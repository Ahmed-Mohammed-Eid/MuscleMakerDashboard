"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import CustomFileUpload from "../customFileUpload.jsx"
import { classNames } from 'primereact/utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation.js';

const NotificationForm = ({ locale, isRTL }) => {
    const router = useRouter();
    const t = useTranslations('Notifications');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('msg', message);
            files.forEach(file => formData.append('files', file));

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error(t('authError'));
            }

            const response = await axios.post(`${process.env.API_URL}/set/notification`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                toast.success(t('createSuccess'));
                setMessage('');
                setFiles([]);
                router.push(`/${locale}/notifications`);
            } else {
                throw new Error(response.data.message || t('createError'));
            }
        } catch (error) {
            toast.error(error.message || t('createError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-fluid">
            <div className="field">
                <label htmlFor="message" className={classNames({ 'p-error': !message && isSubmitting })}>
                    {t('messageLabel')}
                </label>
                <InputText
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className={classNames({ 'p-invalid': !message && isSubmitting })}
                    dir={isRTL ? 'rtl' : 'ltr'}
                />
                {!message && isSubmitting && (
                    <small className="p-error">{t('messageRequired')}</small>
                )}
            </div>

            <div className="field">
                <label htmlFor="files">{t('filesLabel')}</label>
                <CustomFileUpload
                    setFiles={(_files) => {
                        setFiles(_files);
                    }}
                    multiple={true}
                    removeThisItem={(file) => {
                        setFiles(files.filter(f => f.name !== file.name));
                    }}
                />
            </div>

            <Button
                type="submit"
                label={t('createButton')}
                icon="pi pi-send"
                loading={isSubmitting}
                className="mt-4"
            />
        </form>
    );
};

export default NotificationForm;