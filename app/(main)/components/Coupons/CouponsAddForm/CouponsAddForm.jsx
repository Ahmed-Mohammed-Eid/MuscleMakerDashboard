'use client';
import React, { useState } from 'react';
import classes from './CouponsAddForm.module.scss';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CouponsAddForm() {
    // STATES
    const [couponText, setCouponText] = useState('');
    const [discountType, setDiscountType] = useState('amount');
    const [discountAmount, setDiscountAmount] = useState('');
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [hasUsageNumber, setHasUsageNumber] = useState(false);
    const [usageNumber, setUsageNumber] = useState('');
    const [numberOfCodes, setNumberOfCodes] = useState('');

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE
        if (!couponText || !discountAmount || !numberOfCodes || (hasExpiry && !expiryDate) || (hasUsageNumber && !usageNumber)) {
            return toast.error('Please fill all required fields');
        }

        const data = {
            couponText,
            discountType,
            discountAmount,
            hasExpiry,
            expiryDate,
            hasUsageNumber,
            usageNumber,
            numberOfCodes
        };

        // API CALL /create/coupons
        axios
            .post(`${process.env.API_URL}/create/coupons`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((_) => {
                toast.success('Coupon added successfully');
            })
            .catch((err) => {
                console.log(err);
                toast.error('Something went wrong');
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={`card`}>
                <h1 className={'text-2xl mb-5 uppercase'}>Add New Coupon</h1>

                <div className="grid formgrid p-fluid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="couponText">Coupon Text</label>
                        <InputText id="couponText" value={couponText} onChange={(e) => setCouponText(e.target.value)} />
                    </div>

                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="discountType">Discount Type</label>
                        <Dropdown
                            value={discountType}
                            options={[
                                { label: 'Amount', value: 'amount' },
                                { label: 'Ratio', value: 'ratio' }
                            ]}
                            onChange={(e) => setDiscountType(e.value)}
                        />
                    </div>

                    <div className={'field col-12'}>
                        <label htmlFor="discountAmount">Discount Amount</label>
                        <InputNumber id="discountAmount" value={discountAmount} onValueChange={(e) => setDiscountAmount(e.value)} />
                    </div>

                    <div className={'field col-12 flex flex-column align-items-center'}>
                        <label htmlFor="hasExpiry">Has Expiry</label>
                        <InputSwitch id="hasExpiry" checked={hasExpiry} onChange={(e) => setHasExpiry(e.value)} />
                    </div>

                    {hasExpiry && (
                        <div className={'field col-12'}>
                            <label htmlFor="expiryDate">Expiry Date</label>
                            <Calendar id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.value)} showIcon minDate={new Date()} />
                        </div>
                    )}

                    <div className={'field col-12 flex flex-column align-items-center'}>
                        <label htmlFor="hasUsageNumber">Has Usage Number</label>
                        <InputSwitch id="hasUsageNumber" checked={hasUsageNumber} onChange={(e) => setHasUsageNumber(e.value)} />
                    </div>

                    {hasUsageNumber && (
                        <div className={'field col-12'}>
                            <label htmlFor="usageNumber">Usage Number</label>
                            <InputNumber id="usageNumber" value={usageNumber} onValueChange={(e) => setUsageNumber(e.value)} />
                        </div>
                    )}

                    <div className={'field col-12'}>
                        <label htmlFor="numberOfCodes">Number of Codes</label>
                        <InputNumber id="numberOfCodes" value={numberOfCodes} onValueChange={(e) => setNumberOfCodes(e.value)} />
                    </div>
                </div>

                <div className={'flex justify-center mt-5'}>
                    <Button
                        label="Add Coupon"
                        icon="pi pi-plus"
                        style={{
                            width: '100%',
                            padding: '1rem'
                        }}
                    />
                </div>
            </div>
        </form>
    );
}
