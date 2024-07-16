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

export default function OffersTable() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE OFFERS
    const [offers, setOffers] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [offerIdToDelete, setOfferIdToDelete] = React.useState(null);

    // GET THE OFFERS FROM THE API
    function getOffers() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/wallet/offers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setOffers(response.data?.offers || []);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the offers.");
            })
    }

    // EFFECT TO GET THE OFFERS
    useEffect(() => {
        getOffers();
    }, []);

    // DELETE THE OFFER HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/offer`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                offerId: offerIdToDelete,
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Offer Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getOffers();
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
                value={offers || []}
                style={{width: '100%'}}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No offers found."
            >
                {/*IMAGE*/}
                <Column
                    field={'offerImage'}
                    header={'Image'}
                    body={(rowData) => {
                        return (
                            <Image
                                src={rowData?.offerImage || '/img-not_found.jpg'}
                                alt={rowData.title}
                                width={50}
                                height={50}
                            />
                        )
                    }}
                />
                {/*TITLE*/}
                <Column
                    field={'title'}
                    header={'Title'}
                    filter={true}
                    sortable={true}
                />
                {/*CHARGE AMOUNT*/}
                <Column
                    field={'chargeAmount'}
                    header={'Charge Amount'}
                    filter={true}
                    sortable={true}
                />
                {/*OFFER AMOUNT*/}
                <Column
                    field={'offerAmount'}
                    header={'Offer Amount'}
                    filter={true}
                    sortable={true}
                />
                {/*EXPIRY DATE*/}
                <Column
                    field={'expiryDate'}
                    header={'Expiry Date'}
                    body={(rowData) => {
                        return (
                            <p>{new Date(rowData.expiryDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        )
                    }}
                    filter={true}
                    sortable={true}
                />
                {/*IS BLOCKED*/}
                <Column
                    field={'isBlocked'}
                    header={'Blocked'}
                    body={(rowData) => {
                        return (
                            <p>{rowData.isBlocked ? 'Yes' : 'No'}</p>
                        )
                    }}
                    filter={true}
                    sortable={true}
                />
                {/*CREATED AT*/}
                <Column
                    field={'createdAt'}
                    header={'Created At'}
                    body={(rowData) => {
                        return (
                            <p>{new Date(rowData.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        )
                    }}
                    filter={true}
                    sortable={true}
                />
                {/*ACTIONS*/}
                <Column
                    field={'_id'}
                    header={'Actions'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/walletOffers/${rowData._id}`)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setOfferIdToDelete(rowData._id);
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
                header="Delete Offer"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this Offer?
                </p>
            </Dialog>
        </>
    )
}