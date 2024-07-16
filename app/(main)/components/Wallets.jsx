"use client";
import {Calendar} from "primereact/calendar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from 'primereact/button';
import {useEffect, useState} from "react";
import axios from "axios";
import {Dialog} from "primereact/dialog";
import {InputNumber} from "primereact/inputnumber";
import {toast} from "react-hot-toast";
import {Tag} from 'primereact/tag';


export default function Wallets({wallet: serverWallet, id}) {

    // STATES
    const [wallet, setWallet] = useState(serverWallet || {});
    const [addBonusAmount, setAddBonusAmount] = useState(0);
    const [deductBalanceAmount, setDeductBalanceAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dialogsState, setDialogsState] = useState({
        addBonus: false,
        deductBalance: false,
        blockWallet: false
    });

    // GET TRANSACTIONS FUNCTION
    const getTransactions = async () => {
        // GET THE TRANSACTIONS
        const token = localStorage.getItem("token");

        return await axios.get(`${process.env.API_URL}/wallet/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                walletId: wallet?._id,
                // || DATE BEFORE 30 DAYS
                dateFrom: startDate || new Date(new Date().setDate(new Date().getDate() - 30)),
                // || CURRENT DATE + 1 DAY
                dateTo: endDate || new Date(new Date().setDate(new Date().getDate() + 1))
            }
        })
            .then(response => {
                setTransactions(response.data?.walletMovements?.movements || []);
            })
            .catch(error => {
                console.log(error?.response?.data?.message);
            })
    }

    // ADD BONUS FUNCTION
    const addBonus = async () => {

        // VALIDATE THE AMOUNT
        if (isNaN(+addBonusAmount)) {
            toast.error("Amount should be a number");
            return;
        }

        if (Number(addBonusAmount) <= 0) {
            toast.error("Amount should be greater than 0");
            return;
        }

        // ADD BONUS
        const token = localStorage.getItem("token");

        return await axios.post(`${process.env.API_URL}/add/wallet/bonus`, {
            walletId: wallet?._id,
            amount: addBonusAmount
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(_ => {
                // CLOSE THE DIALOG
                setDialogsState({...dialogsState, addBonus: false});

                // SHOW SUCCESS MESSAGE
                toast.success("Bonus Added");
                // GET THE WALLET INFO
                getUserWallet(id);
                // GET THE TRANSACTIONS
                getTransactions();
            })
            .catch(error => {
                console.log(error?.response?.data?.message);
                toast(error?.response?.data?.message);
            })
    }

    // DEDUCT BALANCE FUNCTION
    const deductBalance = async () => {
        // DEDUCT BALANCE
        const token = localStorage.getItem("token");

        // VALIDATE THE AMOUNT
        if (isNaN(+deductBalanceAmount)) {
            toast.error("Amount should be a number");
            return;
        }

        if (Number(deductBalanceAmount) <= 0) {
            toast.error("Amount should be greater than 0");
            return;
        }

        if (Number(deductBalanceAmount) > wallet?.balance) {
            toast.error("Amount should be less than the balance");
            return
        }

        return await axios.post(`${process.env.API_URL}/deduct/wallet/balance`, {
            walletId: wallet?._id,
            amount: deductBalanceAmount
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data);
                // CLOSE THE DIALOG
                setDialogsState({...dialogsState, deductBalance: false});
                // SHOW SUCCESS MESSAGE
                toast.success("Balance Deducted");
                // GET THE WALLET INFO
                getUserWallet(id);
                // GET THE TRANSACTIONS
                getTransactions();
            })
            .catch(error => {
                console.log(error?.response?.data?.message);
                toast.error(error?.response?.data?.message);
            })
    }

    // BLOCK AND UNBLOCK WALLET FUNCTION
    const blockAndUnblockWallet = async (status) => {
        // BLOCK AND UNBLOCK WALLET
        const token = localStorage.getItem("token");

        return await axios.post(`${process.env.API_URL}/block/wallet`, {
            walletId: wallet?._id,
            status
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(_ => {
                // SHOW SUCCESS MESSAGE
                toast.success("Wallet Status Changed");
                // GET THE WALLET INFO
                getUserWallet(id);
                // CLOSE THE DIALOG
                setDialogsState({...dialogsState, blockWallet: false});
            })
            .catch(error => {
                console.log(error?.response?.data?.message);
                toast.error(error?.response?.data?.message);
            })
    }

    // GET USER WALLET FUNCTION
    const getUserWallet = async (id) => {
        // GET THE TOKEN FROM THE COOKIE
        const token = localStorage.getItem("token");
        axios.get(`${process.env.API_URL}/show/client/wallet?clientId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setWallet(response.data?.wallet || {});
            })
            .catch(error => {
                console.log(error?.response?.data?.message);
            })
    }

    // EFFECT TO GET THE TRANSACTIONS
    useEffect(() => {
        // GET THE TRANSACTIONS
        getTransactions();
    }, []);


    return (
        <>
            <div>
                {/*  ACTIONS PART  */}
                <div className={"card"}>
                    <h3 className={"uppercase"}>
                        Wallet Actions
                    </h3>
                    <hr/>
                    <div className={"grid formgrid"}>
                        <div className={"col-12 md:col-4"}>
                            <Button
                                label={"Add Bonus"}
                                icon={"pi pi-plus"}
                                className={"btn btn-primary mb-2"}
                                style={{width: "100%"}}
                                onClick={() => {
                                    setDialogsState({...dialogsState, addBonus: true})
                                }}
                            />
                        </div>
                        <div className={"col-12 md:col-4"}>
                            <Button
                                label={"Deduct Balance"}
                                icon={"pi pi-minus"}
                                className={"btn btn-danger mb-2"}
                                severity={"danger"}
                                style={{width: "100%"}}
                                onClick={() => setDialogsState({...dialogsState, deductBalance: true})}
                            />
                        </div>
                        <div className={"col-12 md:col-4"}>
                            <Button
                                label={"Change Status"}
                                icon={"pi pi-ban"}
                                className={"btn btn-warning mb-2"}
                                severity={"warning"}
                                style={{width: "100%"}}
                                onClick={() => setDialogsState({...dialogsState, blockWallet: true})}
                            />
                        </div>
                    </div>
                </div>

                {/*  USER INFO  */}
                <div className={"card"}>
                    <h3 className={"uppercase"}>
                        User Info
                    </h3>
                    <hr/>
                    <div className={"grid"}>
                        {/*BALANCE*/}
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Balance
                            </h5>
                            <p className={"text-green-500 font-bold text-4xl uppercase"}>
                                {wallet?.balance}
                            </p>
                        </div>

                        {/*IS BLOCKED*/}
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Status
                            </h5>
                            <p className={wallet?.isBlocked ? "text-red-500 font-bold uppercase text-2xl" : "text-green-500 font-bold uppercase text-2xl"}>
                                {wallet?.isBlocked ? "Blocked" : "Active"}
                            </p>
                        </div>

                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Name
                            </h5>
                            <p>
                                {wallet?.clientId?.clientName}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Phone Number
                            </h5>
                            <p>
                                {wallet?.clientId?.phoneNumber}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Email
                            </h5>
                            <p>
                                {wallet?.clientId?.email}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Governorate
                            </h5>
                            <p>
                                {wallet?.clientId?.governorate}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Region
                            </h5>
                            <p>
                                {wallet?.clientId?.region}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Block
                            </h5>
                            <p>
                                {wallet?.clientId?.block}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Street
                            </h5>
                            <p>
                                {wallet?.clientId?.street}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Alley
                            </h5>
                            <p>
                                {wallet?.clientId?.alley}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Building
                            </h5>
                            <p>
                                {wallet?.clientId?.building}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Floor
                            </h5>
                            <p>
                                {wallet?.clientId?.floor}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Appartment
                            </h5>
                            <p>
                                {wallet?.clientId?.appartment}
                            </p>
                        </div>
                        <div className={"col-12 md:col-6"}>
                            <h5 className={"text-gray-700 uppercase text-md"}>
                                Gender
                            </h5>
                            <p>
                                {wallet?.clientId?.gender}
                            </p>
                        </div>
                    </div>
                </div>

                {/*  TRANSACTION HISTORY  */}
                <div className={"card"}>
                    <h3 className={"uppercase"}>
                        Transaction History
                    </h3>
                    <hr/>
                    <div className={"grid"}>
                        <div className={"col-12 grid"}>
                            <div className={"col-12 md:col-5"}>
                                <Calendar
                                    value={startDate || null}
                                    onChange={(e) => setStartDate(e.value)}
                                    readOnly
                                    showIcon
                                    showButtonBar
                                    dateFormat={"dd/mm/yy"}
                                    placeholder={"Start Date"}
                                    style={{width: "100%"}}
                                />
                            </div>
                            <div className={"col-12 md:col-5"}>
                                <Calendar
                                    value={endDate || null}
                                    onChange={(e) => setEndDate(e.value)}
                                    readOnly
                                    showIcon
                                    showButtonBar
                                    dateFormat={"dd/mm/yy"}
                                    placeholder={"End Date"}
                                    style={{width: "100%"}}
                                />
                            </div>
                            <div className={"col-12 md:col-2"}>
                                <Button
                                    label={"Filter"}
                                    icon={"pi pi-filter"}
                                    className={"btn btn-primary"}
                                    style={{width: "100%", height: "100%"}}
                                    onClick={() => getTransactions()}
                                />
                            </div>
                        </div>
                        <div className={"col-12"}>
                            <DataTable
                                value={transactions || []}
                                paginator
                                rows={25}
                                rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                                emptyMessage={"No Transactions Found"}
                            >
                                <Column
                                    field={"_id"}
                                    header={"Transaction ID"}
                                    sortable
                                    filter={true}
                                    body={(rowData) => {
                                        // ADD COPY TO CLIPBOARD FUNCTION
                                        return <span
                                            className={"text-blue-500 cursor-pointer"}
                                            onClick={() => {
                                                navigator.clipboard.writeText(rowData._id);
                                                toast.success("Transaction ID Copied");
                                            }}
                                        >{rowData._id}</span>;
                                    }}
                                />
                                <Column
                                    field={"reason"}
                                    header={"Reason"}
                                    sortable
                                    filter={true}
                                />
                                <Column
                                    field={"amount"}
                                    header={"Amount"}
                                    sortable
                                    filter={true}
                                    body={(rowData) => {
                                        const types = ["deposit", "withdraw", "bonus", "balance deduction"];
                                        // TAGE WITH CUSTOM COLOR FOR EACH TYPE
                                        return <span
                                            className={types.indexOf(rowData.movementType) === 0 ? "text-green-500 font-bold" : types.indexOf(rowData.movementType) === 1 ? "text-red-500 font-bold" : types.indexOf(rowData.movementType) === 2 ? "text-blue-500 font-bold" : "text-yellow-500 font-bold"}>{rowData.amount}</span>;
                                    }}
                                />
                                <Column
                                    field={"movementType"}
                                    header={"Type"}
                                    sortable
                                    filter={true}
                                    body={(rowData) => {
                                        const types = ["deposit", "withdraw", "bonus", "balance deduction"];
                                        // TAGE WITH CUSTOM COLOR FOR EACH TYPE
                                        return <Tag value={rowData.movementType}
                                                    severity={types.indexOf(rowData.movementType) === 0 ? "success" : types.indexOf(rowData.movementType) === 1 ? "danger" : types.indexOf(rowData.movementType) === 2 ? "info" : "warning"}/>;
                                    }}
                                />
                                <Column
                                    field={"date"}
                                    header={"Date"}
                                    sortable
                                    body={(rowData) => {
                                        return new Date(rowData.date).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        });
                                    }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                onHide={() => setDialogsState({...dialogsState, addBonus: false})}
                visible={dialogsState.addBonus}
                header={"Add Bonus"}
                className={"dialogSize"}
            >
                <div className={"grid formgrid gap-4 w-full"}>
                    <div className={"col-12"}>
                        <h5 className={"text-gray-700 uppercase text-md"}>
                            Amount
                        </h5>
                        <InputNumber
                            value={addBonusAmount}
                            onValueChange={(e) => setAddBonusAmount(e.value)}
                            placeholder={"Amount"}
                            className={"w-full mb-2"}
                        />
                        <Button
                            label={"Add Bonus"}
                            className={"btn btn-primary"}
                            style={{width: "100%"}}
                            onClick={() => addBonus()}
                        />
                    </div>
                </div>
            </Dialog>
            <Dialog onHide={() => setDialogsState({...dialogsState, deductBalance: false})}
                    visible={dialogsState.deductBalance} header={"Deduct Balance"} className={"dialogSize"}>
                <div className={"grid formgrid gap-4 w-full"}>
                    <div className={"col-12"}>
                        <h5 className={"text-gray-700 uppercase text-md"}>
                            Amount
                        </h5>
                        <InputNumber
                            value={deductBalanceAmount}
                            onValueChange={(e) => setDeductBalanceAmount(e.value)}
                            placeholder={"Amount"}
                            className={"w-full mb-2"}
                        />
                        <Button
                            label={"Deduct Balance"}
                            className={"btn btn-danger"}
                            severity={"danger"}
                            style={{width: "100%"}}
                            onClick={() => deductBalance()}
                        />
                    </div>
                </div>
            </Dialog>
            <Dialog
                onHide={() => setDialogsState({...dialogsState, blockWallet: false})}
                visible={dialogsState.blockWallet}
                header={"Block And Unblock Wallet"}
                className={"dialogSize"}
            >
                <div className={"grid formgrid gap-4 w-full"}>
                    <div className={"col-12"}>
                        <h5 className={"text-gray-700 uppercase text-md mb-4"}>
                            Choose Action
                        </h5>
                        <div className={"grid"}>
                            <div className={"col-12 md:col-6 mb-2"}>
                                <Button label={"Block"} className={"btn btn-danger"} severity={"danger"}
                                        style={{width: "100%"}} onClick={() => blockAndUnblockWallet(true)}/>
                            </div>
                            <div className={"col-12 md:col-6"}>
                                <Button label={"Unblock"} className={"btn btn-success"} severity={"success"}
                                        style={{width: "100%"}} onClick={() => blockAndUnblockWallet(false)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}