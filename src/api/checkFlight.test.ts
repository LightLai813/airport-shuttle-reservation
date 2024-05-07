import checkFlight from './checkFlight';

describe('checkFlight function', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 清除所有 mock 的狀態
    });

    test('should return flight_exists when flight exists', async () => {
        const mockData = [{ AirlineID: 'ABC', FlightNumber: '123' }];
        global.fetch = jest.fn().mockResolvedValue({ json: () => mockData });

        const result = await checkFlight('ABC123');

        expect(result).toBe('flight_exists');
        expect(fetch).toHaveBeenCalled();
    });

    test('should return flight_not_exists when flight does not exist', async () => {
        const mockData = []; // 沒有回傳資料
        global.fetch = jest.fn().mockResolvedValue({ json: () => mockData });

        const result = await checkFlight('ABC123');

        expect(result).toBe('flight_not_exists');
        expect(fetch).toHaveBeenCalled();
    });

    test('should return error message when API call fails', async () => {
        const errorMessage = 'API ERROR';
        global.fetch = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

        const result = await checkFlight('ABC123');

        expect(result).toBe(errorMessage);
        expect(fetch).toHaveBeenCalled();
    });

    test('should use cached token if available and not expired', async () => {
        const mockTokenData = { access_token: 'token-xxxx', expires_in: 86400 };
        const mockFlightData = [{ AirlineID: 'ABC', FlightNumber: '123' }];
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ json: () => mockTokenData }) // 第一次呼叫，返回 token
            .mockResolvedValue({ json: () => mockFlightData }); // 之後的呼叫，返回 flight data
        const fetchMock = jest.spyOn(global, 'fetch');

        // 第一次呼叫
        const result1 = await checkFlight('ABC123');
        expect(result1).toBe('flight_exists');

        // 模擬時間在 12 小時後
        const futureExpiration = Date.now() + 12 * 60 * 60 * 1000;
        jest.spyOn(Date, 'now').mockReturnValue(futureExpiration);

        // 第二次呼叫，應該直接返回 cached 結果，而不是再次呼叫 token API
        const result2 = await checkFlight('ABC123');
        expect(result2).toBe('flight_exists');

        // 計算 token fetch 的呼叫次數
        const tokenURLCalls = fetchMock.mock.calls.filter(call => call[0] === 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token');

        // 確認 token fetch 的呼叫次數是 1，沒有增加呼叫次數，表示正確使用了 cache 資料
        expect(tokenURLCalls.length).toBe(1);
    });
});
