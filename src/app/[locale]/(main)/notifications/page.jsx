'use client';

import axios from 'axios';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function NotificationsPage({ params: { locale } }) {
    const t = useTranslations();
    const [notifications, setNotifications] = useState([]);
    const [visible, setVisible] = useState(false);
    const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    const isRTL = locale === 'ar';

    // Define translations locally to avoid JSON file modifications
    const translations = useMemo(
        () => ({
            message: isRTL ? 'الرسالة' : 'Message',
            image: isRTL ? 'الصورة' : 'Image',
            createdAt: isRTL ? 'تاريخ الإنشاء' : 'Created At',
            actions: isRTL ? 'الإجراءات' : 'Actions',
            delete: isRTL ? 'حذف' : 'Delete',
            no: isRTL ? 'لا' : 'No',
            yes: isRTL ? 'نعم' : 'Yes',
            deleteNotification: isRTL ? 'حذف الإشعار' : 'Delete Notification',
            deleteConfirmation: isRTL ? 'هل أنت متأكد من رغبتك في حذف هذا الإشعار؟' : 'Are you sure you want to delete this notification?',
            noNotifications: isRTL ? 'لا توجد إشعارات' : 'No notifications found',
            fetchError: isRTL ? 'فشل جلب الإشعارات' : 'Failed to fetch notifications',
            deleteSuccess: isRTL ? 'تم حذف الإشعار بنجاح' : 'Notification deleted successfully',
            deleteError: isRTL ? 'فشل حذف الإشعار' : 'Failed to delete notification'
        }),
        [isRTL]
    );

    const getNotifications = useCallback(() => {
        setLoading(true);
        axios
            .get(`${process.env.API_URL}/all/notifications`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((response) => {
                setNotifications(response.data?.notifications || []);
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
                toast.error(translations.fetchError);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [translations]);

    const deleteHandler = async () => {
        if (!notificationIdToDelete) return;

        const token = localStorage.getItem('token');
        await axios
            .delete(`${process.env.API_URL}/remove/notification`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    notificationId: notificationIdToDelete
                }
            })
            .then(() => {
                toast.success(translations.deleteSuccess);
                setVisible(false);
                getNotifications();
            })
            .catch((error) => {
                console.error('Delete error:', error);
                toast.error(error.response?.data?.message || translations.deleteError);
            });
    };

    const footerContent = (
        <div dir={isRTL ? 'rtl' : 'ltr'}>
            <Button label={translations.no} icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label={translations.yes} icon="pi pi-check" onClick={deleteHandler} style={{ backgroundColor: '#dc3545', color: '#fff' }} autoFocus />
        </div>
    );

    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    return (
        <div className="card mb-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <DataTable
                dir={isRTL ? 'rtl' : 'ltr'}
                value={notifications}
                loading={loading}
                style={{ width: '100%' }}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate={isRTL ? '{first} إلى {last} من {totalRecords}' : '{first} to {last} of {totalRecords}'}
                emptyMessage={translations.noNotifications}
            >
                <Column header={translations.image} body={(rowData) => (rowData.img ? <Image src={rowData.img} alt="Notification" width={50} height={50} style={{ borderRadius: '4px', border: '1px solid #CCCCCC' }} /> : <span>-</span>)} />

                <Column field="msg" header={translations.message} style={{ width: '40%' }} />

                <Column
                    field="createdAt"
                    header={translations.createdAt}
                    body={(rowData) =>
                        new Date(rowData.createdAt).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }
                />

                <Column
                    header={translations.actions}
                    body={(rowData) => (
                        <button
                            className="deleteButton"
                            onClick={() => {
                                setVisible(true);
                                setNotificationIdToDelete(rowData._id);
                            }}
                        >
                            {translations.delete}
                        </button>
                    )}
                />
            </DataTable>

            <div dir={isRTL ? 'rtl' : 'ltr'}>
                <Dialog
                    header={translations.deleteNotification}
                    visible={visible}
                    position="top"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    style={{ width: '90%', maxWidth: '650px' }}
                    onHide={() => setVisible(false)}
                    footer={footerContent}
                    draggable={false}
                    resizable={false}
                >
                    <p className="m-0">{translations.deleteConfirmation}</p>
                </Dialog>
            </div>
        </div>
    );
}
