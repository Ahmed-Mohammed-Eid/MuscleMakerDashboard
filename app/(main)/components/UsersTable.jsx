"use client";
import React, {useEffect, useState} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {TabMenu} from "primereact/tabmenu";
import {Dropdown} from "primereact/dropdown";
// TOAST
import {toast} from "react-hot-toast"


export default function UsersTable() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE USERS
    const [page, setPage] = React.useState(1);
    const [users, setUsers] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [userIdToDelete, setMealIdToDelete] = React.useState(null);
    // LOAD MORE STATES
    const [loadDataOption, setLoadDataOption] = useState("saveOldData");
    const [hasNextPage, setHasNextPage] = useState(false);
    // STATE
    const [activeTab, setActiveTab] = useState("clients");


    // GET THE EMPLOYEES FROM THE API
    function getEmployees() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/all/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => {
                console.log(res)
                if (loadDataOption === "saveOldData" && page > 1) {
                    // GET A COPY OF THE ORDERS ARRAY
                    const usersCopy = [...users];
                    // PUSH THE NEW ORDERS TO THE ORDERS ARRAY
                    usersCopy.push(...res.data.users);
                    // SET THE ORDERS ARRAY
                    setUsers(usersCopy);
                    // SET THE LOAD MORE OPTION TO NULL
                    setLoadDataOption(null);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.hasNextPage || false);
                } else {
                    setUsers(res.data.users);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.hasNextPage || false);
                }
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the users.");
            })
    }

    // GET THE CLIENTS FROM THE API
    function getClients() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/all/clients`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: page
            }
        })
            .then(res => {
                console.log(res)
                if (loadDataOption === "saveOldData" && page > 1) {
                    // GET A COPY OF THE ORDERS ARRAY
                    const usersCopy = [...users];
                    // PUSH THE NEW ORDERS TO THE ORDERS ARRAY
                    usersCopy.push(...res.data.data.clients);
                    // SET THE ORDERS ARRAY
                    setUsers(usersCopy);
                    // SET THE LOAD MORE OPTION TO NULL
                    setLoadDataOption(null);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.data.hasNextPage || false);
                } else {
                    setUsers(res.data.data.clients);
                    // SET THE HAS NEXT PAGE TO FALSE
                    setHasNextPage(res.data.data.hasNextPage || false);
                }
            })
            .catch(error => {
                toast.error(error?.response?.data?.data?.message || "An error occurred while getting the users.");
            })
    }

    // EFFECT TO GET THE USERS
    useEffect(() => {
        if (activeTab === "employees") {
            getEmployees();
        } else {
            getClients();
        }
    }, [activeTab, page]);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/bundle`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                bundleId: userIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Meal Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getClients();
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
                    {label: 'CLIENTS', icon: 'pi pi-fw pi-users', command: () => setActiveTab("clients")},
                    {label: 'EMPLOYEES', icon: 'pi pi-fw pi-user', command: () => setActiveTab("employees")},
                    {
                        label: 'CREATE EMPLOYEE', icon: 'pi pi-fw pi-user-plus', command: () => {
                            router.push('/users/create/employee')
                        }
                    },
                ]}
            />

            {activeTab === "employees" && (
                <DataTable
                    value={users || []}
                    style={{width: '100%'}}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    emptyMessage="No users found."
                >
                    <Column
                        field="userImage"
                        header="Image"
                        body={(rowData) => {
                            return (
                                <Image
                                    src={rowData.userImage}
                                    alt={rowData.fullName}
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
                        field="fullName"
                        header="Name Ar"
                        sortable
                        filter
                    />
                    <Column
                        field="username"
                        header="Username"
                        sortable
                        filter
                        body={(rowData) => {
                            // ADD COPY FUNCTION
                            return (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        color: "#007bff",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(rowData.username)
                                            .then(() => {
                                                toast.success("Username copied to clipboard");
                                            })
                                    }}
                                >
                                {rowData.username}
                                    <i className="pi pi-copy"/>
                            </span>
                            )
                        }}
                    />
                    <Column
                        field="phoneNumber"
                        header="Phone Number"
                        sortable
                        filter
                    />
                    <Column
                        field="address"
                        header="Address"
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
                                        className="editButton"
                                        onClick={() => {
                                            router.push(`/users/${rowData._id}`)
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className={rowData.isActive ? "deactivateButton" : "activateButton"}
                                        onClick={() => {}}
                                    >
                                        {rowData.isActive ? "Deactivate" : "Activate"}
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
                </DataTable>)}

            {activeTab === "clients" && (
                <DataTable
                    value={users || []}
                    style={{width: '100%'}}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    emptyMessage="No users found."
                >
                    <Column
                        field="subscriptionId"
                        header="MEMBERSHIP ID"
                        sortable
                        filter
                    />
                    <Column
                        field="clientName"
                        header="NAME"
                        sortable
                        filter
                    />
                    <Column
                        field="phoneNumber"
                        header="MOBILE"
                        sortable
                        filter
                    />
                    <Column
                        field="subscriped"
                        header="SUBSCRIBED"
                        sortable
                        filter
                        body={(rowData) => {
                            // IT SHOULD BE SUBSCRIBED OR NOT
                            return (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        color: rowData.subscriped ? "#28a745" : "#dc3545",
                                        cursor: "pointer",
                                    }}
                                >
                                {rowData.subscriped ? "Subscribed" : "Not Subscribed"}
                            </span>
                            )
                        }}
                    />
                    <Column
                        field={'_id'}
                        header={'Actions'}
                        body={(rowData) => {
                            return (
                                <div className="flex justify-center gap-2">
                                    <button
                                        className="viewButton"
                                        onClick={() => {

                                        }}
                                    >
                                        View
                                    </button>

                                    <button
                                        className={rowData.clientStatus?.paused ? 'unfreezeButton' : 'freezeButton'}
                                        onClick={() => {}}
                                        >
                                        {rowData.clientStatus?.paused ? 'Unfreeze' : 'Freeze'}
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
                </DataTable>)}

            <Dialog
                header="Delete Employee"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Employee?
                </p>
            </Dialog>
        </>
    )
}