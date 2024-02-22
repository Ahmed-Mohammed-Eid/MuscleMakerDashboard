import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import React, {useState} from "react";
import {Dropdown} from "primereact/dropdown";

export default function ChoosePrices({getPrices, selectedPrices}) {

    const [prices, setPrices] = useState({
        number: 0,
        pricesArray: []
    })

    // GET THE PRICE
    getPrices(prices.pricesArray)

    React.useEffect(() => {
        if (selectedPrices) {
            setPrices({
                number: selectedPrices.length,
                pricesArray: selectedPrices
            })
        }
    }, [selectedPrices])

    return (
        <div className={"card mb-2"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Package Prices</h1>
            <div className="grid formgrid p-fluid flex align-items-center">
                {new Array(prices.number).fill(0).map((_, index) => {
                    return (
                        <>
                            <div className="field col-12 md:col-5 " key={'price' + index}>
                                <label htmlFor={`packageTime${index}`}>Package Time</label>
                                <Dropdown
                                    id={`packageTime${index}`}
                                    value={prices.pricesArray[index]?.period}
                                    options={[
                                        {label: '1 week', value: '1 week'},
                                        {label: '2 weeks', value: '2 weeks'},
                                        {label: '3 weeks', value: '3 weeks'},
                                        {label: '1 month', value: '1 month'},
                                    ]}
                                    onChange={(e) => {
                                        const ArrayOfPrices = [...prices.pricesArray]
                                        ArrayOfPrices[index] = {
                                            ...ArrayOfPrices[index],
                                            period: e.value
                                        }
                                        setPrices({
                                            ...prices,
                                            pricesArray: ArrayOfPrices
                                        })
                                    }}
                                    placeholder="Select Package Time"
                                />
                            </div>
                            <div className="field col-12 md:col-5">
                                <label htmlFor={`pricesPrice${index}`}>Package Price</label>
                                <InputNumber
                                    mode={"currency"}
                                    currency={"KWD"}
                                    locale={"en-US"}
                                    currencyDisplay={"symbol"}
                                    id={`pricesPrice${index}`}
                                    placeholder={"Enter Option Price"}
                                    value={prices.pricesArray[index]?.price}
                                    onChange={(e) => {
                                        const ArrayOfPrices = [...prices.pricesArray]
                                        ArrayOfPrices[index] = {
                                            ...ArrayOfPrices[index],
                                            price: e.value
                                        }
                                        setPrices({
                                            ...prices,
                                            pricesArray: ArrayOfPrices
                                        })
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-2 flex justify-content-end align-items-end mb-8 mt-4 md:mt-0 md:mb-0">
                                <Button
                                    icon="pi pi-times"
                                    price={'button'}
                                    rounded
                                    text
                                    raised
                                    severity="danger"
                                    aria-label="Cancel"
                                    type={"button"}
                                    onClick={() => {
                                        const ArrayOfPrices = [...prices.pricesArray]
                                        ArrayOfPrices.splice(index, 1)
                                        setPrices({
                                            ...prices,
                                            number: prices.number - 1,
                                            pricesArray: ArrayOfPrices
                                        })
                                    }}
                                />
                            </div>
                        </>)
                })}
            </div>
            <div style={{
                width: `100%`,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: "center",
                marginTop: '20px'
            }}>
                <Button
                    icon="pi pi-plus"
                    price={'button'}
                    rounded
                    text
                    raised
                    severity="help"
                    aria-label="add"
                    type={"button"}
                    onClick={() => {
                        setPrices({
                            ...prices,
                            number: prices.number + 1,
                        })
                    }}
                />
            </div>
        </div>

    )
}