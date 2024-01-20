"use client";
import React, {useEffect} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {toast} from "react-hot-toast";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

export default function DayboxesTable() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE BOXES
    const [boxes, setBoxes] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [boxIdToDelete, setPackageIdToDelete] = React.useState(null);

    // GET THE BOXES FROM THE API
    function getBoxes() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/boxes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setBoxes(response.data?.boxes || []);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the boxes.");
            })
    }

    // EFFECT TO GET THE BOXES
    useEffect(() => {
        getBoxes();
    }, []);

    // DELETE THE BOXE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/box`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                boxId: boxIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Box Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getBoxes();
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
            <DataTable
                value={boxes || []}
                style={{width: '100%'}}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No boxes found."
            >
                <Column
                    field="boxImage"
                    header="Box Image"
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.boxImage || "/img-not_found.jpg"}
                                alt={`${rowData.boxNameEn} - ${rowData.boxNameAr}`}
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
                    field="boxNameAr"
                    header="Box Name Ar"
                    sortable
                    filter
                />
                <Column
                    field="boxNameEn"
                    header="Box Name En"
                    sortable
                    filter
                />
                <Column
                    field="boxPrice"
                    header="Box Price"
                    sortable
                    filter
                    body={(rowData) => {
                        return (
                            <>
                            {rowData?.boxPrice && (<span className="text-center font-bold">
                                    {rowData.boxPrice} KWD
                                </span>)}
                            </>
                        )
                    }}
                />
                <Column
                    field="mealsNumber"
                    header="Meals"
                    sortable
                    filter
                />
                <Column
                    field="snacksNumber"
                    header="Snacks"
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
                                        router.push(`/dayboxes/${rowData._id}`)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setPackageIdToDelete(rowData._id);
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
                header="Delete Box"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Box?
                </p>
            </Dialog>
        </>
    )
}