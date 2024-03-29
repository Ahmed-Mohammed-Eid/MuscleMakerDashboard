"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../components/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Checkbox} from 'primereact/checkbox';
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

// IMPORTS
import ChoosePrices from "../../components/ChoosePrices";

export default function CreatePackage() {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [maleImage, setMaleImage] = useState([])
    const [femaleImage, setFemaleImage] = useState([])
    const [prices, setPrices] = useState([])
    const [form, setForm] = useState({
        arName: "",
        enName: "",
        mealsNumber: "",
        snacksNumber: "",
        arText: "",
        enText: "",
        offersDays: "",
        calories: "",
        fridays: false,
        fridayPrice: "",
        breakfast: false,
        lunch: false,
        dinner: false,
    });

    // HANDLERS
    function createPackage(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.arName || !form.enName || !form.mealsNumber || !form.snacksNumber || !form.arText || !form.enText) {
            return toast.error("Please fill all the fields.");
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE IMAGES
        formData.append("files", maleImage[0]);
        formData.append("files", femaleImage[0]);
        formData.append("bundleName", form.arName);
        formData.append("bundleNameEn", form.enName);
        formData.append("mealsNumber", form.mealsNumber);
        formData.append("snacksNumber", form.snacksNumber);
        formData.append("bundleSubtitleAR", form.arText);
        formData.append("bundleSubtitleEN", form.enText);
        formData.append("bundleOffer", form.offersDays || 0);
        // formData.append("calories", form.calories);
        formData.append("fridayOption", form.fridays);
        formData.append("breakfast", form.breakfast);
        formData.append("lunch", form.lunch);
        formData.append("dinner", form.dinner);
        formData.append("periodPrices", JSON.stringify(prices));
        formData.append("fridayPrice", form.fridayPrice || 0);

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/bundle`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Package created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the package.");
                setLoading(false);
            })
    }


    return (
        <form onSubmit={createPackage}>
            <div className={'card mb-2'}>
                <h1 className={"text-2xl font-bold mb-4 uppercase"}>Create Package</h1>
                <div className="grid formgrid p-fluid">
                    <div className="col-12 mb-2 lg:col-6 lg:mb-2">
                        <label className={"mb-2 block"} htmlFor="male-image">MALE IMAGE</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setMaleImage(files)
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...maleImage || []]
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index
                                })
                                setMaleImage(newItems)
                            }}
                        />
                    </div>
                    <div className="col-12 mb-2 lg:col-6 lg:mb-2">
                        <label className={"mb-2 block"} htmlFor="female-image">FEMALE IMAGE</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setFemaleImage(files)
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...femaleImage || []]
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index
                                })
                                setFemaleImage(newItems)
                            }}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="arName">Package Arabic Name</label>
                        <InputText
                            id="arName"
                            type="text"
                            placeholder={"Enter Package Arabic Name"}
                            value={form.arName}
                            onChange={(e) => setForm({...form, arName: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="enName">Package English Name</label>
                        <InputText
                            id="enName"
                            type="text"
                            placeholder={"Enter Package English Name"}
                            value={form.enName}
                            onChange={(e) => setForm({...form, enName: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealsNumber">Meals Number</label>
                        <InputNumber
                            id="mealsNumber"
                            placeholder={"Enter Meals Number"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.mealsNumber}
                            onChange={(e) => setForm({...form, mealsNumber: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="snacksNumber">Snacks Number</label>
                        <InputNumber
                            id="snacksNumber"
                            placeholder={"Enter Snacks Number"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.snacksNumber}
                            onChange={(e) => setForm({...form, snacksNumber: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="arText">Arabic Text on Card</label>
                        <InputText
                            id="arText"
                            type="text"
                            placeholder={"Enter Arabic Text on Card"}
                            value={form.arText}
                            onChange={(e) => setForm({...form, arText: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="enText">English Text on Card</label>
                        <InputText
                            id="enText"
                            type="text"
                            placeholder={"Enter English Text on Card"}
                            value={form.enText}
                            onChange={(e) => setForm({...form, enText: e.target.value})}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="offersDays">OFFERS DAYS (NUMBER)</label>
                        <InputNumber
                            id="offersDays"
                            placeholder={"Enter OFFERS DAYS (NUMBER)"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.offersDays}
                            onChange={(e) => setForm({...form, offersDays: e.value})}
                        />
                    </div>
                    {/*<div className="field col-12 md:col-6">*/}
                    {/*    <label htmlFor="calories">CALORIES (NUMBER)</label>*/}
                    {/*    <InputNumber*/}
                    {/*        id="calories"*/}
                    {/*        placeholder={"Enter CALORIES (NUMBER)"}*/}
                    {/*        min={0}*/}
                    {/*        value={form.calories}*/}
                    {/*        onChange={(e) => setForm({...form, calories: e.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="field col-12 md:col-6">
                        <div className="flex flex-wrap justify-content-start gap-3">
                            <div className="flex align-items-center">
                                <InputSwitch
                                    inputId="fridays"
                                    name="fridays"
                                    value="fridays"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, fridays: event.value
                                        })
                                    }}
                                    checked={form.fridays}
                                />
                                <label htmlFor="fridays" className="ml-2">Fridays</label>
                            </div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-6">
                        <div className="flex flex-wrap justify-content-between gap-3">
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="breakfast"
                                    name="breakfast"
                                    value="breakfast"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, breakfast: event.checked
                                        })
                                    }}
                                    checked={form.breakfast}
                                />
                                <label htmlFor="breakfast" className="ml-2">Breakfast</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="lunch"
                                    name="lunch"
                                    value="lunch"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, lunch: event.checked
                                        })
                                    }}
                                    checked={form.lunch}
                                />
                                <label htmlFor="lunch" className="ml-2">Lunch</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="dinner"
                                    name="dinner"
                                    value="dinner"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, dinner: event.checked
                                        })
                                    }}
                                    checked={form.dinner}
                                />
                                <label htmlFor="dinner" className="ml-2">Dinner</label>
                            </div>
                        </div>
                    </div>

                    {form?.fridays && (<div className="field col-12">
                        <label htmlFor="fridayPrice">Friday Price</label>
                        <InputNumber
                            id="fridayPrice"
                            placeholder={"Enter Friday Price"}
                            mode="currency"
                            currency="KWD"
                            locale="en-US"
                            currencyDisplay="symbol"
                            value={form.fridayPrice}
                            onChange={(e) => setForm({...form, fridayPrice: e.value})}
                        />
                    </div>)}
                </div>
            </div>
            <ChoosePrices getPrices={(pricesArray) => {
                setPrices(pricesArray)
            }}/>
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
                            style={{width: '2rem', height: '2rem'}}/> : `Create Package`}
                    disabled={loading}/>
            </div>
        </form>
    )
}