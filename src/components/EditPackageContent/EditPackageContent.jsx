'use client';
import React, { useState, useEffect, useMemo } from 'react';
import CustomFileUpload from '../../components/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
// IMPORTS
import ChoosePrices from '../ChoosePrices';

export default function EditPackage({ bundle, id, locale }) {
    const t = useTranslations('editPackage');
    const isRTL = locale === 'ar';

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [categories, setCategories] = useState([]);
    const [maleImage, setMaleImage] = useState([]);
    const [femaleImage, setFemaleImage] = useState([]);
    const [prices, setPrices] = useState([]);
    const [form, setForm] = useState({
        categoryId: '',
        bundleId: '',
        arName: '',
        enName: '',
        packagePrice: '',
        mealsNumber: '',
        snacksNumber: '',
        arText: '',
        enText: '',
        offersDays: '',
        fridays: false,
        fridayPrice: '',
        breakfast: false,
        lunch: false,
        dinner: false,
        // DEACTIVATED
        deActivate: '',

        allowedBreakfast: null,
        allowedLunch: null,
        allowedDinner: null,
        carb: '',
        protein: '',
        caloriesRange: [0, 5000]
    });

    // EFFECT TO SET THE FORM
    const memoizedBundle = useMemo(() => bundle, [bundle]);

    useEffect(() => {
        console.log('Memoized Bundle:', memoizedBundle);
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
                deActivate: memoizedBundle.deActivate,
                allowedBreakfast: memoizedBundle.allowedBreakfast,
                allowedLunch: memoizedBundle.allowedLunch,
                allowedDinner: memoizedBundle.allowedDinner,
                carb: memoizedBundle.carb || '',
                protein: memoizedBundle.protine || '',
                caloriesRange: memoizedBundle?.caloriesRange && memoizedBundle?.caloriesRange.length > 0 ? memoizedBundle.caloriesRange : [0, 5000]
            });

            // SET THE PRICES
            setPrices(memoizedBundle.periodPrices);
        }
    }, [memoizedBundle, id]);

    // HANDLERS
    function editPackage(event) {
        // PREVENT DEFAULT
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.arName || !form.enName || !form.mealsNumber || !form.snacksNumber || !form.arText || !form.enText) {
            return toast.error('Please fill all the fields.');
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE IMAGES
        formData.append('categoryId', form.categoryId);
        formData.append('bundleId', form.bundleId);
        formData.append('files', maleImage[0]);
        formData.append('files', femaleImage[0]);
        formData.append('bundleName', form.arName);
        formData.append('bundleNameEn', form.enName);
        formData.append('mealsNumber', form.mealsNumber);
        formData.append('snacksNumber', form.snacksNumber);
        formData.append('bundleSubtitleAR', form.arText);
        formData.append('bundleSubtitleEN', form.enText);
        formData.append('bundleOffer', form.offersDays);
        // formData.append("calories", form.calories);
        formData.append('fridayOption', form.fridays);
        formData.append('breakfast', form.breakfast);
        formData.append('lunch', form.lunch);
        formData.append('dinner', form.dinner);
        formData.append('periodPrices', JSON.stringify(prices));
        formData.append('fridayPrice', form.fridayPrice || 0);
        formData.append('deActivate', form.deActivate);

        // ALLOWED MEALS COUNT
        formData.append('allowedBreakfast', form.allowedBreakfast ? form.allowedBreakfast : 0);
        formData.append('allowedLunch', form.allowedLunch ? form.allowedLunch : 0);
        formData.append('allowedDinner', form.allowedDinner ? form.allowedDinner : 0);

        // CARB & PROTEIN
        formData.append('carb', form.carb || 0);
        formData.append('protein', form.protein || 0);
        formData.append('caloriesRange', JSON.stringify(form.caloriesRange || [0, 0]));

        // SEND THE REQUEST
        axios
            .put(`${process.env.API_URL}/edit/bundle`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                toast.success(response.data?.message || 'Package created successfully.');
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'An error occurred while creating the package.');
                setLoading(false);
            });
    }

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

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // GET CATEGORIES LIST
        getCategoriesList();
    }, []);

    return (
        <form onSubmit={editPackage} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="card mb-2">
                <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t('editPackage')}</h1>
                <div className="grid formgrid p-fluid">
                    <div className="col-12 mb-2 lg:col-6 lg:mb-2">
                        <label className={'mb-2 block'} htmlFor="male-image">
                            {t('maleImage')}
                        </label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setMaleImage(files);
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...(maleImage || [])];
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index;
                                });
                                setMaleImage(newItems);
                            }}
                        />
                    </div>
                    <div className="col-12 mb-2 lg:col-6 lg:mb-2">
                        <label className={'mb-2 block'} htmlFor="female-image">
                            {t('femaleImage')}
                        </label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setFemaleImage(files);
                            }}
                            removeThisItem={(index) => {
                                // ITEMS COPY
                                const items = [...(femaleImage || [])];
                                // FILTER THE ITEMS
                                const newItems = items.filter((item, i) => {
                                    return i !== index;
                                });
                                setFemaleImage(newItems);
                            }}
                        />
                    </div>

                    {/* CATEGORIES LIST */}
                    <div className="field col-12">
                        <label htmlFor="category">{t('category')}</label>
                        <Dropdown
                            id="category"
                            optionLabel="name"
                            optionValue="id"
                            value={form.categoryId}
                            options={categories.map((category) => {
                                return {
                                    id: category._id,
                                    name: `${category.categoryNameAR} - ${category.categoryNameEN}`
                                };
                            })}
                            onChange={(e) => setForm({ ...form, categoryId: e.value })}
                            placeholder={t('selectCategory')}
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="arName">{t('packageArabicName')}</label>
                        <InputText id="arName" type="text" placeholder={t('enterPackageArabicName')} value={form.arName} onChange={(e) => setForm({ ...form, arName: e.target.value })} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="enName">{t('packageEnglishName')}</label>
                        <InputText id="enName" type="text" placeholder={t('enterPackageEnglishName')} value={form.enName} onChange={(e) => setForm({ ...form, enName: e.target.value })} />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="mealsNumber">{t('mealsNumber')}</label>
                        <InputNumber
                            id="mealsNumber"
                            placeholder={t('enterMealsNumber')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.mealsNumber}
                            onChange={(e) => setForm({ ...form, mealsNumber: e.value })}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="snacksNumber">{t('snacksNumber')}</label>
                        <InputNumber
                            id="snacksNumber"
                            placeholder={t('enterSnacksNumber')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.snacksNumber}
                            onChange={(e) => setForm({ ...form, snacksNumber: e.value })}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="arText">{t('arabicTextOnCard')}</label>
                        <Dropdown
                            id="arText"
                            optionLabel="name"
                            optionValue="value"
                            value={form.arText}
                            options={[
                                // 80 - 100 - 120 - 150 - 180 - 200
                                { name: '٨٠ بروتين ٨٠ كارب', value: '٨٠ بروتين ٨٠ كارب' },
                                { name: '١٠٠ بروتين ١٠٠ كارب', value: '١٠٠ بروتين ١٠٠ كارب' },
                                { name: '١٢٠ بروتين ١٢٠ كارب', value: '١٢٠ بروتين ١٢٠ كارب' },
                                { name: '١٥٠ بروتين ١٥٠ كارب', value: '١٥٠ بروتين ١٥٠ كارب' },
                                { name: '١٨٠ بروتين ١٨٠ كارب', value: '١٨٠ بروتين ١٨٠ كارب' },
                                { name: '٢٠٠ بروتين ٢٠٠ كارب', value: '٢٠٠ بروتين ٢٠٠ كارب' }
                            ]}
                            onChange={(e) => setForm({ ...form, arText: e.value })}
                            placeholder={t('selectArabicTextOnCard')}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="enText">{t('englishTextOnCard')}</label>
                        <Dropdown
                            id="enText"
                            optionLabel="name"
                            optionValue="value"
                            value={form.enText}
                            options={[
                                // 80 - 100 - 120 - 150 - 180 - 200
                                { name: '80 Protein 80 Carb', value: '80 Protein 80 Carb' },
                                { name: '100 Protein 100 Carb', value: '100 Protein 100 Carb' },
                                { name: '120 Protein 120 Carb', value: '120 Protein 120 Carb' },
                                { name: '150 Protein 150 Carb', value: '150 Protein 150 Carb' },
                                { name: '180 Protein 180 Carb', value: '180 Protein 180 Carb' },
                                { name: '200 Protein 200 Carb', value: '200 Protein 200 Carb' }
                            ]}
                            onChange={(e) => setForm({ ...form, enText: e.value })}
                            placeholder={t('selectEnglishTextOnCard')}
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="offersDays">{t('offersDays')}</label>
                        <InputNumber
                            id="offersDays"
                            placeholder={t('enterOffersDays')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.offersDays}
                            onChange={(e) => setForm({ ...form, offersDays: e.value })}
                        />
                    </div>
                    <div className="field col-12 md:col-6">
                        <div className="flex flex-wrap justify-content-start gap-3">
                            <div className="flex align-items-center">
                                <InputSwitch
                                    inputId="fridays"
                                    name="fridays"
                                    value="fridays"
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            fridays: event.value
                                        });
                                    }}
                                    checked={form.fridays}
                                />
                                <label htmlFor="fridays" className="ml-2">
                                    {t('fridays')}
                                </label>
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
                                            ...form,
                                            breakfast: event.checked
                                        });
                                    }}
                                    checked={form.breakfast}
                                />
                                <label htmlFor="breakfast" className="ml-2">
                                    {t('breakfast')}
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="lunch"
                                    name="lunch"
                                    value="lunch"
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            lunch: event.checked
                                        });
                                    }}
                                    checked={form.lunch}
                                />
                                <label htmlFor="lunch" className="ml-2">
                                    {t('lunch')}
                                </label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox
                                    inputId="dinner"
                                    name="dinner"
                                    value="dinner"
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            dinner: event.checked
                                        });
                                    }}
                                    checked={form.dinner}
                                />
                                <label htmlFor="dinner" className="ml-2">
                                    {t('dinner')}
                                </label>
                            </div>
                        </div>
                    </div>

                    {form?.fridays && (
                        <div className="field col-12">
                            <label htmlFor="fridayPrice">{t('fridayPrice')}</label>
                            <InputNumber
                                id="fridayPrice"
                                placeholder={t('enterFridayPrice')}
                                mode="currency"
                                currency="KWD"
                                locale="en-US"
                                currencyDisplay="symbol"
                                value={form.fridayPrice}
                                onChange={(e) => setForm({ ...form, fridayPrice: e.value })}
                            />
                        </div>
                    )}

                    <div className="field col-4">
                        <label htmlFor="allowedBreakfast">{t('allowedBreakfast')}</label>
                        <InputNumber
                            id="allowedBreakfast"
                            placeholder={t('enterAllowedBreakfast')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.allowedBreakfast}
                            onChange={(e) => setForm({ ...form, allowedBreakfast: e.value })}
                        />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="allowedLunch">{t('allowedLunch')}</label>
                        <InputNumber
                            id="allowedLunch"
                            placeholder={t('enterAllowedLunch')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.allowedLunch}
                            onChange={(e) => setForm({ ...form, allowedLunch: e.value })}
                        />
                    </div>
                    <div className="field col-4">
                        <label htmlFor="allowedDinner">{t('allowedDinner')}</label>
                        <InputNumber
                            id="allowedDinner"
                            placeholder={t('enterAllowedDinner')}
                            mode="decimal"
                            minFractionDigits={0}
                            maxFractionDigits={0}
                            min={0}
                            max={100}
                            value={form.allowedDinner}
                            onChange={(e) => setForm({ ...form, allowedDinner: e.value })}
                        />
                    </div>

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
                                            ...form,
                                            deActivate: event.checked
                                        });
                                    }}
                                    checked={form.deActivate}
                                />
                                <label htmlFor="deActivate" className="ml-2">
                                    {t('deactivate')}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/*  CARB & PROTEIN */}
                    <div className="field col-6">
                        <label htmlFor="carb">{t('carb')}</label>
                        <InputNumber id="carb" placeholder={t('enterCarb')} mode="decimal" minFractionDigits={0} maxFractionDigits={0} min={0} value={form.carb} onChange={(e) => setForm({ ...form, carb: e.value })} />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="protein">{t('protein')}</label>
                        <InputNumber id="protein" placeholder={t('enterProtein')} mode="decimal" minFractionDigits={0} maxFractionDigits={0} min={0} value={form.protein} onChange={(e) => setForm({ ...form, protein: e.value })} />
                    </div>

                    {/* SLIDER */}
                    <div className="field col-12">
                        <label htmlFor="caloriesRange" className="mb-3 block">
                            {t('caloriesRange')}
                        </label>
                        <Slider id="caloriesRange" value={form.caloriesRange} range onChange={(e) => setForm({ ...form, caloriesRange: e.value })} min={0} max={5000} step={20} />
                        <div className="mt-2 flex justify-content-between align-content-center">
                            {form.caloriesRange && (
                                <>
                                    <Tag severity={'success'}> {form?.caloriesRange[0]}</Tag> <Tag severity={'success'}> {form?.caloriesRange[1]}</Tag>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ChoosePrices
                selectedPrices={bundle.periodPrices || []}
                getPrices={(pricesArray) => {
                    setPrices(pricesArray);
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
                    style={{ width: '100%', textTransform: 'uppercase' }}
                    type={'submit'}
                    label={
                        loading ? (
                            <ProgressSpinner
                                fill={'#fff'}
                                strokeWidth={'4'}
                                style={{
                                    width: '2rem',
                                    height: '2rem'
                                }}
                            />
                        ) : (
                            t('editPackage')
                        )
                    }
                    disabled={loading}
                />
            </div>
        </form>
    );
}
