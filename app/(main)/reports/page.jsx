"use client";

import React from "react";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
// AXIOS
import axios from "axios";

export default function Reports() {

    //STATES
    const [loading, setLoading] = React.useState(false);
    const [reportType, setReportType] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    function handleSubmit(e) {
        e.preventDefault();
        //GET THE TOKEN FROM LOCAL STORAGE

        // SET THE LOADING STATE TO TRUE
        setLoading(true);
        // MAKE THE API CALL
        axios.get(`${process.env.API_URL}/report`, {
            params: {
                reportName: reportType,
                dateFrom: startDate,
                dateTo: endDate,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then((res) => {
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
                // OPEN THE URL IN A NEW TAB
                const timer = setTimeout(() => {
                    window.open(res.data.url, "_blank");
                    clearTimeout(timer);
                }, 1000);
            })
            .catch((err) => {
                console.log(err);
                // SET THE LOADING STATE TO FALSE
                setLoading(false);
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={"col-12 card"}>
                <h1 className="text-2xl mb-5 uppercase">GET Report</h1>

                <div className="p-fluid formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="reportType">Report Type</label>
                        <Dropdown
                            id="reportType"
                            value={reportType}
                            onChange={(e) => {
                                setReportType(e.target.value);
                            }}
                            placeholder="Report Type"
                            options={[
                                {label: "Kitchen Meals", value: "kitchenMeals"},
                            ]}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="startDate">Start Date</label>
                        <Calendar
                            id="startDate"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                            placeholder="Start Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="endDate">End Date</label>
                        <Calendar
                            id="endDate"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                            placeholder="End Date"
                            dateFormat="dd/mm/yy"
                            showIcon={true}
                        />
                    </div>

                    <div className="field col-6 ml-auto mt-4">
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
                </div>
            </form>
        </>
    );
}