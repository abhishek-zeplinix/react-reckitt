
import React, { useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { useNavigate } from 'react-router-dom';
import { GetCall } from '../api/ApiKit';
import { useAppContext } from '../layout/AppWrapper';
import { Supplier, CustomResponse } from '../types';
import { getRowLimitWithScreenHeight, buildQueryParams } from '../utils/uitl';



const SupplierDirectory = () => {
    const router = useNavigate();
    const { user, isLoading, setLoading, setScroll, setAlert } = useAppContext();
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());
    const [page, setPage] = useState<number>(1);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [totalRecords, setTotalRecords] = useState<number | undefined>(undefined);

    // const { setSupplierDataFunc } = useContext(SupplierRatingContext); 

    useEffect(() => {
        // setScroll(true);
        fetchData();
        // fetchRolesData();
        return () => {
            // setScroll(true);
        };
    }, []);

    const fetchData = async (params?: any) => {
        if (!params) {
            params = { limit: limit, page: page };
        }
        setLoading(true);
        const queryString = buildQueryParams(params);
        const response: CustomResponse = await GetCall(`/company/supplier?${queryString}`);
        setLoading(false);
        if (response.code == 'SUCCESS') {
            setSuppliers(response.data);
            console.log('46', response.data);

            if (response.total) {
                setTotalRecords(response?.total);
            }
        } else {
            setSuppliers([]);
        }
    };

    const navigateToSummary = (supId: number, catId: number, subCatId: number) => {
        console.log("supplier id-->" , supId, "cat id -->", catId, "sub cat id -->", subCatId);
        
        const selectedSupplier = suppliers.find((supplier) => supplier.supId === supId);

        if (selectedSupplier) {
            // uupdate the context with the selected supplier data

            sessionStorage.setItem('supplier-data', JSON.stringify(selectedSupplier));

        }

        router(`/supplier-scoreboard-summary`);

    };

    // Render the status column
    const statusBodyTemplate = (rowData: any) => (
        <span
            style={{
                color: rowData.status === 'Active' ? 'green' : 'red',
                fontWeight: 'bold'
            }}
        >
            {rowData.status}
        </span>
    );

    // Render the history button
    // const historyBodyTemplate = (rowData: any) => <Button icon="pi pi-eye" className="p-button-rounded p-button-danger" onClick={() => navigateToSummary(rowData.id)} />;

    // Render the evaluate button
    const evaluateBodyTemplate = (rowData: any) => <Button icon="pi pi-plus" className="p-button-rounded p-button-danger" onClick={() => navigateToSummary(rowData.supId, rowData.category.categoryId, rowData.subCategories.subCategoryId)} />;

    return (
        <div className="p-m-4">
            <h3>Supplier Directory</h3>
            <DataTable
                value={suppliers}
                scrollable
                scrollHeight="250px"
                responsiveLayout="scroll"
                // onRowClick={(e) => navigateToSummary(e.data.supId)}
                style={{
                    scrollbarWidth: 'thin', // Firefox
                    scrollbarColor: '#888 #f1f1f1' // Firefox
                }}
            >
                <Column field="supId" header="#" />
                <Column field="supplierName" header="Supplier Name" />
                <Column field="status" header="Status" body={statusBodyTemplate} />
                <Column field="location.name" header="Location" />
                <Column field="category.categoryName" header="Category" />
                {/* <Column field="onboardingDate" header="Onboarding Date" />
                <Column field="lastEvaluated" header="Last Evaluated" />*/}
                {/* <Column header="History" body={historyBodyTemplate} /> */}
                <Column header="Evaluate" body={evaluateBodyTemplate}/>
            </DataTable>
        </div>
    );
};

export default SupplierDirectory;
