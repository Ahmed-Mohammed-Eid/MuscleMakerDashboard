import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";

export default function ChooseExtra({getExtra, selectedExtra, allowedExtras}) {

    const [extra, setExtra] = useState({
        number: 0,
        maximumExtraNumber: 0,
        extraArray: []
    })

    // GET THE EXTRA
    getExtra(extra.extraArray, extra.maximumExtraNumber)

    useEffect(() => {
        if (selectedExtra) {
            setExtra({
                number: selectedExtra.length,
                maximumExtraNumber: allowedExtras || 0,
                extraArray: selectedExtra
            })
        }
    }, [selectedExtra])

    return (
        <div className={"card mb-2"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Meal Extras</h1>
            <div className="grid formgrid p-fluid">
                {new Array(extra.number).fill(0).map((_, index) => {
                    return (
                        <div key={`MealExtra_${index}`} className={'field col-12 grid formgrid p-fluid'}>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`extraNameAr${index}`}>Extra Name Ar</label>
                                <InputText
                                    id={`extraNameAr${index}`}
                                    type="text"
                                    placeholder="Enter Extra Name Ar"
                                    value={extra.extraArray[index]?.extraNameAr}
                                    onChange={(e) => {
                                        const ArrayOfExtras = [...extra.extraArray];
                                        ArrayOfExtras[index] = {
                                            ...ArrayOfExtras[index],
                                            extraNameAr: e.target.value
                                        };
                                        setExtra({
                                            ...extra,
                                            extraArray: ArrayOfExtras
                                        });
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`extraNameEn${index}`}>Extra Name En</label>
                                <InputText
                                    id={`extraNameEn${index}`}
                                    type="text"
                                    placeholder={"Enter Extra Name En"}
                                    value={extra.extraArray[index]?.extraNameEn}
                                    onChange={(e) => {
                                        const ArrayOfExtras = [...extra.extraArray]
                                        ArrayOfExtras[index] = {
                                            ...ArrayOfExtras[index],
                                            extraNameEn: e.target.value
                                        }
                                        setExtra({
                                            ...extra,
                                            extraArray: ArrayOfExtras
                                        })
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`extraPrice${index}`}>Extra Price</label>
                                <InputNumber
                                    mode={"currency"}
                                    currency={"KWD"}
                                    locale={"en-US"}
                                    currencyDisplay={"symbol"}
                                    id={`extraPrice${index}`}
                                    placeholder={"Enter Extra Price"}
                                    value={extra.extraArray[index]?.extraPrice}
                                    onChange={(e) => {
                                        const ArrayOfExtras = [...extra.extraArray]
                                        ArrayOfExtras[index] = {
                                            ...ArrayOfExtras[index],
                                            extraPrice: e.value
                                        }
                                        setExtra({
                                            ...extra,
                                            extraArray: ArrayOfExtras
                                        })
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-9 md:mb-8 mb-0">
                                <label htmlFor={`extrasFoodicsId${index}`}>Extra Foodics Id</label>
                                <InputText
                                    id={`extrasFoodicsId${index}`}
                                    type="text"
                                    placeholder={"Enter Extra Foodics Id"}
                                    value={extra.extraArray[index]?.foodicsId}
                                    onChange={(e) => {
                                        const ArrayOfExtras = [...extra.extraArray]
                                        ArrayOfExtras[index] = {
                                            ...ArrayOfExtras[index],
                                            foodicsId: e.target.value
                                        }
                                        setExtra({
                                            ...extra,
                                            extraArray: ArrayOfExtras
                                        })
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-3 flex justify-content-end align-items-end mb-8 mt-4 md:mt-0">
                                <Button
                                    icon="pi pi-times"
                                    rounded
                                    type={'button'}
                                    text
                                    raised
                                    severity="danger"
                                    aria-label="Cancel"
                                    onClick={() => {
                                        const ArrayOfExtras = [...extra.extraArray]
                                        ArrayOfExtras.splice(index, 1)
                                        setExtra({
                                            ...extra,
                                            number: extra.number - 1,
                                            extraArray: ArrayOfExtras
                                        })
                                    }}
                                />
                            </div>
                        </div>)
                })}
                {/*  MAXIMUM NUMBER OF EXTRAS  */}
                <div className="field col-12">
                    <label htmlFor="maximumExtraNumber">Maximum Number Of Extras To Choose</label>
                    <InputNumber
                        id="maximumExtraNumber"
                        type="text"
                        placeholder={"Enter Maximum Number Of Extras"}
                        value={extra.maximumExtraNumber}
                        onChange={(e) => {
                            setExtra({
                                ...extra,
                                maximumExtraNumber: e.value
                            })
                        }}
                    />
                </div>
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
                    type={'button'}
                    rounded
                    text
                    raised
                    severity="help"
                    aria-label="add"
                    onClick={() => {
                        setExtra({
                            ...extra,
                            number: extra.number + 1,
                        })
                    }}
                />
            </div>
        </div>

    )
}