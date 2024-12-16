'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TabMenu } from 'primereact/tabmenu';

export default function MealsTable({ locale, isRTL }) {
    const t = useTranslations('meals');
    const router = useRouter();
    const [meals, setMeals] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [mealIdToDelete, setMealIdToDelete] = React.useState(null);
    const [menuType, setMenuType] = useState('orders');

    function getMeals() {
        const token = localStorage.getItem('token');
        axios
            .get(`${process.env.API_URL}/get/meals`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    menuType: menuType,
                    mealType: 'all'
                }
            })
            .then((res) => {
                setMeals(res.data?.data?.meals || []);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || t('deleteError'));
            });
    }

    useEffect(() => {
        getMeals();
    }, [menuType]);

    const deleteHandler = async () => {
        const token = localStorage.getItem('token');
        await axios
            .delete(`${process.env.API_URL}/delete/meal`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    mealId: mealIdToDelete
                }
            })
            .then((_) => {
                toast.success(t('mealDeletedSuccess'));
                setVisible(false);
                getMeals();
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err?.message || t('deleteError'));
            });
    };

    const footerContent = (
        <div dir="ltr">
            <Button label={t('no')} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label={t('yes')}
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
                style={{
                    backgroundColor: '#dc3545',
                    color: '#fff'
                }}
                autoFocus
            />
        </div>
    );

    return (
        <>
            <TabMenu
                dir={isRTL ? 'rtl' : 'ltr'}
                model={[
                    {
                        label: t('orders'),
                        icon: 'pi pi-fw pi-home',
                        command: () => {
                            setMenuType('orders');
                        }
                    },
                    {
                        label: t('subscriptions'),
                        icon: 'pi pi-fw pi-calendar',
                        command: () => {
                            setMenuType('subscriptions');
                        }
                    }
                ]}
            />
            <DataTable
                dir={isRTL ? 'rtl' : 'ltr'}
                value={meals || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t('noMealsFound')}
            >
                <Column
                    field="imagePath"
                    header={t('image')}
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.imagePath}
                                alt={rowData?.mealTitle}
                                width={50}
                                height={50}
                                style={{
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        );
                    }}
                />
                <Column field="mealTitle" header={t('nameAr')} sortable filter />
                <Column field="mealTitleEn" header={t('nameEn')} sortable filter />
                <Column
                    field="mealPrice"
                    header={t('price')}
                    sortable
                    filter
                    body={(rowData) => {
                        return <span className="text-center font-bold">{rowData.mealPrice} KWD</span>;
                    }}
                />
                <Column field="mealType" header={t('type')} sortable filter />
                <Column
                    field={'_id'}
                    header={t('actions')}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="copyButton"
                                    onClick={() => {
                                        navigator.clipboard
                                            .writeText(rowData._id)
                                            .then(() => {
                                                toast.success(t('mealIdCopied'));
                                            })
                                            .catch(() => {
                                                toast.error(t('copyIdError'));
                                            });
                                    }}
                                >
                                    {t('copyId')}
                                </button>
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/${locale}/meals/${rowData._id}`);
                                    }}
                                >
                                    {t('edit')}
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setMealIdToDelete(rowData._id);
                                    }}
                                >
                                    {t('delete')}
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog header={t('deleteMeal')} visible={visible} position={'top'} style={{ width: '90%', maxWidth: '650px' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">{t('deleteConfirmation')}</p>
            </Dialog>
        </>
    );
}
