'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CouponsList() {
    // STATES
    const [coupons, setCoupons] = useState([]);
    const [selectedCouponToDelete, setSelectedCouponToDelete] = useState(null);
    const [selectedCouponToEdit, setSelectedCouponToEdit] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // API CALL /coupons
        getCoupons();
    }, []);

    // GET THE COUPONS HANDLER
    const getCoupons = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /coupons
        axios
            .get(`${process.env.API_URL}/all/coupons?page=1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setCoupons(res.data?.coupons || []);
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to fetch coupons');
            });
    };

    // EDIT COUPON
    const editCoupon = (coupon) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE COUPON
        if (!coupon) {
            toast.error('Coupon not found');
            return;
        }

        // API CALL /coupons
        axios
            .put(
                `${process.env.API_URL}/set/coupon/expired`,
                {
                    couponId: selectedCouponToEdit._id,
                    status: !selectedCouponToEdit.expired
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((res) => {
                setSelectedCouponToEdit(null);
                toast.success('Coupon status changed successfully');
                // REFRESH THE COUPONS
                getCoupons();
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to change coupon status');
            });
    };

    // DELETE COUPON
    const deleteCoupon = (coupon) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE COUPON
        if (!coupon) {
            toast.error('Coupon not found');
            return;
        }

        // API CALL /coupons
        axios
            .delete(`${process.env.API_URL}/delete/coupon`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    couponId: selectedCouponToDelete._id
                }
            })
            .then((res) => {
                setSelectedCouponToDelete(null);
                toast.success('Coupon deleted successfully');
                // REFRESH THE COUPONS
                getCoupons();
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to delete coupon');
            });
    };

    return (
        <>
            <div className="card">
                <DataTable
                    value={coupons || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header="COUPONS"
                    emptyMessage="No coupons found"
                    className="p-datatable-sm"
                >
                    <Column
                        field={''}
                        header="#"
                        sortable
                        filter
                        filterPlaceholder="Search by #"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData, index) => {
                            return <div>{index.rowIndex + 1}</div>;
                        }}
                    />
                    <Column
                        field="couponCode"
                        header="Coupon Text"
                        sortable
                        filter
                        filterPlaceholder="Search by Coupon Text"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-between'}>
                                    <p
                                        onClick={() => {
                                            navigator.clipboard.writeText(rowData.couponCode);
                                            toast.success('Copied to clipboard');
                                        }}
                                        style={{ cursor: 'pointer', color: '#6f3ee6', fontWeight: 'bold' }}
                                    >
                                        {rowData.couponCode}
                                    </p>
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="discountType"
                        header="Discount Type"
                        sortable
                        filter
                        filterPlaceholder="Search by Discount Type"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return <Tag value={rowData.discountType === 'amount' ? 'Amount' : 'Ratio'} severity={rowData.discountType === 'amount' ? 'success' : 'info'} style={{ fontSize: '12px', fontWeight: '400' }} />;
                        }}
                    />
                    <Column
                        field="discountAmount"
                        header="Discount Amount"
                        sortable
                        filter
                        filterPlaceholder="Search by Discount Amount"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div>
                                    {rowData.discountAmount} {rowData.discountType === 'amount' ? 'kwd' : '%'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="hasExpiry"
                        header="Has Expiry"
                        sortable
                        filter
                        filterPlaceholder="Search by Has Expiry"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return <div>{rowData.hasExpiry ? '✅' : '❌'}</div>;
                        }}
                    />
                    <Column
                        field="expiryDate"
                        header="Expiry Date"
                        sortable
                        filter
                        filterPlaceholder="Search by Expiry Date"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div>
                                    {rowData.expiryDate
                                        ? new Date(rowData.expiryDate).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: '2-digit'
                                          })
                                        : 'N/A'}
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="hasUsageNumber"
                        header="Has Usage Number"
                        sortable
                        filter
                        filterPlaceholder="Search by Has Usage Number"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return <div>{rowData.hasUsageNumber ? '✅' : '❌'}</div>;
                        }}
                    />
                    <Column field="usageNumber" header="Usage Number" sortable filter filterPlaceholder="Search by Usage Number" style={{ whiteSpace: 'nowrap' }} />
                    <Column
                        field="expired"
                        header="Expired"
                        sortable
                        filter
                        filterPlaceholder="Search by Expired"
                        style={{ whiteSpace: 'nowrap' }}
                        body={(rowData) => {
                            return (
                                <div>{rowData.expired ? <Tag value="Expired" severity={'danger'} style={{ fontSize: '12px', fontWeight: '400' }} /> : <Tag value="Active" severity={'success'} style={{ fontSize: '12px', fontWeight: '400' }} />}</div>
                            );
                        }}
                    />
                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center gap-2'}>
                                    <button className={'editButton'} onClick={() => setSelectedCouponToEdit(rowData)}>
                                        Change Status
                                    </button>
                                    <button className={'deleteButton'} onClick={() => setSelectedCouponToDelete(rowData)}>
                                        Delete
                                    </button>
                                </div>
                            );
                        }}
                        header="Actions"
                        style={{ width: '10%' }}
                    />
                </DataTable>

                {/* DELETE DIALOG */}
                <Dialog
                    visible={selectedCouponToDelete}
                    onHide={() => setSelectedCouponToDelete(null)}
                    header="Delete Coupon"
                    footer={
                        <div className={'flex justify-center'}>
                            <button className={'deleteButton'} onClick={() => deleteCoupon(selectedCouponToDelete)}>
                                Delete
                            </button>
                            <button className={'cancelButton'} onClick={() => setSelectedCouponToDelete(null)}>
                                Cancel
                            </button>
                        </div>
                    }
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                >
                    <div className={'flex justify-center'}>
                        <p>Are you sure you want to delete this coupon?</p>
                    </div>
                </Dialog>

                {/* EDIT DIALOG */}
                <Dialog
                    visible={selectedCouponToEdit}
                    onHide={() => setSelectedCouponToEdit(null)}
                    header="Edit Coupon"
                    footer={
                        <div className={'flex justify-center'}>
                            <button className={'editButton'} onClick={() => editCoupon(selectedCouponToEdit)}>
                                Save
                            </button>
                            <button className={'cancelButton'} onClick={() => setSelectedCouponToEdit(null)}>
                                Cancel
                            </button>
                        </div>
                    }
                    position={'center'}
                    style={{ width: '100%', maxWidth: '500px' }}
                    draggable={false}
                    resizable={false}
                >
                    <div className={'flex justify-center'}>
                        <p>Are you sure you want to change the status of this coupon?</p>
                    </div>
                </Dialog>
            </div>
        </>
    );
}
