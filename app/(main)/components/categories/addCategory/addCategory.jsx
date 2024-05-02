'use client';
import React, { useState } from 'react';
// PRIME REACT
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

// COMPONENTS
import CustomFileUpload from "../../customFileUpload/customFileUpload";

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function AddCategoryForm() {

    // STATES
    const [categoryNameAR, setCategoryNameAR] = useState('');
    const [categoryNameEN, setCategoryNameEN] = useState('');
    const [files, setFiles] = useState(null);

    // HANDLERS
    function handleSubmit(e) {
        // PREVENT DEFAULT
        e.preventDefault();

        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');


        // VALIDATE
        if (!categoryNameAR || !categoryNameEN || !files) {
            return toast.error('Please fill all required fields');
        }

        // SUBMIT
        const data = new FormData();
        data.append('categoryNameAR', categoryNameAR);
        data.append('categoryNameEN', categoryNameEN);

        // LOOP THROUGH FILES
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }

        // API CALL /create/coupons
        axios.post(`${process.env.API_URL}/create/bundle/category`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(_ => {
                toast.success('Category added successfully');
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong');
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={`card`}>
                <h1 className={'text-2xl mb-5 uppercase'}>
                    Add Category
                </h1>

                <div className={'p-fluid formgrid grid'}>
                    <div className={'field col-12 md:col-6'}>
                        <label htmlFor="couponCode">Category Name (EN)</label>
                        <InputText
                            id="categoryNameEN"
                            value={categoryNameEN}
                            onChange={(e) => setCategoryNameEN(e.target.value)}
                            placeholder={'Category Name (EN)'}
                        />
                    </div>
                    <div className={'field col-12 md:col-6'}>
                        <label
                            htmlFor="categoryNameAR">Category Name (AR)</label>
                        <InputText
                            id="categoryNameAR"
                            value={categoryNameAR}
                            onChange={(e) => setCategoryNameAR(e.target.value)}
                            placeholder={'Category Name (AR)'}
                        />
                    </div>
                    <div className={'field col-12'} dir={'ltr'}>
                        <label htmlFor="files">Category Image</label>
                        <CustomFileUpload
                            setFiles={(files) => {
                                setFiles(files);
                            }}
                            multiple={true}
                        />
                    </div>
                </div>
            </div>
            <div className={'flex justify-center mt-5'}>
                <Button
                    label={'Add Category'}
                    icon="pi pi-plus"
                    style={{
                        width: '100%',
                        padding: '1rem'
                    }}
                />
            </div>
        </form>
    );
}