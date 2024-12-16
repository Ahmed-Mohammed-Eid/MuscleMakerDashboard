
export const metadata = {
    title: 'Muscle Maker | Login',
    description: 'Muscle Maker Login',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Muscle Maker | Login',
        url: 'https://musclemakergrillkw.net/',
        description: 'Muscle Maker Login',
        images: ['/logo.png'],
        ttl: 604800
    },
    icons: {
        icon: '/logo.png',
    }
};

export default function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}