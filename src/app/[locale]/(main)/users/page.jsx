import UsersTable from '../components/users/UsersTable';

export default function UsersPage({ params: { locale } }) {
    return (
        <div className={'card mb-0'}>
            <UsersTable locale={locale} isRTL={locale === 'ar'} />
        </div>
    );
}
