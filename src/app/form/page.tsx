'use client';

import React, { useMemo, useRef, useState, useTransition, ForwardedRef, forwardRef, useCallback } from 'react';
import { FormGroup, FormLabel, InputLabel, Select, MenuItem, TextField, Button, CircularProgress } from '@mui/material';

import MsgSuccess from './msgSuccess';
import MsgConfirmFlight from './msgConfirmFlight';

import checkFlight from '../../api/checkFlight';
import saveReservation from '../../api/saveReservation';

// 表單欄位
interface InputFieldProps {
    name: string;
    label: string;
    value: string;
    errorMsg?: string;
    placeholder?: string;
    multiline?: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField = forwardRef(({
    name,
    label,
    value,
    errorMsg,
    placeholder,
    multiline,
    handleChange
}: InputFieldProps,
    ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
) => (
    <>
        <InputLabel
            className="mt-5"
            shrink={true}
            htmlFor={`TXT_${name}`}
        >{label}</InputLabel>
        <TextField
            inputRef={ref}
            id={`TXT_${name}`}
            name={name}
            value={value}
            placeholder={placeholder}
            multiline={!!multiline}
            rows={multiline}
            error={!!errorMsg}
            helperText={errorMsg}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={handleChange}
        />
    </>
));

export default function Page() {
    // 表單送出中
    const [isPending, startTransition] = useTransition();

    // 表單送出成功，返回結果
    const [result, setResult] = useState<string | null>(null);

    const flightNumberRef = useRef<HTMLInputElement>(null);

    // 表單內容
    const [formData, setFormData] = useState<Record<string, string>>({
        airport: 'taoyuan-terminal-1',
        flightNumber: '',
        name: '',
        phone: '',
        id: '',
        notes: ''
    });

    // 輸入內容錯誤訊息
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // 判斷表單內容是否可以送出
    const isValid = useMemo(() => (
        !isPending
        && Object.entries(formData).every(([key, value]) => value !== '' || key === 'notes') // 除了 notes 以外，其他欄位不能為空
        && Object.values(errors).every(error => error === null) // 所有欄位的錯誤訊息都為空
    ), [errors, formData, isPending]);

    // 表單內容更新
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 將小寫字母轉換為大寫，統一使用者輸入資訊
        const uppercaseValue = value.toUpperCase();
        setFormData((prev) => ({
            ...prev,
            [name]: uppercaseValue
        }));

        // 檢查輸入值是否符合格式，並更新錯誤訊息
        switch (name) {
            case 'flightNumber':
            case 'id':
                setErrors((prev) => ({
                    ...prev,
                    [name]: /^[A-Z0-9]+$/.test(uppercaseValue) ? null : '僅接受英文字母和數字'
                }));
                break;

            case 'name':
                setErrors((prev) => ({
                    ...prev,
                    name: /^[A-Z\s]+$/.test(uppercaseValue) ? null : '僅接受英文字母和空格'
                }));
                break;

            case 'phone':
                setErrors((prev) => ({
                    ...prev,
                    phone: /^[0-9]+$/.test(uppercaseValue) ? null : '僅接受數字'
                }));
                break;

            default:
                break;
        }
    };

    // 表單送出
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            const result = await checkFlight(formData.flightNumber);

            switch (result) {
                case 'flight_exists':
                    submitReservation();
                    break;

                case 'flight_not_exists':
                    setResult('flight_not_exists');
                    break;

                default:
                    console.error(result);
                    break;
            }
        })
    }

    // 重置 FlightNumber 欄位
    const resetFlightNumber = () => {
        setFormData((prev) => ({
            ...prev,
            flightNumber: '',
        }));
        setResult(null);

        // 因為前面有使用 setState 的操作
        // 所以透過 setTimeout 將 focus() 操作放到 task query 最後，以免 ref 尚未更新，造成 focus() 失效
        setTimeout(() => {
            flightNumberRef.current.focus();
        }, 0);
    }

    // 送出訂單
    const submitReservation = () => {
        setResult(null);
        startTransition(async () => {
            const result = await saveReservation(formData);

            switch (result) {
                case 'success':
                    setResult('success');
                    break;

                default:
                    console.error(result);
                    break;
            }
        })
    }

    return (
        <div className="w-full max-w-[400px] h-screen flex flex-col items-center mx-auto p-8">
            <form className="w-full" action="#" onSubmit={handleSubmit}>
                <FormLabel component="legend">班機資訊</FormLabel>
                <FormGroup>
                    <InputLabel
                        id="label-airport"
                        className="mt-5"
                        shrink={true}
                    >下車機場</InputLabel>
                    <Select
                        labelId="label-airport"
                        value={formData.airport}
                        inputProps={{
                            readOnly: true,
                        }}
                    >
                        <MenuItem value="taoyuan-terminal-1">桃園國際機場 第一航廈</MenuItem>
                    </Select>

                    <InputField
                        ref={flightNumberRef}
                        name="flightNumber"
                        label="航班編號"
                        value={formData.flightNumber}
                        errorMsg={errors.flightNumber}
                        placeholder="BR123"
                        handleChange={handleChange}
                    />
                </FormGroup>

                <hr className="mt-5 mb-5" />

                <FormLabel component="legend">旅客資訊</FormLabel>
                <FormGroup>
                    <InputField
                        name="name"
                        label="姓名"
                        value={formData.name}
                        errorMsg={errors.name}
                        placeholder="Chen Yi Chun"
                        handleChange={handleChange}
                    />
                    <InputField
                        name="phone"
                        label="電話"
                        value={formData.phone}
                        errorMsg={errors.phone}
                        placeholder="0912345678"
                        handleChange={handleChange}
                    />
                    <InputField
                        name="id"
                        label="身分證字號/ 護照編號"
                        value={formData.id}
                        errorMsg={errors.id}
                        placeholder="A123456789"
                        handleChange={handleChange}
                    />
                    <InputField
                        name="notes"
                        label="乘車備註"
                        value={formData.notes}
                        multiline={4}
                        handleChange={handleChange}
                    />
                </FormGroup>

                <FormGroup
                    className="mt-10"
                >
                    <Button
                        variant="contained"
                        disableElevation
                        size="large"
                        type="submit"
                        disabled={!isValid}
                    >
                        {
                            isPending ? <CircularProgress sx={{ color: 'white' }} size={26} /> : '下一步'
                        }
                    </Button>
                </FormGroup>
            </form>

            <MsgConfirmFlight
                open={result === 'flight_not_exists'}
                onClose={() => {
                    setResult(null)
                }}
                flightNumber={formData.flightNumber}
                resetFlightNumber={resetFlightNumber}
                submitReservation={submitReservation}
            />
            <MsgSuccess
                open={result === 'success'}
                onClose={() => {
                    setResult(null)
                }}
            />
        </div>
    );
}
