import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";

export default function MealVariations({getVariation = () => {}, selectedVariation, allowedVariations}) {

    const [variation, setVariation] = useState({
        number: 0,
        variationsArray: []
    })

    // GET THE VARIATION
    getVariation(variation.variationsArray)

    useEffect(() => {
        if (selectedVariation) {
            setVariation({
                number: selectedVariation.length,
                variationsArray: selectedVariation
            })
        }
    }, [selectedVariation])

    return (
        <div className={"card mb-2"}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>Meal Nutrition</h1>
            <div className="grid formgrid p-fluid">
                {new Array(variation.number).fill(0).map((_, index) => {
                    return (
                        <div key={`MealVariation_${index}`} className={'field col-12 grid formgrid p-fluid'}>
                            <div className="field col-12">
                                <label htmlFor={`variationNameAr${index}`}>Nutrition</label>
                                <Dropdown
                                    id={`variationNameAr${index}`}
                                    value={variation.variationsArray[index]?.title}
                                    options={[
                                        // 80 - 100 - 120 - 150 - 180 - 200
                                        {name: '٨٠ بروتين ٨٠ كارب', value: '٨٠ بروتين ٨٠ كارب'},
                                        {name: '١٠٠ بروتين ١٠٠ كارب', value: '١٠٠ بروتين ١٠٠ كارب'},
                                        {name: '١٢٠ بروتين ١٢٠ كارب', value: '١٢٠ بروتين ١٢٠ كارب'},
                                        {name: '١٥٠ بروتين ١٥٠ كارب', value: '١٥٠ بروتين ١٥٠ كارب'},
                                        {name: '١٨٠ بروتين ١٨٠ كارب', value: '١٨٠ بروتين ١٨٠ كارب'},
                                        {name: '٢٠٠ بروتين ٢٠٠ كارب', value: '٢٠٠ بروتين ٢٠٠ كارب'},
                                    ]}
                                    onChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            title: e.value,
                                            protine: ArrayOfVariations[index]?.protine || 0,
                                            carbohydrates: ArrayOfVariations[index]?.carbohydrates || 0,
                                            fats: ArrayOfVariations[index]?.fats || 0,
                                            sugar: ArrayOfVariations[index]?.sugar || 0,
                                            calories: ArrayOfVariations[index]?.calories || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    optionLabel="name"
                                    placeholder="Select Nutrition"
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`Protine${index}`}>Protein</label>
                                <InputNumber
                                    id={`Protine${index}`}
                                    value={variation.variationsArray[index]?.protine}
                                    onValueChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            protine: e.value,
                                            title: ArrayOfVariations[index]?.title || '',
                                            carbohydrates: ArrayOfVariations[index]?.carbohydrates || 0,
                                            fats: ArrayOfVariations[index]?.fats || 0,
                                            sugar: ArrayOfVariations[index]?.sugar || 0,
                                            calories: ArrayOfVariations[index]?.calories || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    placeholder={'Protein'}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`Carbohydrates${index}`}>Carbohydrates</label>
                                <InputNumber
                                    id={`Carbohydrates${index}`}
                                    value={variation.variationsArray[index]?.carbohydrates}
                                    onValueChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            carbohydrates: e.value,
                                            title: ArrayOfVariations[index]?.title || '',
                                            protine: ArrayOfVariations[index]?.protine || 0,
                                            fats: ArrayOfVariations[index]?.fats || 0,
                                            sugar: ArrayOfVariations[index]?.sugar || 0,
                                            calories: ArrayOfVariations[index]?.calories || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    placeholder={'Carbohydrates'}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`Fats${index}`}>Fats</label>
                                <InputNumber
                                    id={`Fats${index}`}
                                    value={variation.variationsArray[index]?.fats}
                                    onValueChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            fats: e.value,
                                            title: ArrayOfVariations[index]?.title || '',
                                            protine: ArrayOfVariations[index]?.protine || 0,
                                            carbohydrates: ArrayOfVariations[index]?.carbohydrates || 0,
                                            sugar: ArrayOfVariations[index]?.sugar || 0,
                                            calories: ArrayOfVariations[index]?.calories || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    placeholder={'Fats'}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`Sugar${index}`}>Sugar</label>
                                <InputNumber
                                    id={`Sugar${index}`}
                                    value={variation.variationsArray[index]?.sugar}
                                    onValueChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            sugar: e.value,
                                            title: ArrayOfVariations[index]?.title || '',
                                            protine: ArrayOfVariations[index]?.protine || 0,
                                            carbohydrates: ArrayOfVariations[index]?.carbohydrates || 0,
                                            fats: ArrayOfVariations[index]?.fats || 0,
                                            calories: ArrayOfVariations[index]?.calories || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    placeholder={'Sugar'}
                                />
                            </div>
                            <div className="field col-12 md:col-4">
                                <label htmlFor={`Calories${index}`}>Calories</label>
                                <InputNumber
                                    id={`Calories${index}`}
                                    value={variation.variationsArray[index]?.calories}
                                    onValueChange={(e) => {
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations[index] = {
                                            calories: e.value,
                                            title: ArrayOfVariations[index]?.title || '',
                                            protine: ArrayOfVariations[index]?.protine || 0,
                                            carbohydrates: ArrayOfVariations[index]?.carbohydrates || 0,
                                            fats: ArrayOfVariations[index]?.fats || 0,
                                            sugar: ArrayOfVariations[index]?.sugar || 0
                                        }
                                        setVariation({
                                            ...variation,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                    placeholder={'Calories'}
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
                                        const ArrayOfVariations = [...variation.variationsArray]
                                        ArrayOfVariations.splice(index, 1)
                                        setVariation({
                                            ...variation,
                                            number: variation.number - 1,
                                            variationsArray: ArrayOfVariations
                                        })
                                    }}
                                />
                            </div>
                        </div>)
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
                    type={'button'}
                    rounded
                    text
                    raised
                    severity="help"
                    aria-label="add"
                    onClick={() => {
                        setVariation({
                            ...variation,
                            number: variation.number + 1,
                        })
                    }}
                />
            </div>
        </div>

    )
}