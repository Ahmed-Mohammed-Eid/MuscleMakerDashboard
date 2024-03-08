"use client";
import React, {useEffect, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {toast} from "react-hot-toast";
import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";


export default function MealsReportTable() {

    //STATE FOR THE MEALS
    const [clientIds, setClientIds] = React.useState([]);
    const [meals, setMeals] = React.useState([]);
    // STATE FOR THE DATE
    const [date, setDate] = useState(new Date());

    // GET THE MEALS FROM THE API
    function getMeals() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // MAKE THE REQUEST TO THE API
        axios.get(`${process.env.API_URL}/today/delivery/meals`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealsFilter: "all",
                mealsDate: `${date}`,
            }
        })
            .then(res => {
                // GET THE MEALS ARRAY
                const meals = res.data.clients;
                // SET THE CLIENTS IDS AND THE DATE ID IN THE STATE WITH NO DUPLICATES TO BE SOMETHING LIKE [{clientId: "123", dateId: "123"},...]
                const clientIds = [];
                meals.forEach(meal => {
                    if(!clientIds.some(client => client.clientId === meal.clientId)) {
                        clientIds.push({
                            clientId: meal.clientId,
                            dateId: meal.dateId
                        });
                    }
                });
                // SET THE CLIENTS IDS
                setClientIds(clientIds);
                // SET THE ORDERS ARRAY
                setMeals(meals);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the meals.");
            })
    }

    // MARK MEAL AS DELIVERED
    // function markAsDelivered(clientId, dateId, dayMealId) {
    //     // GET THE TOKEN FROM THE LOCAL STORAGE
    //     const token = localStorage.getItem("token");
    //
    //     // VALIDATE IF THERE ARE DATA
    //     if(!clientId || !dateId || !dayMealId) {
    //         toast.error("An error occurred while marking the meal as delivered.");
    //         return;
    //     }
    //
    //     // MAKE THE REQUEST TO THE API
    //     axios.put(`${process.env.API_URL}/set/meal/delivered`, {
    //         clientId: clientId,
    //         dateId: dateId,
    //         dayMealId: dayMealId
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         },
    //     })
    //         .then(res => {
    //             toast.success(res.data?.message || "Meal marked as delivered.");
    //             getMeals();
    //         })
    //         .catch(error => {
    //             toast.error(error?.response?.data?.message || "An error occurred while marking the meal as delivered.");
    //         })
    // }

    // PRINT ALL THE LABELS
    function printLabels() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE IF THERE ARE MEALS DATE
        if(!date) {
            toast.error("Please select a date to print the labels.");
            return;
        }

        // MAKE THE REQUEST TO THE API
        axios.get(`${process.env.API_URL}/print/labels`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                mealFilter: "all",
                mealsDate: `${date}`,
            }
        })
            .then(res => {
                if(res.data?.url) {
                    window.open(res.data.url, "_blank");
                }else {
                    toast.error("An error occurred while printing the labels.");
                }
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the meals.");
            })
    }

    // MARK ALL AS DELIVERED
    function markAllAsDelivered() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE IF THERE ARE CLIENTS
        if(clientIds.length === 0) {
            toast.error("There are no clients to mark as delivered.");
            return;
        }

        // MAKE THE REQUEST TO THE API
        axios.put(`${process.env.API_URL}/set/all/meals/delivered`, {
            clients: clientIds || [],
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => {
                toast.success(res.data?.message || "All meals marked as delivered.");
                getMeals();
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while marking all meals as delivered.");
            })
    }

    // EFFECT TO GET THE MEALS
    useEffect(() => {
        getMeals();
    }, [date]);

    return (
        <>
            <div className="grid mb-3">
                <div className="col-12">
                    <Calendar
                        value={date}
                        onChange={(e) => {
                            setDate(e.value);
                        }}
                        dateFormat="dd/mm/yy"
                        showIcon
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </div>
                <div className="col-12 grid gap-1 justify-content-end" style={{padding: '5px 0'}}>
                    <Button
                        label="Print Labels"
                        icon="pi pi-print"
                        size={'small'}
                        severity="info"
                        onClick={printLabels}
                    />
                    <Button
                        label="Mark all as Delivered"
                        icon="pi pi-check"
                        size={'small'}
                        severity="success"
                        onClick={markAllAsDelivered}
                    />
                </div>
            </div>

            <DataTable
                value={meals || []}
                style={{width: '100%'}}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No meals found."
            >

                <Column
                    field="clientName"
                    header="Client Name"
                    sortable
                    filter
                />
                <Column
                    field="phoneNumber"
                    header="Phone Number"
                    sortable
                    filter
                />
                <Column
                    field="mealTitle"
                    header="Title"
                    sortable
                    filter
                />
                <Column
                    field="mealType"
                    header="Type"
                    sortable
                    filter
                />
                {/*<Column*/}
                {/*    field={'_id'}*/}
                {/*    header={'Actions'}*/}
                {/*    body={(rowData) => {*/}
                {/*        return (*/}
                {/*            <div className="flex justify-center gap-2">*/}
                {/*                <button*/}
                {/*                    className="editButton"*/}
                {/*                    style={{backgroundColor: "#22C55E"}}*/}
                {/*                    onClick={() => {*/}
                {/*                        markAsDelivered(rowData.clientId, rowData.dateId, rowData.mealId);*/}
                {/*                    }}*/}
                {/*                >*/}
                {/*                    Delivered*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        )*/}
                {/*    }}*/}
                {/*/>*/}
            </DataTable>
        </>
    )
}