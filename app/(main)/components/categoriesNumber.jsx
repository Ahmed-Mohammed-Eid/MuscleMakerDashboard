"use client";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function CategoriesNumber({categories}) {
    return(
        <DataTable
            value={categories}
            style={{width: '100%'}}
        >
            <Column field="name" header="Name"></Column>
            <Column field="number" header="Number" body={
                (rowData) => {
                    return(
                        <span className="text-center font-bold">{rowData.number}</span>
                    )
                }
            }></Column>
        </DataTable>
    )
}