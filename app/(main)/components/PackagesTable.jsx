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

export default function PackagesTable() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE PACKAGES
    const [packages, setPackages] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [packageIdToDelete, setPackageIdToDelete] = React.useState(null);

    // GET THE PACKAGES FROM THE API
    function getPackages() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/bundles`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setPackages(response.data?.bundles || []);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the packages.");
            })
    }

    // EFFECT TO GET THE PACKAGES
    useEffect(() => {
        getPackages();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/bundle`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                bundleId: packageIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Meal Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getPackages();
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
            <DataTable
                value={packages || []}
                style={{width: '100%'}}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No packages found."
            >
                <Column
                    field="bundleImageMale"
                    header="Male Img"
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.bundleImageMale || '/img-not_found.jpg'}
                                alt={rowData.bundleName}
                                width={50}
                                height={50}
                                placeholder={"blur"}
                                blurDataURL={rowData.bundleImageMale}
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                        )
                    }}
                />
                <Column
                    field="bundleImageMale"
                    header="Female Img"
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData.bundleImageFemale}
                                alt={rowData.bundleName}
                                width={50}
                                height={50}
                                placeholder={"blur"}
                                blurDataURL={rowData.bundleImageFemale}
                                style={{
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                        )
                    }}
                />
                <Column
                    field="bundleName"
                    header="Name Ar"
                    sortable
                    filter
                />
                <Column
                    field="bundleNameEn"
                    header="Name En"
                    sortable
                    filter
                />
                <Column
                    field="bundlePrice"
                    header="Price"
                    sortable
                    filter
                    body={(rowData) => {
                        return (
                            <span className="text-center font-bold">
                                {rowData.bundlePrice} KWD
                            </span>
                        )
                    }}
                />
                <Column
                    field="snacksNumber"
                    header="Snacks"
                    sortable
                    filter
                />
                <Column
                    field="fridayOption"
                    header="Fridays"
                    sortable
                    filter
                    body={(rowDara) => {
                        return (
                            <span className="text-center font-bold">
                        {rowDara.fridayOption ? <span className="text-green-500">Yes</span> :
                            <span className="text-red-500">No</span>}
                    </span>
                        )
                    }}/>
                <Column
                    field={'_id'}
                    header={'Actions'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/packages/${rowData._id}`)
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
                header="Delete Package"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Package?
                </p>
            </Dialog>
        </>
    )
}