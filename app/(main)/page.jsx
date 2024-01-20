"use client";
// IMPORTS
import ClientsChart from "./components/clientsChart";
import CategoriesNumber from "./components/categoriesNumber";
import BestSelling from "./components/bestSelling";
import axios from "axios";
import {useEffect, useState} from "react";


const Dashboard = () => {

    //STATES
    const [categoriesNumber, setCategoriesNumber] = useState([]);
    const [topSelling, setTopSelling] = useState([]);
    const [clients, setClients] = useState({
        all: 0, active: 0, inActive: 0,
    });

    function getState() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/get/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                setCategoriesNumber([{
                    name: "Packages", number: res.data.data.bundlesNumber,
                }, {
                    name: "Meals", number: res.data.data.mealsNumber,
                },
                //     {
                //     name: "Doctors", number: res.data.data.specialistsNumber,
                // }
                ])
                setTopSelling(res.data.data.bestSeller);
                setClients({
                    all: res.data.data.clientsStats.all,
                    active: res.data.data.clientsStats.active,
                    inActive: res.data.data.clientsStats.inactive,
                });
            })
            .then((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getState();
    }, []);

    return (<div className="grid gap-1">
            <div className="card mt-2 col-12 md:col-6 lg:col-6 mb-0">
                <div className="card-header">
                    <h3 className="card-title text-center uppercase">Clients Chart</h3>
                </div>
                <div className="card-body flex justify-content-center">
                    <ClientsChart clients={clients}/>
                </div>
            </div>
            <div className="card mt-2 col mb-0">
                <div className="card-header">
                    <h3 className="card-title text-center uppercase">Categories Number</h3>
                </div>
                <div className="card-body">
                    <CategoriesNumber categories={categoriesNumber}/>
                </div>
            </div>
            <div className="card mt-2 col-12">
                <div className="card-header">
                    <h3 className="card-title text-center uppercase">Best Selling Packages</h3>
                </div>
                <div className="card-body">
                    <BestSelling packages={topSelling}/>
                </div>
            </div>
        </div>);
};

export default Dashboard;
