import { redirect } from 'next/navigation';

export default function UsersPage({ params: { locale } }) {
    redirect(`/${locale}/users/clients`);
}
