import NotificationForm from '../../components/notifications/NotificationForm';
import { useTranslations } from 'next-intl';

export default function CreateNotificationPage({ params: { locale } }) {
    const t = useTranslations('Notifications');
    const isRTL = locale === 'ar';
    
    return (
        <div className="card" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <h1>{t('createNotification')}</h1>
            <NotificationForm locale={locale} isRTL={isRTL} />
        </div>
    );
}