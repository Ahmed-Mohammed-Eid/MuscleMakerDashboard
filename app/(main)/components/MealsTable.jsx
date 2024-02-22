"use client";
import React, {useEffect, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {toast} from "react-hot-toast";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {TabMenu} from "primereact/tabmenu";
import {Dropdown} from "primereact/dropdown";


export default function MealsTable() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE MEALS
    const [page, setPage] = React.useState(1);
    const [meals, setMeals] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [mealIdToDelete, setMealIdToDelete] = React.useState(null);
    // LOAD MORE STATES
    const [loadDataOption, setLoadDataOption] = useState("saveOldData");
    const [hasNextPage, setHasNextPage] = useState(false);
    // STATE
    const [menuType, setMenuType] = useState("orders");


    // GET THE MEALS FROM THE API
    function getMeals() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/meals`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                menuType: menuType,
                mealType: 'all',
                // page: page,
            }
        })
            .then(res => {
                if (loadDataOption === "saveOldData" && page > 1) {
                    // GET A COPY OF THE ORDERS ARRAY
                    const mealsCopy = [...meals];
                    // PUSH THE NEW ORDERS TO THE ORDERS ARRAY
                    mealsCopy.push(...res.data.data.meals);
                    // SET THE ORDERS ARRAY
                    setMeals(mealsCopy);
                    // SET THE LOAD MORE OPTION TO NULL
                    setLoadDataOption(null);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.data.hasNextPage);
                } else {
                    setMeals(res.data.data.meals);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.data.hasNextPage);
                }
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the meals.");
            })
    }

    // EFFECT TO GET THE MEALS
    useEffect(() => {
        getMeals();
    }, [menuType, page]);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/meal`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                mealId: mealIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Meal Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getMeals();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || res.message);
            })
    }

    const footerContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"/>
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
                style={{
                    backgroundColor: "#dc3545",
                    color: "#fff"
                }}
                autoFocus/>
        </div>
    );

    return (
        <>
            {hasNextPage && (<div className="mb-3 w-full" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
            }}>
                {/*  BUTTON TO LOAD MORE  */}
                <div style={{
                    display: "flex",
                    alignItems: "initial",
                    justifyContent: "space-between",
                }}>
                    <Dropdown
                        value={loadDataOption}
                        options={[
                            {
                                label: "Don't Save Old Orders",
                                value: "dontSaveOldData",
                            },
                            {
                                label: "Save Old Orders",
                                value: "saveOldData",
                            },
                        ]}
                        onChange={(e) => {
                            setLoadDataOption(e.value);
                        }}
                        placeholder="Load More"
                        style={{
                            marginRight: "1rem",
                        }}
                    />
                    <button
                        className="button text-white px-6 py-2 border-round border-none pointer custom-button inline-block scale-95"
                        onClick={() => {
                            if (!hasNextPage) {
                                return toast.error("No more orders to load")
                            }

                            if (!loadDataOption) {
                                return toast.error("Please select how should we load the orders")
                            }

                            setPage(page + 1);
                        }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '5px',
                            marginLeft: "auto",
                            marginRight: ".5rem",
                            backgroundColor: "#28a745",
                        }}
                    >
                        Next Part <i className="pi pi-angle-double-right"/>
                    </button>
                </div>
            </div>)}

            <TabMenu
                model={[
                    {label: 'ORDERS', icon: 'pi pi-fw pi-home', command: () => setMenuType("orders")},
                    {label: 'SUBSCRIPTIONS', icon: 'pi pi-fw pi-calendar', command: () => setMenuType("subscriptions")},
                ]}
            />
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
                <Column
                    field={'_id'}
                    header={'Actions'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="copyButton"
                                    onClick={() => {
                                        navigator.clipboard.writeText(rowData._id);
                                        toast.success("Meal ID Copied");
                                    }}
                                >
                                    Copy ID
                                </button>
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/meals/${rowData._id}`)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setMealIdToDelete(rowData._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Meal"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Meal?
                </p>
            </Dialog>
        </>
    )
}