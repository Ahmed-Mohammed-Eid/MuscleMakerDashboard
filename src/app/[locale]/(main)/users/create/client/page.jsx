'use client';
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { MultiSelect } from 'primereact/multiselect';

export default function CreateClient({ params: { locale } }) {
    const t = useTranslations('createClient');
    const isRTL = locale === 'ar';

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [bundles, setBundles] = useState([]);
    const [flexBundleOptions, setFlexBundleOptions] = useState(null);
    const [form, setForm] = useState({
        clientName: '',
        phoneNumber: '',
        email: '',
        gender: '',
        governorate: '',
        region: '',
        block: '',
        street: '',
        alley: '',
        building: '',
        floor: '',
        appartment: '',
        dislikedMeals: '',
        password: '',
        startingAt: null,
        bundleId: '',
        bundlePeriod: '',
        orderAmount: '',
        customBundle: false,
        bundleOptions: {
            carb: { carbValue: 0, price: 0 },
            protine: { protineValue: 0, price: 0 },
            mealsNumber: { mealsCount: 0, price: 0 },
            mealsType: [],
            snacksNumber: { snackCount: 0, price: 0 },
            weekDays: [],
            bundlePeriods: { weekCount: 0, price: 0 }
        },
        hasCoupon: false,
        couponCode: '',
        selectedPeriodPrice: null
    });

    // Options for the top bar
    const [options, setOptions] = useState({
        bundleType: 'normal', // normal or custom
        hasDislikedMeals: false,
        hasCoupon: false,
        requirePayment: false
    });

    // Fetch bundles and flex bundle options on component mount
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch bundles
                const bundlesResponse = await axios.get(`${process.env.API_URL}/get/bundles`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBundles(bundlesResponse.data?.bundles || []);

                // Fetch flex bundle options
                const flexOptionsResponse = await axios.get(`${process.env.API_URL}/flex/bundle/options`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(flexOptionsResponse.data?.flexOptions);
                setFlexBundleOptions(flexOptionsResponse.data?.flexOptions);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Error fetching data');
            }
        };
        fetchData();
    }, []);

    // Calculate total price for custom bundle
    const calculateCustomBundleTotal = () => {
        if (!form.bundleOptions) return 0;

        const carbPrice = form.bundleOptions.carb?.price || 0;
        const proteinPrice = form.bundleOptions.protine?.price || 0;
        const mealsPrice = form.bundleOptions.mealsNumber?.price || 0;
        const snacksPrice = form.bundleOptions.snacksNumber?.price || 0;
        const periodPrice = form.bundleOptions.bundlePeriods?.price || 0;
        const weekDaysPrice = form.bundleOptions.weekDays?.reduce((sum, day) => sum + (flexBundleOptions?.weekDays.find((d) => d.dayName === day.dayName)?.price || 0), 0) || 0;
        const mealsTypePrice = form.bundleOptions.mealsType?.reduce((sum, type) => sum + type.price, 0) || 0;

        return carbPrice + proteinPrice + mealsPrice + snacksPrice + periodPrice + weekDaysPrice + mealsTypePrice;
    };

    // HANDLERS
    async function createClient(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');

        // Basic validation
        if (!form.clientName || !form.phoneNumber || !form.email || !form.password) {
            toast.error(t('fillRequiredFieldsError'));
            return;
        }

        setLoading(true);

        // Prepare the request data
        const requestData = {
            clientName: form.clientName,
            phoneNumber: form.phoneNumber,
            email: form.email,
            gender: form.gender,
            governorate: form.governorate,
            region: form.region,
            block: form.block,
            street: form.street,
            alley: form.alley,
            building: form.building,
            floor: form.floor,
            appartment: form.appartment,
            dislikedMeals: options.hasDislikedMeals ? form.dislikedMeals : '',
            password: form.password,
            startingAt: form.startingAt ? form.startingAt.toLocaleDateString('en-US') : null,
            customBundle: options.bundleType === 'custom',
            requirePayment: options.requirePayment
        };

        // Add bundle related fields based on bundle type
        if (options.bundleType === 'normal') {
            requestData.bundleId = form.bundleId;
            requestData.bundlePeriod = form.selectedPeriodPrice?.period;
            requestData.orderAmount = form.selectedPeriodPrice?.price;
        } else {
            requestData.bundleOptions = form.bundleOptions;
        }

        // Add coupon if exists
        if (options.hasCoupon) {
            requestData.hasCoupon = true;
            requestData.couponCode = form.couponCode;
        }

        try {
            const response = await axios.post(`${process.env.API_URL}/admin/create/client`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success(response.data?.message || t('createSuccess'));
            // Reset form or redirect
        } catch (error) {
            toast.error(error?.response?.data?.message || t('createError'));
        } finally {
            setLoading(false);
        }
    }

    const governorateOptions = [
        { label: t('governorates.jahra'), value: 'الجهراء' },
        { label: t('governorates.hawally'), value: 'حولي' },
        { label: t('governorates.capital'), value: 'العاصمة' },
        { label: t('governorates.farwaniya'), value: 'الفروانيه' },
        { label: t('governorates.mubarakAlKabeer'), value: 'مبارك الكبير' },
        { label: t('governorates.ahmadi'), value: 'الاحمدي' }
    ];

    const genderOptions = [
        { label: t('gender.male'), value: 'male' },
        { label: t('gender.female'), value: 'female' }
    ];

    // Render top options bar
    const renderOptionsBar = () => (
        <div className="card p-4 mb-6">
            <div className="flex flex-wrap gap-4 justify-content-between">
                <div className="flex gap-4">
                    <div className="flex align-items-center">
                        <RadioButton inputId="normalBundle" name="bundleType" value="normal" onChange={(e) => setOptions({ ...options, bundleType: e.value })} checked={options.bundleType === 'normal'} />
                        <label htmlFor="normalBundle" className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                            {t('normalBundleLabel')}
                        </label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="customBundle" name="bundleType" value="custom" onChange={(e) => setOptions({ ...options, bundleType: e.value })} checked={options.bundleType === 'custom'} />
                        <label htmlFor="customBundle" className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                            {t('customBundleLabel')}
                        </label>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex align-items-center">
                        <Checkbox inputId="requirePayment" name="requirePayment" onChange={(e) => setOptions({ ...options, requirePayment: e.checked })} checked={options.requirePayment} />
                        <label htmlFor="requirePayment" className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                            {t('requirePaymentLabel')}
                        </label>
                    </div>

                    <div className="flex align-items-center">
                        <Checkbox inputId="hasDislikedMeals" name="hasDislikedMeals" onChange={(e) => setOptions({ ...options, hasDislikedMeals: e.checked })} checked={options.hasDislikedMeals} />
                        <label htmlFor="hasDislikedMeals" className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                            {t('hasDislikedMealsLabel')}
                        </label>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="hasCoupon" name="hasCoupon" onChange={(e) => setOptions({ ...options, hasCoupon: e.checked })} checked={options.hasCoupon} />
                        <label htmlFor="hasCoupon" className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                            {t('hasCouponLabel')}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={'mb-0'} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="card p-4">
                <h1 className={'text-2xl font-bold mb-4 uppercase'}>{t('title')}</h1>

                {/* Options Bar */}
                {renderOptionsBar()}

                {/* Form */}
                <form onSubmit={createClient} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="surface-section p-4 border-round">
                        <h2 className="text-xl font-semibold mb-4">{t('sections.basicInfo')}</h2>
                        <div className="grid formgrid p-fluid">
                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="clientName" className="block font-medium mb-2">
                                    {t('nameLabel')}
                                </label>
                                <InputText id="clientName" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder={t('namePlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="phoneNumber" className="block font-medium mb-2">
                                    {t('phoneLabel')}
                                </label>
                                <InputMask id="phoneNumber" mask="99999999" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder={t('phonePlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="email" className="block font-medium mb-2">
                                    {t('emailLabel')}
                                </label>
                                <InputText id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('emailPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="gender" className="block font-medium mb-2">
                                    {t('genderLabel')}
                                </label>
                                <Dropdown id="gender" value={form.gender} options={genderOptions} onChange={(e) => setForm({ ...form, gender: e.value })} placeholder={t('genderPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 mb-4">
                                <label htmlFor="password" className="block font-medium mb-2">
                                    {t('passwordLabel')}
                                </label>
                                <Password id="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t('passwordPlaceholder')} feedback={false} className="w-full" />
                            </div>

                            {options.hasDislikedMeals && (
                                <div className="field col-12 mb-4">
                                    <label htmlFor="dislikedMeals" className="block font-medium mb-2">
                                        {t('dislikedMealsLabel')}
                                    </label>
                                    <InputText id="dislikedMeals" value={form.dislikedMeals} onChange={(e) => setForm({ ...form, dislikedMeals: e.target.value })} placeholder={t('dislikedMealsPlaceholder')} className="w-full" />
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider />

                    {/* Address Section */}
                    <div className="surface-section p-4 border-round">
                        <h2 className="text-xl font-semibold mb-4">{t('sections.address')}</h2>
                        <div className="grid formgrid p-fluid">
                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="governorate" className="block font-medium mb-2">
                                    {t('governorateLabel')}
                                </label>
                                <Dropdown id="governorate" value={form.governorate} options={governorateOptions} onChange={(e) => setForm({ ...form, governorate: e.value })} placeholder={t('governoratePlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="region" className="block font-medium mb-2">
                                    {t('regionLabel')}
                                </label>
                                <InputText id="region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder={t('regionPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-3 mb-4">
                                <label htmlFor="block" className="block font-medium mb-2">
                                    {t('blockLabel')}
                                </label>
                                <InputText id="block" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} placeholder={t('blockPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-3 mb-4">
                                <label htmlFor="street" className="block font-medium mb-2">
                                    {t('streetLabel')}
                                </label>
                                <InputText id="street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder={t('streetPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-3 mb-4">
                                <label htmlFor="alley" className="block font-medium mb-2">
                                    {t('alleyLabel')}
                                </label>
                                <InputText id="alley" value={form.alley} onChange={(e) => setForm({ ...form, alley: e.target.value })} placeholder={t('alleyPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-3 mb-4">
                                <label htmlFor="building" className="block font-medium mb-2">
                                    {t('buildingLabel')}
                                </label>
                                <InputText id="building" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} placeholder={t('buildingPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="floor" className="block font-medium mb-2">
                                    {t('floorLabel')}
                                </label>
                                <InputText id="floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder={t('floorPlaceholder')} className="w-full" />
                            </div>

                            <div className="field col-12 md:col-6 mb-4">
                                <label htmlFor="appartment" className="block font-medium mb-2">
                                    {t('appartmentLabel')}
                                </label>
                                <InputText id="appartment" value={form.appartment} onChange={(e) => setForm({ ...form, appartment: e.target.value })} placeholder={t('appartmentPlaceholder')} className="w-full" />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Subscription Section */}
                    <div className="surface-section p-4 border-round">
                        <h2 className="text-xl font-semibold mb-4">{t('sections.subscription')}</h2>
                        <div className="grid formgrid p-fluid">
                            <div className="field col-12 mb-4">
                                <label htmlFor="startingAt" className="block font-medium mb-2">
                                    {t('startDateLabel')}
                                </label>
                                <Calendar id="startingAt" value={form.startingAt} onChange={(e) => setForm({ ...form, startingAt: e.value })} dateFormat="mm-dd-yy" placeholder={t('startDatePlaceholder')} showIcon className="w-full" />
                            </div>

                            {options.bundleType === 'normal' ? (
                                <>
                                    <div className="field col-12 md:col-6 mb-4">
                                        <label htmlFor="bundleId" className="block font-medium mb-2">
                                            {t('bundleLabel')}
                                        </label>
                                        <Dropdown
                                            id="bundleId"
                                            value={form.bundleId}
                                            options={bundles.map((bundle) => ({ label: isRTL ? bundle?.bundleName : bundle?.bundleNameEn, value: bundle._id }))}
                                            onChange={(e) => {
                                                const selectedBundle = bundles.find((b) => b._id === e.value);
                                                setForm({
                                                    ...form,
                                                    bundleId: e.value,
                                                    selectedPeriodPrice: null // Reset period price when bundle changes
                                                });
                                            }}
                                            placeholder={t('bundlePlaceholder')}
                                            className="w-full"
                                        />
                                    </div>

                                    {form.bundleId && (
                                        <div className="field col-12 md:col-6 mb-4">
                                            <label htmlFor="periodPrice" className="block font-medium mb-2">
                                                {t('periodAndPriceLabel')}
                                            </label>
                                            <Dropdown
                                                id="periodPrice"
                                                value={form.selectedPeriodPrice}
                                                options={bundles
                                                    .find((b) => b._id === form.bundleId)
                                                    ?.periodPrices.map((pp) => ({
                                                        label: `${pp.period} - ${pp.price} KWD`,
                                                        value: pp
                                                    }))}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        selectedPeriodPrice: e.value
                                                    })
                                                }
                                                placeholder={t('selectPeriodAndPrice')}
                                                optionLabel="label"
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="field col-12 md:col-6 mb-4">
                                        <label htmlFor="carbValue" className="block font-medium mb-2">
                                            {t('carbLabel')}
                                        </label>
                                        <Dropdown
                                            id="carbValue"
                                            value={form.bundleOptions.carb}
                                            options={flexBundleOptions?.carb.map((option) => ({
                                                label: `${option.carbValue}g - ${option.price} KWD`,
                                                value: option
                                            }))}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        carb: e.value
                                                    }
                                                })
                                            }
                                            placeholder={t('carbPlaceholder')}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6 mb-4">
                                        <label htmlFor="protineValue" className="block font-medium mb-2">
                                            {t('proteinLabel')}
                                        </label>
                                        <Dropdown
                                            id="protineValue"
                                            value={form.bundleOptions.protine}
                                            options={flexBundleOptions?.protine.map((option) => ({
                                                label: `${option.protineValue}g - ${option.price} KWD`,
                                                value: option
                                            }))}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        protine: e.value
                                                    }
                                                })
                                            }
                                            placeholder={t('proteinPlaceholder')}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6 mb-4">
                                        <label htmlFor="mealsCount" className="block font-medium mb-2">
                                            {t('mealsCountLabel')}
                                        </label>
                                        <Dropdown
                                            id="mealsCount"
                                            value={form.bundleOptions.mealsNumber}
                                            options={flexBundleOptions?.mealsNumber.map((option) => ({
                                                label: `${option.mealsCount} meals - ${option.price} KWD`,
                                                value: option
                                            }))}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        mealsNumber: e.value
                                                    }
                                                })
                                            }
                                            placeholder={t('mealsCountPlaceholder')}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="field col-12 md:col-6 mb-4">
                                        <label htmlFor="snackCount" className="block font-medium mb-2">
                                            {t('snacksCountLabel')}
                                        </label>
                                        <Dropdown
                                            id="snackCount"
                                            value={form.bundleOptions.snacksNumber}
                                            options={flexBundleOptions?.snacksNumber.map((option) => ({
                                                label: `${option.snackCount} snacks - ${option.price} KWD`,
                                                value: option
                                            }))}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        snacksNumber: e.value
                                                    }
                                                })
                                            }
                                            placeholder={t('snacksCountPlaceholder')}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="field col-12 mb-4">
                                        <label className="block font-medium mb-2">{t('mealsTypeLabel')}</label>
                                        <MultiSelect
                                            value={form.bundleOptions.mealsType}
                                            options={flexBundleOptions?.mealsType.map((type) => ({
                                                label: `${type.mealType} - ${type.price} KWD`,
                                                value: type
                                            }))}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        mealsType: e.value
                                                    }
                                                });
                                            }}
                                            placeholder={t('selectMealTypes')}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="field col-12 mb-4">
                                        <label className="block font-medium mb-2">{t('weekDaysLabel')}</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                                                const dayPrice = flexBundleOptions?.weekDays.find((d) => d.dayName === day)?.price || 0;
                                                return (
                                                    <div key={day} className="flex align-items-center">
                                                        <Checkbox
                                                            inputId={day}
                                                            onChange={(e) => {
                                                                const isSelected = form.bundleOptions.weekDays.some((d) => d.dayName === day);
                                                                let newWeekDays;
                                                                if (isSelected) {
                                                                    newWeekDays = form.bundleOptions.weekDays.filter((d) => d.dayName !== day);
                                                                } else {
                                                                    newWeekDays = [...form.bundleOptions.weekDays, { dayName: day, price: dayPrice }];
                                                                }
                                                                setForm({
                                                                    ...form,
                                                                    bundleOptions: {
                                                                        ...form.bundleOptions,
                                                                        weekDays: newWeekDays
                                                                    }
                                                                });
                                                            }}
                                                            checked={form.bundleOptions.weekDays.some((d) => d.dayName === day)}
                                                        />
                                                        <label htmlFor={day} className={`${isRTL ? 'mr-2' : 'ml-2'} font-medium inline-block`}>
                                                            {t(day.toLowerCase())} - {dayPrice} KWD
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="field col-12 mb-4">
                                        <label htmlFor="bundlePeriods" className="block font-medium mb-2">
                                            {t('bundlePeriodLabel')}
                                        </label>
                                        <Dropdown
                                            id="bundlePeriods"
                                            value={form.bundleOptions.bundlePeriods}
                                            options={flexBundleOptions?.bundlePeriods.map((option) => ({
                                                label: `${option.weekCount} weeks - ${option.price} KWD`,
                                                value: option
                                            }))}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    bundleOptions: {
                                                        ...form.bundleOptions,
                                                        bundlePeriods: e.value
                                                    }
                                                })
                                            }
                                            placeholder={t('bundlePeriodPlaceholder')}
                                            optionLabel="label"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="col-12">
                                        <div className="text-center p-4 border-round bg-primary-50">
                                            <span className="text-xl font-bold text-primary-900">
                                                {t('totalPrice')}: {calculateCustomBundleTotal()} KWD
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Divider />

                    {/* Payment Section */}
                    <div className="surface-section p-4 border-round">
                        <h2 className="text-xl font-semibold mb-4">{t('sections.payment')}</h2>
                        <div className="grid formgrid p-fluid">
                            {options.hasCoupon && (
                                <div className="field col-12 mb-4">
                                    <label htmlFor="couponCode" className="block font-medium mb-2">
                                        {t('couponLabel')}
                                    </label>
                                    <InputText value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} placeholder={t('couponPlaceholder')} className="w-full" />
                                </div>
                            )}

                            <div className="field col-12">
                                <Button type="submit" label={loading ? <ProgressSpinner style={{ width: '1.5rem', height: '1.5rem' }} /> : t('submitButton')} disabled={loading} className="w-full p-button-lg" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
