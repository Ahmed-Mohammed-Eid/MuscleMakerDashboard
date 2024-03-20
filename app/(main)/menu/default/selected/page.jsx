"use client"
import React, {useEffect, useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {toast} from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";

export default function DefaultSelectedPage() {
    // STATES
    const [menu, setMenu] = useState([]);


    // FUNCTION TO GET THE MEALS
    const getMeals = async () => {
        // GET TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // SET DYNAMIC URL BASED ON THE ROLE
        let url = `${process.env.API_URL}/get/menu`;

        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            const menu = res.data.menu;

            // LOOP THROUGH THE MENU AND SORT IT BASED ON THE KEY day FROM THE OBJECT SROM 'Sat' To 'Fri' even if the menu is not having all the days of the week just ignore the missing days
            // THE DAY VALUE WILL BE ONE OF THESE VALUES ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
            const sortedMenu = menu.sort((a, b) => {
                const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                return days.indexOf(a.day) - days.indexOf(b.day);
            });

            setMenu(sortedMenu);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }

    // EFFECT TO GEY MENU
    useEffect(() => {
        // GET THE MEALS
        getMeals();
    }, []);

    // FUNCTION TO GET THE FULL NAME OF THE DAY
    const getDayName = (day) => {
        // GET THE DATE AND FORMAT IT TO SHOW THE FULL NAME BASED ON THE SHORT NAME FOR EXAMPLE 'Sat' TO 'Saturday'
        const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        // GET THE DATE WITH THE FIRST 3 LETTERS OF THE DAY
        return days.find(d => d.startsWith(day));
    }

    return (
        <>
            <div className={'card mb-0'}>
                <h1 className={"mb-2 uppercase"}>Default Menu</h1>
                <DataTable
                    value={menu || []}
                >
                    <Column
                        field="day"
                        header="Day"
                        sortable
                        filter
                        body={(rowData) => {
                            return (
                                <span className="text-center font-bold">
                                    {getDayName(rowData.day)}
                                </span>
                            )
                        }}
                    />
                    <Column
                        field="breakfast"
                        header="Breakfast"
                        body={(rowData) => {
                            return rowData.breakfast.map((meal, index) => {
                                return (
                                    <p className={'text-sm mb-0'} key={index}>{meal.mealId.mealTitle}</p>
                                )
                            })
                        }}
                        sortable
                        filter
                    />
                    <Column
                        field="lunch"
                        header="Lunch"
                        body={(rowData) => {
                            return rowData.lunch.map((meal, index) => {
                                return (
                                    <p className={'text-sm mb-0'} key={index}>{meal.mealId.mealTitle}</p>
                                )
                            })
                        }}
                        sortable
                        filter
                    />
                    <Column
                        field="dinner"
                        header="Dinner"
                        body={(rowData) => {
                            return rowData.dinner.map((meal, index) => {
                                return (
                                    <p className={'text-sm mb-0'} key={index}>{meal.mealId.mealTitle}</p>
                                )
                            })
                        }}
                        sortable
                        filter
                        />
                {/*    SNACK*/}
                    <Column
                        field="snack"
                        header="Snack"
                        body={(rowData) => {
                            return rowData.snack.map((meal, index) => {
                                return (
                                    <p className={'text-sm mb-0'} key={index}>{meal.mealId.mealTitle}</p>
                                )
                            })
                        }}
                        sortable
                        filter
                    />
                </DataTable>
            </div>
        </>
    );
}