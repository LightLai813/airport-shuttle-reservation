'use server';

// 將資料寫入資料庫
export default async function saveReservation(formData: Record<string, string>): Promise<string> {
    try {
        console.log(formData);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        /**
         * TODO: 實作寫入資料庫
         * const resp = await fetch('https://tdx.transportdata.tw/api/basic/v2/Air/FIDS/Airport/Departure/TPE', {
         *     method: 'POST',
         *     headers: {
         *         'Accept-Encoding': 'br,gzip',
         *         'Authorization': `Bearer ${accessToken}`
         *     },
         *     body: JSON.stringify(formData)
         * });
         *
         * const data = await resp.json();
         *
         * console.log({ data });
         */

        return 'success';
    } catch (error) {
        return error.message;
    }
}
