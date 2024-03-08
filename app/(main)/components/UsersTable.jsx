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
    const [clientIdToDelete, setClientIdToDelete] = React.useState(null);
    const [employeeIdToDelete, setEmployeeIdToDelete] = React.useState(null);
    // LOAD MORE STATES
    const [loadDataOption, setLoadDataOption] = useState("saveOldData");
    const [hasNextPage, setHasNextPage] = useState(false);
    // STATE
    const [activeTab, setActiveTab] = useState("clients");
    const [clientData, setClientData] = useState(null);


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
    const deleteClientHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/admin/remove/client`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                clientId: clientIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Client deleted successfully.');
                // Hide the dialog
                setClientIdToDelete(null);
                // Update the State
                getClients();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || `An error occurred while deleting the client.`);
            })
    }

    // DELETE THE EMPLOYEE HANDLER
    const deleteEmployeeHandler = async (event) => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: employeeIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Employee deleted successfully.');
                // Hide the dialog
                setEmployeeIdToDelete(false);
                // Update the State
                getEmployees();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || `An error occurred while deleting the employee.`);
            })
    }

    // ACTIVATE AND DEACTIVATE THE EMPLOYEE
    const activateOrDeactivateEmployee = async (userId, status) => {
        const url = `${process.env.API_URL}/set/user/active`; // PUT REQUEST

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // SET THE DATA
        const data = {
            userId: userId,
            isActive: status
        };

        // SEND THE REQUEST
        await axios.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log(res);
                // SHOW THE NOTIFICATION
                toast.success(res.data.message);
                // GET THE EMPLOYEES
                getEmployees();
            })
            .catch(err => {
                console.log(err);
                toast.error(err?.response?.data?.message || "An error occurred while updating the employee status.");
            })
    }

    // FREEZE OR UNFREEZE THE CLIENT
    // const freezeOrUnfreezeClient = async (clientId, status) => {
    //     const freezeUrl = `${process.env.API_URL}/client/pause`; // POST REQUEST
    //     const unfreezeUrl = `${process.env.API_URL}/activate/client`; // PUT REQUEST
    //
    //     // GET THE TOKEN FROM THE LOCAL STORAGE
    //     const token = localStorage.getItem("token");
    //
    //     // SET THE URL
    //     const url = status === "paused" ? unfreezeUrl : freezeUrl;
    //
    //     // SET THE METHOD
    //     const method = status === "paused" ? "put" : "post";
    //
    //     // SET THE DATA
    //     const data = {
    //         clientId: clientId
    //     };
    //
    //     // SEND THE REQUEST
    //     await axios[method](url, data, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //         .then(res => {
    //             console.log(res);
    //             // SHOW THE NOTIFICATION
    //             toast.success(res.data.message);
    //             // GET THE CLIENTS
    //             getClients();
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             toast.error(err?.response?.data?.message || "An error occurred while updating the client status.");
    //         })
    // }
    //

    // DELETE CLIENT DIALOG FOOTER
    const clientFooterContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setClientIdToDelete(null)}
                className="p-button-text"/>
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteClientHandler();
                }}
                style={{
                    backgroundColor: "#dc3545",
                    color: "#fff"
                }}
                autoFocus/>
        </div>
    );

    // DELETE EMPLOYEE DIALOG FOOTER
    const employeeFooterContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setEmployeeIdToDelete(false)}
                className="p-button-text"/>
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteEmployeeHandler();
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
                                        onClick={() => {
                                            activateOrDeactivateEmployee(rowData._id, !rowData.isActive)
                                        }}
                                    >
                                        {rowData.isActive ? "Deactivate" : "Activate"}
                                    </button>

                                    <button
                                        className="deleteButton"
                                        onClick={() => {
                                            setEmployeeIdToDelete(rowData._id);
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
                                            setClientData(rowData);
                                        }}
                                    >
                                        View
                                    </button>

                                    {/*<button*/}
                                    {/*    className={rowData.clientStatus?.paused ? 'unfreezeButton' : 'freezeButton'}*/}
                                    {/*    onClick={() => {*/}
                                    {/*        freezeOrUnfreezeClient(rowData._id, rowData.clientStatus?.paused ? "unpaused" : "paused")*/}
                                    {/*    }}*/}
                                    {/*>*/}
                                    {/*    {rowData.clientStatus?.paused ? 'Unfreeze' : 'Freeze'}*/}
                                    {/*</button>*/}

                                    <button
                                        className="deleteButton"
                                        onClick={() => {
                                            setVisible(true);
                                            setClientIdToDelete(rowData._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )
                        }}
                    />
                </DataTable>)}

            {/*  DELETE CLIENT DIALOG  */}
            <Dialog
                header="Delete Client"
                visible={clientIdToDelete !== null}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setClientIdToDelete(null)}
                footer={clientFooterContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Client?
                </p>
            </Dialog>
            
            {/* DELETE EMPLOYEE DIALOG */}
            <Dialog
                header="Delete Employee"
                visible={employeeIdToDelete}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setEmployeeIdToDelete(false)}
                footer={employeeFooterContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Employee?
                </p>
            </Dialog>

            {/*  SHOW THE CLIENT DATA  */}
            <Dialog
                header="Client Data"
                visible={clientData !== null}
                position={"center"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setClientData(null)}
                draggable={false}
                resizable={false}
            >
                <div className="card">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <h5>Client Name</h5>
                            <p>{clientData?.clientName}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Client Phone</h5>
                            <p>{clientData?.phoneNumber}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Client Email</h5>
                            <p>{clientData?.email}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Gender</h5>
                            <p>{clientData?.gender}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Governorate</h5>
                            <p>{clientData?.governorate}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Region</h5>
                            <p>{clientData?.region}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Block</h5>
                            <p>{clientData?.block}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Street</h5>
                            <p>{clientData?.street}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Alley</h5>
                            <p>{clientData?.alley}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Building</h5>
                            <p>{clientData?.building}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Floor</h5>
                            <p>{clientData?.floor}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Apartment</h5>
                            <p>{clientData?.appartment}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Client Status</h5>
                            <p>{clientData?.clientStatus?.paused ? 'Paused' : 'Active'}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Client Subscription</h5>
                            <p>{clientData?.subscriped ? 'Subscribed' : 'Not Subscribed'}</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <h5>Bundle Id</h5>
                            <p>{clientData?.subscripedBundle?.bundleId}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Starting Date</h5>
                            <p>{new Date(clientData?.subscripedBundle?.startingDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Ending Date</h5>
                            <p>{new Date(clientData?.subscripedBundle?.endingDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <h5>Bundle Period</h5>
                            <p>{clientData?.subscripedBundle?.bundlePeriod}</p>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}