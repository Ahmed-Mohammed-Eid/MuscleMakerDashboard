"use client";
import React, {useState, useEffect} from 'react';
import CustomFileUpload from "../../components/customFileUpload";
import {InputText} from "primereact/inputtext";
import {InputMask} from "primereact/inputmask";
import {Dropdown} from "primereact/dropdown";
import {Password} from 'primereact/password';
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";
import {InputNumber} from "primereact/inputnumber";

export default function EditEmployeeContent({employee, id}) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [employeeImage, setEmployeeImage] = useState([])
    const [form, setForm] = useState({
        employeeName: "",
        employeeRole: "",
        employeeAddress: "",
        employeeMobile: "",
        employeeUsername: "",
        employeePassword: ""
    });

    // EFFECT TO SET THE FORM DATA FROM THE EMPLOYEE DATA
    useEffect(() => {
        setForm({
            employeeName: employee?.fullName || "",
            employeeRole: employee?.role || "",
            employeeAddress: employee?.address || "",
            employeeMobile: employee?.phoneNumber || "",
            employeeUsername: employee?.username || "",
            employeePassword: ""
        })
    }, []);

    // HANDLERS
    function editEmployee(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.employeeName || !form.employeeRole || !form.employeeAddress || !form.employeeMobile || !form.employeeUsername) {
            toast.error("Please fill all the fields.");
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE IMAGES
        formData.append("files", employeeImage[0]);
        formData.append("fullName", form.employeeName);
        formData.append("username", form.employeeUsername);
        formData.append("role", form.employeeRole);
        formData.append("password", form.employeePassword);
        formData.append("address", form.employeeAddress);
        formData.append("phoneNumber", form.employeeMobile);
        formData.append("userId", id);

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/user`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "Employee editd successfully.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while creating the employee.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Edit Employee</h1>
            <form className="grid formgrid p-fluid" onSubmit={editEmployee}>
                <div className="col-12 mb-2 lg:mb-2">
                    <label className={"mb-2 block"} htmlFor="male-image">EMPLOYEE IMAGE</label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setEmployeeImage(files)
                        }}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...employeeImage || []]
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index
                            })
                            setEmployeeImage(newItems)
                        }}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="employeeName">Employee Name</label>
                    <InputText
                        id="employeeName"
                        type="text"
                        placeholder={"Enter Employee Name"}
                        value={form.employeeName}
                        onChange={(e) => setForm({...form, employeeName: e.target.value})}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="employeeRole">Employee Role</label>
                    <Dropdown
                        id="employeeRole"
                        placeholder={"Select Employee Role"}
                        options={[
                            {label: "Admin", value: "admin"},
                            {label: "Employee", value: "employee"},
                            {label: 'Manager', value: 'manager'}
                        ]}
                        value={form.employeeRole}
                        onChange={(e) => setForm({...form, employeeRole: e.target.value})}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="addess">Address</label>
                    <InputText
                        id="addess"
                        type="text"
                        placeholder={"Enter Address"}
                        value={form.employeeAddress}
                        onChange={(e) => setForm({...form, employeeAddress: e.target.value})}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="mobile">Mobile</label>
                    <InputText
                        id="mobile"
                        type="text"
                        placeholder={"Enter Mobile"}
                        value={form.employeeMobile}
                        onChange={(e) => setForm({...form, employeeMobile: e.target.value})}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="username">Username</label>
                    <InputText
                        id="username"
                        type="text"
                        placeholder={"Enter Username"}
                        value={form.employeeUsername}
                        onChange={(e) => setForm({...form, employeeUsername: e.target.value})}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="password">Password</label>
                    <Password
                        id="password"
                        placeholder={"Enter Password"}
                        value={form.employeePassword}
                        onChange={(e) => setForm({...form, employeePassword: e.target.value})}
                        feedback={false}
                    />
                </div>
                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={"submit"}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{width: '2rem', height: '2rem'}}/> : `Edit Employee`}
                        disabled={loading}/>
                </div>
            </form>
        </div>
    )
}