'use client';

import { useEffect, useState } from 'react';
// PRIME REACT
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// HELPERS
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';

export default function CategoriesList() {
    // ROUTER
    const router = useRouter();

    // STATES
    const [categories, setCategories] = useState([]);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);

    // EFFECT TO FETCH DATA
    useEffect(() => {
        // GET CATEGORIES LIST
        getCategoriesList();
    }, []);

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

    // DELETE CATEGORY HANDLER
    const deleteCategory = (category) => {
        // GET THE TOKEN FROM LOCAL STORAGE
        const token = localStorage.getItem('token');

        // API CALL /category/delete
        axios
            .delete(`${process.env.API_URL}/delete/bundle/category`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    categoryId: category._id
                }
            })
            .then((_) => {
                toast.success('Category deleted successfully');
                setSelectedCategoryToDelete(null);
                getCategoriesList();
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to delete category');
            });
    };

    return (
        <>
            <div className="card">
                <DataTable
                    value={categories || []}
                    paginator
                    rows={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    header={'Categories'}
                    emptyMessage={'No categories found'}
                    className="p-datatable-sm"
                >
                    {/*  IMAGE  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <Image src={rowData?.categoryImage || '/assets/404.jpg'} alt={'Category Image'} width={50} height={50} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #ccc' }} />
                            );
                        }}
                        header={'Image'}
                        style={{ width: '10%' }}
                    />
                    {/*  NAME EN  */}
                    <Column field="categoryNameEN" header={'Name (EN)'} sortable filter />

                    {/*  NAME AR  */}
                    <Column field="categoryNameAR" header={'Name (AR)'} sortable filter />

                    {/*  ACTIONS  */}
                    <Column
                        body={(rowData) => {
                            return (
                                <div className={'flex justify-center gap-1'}>
                                    <button className={'editButton'} onClick={() => router.push(`/categories/${rowData._id}`)}>
                                        {'Edit'}
                                    </button>
                                    <button className={'deleteButton'} onClick={() => setSelectedCategoryToDelete(rowData)}>
                                        {'Delete'}
                                    </button>
                                </div>
                            );
                        }}
                        header={'Actions'}
                        style={{ width: '10%' }}
                    />
                </DataTable>
            </div>

            {/* DELETE DIALOG */}
            <Dialog
                visible={selectedCategoryToDelete !== null}
                onHide={() => setSelectedCategoryToDelete(null)}
                header={'Delete Category'}
                footer={
                    <div className={'flex justify-center'}>
                        <button className={'deleteButton'} onClick={() => deleteCategory(selectedCategoryToDelete)}>
                            {'Delete'}
                        </button>
                        <button className={'cancelButton'} onClick={() => setSelectedCategoryToDelete(null)}>
                            {'Cancel'}
                        </button>
                    </div>
                }
                position={'center'}
                style={{ width: '100%', maxWidth: '500px' }}
                draggable={false}
                resizable={false}
            >
                <div className={'flex justify-center'}>
                    <p>{'Are you sure you want to delete this Category?'}</p>
                </div>
            </Dialog>
        </>
    );
}
