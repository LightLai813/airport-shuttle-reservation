'use server';

// 取得 TDX token
function createTokenManager() {
    let cachedToken: string | null = null; // 儲存 token
    let tokenExpiration: number | null = null; // 儲存 token 過期時間

    // 取得 TDX token
    async function getAuthorizationHeader() {
        // TDX token 有效期為 1 天，所以如果 cache 中有 token，且尚未過期，就直接返回 cache token，減少 API request 次數
        if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
            return cachedToken;
        }

        const params = {
            grant_type: "client_credentials",
            client_id: process.env.TDX_CLIENT_ID,
            client_secret: process.env.TDX_CLIENT_SECRET,
        };

        const resp = await fetch('https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
                'Accept-Encoding': 'br,gzip',
            },
            body: new URLSearchParams(params),
        });

        const data = await resp.json();
        cachedToken = data.access_token;
        tokenExpiration = Date.now() + (data.expires_in * 1000);

        return cachedToken;
    }

    return {
        getAuthorizationHeader,
    };
}

const tokenManager = createTokenManager();


// 將使用者輸入的字串拆分成 airlineID 和 flightNumber
function splitString(str: string) {
    // 使用正規表達式拆分字串
    const matches = str.match(/^([A-Za-z]+)(\d+)$/);

    if (matches) {
        // 第一個元素是整個匹配的字串，第二個是英文字母部分，第三個是數字部分
        const [, airlineID, flightNumber] = matches;
        return { airlineID, flightNumber };
    } else {
        // 如果字串不符合格式，回傳 null 或者做其他處理
        return null;
    }
}

// 透過 API 檢查航班是否存在
export default async function checkFlight(flightID: string): Promise<string> {
    try {
        const flightInfo = splitString(flightID);
        if (!flightInfo) return 'flight_not_exists';

        const accessToken = await tokenManager.getAuthorizationHeader();
        const params = {
            $format: 'JSON',
            $select: 'AirlineID,FlightNumber',
            // OData 沒辦法使用 concat 函數，所以使用 splitString 拆分 flightID，AirlineID 和 FlightNumber 各自判斷是否存在
            $filter: `AirlineID eq '${flightInfo.airlineID}' and FlightNumber eq '${flightInfo.flightNumber}'`
        };

        const resp = await fetch(`https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TPE?${new URLSearchParams(params).toString()}`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'br,gzip',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await resp.json();

        return data.length > 0 ? 'flight_exists' : 'flight_not_exists';
    } catch (error) {
        return error.message;
    }
}
