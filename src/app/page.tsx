'use client';

import React, { useState } from 'react';
import { FormGroup, FormLabel, InputLabel, Select, MenuItem, TextField, Button, CircularProgress } from '@mui/material';

export default function Page() {
    const [isPending, setIsPending] = useState(false);

    const [formData, setFormData] = useState<Record<string, string>>({
        airport: 'taoyuan-terminal-1',
        flightNumber: '',
        name: '',
        phone: '',
        id: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 將小寫字母轉換為大寫
        const uppercaseValue = value.toUpperCase();
        setFormData({
            ...formData,
            [name]: uppercaseValue
        });

        // 檢查輸入值是否符合格式，並更新錯誤訊息
        switch (name) {
            case 'flightNumber':
                setErrors({
                    ...errors,
                    flightNumber: /^[A-Z0-9]+$/.test(uppercaseValue) ? null : '僅接受英文字母和數字'
                });
                break;

            case 'name':
                setErrors({
                    ...errors,
                    name: /^[A-Z\s]+$/.test(uppercaseValue) ? null : '僅接受英文字母和空格'
                });
                break;

            case 'phone':
                setErrors({
                    ...errors,
                    phone: /^[0-9]+$/.test(uppercaseValue) ? null : '僅接受數字'
                });
                break;

            case 'id':
                setErrors({
                    ...errors,
                    id: /^[A-Z0-9]+$/.test(uppercaseValue) ? null : '僅接受英文字母和數字'
                });
                break;

            default:
                break;
        }
    };

    return (
        <div className="w-full max-w-[400px] h-screen flex flex-col items-center mx-auto p-8">
            <form className="w-full">
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

                    <InputLabel
                        className="mt-5"
                        shrink={true}
                    >航班編號</InputLabel>
                    <TextField
                        name="flightNumber"
                        value={formData.flightNumber}
                        placeholder="BR123"
                        error={!!errors.flightNumber}
                        helperText={errors.flightNumber}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange}
                    />
                </FormGroup>

                <hr className="mt-5 mb-5" />

                <FormLabel component="legend">旅客資訊</FormLabel>
                <FormGroup>
                    {
                        [{
                            key: 'name',
                            label: '姓名',
                            placeholder: 'Chen Yi Chun'
                        }, {
                            key: 'phone',
                            label: '電話',
                            placeholder: '0912345678'
                        }, {
                            key: 'id',
                            label: '身分證字號/ 護照編號',
                            placeholder: 'A123456789'
                        }, {
                            key: 'notes',
                            label: '乘車備註',
                            multiline: 4
                        }].map(({
                            key,
                            label,
                            placeholder,
                            multiline
                        }) => (
                            <React.Fragment key={key}>
                                <InputLabel
                                    className="mt-5"
                                    shrink={true}
                                >{label}</InputLabel>
                                <TextField
                                    name={key}
                                    value={formData[key]}
                                    placeholder={placeholder}
                                    multiline={!!multiline}
                                    rows={multiline}
                                    error={!!errors[key]}
                                    helperText={errors[key]}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleChange}
                                />
                            </React.Fragment>
                        ))
                    }
                </FormGroup>
                <FormGroup
                    className="mt-10"
                >
                    <Button
                        variant="contained"
                        disableElevation
                        size="large"
                        type="submit"
                    >
                        {
                            isPending ? <CircularProgress sx={{ color: 'white' }} size={26} /> : '下一步'
                        }
                    </Button>
                </FormGroup>
            </form>
        </div>
    );
}
