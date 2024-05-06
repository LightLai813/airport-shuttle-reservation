'use client';

import React from 'react';

import { Drawer } from '@mui/material';

interface MsgSuccessProps {
    open: boolean;
    onClose: () => void;
}

export default function SuccessMsg({
    open,
    onClose
}: MsgSuccessProps) {
    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
        >
            <div className="p-10 max-w-[400px] mx-auto flex flex-col items-center">
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgb(26, 174, 159)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p className="text-xl font-bold mt-5">完成送機行程</p>
            </div>
        </Drawer>
    );
} 
