'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function DislikedMealsPage({ params: { locale } }) {
    const isRTL = locale === 'ar';
    // STATES
    const [dislikedMeals, setDislikedMeals] = React.useState([]);
    const [globaleSearch, setGlobaleSearch] = React.useState('');
    const [deleteDialog, setDeleteDialog] = React.useState({
        visible: false,
        mealId: null
    });

    // HANDLERS
    const getDislikedMeals = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get(`${process.env.API_URL}/show/disliked/meals`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDislikedMeals(response.data?.dislikedMeals || []);
        } catch (error) {
            console.error('Error fetching disliked meals:', error);
            toast.error('Failed to fetch disliked meals. Please try again.' + (error.response?.data?.message || ''));
        }
    }, []);

    const handleRemoveDislikedMeal = async (mealId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            await axios.delete(`${process.env.API_URL}/remove/disliked/meal?dislikedMealId=${mealId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // GET THE UPDATED LIST
            getDislikedMeals();
            toast.success(isRTL ? 'تمت إزالة الوجبة غير المفضلة بنجاح' : 'Disliked meal removed successfully');
        } catch (error) {
            console.error('Error removing disliked meal:', error);
            toast.error('Failed to remove disliked meal. Please try again.' + (error.response?.data?.message || ''));
        }
    };

    React.useEffect(() => {
        getDislikedMeals();
    }, [getDislikedMeals]);

    return (
        <div className="card mb-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <DataTable
                value={dislikedMeals}
                globalFilter={globaleSearch}
                header={
                    <div className="table-header flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 className="m-0">{isRTL ? 'الوجبات غير المفضلة' : 'Disliked Meals'}</h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <input type="search" className="p-inputtext p-component" placeholder={isRTL ? 'بحث...' : 'Search...'} onInput={(e) => setGlobaleSearch(e.target.value)} />
                        </span>
                    </div>
                }
                emptyMessage={isRTL ? 'لا توجد وجبات غير مفضلة' : 'No disliked meals found'}
            >
                <Column field="mealTitleAr" header={isRTL ? 'اسم الوجبة بالعربية' : 'Meal Name Arabic'} />
                <Column field="mealTitleEn" header={isRTL ? 'اسم الوجبة بالإنجليزية' : 'Meal Name English'} />
                <Column
                    field="_id"
                    header={isRTL ? 'الإجراءات' : 'Actions'}
                    body={(rowData) => {
                        return (
                            <button className="deleteButton" onClick={() => setDeleteDialog({ visible: true, mealId: rowData._id })}>
                                {isRTL ? 'حذف' : 'Remove'}
                            </button>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header={isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
                visible={deleteDialog.visible}
                style={{ width: '350px', direction: isRTL ? 'rtl' : 'ltr' }} // Adjust direction based on
                modal
                footer={null}
                onHide={() => setDeleteDialog({ visible: false, mealId: null })}
                draggable={false}
                resizable={false}
            >
                <div className="confirmation-content">{isRTL ? 'هل أنت متأكد أنك تريد حذف هذه الوجبة من المفضلة؟' : 'Are you sure you want to remove this meal from disliked?'}</div>
                <div className="confirmation-buttons flex gap-2" style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <Button size="small" label={isRTL ? 'إلغاء' : 'Cancel'} icon="pi pi-times" className="flex-1" outlined onClick={() => setDeleteDialog({ visible: false, mealId: null })} />
                    <Button
                        label={isRTL ? 'حذف' : 'Delete'}
                        size="small"
                        className="flex-1"
                        icon="pi pi-check"
                        style={{ backgroundColor: '#dc3545', color: '#fff' }}
                        onClick={() => {
                            handleRemoveDislikedMeal(deleteDialog.mealId);
                            setDeleteDialog({ visible: false, mealId: null });
                        }}
                        autoFocus
                    />
                </div>
            </Dialog>
        </div>
    );
}

export default DislikedMealsPage;
