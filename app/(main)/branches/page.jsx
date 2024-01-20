"use client";
import React, {useEffect, useState} from 'react';

// AXIOS
import axios from 'axios';
// TOAST
import {toast} from 'react-hot-toast';

// COMPONENTS
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";


export default function Branches() {

    // VARIABLES
    let page = 1;
    let rowsPerPage = 25;

    // STATES
    const [branches, setBranches] = useState([]);
    const [visible, setVisible] = React.useState(false);
    const [branchIdToDelete, setBranchIdToDelete] = React.useState(null);
    // STATES
    const [loading, setLoading] = useState(false);
    const [branch, setBranch] = useState({
        branchName: '',
        branchId: '',
    })

    // SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        // VALIDATION
        if (!branch.branchName) {
            toast.error('Branch Name is required');
            return;
        }

        if (!branch.branchId) {
            toast.error('Branch Id is required');
            return;
        }

        // GET THE TOKEN
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please login first');
            return;
        }

        // SUBMIT
        setLoading(true);

        axios.post(`${process.env.API_URL}/create/branch`, {
            branchName: branch.branchName,
            branchFoodicsId: branch.branchId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(_ => {
                setLoading(false);
                toast.success('Branch set successfully');
                setBranch({
                    branchName: '',
                    branchId: '',
                });
                getBranches();
            })
            .catch(_ => {
                setLoading(false);
                toast.error('Something went wrong');
            })
    }

    // FUNCTION TO GET THE SHIFTS
    const getBranches = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem("token");

        // GET SHIFTS
        if (token) {
            axios
                .get(`${process.env.API_URL}/all/branches`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setBranches(res.data?.branches);
                })
                .catch((err) => {
                    toast.error(
                        err.response?.data?.message || "Something went wrong"
                    );
                });
        } else {
            toast.error("You are not authorized to access this page");
        }
    }

    // FETCH SHIFTS
    useEffect(() => {
        getBranches();
    }, []);

    // DELETE THE BRANCH HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/branch`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                branchId: branchIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Meal Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getBranches();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || res?.message);
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
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title uppercase">SET BRANCH</h5>
                </div>
                <form className={'p-fluid formgrid grid'} onSubmit={submitHandler}>

                    <div className="field col-12">
                        <label htmlFor="branchName" className={'font-bold'}>Branch Name</label>
                        <InputText
                            id="branchName"
                            value={branch.branchName}
                            onChange={(e) =>
                                setBranch({...branch, branchName: e.target.value})
                            }
                            placeholder="Branch Name"
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="branchId" className={'font-bold'}>Branch Foodics Id</label>
                        <InputText
                            id="branchId"
                            value={branch.branchId}
                            onChange={(e) =>
                                setBranch({...branch, branchId: e.target.value})
                            }
                            placeholder="Branch Foodics Id"
                        />
                    </div>

                    <div className="w-1/2 ml-auto mr-2">
                        <Button
                            type="submit"
                            className="bg-slate-500 w-full"
                            style={{
                                background: loading
                                    ? "#dcdcf1"
                                    : "var(--primary-color)",
                            }}
                            label={
                                loading ? (
                                    <ProgressSpinner
                                        strokeWidth="4"
                                        style={{
                                            width: "1.5rem",
                                            height: "1.5rem",
                                        }}
                                    />
                                ) : (
                                    "Submit"
                                )
                            }
                        />
                    </div>
                </form>
            </div>
            <div className="card">
                <h1 className="text-2xl mb-5 uppercase">Branches List</h1>
                <DataTable
                    value={branches}
                    paginator
                    first={page * rowsPerPage}
                    rows={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sortMode="multiple"
                    emptyMessage="No records found"
                    // Max height of the table container
                    scrollable
                    scrollHeight="calc(100vh - 370px)"
                >
                    <Column
                        field="branchName"
                        header="Branch Name"
                        sortable
                        filter
                        filterPlaceholder="Search by Branch Name"
                    />
                    <Column
                        field="branchFoodicsId"
                        header="Branch Foodics Id"
                        sortable
                        filter
                        filterPlaceholder="Search by Branch Id"
                        body={(rowData) => {
                            // ADD COPY FUNCTIONALITY WHEN CLICKING ON THE ID
                            return (
                                <div className="flex items-center">
                                    <span
                                        className="mr-2"
                                        onClick={() => {
                                            navigator.clipboard.writeText(rowData.branchFoodicsId);
                                            toast.success('Copied to clipboard');
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            color: 'var(--primary-color)'
                                        }}
                                    >
                                        {rowData.branchFoodicsId}
                                    </span>
                                </div>
                            )
                        }}
                    />
                    <Column
                        field={"_id"}
                        header="Actions"
                        body={(rowData) => {
                            return(
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setBranchIdToDelete(rowData._id);
                                    }}
                                >
                                    Delete
                                </button>
                            )
                        }}
                    />
                </DataTable>
            </div>
            <Dialog
                header="Delete Branch"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Branch?
                </p>
            </Dialog>
        </>
    )
}