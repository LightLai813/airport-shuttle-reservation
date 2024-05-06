import React from 'react';
import { Drawer, Button } from '@mui/material';

interface MsgCheckFlightProps {
    open: boolean;
    onClose: () => void;
    flightNumber: string;
    resetFlightNumber: () => void;
    submitReservation: () => void;
}

export default function MsgCheckFlight({
    open,
    onClose,
    flightNumber,
    resetFlightNumber,
    submitReservation
}: MsgCheckFlightProps) {
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
        >
            <div className="p-5 max-w-[400px] mx-auto">
                <h3 className="text-xl font-bold">查不到「{flightNumber}」的航班？</h3>
                <p>請確認航班資訊、起飛時間等，您也可以直接填寫此航班作為機場接送資訊。</p>

                <Button
                    className="w-full mt-5"
                    variant="contained"
                    size="large"
                    onClick={submitReservation}
                >
                    確認航班資訊，並送出
                </Button>
                <Button
                    className="w-full mt-2"
                    variant="outlined"
                    size="large"
                    onClick={resetFlightNumber}
                >
                    重新填寫
                </Button>
            </div>
        </Drawer>
    );
}
