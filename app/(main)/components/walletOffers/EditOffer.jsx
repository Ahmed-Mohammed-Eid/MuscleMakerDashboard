"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../components/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import {InputNumber} from "primereact/inputnumber";
import {InputTextarea} from "primereact/inputtextarea";
import {Button} from "primereact/button";
import {InputSwitch} from "primereact/inputswitch";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function EditOffer({offerData, id}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // FORM STATE
    const [form, setForm] = useState({
        title: '',
        description: '',
        chargeAmount: 0,
        offerAmount: 0,
        expiryDate: null,
        isBlocked: null,
        files: [],
    });

    // HANDLERS
    function updateOffer(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.title || !form.description || !form.chargeAmount || !form.offerAmount || !form.expiryDate) {
            return toast.error("Please fill all the fields.");
        }

        // CREATE THE FORM DATA
        const formData = new FormData();

        // APPEND THE FORM DATA
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('chargeAmount', form.chargeAmount);
        formData.append('offerAmount', form.offerAmount);
        formData.append('expiryDate', form.expiryDate);
        formData.append('isBlocked', form.isBlocked);
        formData.append('offerId', id);


        // APPEND THE IMAGES
        for(let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // Set the loading state for the spinner
        setLoading(true);

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/offer`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Offer created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the offer.");
                setLoading(false);
            })
    }

    // SET THE FORM DATA
    React.useEffect(() => {
        if (offerData) {
            setForm({
                title: offerData.title,
                description: offerData.description,
                chargeAmount: offerData.chargeAmount,
                offerAmount: offerData.offerAmount,
                expiryDate: new Date(offerData.expiryDate),
                isBlocked: offerData.isBlocked,
                files: [],
            })
        }
    }, [offerData]);

    return (
        <form onSubmit={updateOffer}>
            <div className={'card mb-2'}>
                <h1 className={"text-2xl font-bold mb-4 uppercase"}>Edit Wallet Offer</h1>
                <div className="grid formgrid p-fluid">
                    <div className="col-12 mb-2 lg:mb-2">
                        <label className={"mb-2 block"} htmlFor="male-image">OFFER IMAGE</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setForm({...form, files: files})
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...form.files || []]
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index
                                })
                                setForm({...form, files: newItems})
                            }}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="title">Title</label>
                        <InputText
                            id="title"
                            type="text"
                            placeholder={"Enter Offer Arabic Name"}
                            value={form.title}
                            onChange={(e) => setForm({...form, title: e.target.value})}
                        />
                    </div>
                    {/*DESCRIPTION*/}
                    <div className="field col-12">
                        <label htmlFor="description">Description</label>
                        <InputTextarea
                            id="description"
                            placeholder={"Enter Offer Description"}
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                            style={{height: '100px'}}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="chargeAmount">Charge Amount</label>
                        <InputNumber
                            id="chargeAmount"
                            placeholder={"Enter Charge Amount"}
                            value={form.chargeAmount}
                            onChange={(e) => setForm({...form, chargeAmount: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="offerAmount">Offer Amount (HINT: Type the extra amount only)</label>
                        <InputNumber
                            id="offerAmount"
                            placeholder={"Enter Offer Amount"}
                            value={form.offerAmount}
                            onChange={(e) => setForm({...form, offerAmount: e.value})}
                        />
                    </div>
                    {/*  EXPIRY DATE  */}
                    <div className="field col-12">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <Calendar
                            id="expiryDate"
                            value={form.expiryDate}
                            onChange={(e) => setForm({...form, expiryDate: e.value})}
                            showIcon
                            placeholder={"Select Expiry Date"}
                            minDate={new Date()}
                        />
                    </div>
                    {/*  BLOCK STATUS  */}
                    <div className="field col-12 flex gap-2 align-items-center">
                        <InputSwitch
                            id="blocked"
                            checked={form.isBlocked}
                            onChange={(e) => setForm({...form, isBlocked: e.value})}
                        />
                        <label htmlFor="blocked">Blocked</label>
                    </div>
                </div>
            </div>
            <div
                className="mt-4"
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Button
                    type={"submit"}
                    style={{width: '100%', textTransform: 'uppercase'}}
                    label={loading ?
                        <ProgressSpinner
                            fill={'#fff'}
                            strokeWidth={'4'}
                            style={{width: '2rem', height: '2rem'}}/> : `Update Offer`}
                    disabled={loading}/>
            </div>
        </form>
    )
}