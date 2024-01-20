"use client"
import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {toast} from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";

export default function DailyPage() {
    // STATES
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);

    // EFFECT TO GEY MENU

    useEffect(() => {
        // GET TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `${process.env.API_URL}/meals/filter`;

        try {
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    mealsFilter: 'all',
                }
            })
                .then(res => {
                    setMenu(res.data.meals);
                })
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }, []);

    return (
        <>
            <form className={"card flex gap-2 justify-content-end flex-wrap mb-2"}
                  onSubmit={(e) => e.preventDefault()}>
                <Button type={"submit"} label={'Delete'} severity="danger"/>
                <Calendar placeholder={'Choose Day'} onChange={(e) => {
                }}/>
                <Button label={'Selected Days List'} className={"p-button-success ml-auto"}/>
            </form>
            <div className={'card mb-0'}>
                <h1 className={"mb-2 uppercase"}>Daily Menu</h1>
                <DataTable
                    value={menu || []}
                    selectionMode="checkbox"
                    selection={selectedMenu}
                    onSelectionChange={(e) => {
                        setSelectedMenu(e.value);
                        // SET THE SELECTED MENU IDS
                        setSelectedMenuIds(e.value.map((menu) => menu.id));
                    }}
                    dataKey="id"
                    paginator
                    rows={10}
                >
                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                    <Column
                        field="imagePath"
                        header="Image"
                        body={(rowData) => {
                            return (
                                <Image
                                    src={rowData.imagePath}
                                    alt={rowData.mealTitle}
                                    width={50}
                                    height={50}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                            )
                        }}
                    />
                    <Column
                        field="mealTitle"
                        header="Name Ar"
                        sortable
                        filter
                    />
                    <Column
                        field="mealTitleEn"
                        header="Name En"
                        sortable
                        filter
                    />
                    <Column
                        field="mealPrice"
                        header="Price"
                        sortable
                        filter
                        body={(rowData) => {
                            return (
                                <span className="text-center font-bold">
                                {rowData.mealPrice} KWD
                            </span>
                            )
                        }}
                    />
                    <Column
                        field="mealType"
                        header="Type"
                        sortable
                        filter
                    />
                </DataTable>
            </div>
        </>
    );
}