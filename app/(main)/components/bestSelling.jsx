"use client";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function BestSelling({packages}) {
    return(
        <DataTable
            value={packages}
            style={{width: '100%'}}
        >
            <Column field="bundleName" header="Name"></Column>
            <Column field="bundlePrice" header="Price"></Column>
            <Column field="snacksNumber" header="Snacks"></Column>
            <Column field="fridayOption" header="Fridays" body={(rowDara) => {
                return(
                    <span className="text-center font-bold">{rowDara.fridayOption ? "Yes" : "No"}</span>
                )
            }}></Column>

        </DataTable>
    )
}