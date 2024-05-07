import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Page from './page';

import checkFlight from '../../api/checkFlight';
import saveReservation from '../../api/saveReservation';

jest.mock('../../api/checkFlight');
jest.mock('../../api/saveReservation');

describe('Form.Page component', () => {
    beforeEach(() => {
        (checkFlight as jest.Mock).mockClear();
        (saveReservation as jest.Mock).mockClear();
    });

    test('renders correctly', () => {
        const { getByLabelText, getByText } = render(<Page />);

        // 確認所有欄位都存在
        expect(getByLabelText('下車機場')).toBeInTheDocument();
        expect(getByLabelText('航班編號')).toBeInTheDocument();
        expect(getByLabelText('姓名')).toBeInTheDocument();
        expect(getByLabelText('電話')).toBeInTheDocument();
        expect(getByLabelText('身分證字號/ 護照編號')).toBeInTheDocument();
        expect(getByLabelText('乘車備註')).toBeInTheDocument();
        expect(getByText('下一步')).toBeInTheDocument();
    });

    // 各欄位的資料檢查與錯誤內容顯示
    describe('Invalid Input', () => {
        test('shows error message when flight number is not valid', async () => {
            const { getByLabelText, queryByText } = render(<Page />);

            const flightNumberInput = getByLabelText('航班編號');
            fireEvent.change(flightNumberInput, { target: { value: '航班編號' } });

            // 確認錯誤訊息已顯示
            expect(queryByText('僅接受英文字母和數字')).toBeInTheDocument();
        });

        test('shows error message when name is not valid', async () => {
            const { getByLabelText, queryByText } = render(<Page />);

            const flightNumberInput = getByLabelText('姓名');
            fireEvent.change(flightNumberInput, { target: { value: '123' } });

            // 確認錯誤訊息已顯示
            expect(queryByText('僅接受英文字母和空格')).toBeInTheDocument();
        });

        test('shows error message when phone is not valid', async () => {
            const { getByLabelText, queryByText } = render(<Page />);

            const flightNumberInput = getByLabelText('電話');
            fireEvent.change(flightNumberInput, { target: { value: 'abc' } });

            // 確認錯誤訊息已顯示
            expect(queryByText('僅接受數字')).toBeInTheDocument();
        });

        test('shows error message when id is not valid', async () => {
            const { getByLabelText, queryByText } = render(<Page />);

            const flightNumberInput = getByLabelText('身分證字號/ 護照編號');
            fireEvent.change(flightNumberInput, { target: { value: '身分證字號' } });

            // 確認錯誤訊息已顯示
            expect(queryByText('僅接受英文字母和數字')).toBeInTheDocument();
        });
    });

    // 班機不存在時顯示查不到班機的訊息
    test('shows check flight message when flight number is not exist', async () => {
        const { getByLabelText, getByText, queryByText } = render(<Page />);

        const flightNumber = 'ABC123';

        // 各欄位填入資料
        const flightNumberInput = getByLabelText('航班編號');
        fireEvent.change(flightNumberInput, { target: { value: flightNumber } });
        const nameInput = getByLabelText('姓名');
        fireEvent.change(nameInput, { target: { value: 'Chen Yi Chun' } });
        const phoneInput = getByLabelText('電話');
        fireEvent.change(phoneInput, { target: { value: '0912345678' } });
        const idInput = getByLabelText('身分證字號/ 護照編號');
        fireEvent.change(idInput, { target: { value: 'A123456789' } });

        // 模擬 checkFlight 回傳 'flight_not_exists'
        (checkFlight as jest.Mock).mockResolvedValueOnce('flight_not_exists');

        // 點擊「下一步」按鈕
        const submitButton = getByText('下一步');
        fireEvent.click(submitButton);

        // 等待 API 請求完成
        await waitFor(() => expect(checkFlight).toHaveBeenCalled());

        // 確認查不到班機的訊息已顯示
        expect(queryByText(`查不到「${flightNumber}」的航班？`)).toBeInTheDocument();
    });

    // 表單送出成功時顯示成功的訊息
    test('submits reservation successfully', async () => {
        const { getByLabelText, getByText, queryByText } = render(<Page />);

        // 各欄位填入資料
        const flightNumberInput = getByLabelText('航班編號');
        fireEvent.change(flightNumberInput, { target: { value: 'BR123' } });
        const nameInput = getByLabelText('姓名');
        fireEvent.change(nameInput, { target: { value: 'Chen Yi Chun' } });
        const phoneInput = getByLabelText('電話');
        fireEvent.change(phoneInput, { target: { value: '0912345678' } });
        const idInput = getByLabelText('身分證字號/ 護照編號');
        fireEvent.change(idInput, { target: { value: 'A123456789' } });
        const notesInput = getByLabelText('乘車備註');
        fireEvent.change(notesInput, { target: { value: 'Notes' } });

        // 模擬 checkFlight 回傳 'flight_not_exists', saveReservation 回傳 'success'
        (checkFlight as jest.Mock).mockResolvedValueOnce('flight_exists');
        (saveReservation as jest.Mock).mockResolvedValueOnce('success');

        // 點擊「下一步」按鈕
        const submitButton = getByText('下一步');
        fireEvent.click(submitButton);

        // 等待 API 請求完成
        await waitFor(() => {
            expect(checkFlight).toHaveBeenCalled();
            expect(saveReservation).toHaveBeenCalled();
        });

        // 確認成功訊息已顯示
        expect(queryByText('完成送機行程')).toBeInTheDocument();
    })
});
