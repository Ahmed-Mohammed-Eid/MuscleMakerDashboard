import { Metadata } from 'next';
import Layout from '../../layout/layout';
import {cookies} from "next/headers";
import { redirect } from 'next/navigation'
import axios from "axios";

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Muscle Maker | Dashboard',
    description: 'Muscle Maker Dashboard',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Muscle Maker | Dashboard',
        url: 'https://musclemakergrill.com',
        description: 'Muscle Maker Dashboard',
        images: ['/logo.png'],
        ttl: 604800
    },
    icons: {
        icon: '/logo.png',
    }
};

export default async function AppLayout({ children }: AppLayoutProps) {

    // SEND A REQUEST TO CHECK IF THE TOKEN IS VALID
    // GET THE TOKEN FROM THE COOKIE
    const token = cookies().get("token");

    if (!token) {
        redirect("/login");
    }

    // CHECK IF THE TOKEN IS VALID
    await axios.get(`${process.env.API_URL}/get/verify/token`, {
        params: {
            token: token.value
        }
    }).then((response) => {
        if(!response.data.success) {
            redirect("/login");
        }
    }).catch(() => {
        redirect("/login");
    });


    return <Layout>{children}</Layout>;
}
