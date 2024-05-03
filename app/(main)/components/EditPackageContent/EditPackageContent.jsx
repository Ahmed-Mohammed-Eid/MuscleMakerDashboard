"use client";
import React, {useState, useEffect, useMemo} from 'react';
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
import ChoosePrices from "../ChoosePrices";


export default function EditPackage({bundle, id}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [categories, setCategories] = useState([]);
    const [maleImage, setMaleImage] = useState([])
    const [femaleImage, setFemaleImage] = useState([])
    const [prices, setPrices] = useState([])
    const [form, setForm] = useState({
        categoryId: "",
        bundleId: "",
        arName: "",
        enName: "",
        packagePrice: "",
        mealsNumber: "",
        snacksNumber: "",
        arText: "",
        enText: "",
        offersDays: "",
        // calories: "",
        fridays: false,
        fridayPrice: "",
        breakfast: false,
        lunch: false,
        dinner: false,
        // DEACTIVATED
        deActivate: ""
    });

    // EFFECT TO SET THE FORM
    const memoizedBundle = useMemo(() => bundle, [bundle]);

    useEffect(() => {
        if (memoizedBundle) {
            setForm({
                categoryId: memoizedBundle.categoryId,
                bundleId: id,
                arName: memoizedBundle.bundleName,
                enName: memoizedBundle.bundleNameEn,
                mealsNumber: memoizedBundle.mealsNumber,
                snacksNumber: memoizedBundle.snacksNumber,
                arText: memoizedBundle.bundleSubtitleAR,
                enText: memoizedBundle.bundleSubtitleEN,
                offersDays: memoizedBundle.bundleOffer,
                fridays: memoizedBundle.fridayOption,
                breakfast: memoizedBundle.mealsType.includes('افطار'),
                lunch: memoizedBundle.mealsType.includes('غداء'),
                dinner: memoizedBundle.mealsType.includes('عشاء'),
                fridayPrice: memoizedBundle.fridayPrice || 0,
                deActivate: memoizedBundle.deActivate
            })

            // SET THE PRICES
            setPrices(memoizedBundle.periodPrices)
        }
    }, [memoizedBundle]);


    // HANDLERS
    function editPackage(event) {
        // PREVENT DEFAULT
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
        formData.append("categoryId", form.categoryId);
        formData.append("bundleId", form.bundleId);
        formData.append("files", maleImage[0]);
        formData.append("files", femaleImage[0]);
        formData.append("bundleName", form.arName);
        formData.append("bundleNameEn", form.enName);
        formData.append("mealsNumber", form.mealsNumber);
        formData.append("snacksNumber", form.snacksNumber);
        formData.append("bundleSubtitleAR", form.arText);
        formData.append("bundleSubtitleEN", form.enText);
        formData.append("bundleOffer", form.offersDays);
        // formData.append("calories", form.calories);
        formData.append("fridayOption", form.fridays);
        formData.append("breakfast", form.breakfast);
        formData.append("lunch", form.lunch);
        formData.append("dinner", form.dinner);
        formData.append("periodPrices", JSON.stringify(prices));
        formData.append("fridayPrice", form.fridayPrice || 0);
        formData.append("deActivate", form.deActivate);

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/bundle`, formData, {
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

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // GET CATEGORIES LIST
        getCategoriesList();
    }, []);

    // GET CATEGORIES LIST HANDLER
    const getCategoriesList = () => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /categories
        axios
            .get(`${process.env.API_URL}/category/list`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setCategories(res.data?.categories || []);
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to fetch categories');
            });
    };



    return (
        <form onSubmit={editPackage}>
            <div className="card mb-2">
                <h1 className={"text-2xl font-bold mb-4 uppercase"}>Edit Package</h1>
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

                    {/* CATEGORIES LIST */}
                    <div className="field col-12">
                        <label htmlFor="category">Category</label>
                        <Dropdown
                            id="category"
                            optionLabel="name"
                            optionValue="id"
                            value={form.categoryId}
                            options={
                                categories.map((category) => {
                                    return {
                                        id: category._id,
                                        name: `${category.categoryNameAR} - ${category.categoryNameEN}`
                                    }
                                })
                            }
                            onChange={(e) => setForm({...form, categoryId: e.value})}
                            placeholder={"Select a Category"}

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
                        <Dropdown
                            id="arText"
                            optionLabel="name"
                            optionValue="value"
                            value={form.arText}
                            options={[
                                // 80 - 100 - 120 - 150 - 180 - 200
                                {name: '٨٠ بروتين ٨٠ كارب', value: '٨٠ بروتين ٨٠ كارب'},
                                {name: '١٠٠ بروتين ١٠٠ كارب', value: '١٠٠ بروتين ١٠٠ كارب'},
                                {name: '١٢٠ بروتين ١٢٠ كارب', value: '١٢٠ بروتين ١٢٠ كارب'},
                                {name: '١٥٠ بروتين ١٥٠ كارب', value: '١٥٠ بروتين ١٥٠ كارب'},
                                {name: '١٨٠ بروتين ١٨٠ كارب', value: '١٨٠ بروتين ١٨٠ كارب'},
                                {name: '٢٠٠ بروتين ٢٠٠ كارب', value: '٢٠٠ بروتين ٢٠٠ كارب'},
                            ]}
                            onChange={(e) => setForm({...form, arText: e.value})}
                            placeholder={"Select Arabic Text on Card"}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="enText">English Text on Card</label>
                        <Dropdown
                            id="enText"
                            optionLabel="name"
                            optionValue="value"
                            value={form.enText}
                            options={[
                                // 80 - 100 - 120 - 150 - 180 - 200
                                {name: '80 Protein 80 Carb', value: '80 Protein 80 Carb'},
                                {name: '100 Protein 100 Carb', value: '100 Protein 100 Carb'},
                                {name: '120 Protein 120 Carb', value: '120 Protein 120 Carb'},
                                {name: '150 Protein 150 Carb', value: '150 Protein 150 Carb'},
                                {name: '180 Protein 180 Carb', value: '180 Protein 180 Carb'},
                                {name: '200 Protein 200 Carb', value: '200 Protein 200 Carb'},
                            ]}
                            onChange={(e) => setForm({...form, enText: e.value})}
                            placeholder={"Select English Text on Card"}
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
                    {/*        mode="decimal"*/}
                    {/*        minFractionDigits={0}*/}
                    {/*        maxFractionDigits={0}*/}
                    {/*        min={0}*/}
                    {/*        max={100}*/}
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

                    {/*  DEACTIVATE  */}
                    <div className="field col-12">
                        <div className="flex flex-wrap justify-content-start gap-3">
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="deActivate"
                                    name="deActivate"
                                    value="deActivate"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, deActivate: event.checked
                                        })
                                    }}
                                    checked={form.deActivate}
                                />
                                <label htmlFor="deActivate" className="ml-2">Deactivate</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChoosePrices
                selectedPrices={bundle.periodPrices || []}
                getPrices={(pricesArray) => {
                    setPrices(pricesArray)
                }}
            />
            <div
                className="mt-4"
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Button
                    style={{width: '100%', textTransform: 'uppercase'}}
                    type={"submit"}
                    label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'} style={{
                        width: '2rem',
                        height: '2rem'
                    }}/> : `Edit Package`}
                    disabled={loading}/>
            </div>
        </form>
    )
}