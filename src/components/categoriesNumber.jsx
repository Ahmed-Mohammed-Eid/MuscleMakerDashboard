'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslations } from 'next-intl';

export default function CategoriesNumber({ categories, locale }) {
    const t = useTranslations('DashboardHome');
    const isRTL = locale === 'ar';

    return (
        <DataTable value={categories} style={{ width: '100%' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <Column field="name" header={t('name')}></Column>
            <Column
                field="number"
                header={t('number')}
                body={(rowData) => {
                    return <span className="text-center font-bold">{rowData.number}</span>;
                }}
            ></Column>
        </DataTable>
    );
}
