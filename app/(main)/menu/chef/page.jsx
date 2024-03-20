"use client"
import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {toast} from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {useRouter} from "next/navigation";

export default function ChefPage() {

    // ROUTER
    const router = useRouter();


    // STATES
    const [menu, setMenu] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());


    // FUNCTION TO GET THE MEALS
    const getMeals = async () => {
        // GET TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `${process.env.API_URL}/meals/filter`;

        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    menuType: 'subscriptions',
                    mealsFilter: 'all',
                }
            });

            setMenu(res.data.meals);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

    // EFFECT TO GEY MENU
    useEffect(() => {
        // GET THE DATE AND FORMAT IT TO RETURN THE DAY FIRST 3 LETTERS
        const day = selectedDay.toString().split(' ')[0];
        setSelectedDay(day)

        // GET THE MEALS
        getMeals();
    }, []);

    // SUBMIT HANDLER
    const handleSubmit = async () => {
        // GET TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `${process.env.API_URL}/add/chiff/menu/day`;

        try {
            const res = await axios.post(url, {
                mealsIds: selectedMenuIds,
                day: selectedDay,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // SHOW SUCCESS MESSAGE
            toast.success(res.data?.message || 'Menu Day Added Successfully');

            // RESET THE SELECTED MENU
            setSelectedMenu([]);
            setSelectedMenuIds([]);

        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

    return (
        <>
            <form className={"card flex gap-2 justify-content-end flex-wrap mb-2"}
                  onSubmit={(e) => e.preventDefault()}>
                <Button
                    label={'Selected Days List'}
                    severity={'help'}
                    className={"mr-auto"}
                    onClick={() => router.push('/menu/chef/selected')}
                />
                <Button onClick={handleSubmit} label={'Add Menu Day'} className={"p-button-success"}/>
                <Dropdown
                    value={selectedDay}
                    style={{width: '100%', maxWidth: '200px'}}
                    options={[
                        {label: 'Saturday', value: 'Sat'},
                        {label: 'Sunday', value: 'Sun'},
                        {label: 'Monday', value: 'Mon'},
                        {label: 'Tuesday', value: 'Tue'},
                        {label: 'Wednesday', value: 'Wed'},
                        {label: 'Thursday', value: 'Thu'},
                        {label: 'Friday', value: 'Fri'},
                    ]}
                    onChange={(e) => {
                        setSelectedDay(e.value);
                    }}
                    placeholder="Select a Day"
                />
            </form>
            <div className={'card mb-0'}>
                <h1 className={"mb-2 uppercase"}>Chef Menu</h1>
                <DataTable
                    value={menu || []}
                    selectionMode="checkbox"
                    selection={selectedMenu}
                    onSelectionChange={(e) => {
                        // SET THE SELECTED MENU
                        setSelectedMenu(e.value);
                        // SET THE SELECTED MENU IDS
                        setSelectedMenuIds(e.value.map((menu) => menu._id));
                    }}
                    dataKey="_id"
                    paginator
                    rows={10}
                >
                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}} exportable={false}></Column>
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