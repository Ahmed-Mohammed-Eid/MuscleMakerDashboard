"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../components/customFileUpload";
import ChooseExtra from "../../components/ChooseExtra";
import ChooseTypes from "../../components/ChooseTypes";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {InputSwitch} from 'primereact/inputswitch';
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";
import {MultiSelect} from "primereact/multiselect";
import {InputTextarea} from "primereact/inputtextarea";

export default function CreateMeal() {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [mealImage, setMealImage] = useState([])
    const [extra, setExtra] = useState()
    const [maximumExtraNumber, setMaximumExtraNumber] = useState(0)
    const [types, setTypes] = useState()
    const [form, setForm] = useState({
        mealTitle: "",
        mealTitleEn: "",
        mealPrice: "",
        mealCategory: "",
        mealType: "",
        carbohydrate: "",
        fat: "",
        calories: "",
        protein: "",
        sugar: "",
        mealFoodicsId: "",
        mealDescription: "",
        blockMeal: false,
    });

    // HANDLERS
    function createMeal(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.mealTitle || !form.mealTitleEn || !form.mealPrice || !form.mealCategory || !form.mealType || !form.carbohydrate || !form.fat || !form.calories || !form.protein || !form.sugar || !form.mealFoodicsId || !form.mealDescription || !mealImage ) {
            return toast.error("Please fill all the fields.");
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE IMAGES
        formData.append("mealTitle", form.mealTitle);
        formData.append("mealTitleEn", form.mealTitleEn);
        formData.append("mealTypes", JSON.stringify(form.mealType));
        formData.append("menuType", form.mealCategory);
        formData.append("protine", form.protein);
        formData.append("carbohydrates", form.carbohydrate);
        formData.append("fats", form.fat);
        formData.append("calories", form.calories);
        formData.append("sugar", form.sugar);
        formData.append("mealDescription", form.mealDescription);
        formData.append("mealBlocked", form.blockMeal);
        formData.append("mealPrice", form.mealPrice);
        formData.append("foodicsId", form.mealFoodicsId);
        formData.append("allowedExtras", maximumExtraNumber);
        formData.append("extras", JSON.stringify(extra));
        formData.append("options", JSON.stringify(types));

        // LOOP THROUGH THE FILES AND APPEND THEM TO THE FORM DATA
        for (let i = 0; i < mealImage.length; i++) {
            formData.append("files", mealImage[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/meal`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Meal created successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the meal.");
                setLoading(false);
            })
    }


    return (
        <form onSubmit={createMeal}>
            <div className={"card mb-2"}>
                <h1 className={"text-2xl font-bold mb-4 uppercase"}>Create Meal</h1>
                <div className="grid formgrid p-fluid " onSubmit={createMeal}>
                    <div className="col-12 mb-2 lg:mb-2">
                        <label className={"mb-2 block"} htmlFor="female-image">MEAL IMAGE</label>
                        <CustomFileUpload
                            multiple={true}
                            setFiles={(files) => {
                                setMealImage(files)
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...mealImage || []]
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index
                                })
                                setMealImage(newItems)
                            }}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealTitle">Meal Arabic Name</label>
                        <InputText
                            id="mealTitle"
                            type="text"
                            placeholder={"Enter Meal Arabic Name"}
                            value={form.mealTitle}
                            onChange={(e) => setForm({...form, mealTitle: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealTitleEn">Meal English Name</label>
                        <InputText
                            id="mealTitleEn"
                            type="text"
                            placeholder={"Enter Meal English Name"}
                            value={form.mealTitleEn}
                            onChange={(e) => setForm({...form, mealTitleEn: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealCategory">Meal Category</label>
                        <Dropdown
                            id="mealCategory"
                            placeholder={"Select Meal Category"}
                            options={[
                                {label: "Orders", value: "orders"},
                                {label: "Subscriptions", value: "subscriptions"},
                            ]}
                            value={form.mealCategory}
                            onChange={(e) => setForm({...form, mealCategory: e.target.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealType">Meal Type</label>
                        <MultiSelect
                            id={"mealType"}
                            multiple={true}
                            value={form.mealType}
                            onChange={(e) => setForm({...form, mealType: e.value})}
                            options={[
                                {value: 'افطار', label: 'فطور'},
                                {value: 'غداء', label: 'غداء'},
                                {value: 'عشاء', label: 'عشاء'},
                                {value: 'سناك', label: 'وجبات خفيفة'},
                                {value: 'مقبلات', label: 'مقبلات'},
                                {value: 'سلطة', label: 'سلطة'},
                                {value: 'قليل الكربوهيدرات', label: 'قليل الكربوهيدرات'},
                                {value: 'الأطباق', label: 'الأطباق'},
                                {value: 'البرجر الصحي', label: 'البرجر الصحي'},
                                {value: 'التورتيلا الصحي', label: 'التورتيلا الصحي'},
                                {value: 'البيتزا الصحية', label: 'البيتزا الصحية'},
                                {value: 'طلبات الطاقة الجانبية', label: 'طلبات الطاقة الجانبية'},
                                {value: 'طلبات البروتين الجانبية', label: 'طلبات البروتين الجانبية'},
                                {value: 'معكرونة', label: 'معكرونة'},
                                {value: 'سمــوثــي & بروتين شيك', label: 'سمــوثــي & بروتين شيك'},
                                {value: 'حلويات', label: 'حلويات'},
                            ]}
                            optionLabel="label"
                            display="chip"
                            filter={true}
                            placeholder="Select Type"
                            maxSelectedLabels={3}
                            className="w-full"/>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealPrice">Meal Price</label>
                        <InputNumber
                            id="mealPrice"
                            placeholder={"Enter Meal Price"}
                            mode="currency"
                            currency="KWD"
                            locale="en-US"
                            currencyDisplay="symbol"
                            value={form.mealPrice}
                            onChange={(e) => setForm({...form, mealPrice: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="carbohydrate">Carbohydrate</label>
                        <InputNumber
                            id="carbohydrate"
                            placeholder={"Enter Carbohydrate"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            value={form.carbohydrate}
                            onChange={(e) => setForm({...form, carbohydrate: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="fat">Fat</label>
                        <InputNumber
                            id="fat"
                            placeholder={"Enter Fat"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            value={form.fat}
                            onChange={(e) => setForm({...form, fat: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="protein">Protein</label>
                        <InputNumber
                            id="protein"
                            placeholder={"Enter Protein"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            value={form.protein}
                            onChange={(e) => setForm({...form, protein: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="sugar">Sugar</label>
                        <InputNumber
                            id="sugar"
                            placeholder={"Enter Sugar"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            value={form.sugar}
                            onChange={(e) => setForm({...form, sugar: e.value})}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="calories">Calories</label>
                        <InputNumber
                            id="calories"
                            placeholder={"Enter Calories"}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            value={form.calories}
                            onChange={(e) => setForm({...form, calories: e.value})}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="mealFoodicsId">Meal Foodics Id</label>
                        <InputText
                            id="mealFoodicsId"
                            type="text"
                            placeholder={"Enter Meal Foodics Id"}
                            value={form.mealFoodicsId}
                            onChange={(e) => setForm({...form, mealFoodicsId: e.target.value})}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="mealDescription">Meal Description</label>
                        <InputTextarea
                            id="mealDescription"
                            value={form.mealDescription}
                            onChange={(e) => setForm({...form, mealDescription: e.target.value})}
                            rows={5}
                            cols={30}
                            autoResize={true}
                            placeholder={"Enter Meal Description"}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <div className="flex flex-wrap justify-content-start gap-3">
                            <div className="flex align-items-center">
                                <InputSwitch
                                    inputId="blockMeal"
                                    name="blockMeal"
                                    value="blockMeal"
                                    onChange={(event) => {
                                        setForm({
                                            ...form, blockMeal: event.value
                                        })
                                    }}
                                    checked={form.blockMeal}
                                />
                                <label htmlFor="blockMeal" className="ml-2">Block Meal</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChooseExtra getExtra={(extra, maximumNumber) => {
                setExtra(extra);
                setMaximumExtraNumber(maximumNumber)
            }}/>

            <ChooseTypes getType={(types) => {
                setTypes(types)
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
                            style={{width: '2rem', height: '2rem'}}/> : `Create Meal`}
                    disabled={loading}/>
            </div>
        </form>
    )
}