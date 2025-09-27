'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import toast from 'react-hot-toast';

function CreateDislikedMeal({ params: { locale } }) {
    const isRTL = locale === 'ar';

    // STATES
    const [mealNameAr, setMealNameAr] = React.useState('');
    const [mealNameEn, setMealNameEn] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    // HANDLERS
    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = axios.post(
                `${process.env.API_URL}/create/disliked/meals`,
                {
                    mealTitleAr: mealNameAr,
                    mealTitleEn: mealNameEn
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(isRTL ? 'تم إنشاء الوجبة غير المفضلة بنجاح' : 'Disliked meal created successfully');
            setMealNameAr('');
            setMealNameEn('');
        } catch (error) {
            console.error('Error creating disliked meal:', error);
            toast.error(isRTL ? 'حدث خطأ أثناء إنشاء الوجبة غير المفضلة' : 'An error occurred while creating the disliked meal');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card mb-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <h4>{isRTL ? 'إنشاء وجبة غير مفضلة' : 'Create Disliked Meal'}</h4>
            <hr className="mb-2" />
            <form className="grid formgrid p-fluid mt-4" onSubmit={handleSubmit}>
                <div className="field col-12 md:col-6">
                    <label className='font-bold' htmlFor="mealNameAr">{isRTL ? 'اسم الوجبة (عربي)' : 'Meal Name (Arabic)'}</label>
                    <InputText id="mealNameAr" className="w-full" value={mealNameAr} onChange={(e) => setMealNameAr(e.target.value)} placeholder={isRTL ? 'أدخل اسم الوجبة (عربي)' : 'Enter Meal Name (Arabic)'} />
                </div>
                <div className="field col-12 md:col-6">
                    <label className='font-bold' htmlFor="mealNameEn">{isRTL ? 'اسم الوجبة (إنجليزي)' : 'Meal Name (English)'}</label>
                    <InputText id="mealNameEn" className="w-full" value={mealNameEn} onChange={(e) => setMealNameEn(e.target.value)} placeholder={isRTL ? 'أدخل اسم الوجبة (إنجليزي)' : 'Enter Meal Name (English)'} />
                </div>
                <div className="field col-12">
                    <Button type="submit" label={isRTL ? 'إنشاء' : 'Create'} className="w-full" icon="pi pi-check" loading={isLoading} disabled={isLoading} />
                </div>
            </form>
        </div>
    );
}

export default CreateDislikedMeal;
