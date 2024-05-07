import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import MsgCheckFlight from './msgConfirmFlight';

describe('MsgCheckFlight component', () => {
    test('renders with correct flight number', () => {
        const flightNumber = 'ABC123';
        const { getByText } = render(
            <MsgCheckFlight
                open={true}
                onClose={() => { }}
                flightNumber={flightNumber}
                resetFlightNumber={() => { }}
                submitReservation={() => { }}
            />
        );
        expect(getByText(`查不到「${flightNumber}」的航班？`)).toBeInTheDocument();
    });

    test('calls submitReservation function when "確認航班資訊，並送出" button clicked', () => {
        const submitReservationMock = jest.fn();
        const { getByText } = render(
            <MsgCheckFlight
                open={true}
                onClose={() => { }}
                flightNumber=""
                resetFlightNumber={() => { }}
                submitReservation={submitReservationMock}
            />
        );
        fireEvent.click(getByText('確認航班資訊，並送出')); // Replace with your "確認航班資訊，並送出" button text
        expect(submitReservationMock).toHaveBeenCalled();
    });

    test('calls resetFlightNumber function when "重新填寫" button clicked', () => {
        const resetFlightNumberMock = jest.fn();
        const { getByText } = render(
            <MsgCheckFlight
                open={true}
                onClose={() => { }}
                flightNumber=""
                resetFlightNumber={resetFlightNumberMock}
                submitReservation={() => { }}
            />
        );
        fireEvent.click(getByText('重新填寫')); // Replace with your "重新填寫" button text
        expect(resetFlightNumberMock).toHaveBeenCalled();
    });
});
