
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { sortBy } from 'lodash';
import { SortOrder } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { PostCall, GetCall, DeleteCall } from '../../../api/ApiKit';
import CustomDataTable, { CustomDataTableRef } from '../../../components/CustomDataTable';
import { useAppContext } from '../../../layout/AppWrapper';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { Rules, CustomResponse } from '../../../types';
import { getRowLimitWithScreenHeight, buildQueryParams } from '../../../utils/uitl';


const ACTIONS = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    DELETE: 'delete'
};

const ManageCapaRulesPage = () => {
    const router = useNavigate();
    const { layoutState } = useContext(LayoutContext);
    const [isShowSplit, setIsShowSplit] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const dataTableRef = useRef<CustomDataTableRef>(null);
    const [limit, setLimit] = useState<number>(getRowLimitWithScreenHeight());

    const [selectedRuleId, setSelectedRuleId] = useState();
    const [action, setAction] = useState(null);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [rules, setRules] = useState<Rules[]>([]);
    const [totalRecords, setTotalRecords] = useState();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

    const handleCreateNavigation = () => {
        router('/create-new-capa-rules'); // Replace with the route you want to navigate to
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            setIsDetailLoading(true);
            try {
                // Use the existing PostCall function
                const response: CustomResponse = await PostCall('/company/bulk-rules', formData);

                setIsDetailLoading(false);

                if (response.code === 'SUCCESS') {
                    setAlert('success', 'Rules imported successfully');
                } else {
                    setAlert('error', response.message || 'File upload failed');
                }
            } catch (error) {
                setIsDetailLoading(false);
                console.error('An error occurred during file upload:', error);
                setAlert('error', 'An unexpected error occurred during file upload');
            }
        }
    };
    const { isLoading, setLoading, setAlert } = useAppContext();

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <span className="p-input-icon-left flex align-items-center">
                    <h3 className="mb-0">Manage Capa Rules</h3>
                </span>
                <div className="flex justify-content-end">
                    <Button icon="pi pi-plus" size="small" label="Import Rules" aria-label="Add Rules" className="default-button " onClick={handleButtonClick} style={{ marginLeft: 10 }}>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xls,.xlsx" onChange={handleFileChange} />
                    </Button>
                    {/* <Button icon="pi pi-trash" size="small" label="Delete Rules" aria-label="Add Supplier" className="default-button " style={{ marginLeft: 10 }} /> */}
                    <Button icon="pi pi-plus" size="small" label="Add Rules" aria-label="Add Rule" className="bg-pink-500 border-pink-500 hover:text-white" onClick={handleCreateNavigation} style={{ marginLeft: 10 }} />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const renderInputBox = () => {
        return (
            <div style={{ position: 'relative' }}>
                <InputText placeholder="Search" style={{ paddingLeft: '40px', width: '40%' }} />
                <span
                    className="pi pi-search"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'gray',
                        fontSize: '1.5rem'
                    }}
                ></span>
            </div>
        );
    };

    const inputboxfeild = renderInputBox();

    const fetchData = async (params?: any) => {
        try {
            if (!params) {
                params = { limit: limit, page: page, include: 'subCategories', sortOrder: 'asc' };
            }

            setPage(params.page);

            const queryString = buildQueryParams(params);

            const response = await GetCall(`company/rules?${queryString}`);

            setTotalRecords(response.total);
            setRules(response.data);
        } catch (error) {
            setAlert('error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    const dataTableHeaderStyle = { fontSize: '12px' };

    useEffect(() => {
        fetchData();
    }, []);

    const departments = [
        { label: 'Planning', value: 'Planning' },
        { label: 'Quality', value: 'Quality' },
        { label: 'Development', value: 'Development' },
        { label: 'Procurement', value: 'Procurement' },
        { label: 'Sustainability', value: 'Sustainability' }
    ];

    const subcategories = [
        { label: 'Packing Material Supplier', value: 'Packing Material Supplier' },
        { label: 'Raw Material Supplier', value: 'Raw Material Supplier' },
        { label: 'Copack Material Supplier', value: 'Copack Material Supplier' }
    ];

    const dropdownMenuDepartment = () => {
        return <Dropdown value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.value)} options={departments} optionLabel="label" placeholder="-- Select Department --" className="w-full md:w-20rem" />;
    };

    const dropdownFieldDeparment = dropdownMenuDepartment();

    const dropdownMenuSubCategory = () => {
        return <Dropdown value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.value)} options={subcategories} optionLabel="label" placeholder="-- Select Sub Category --" className="w-full md:w-20rem" />;
    };

    const dropdownFieldSubCategory = dropdownMenuSubCategory();

    const onRowSelect = async (perm: Rules, action: any) => {
        setAction(action);

        setSelectedRuleId(perm.ruleId);

        if (action === ACTIONS.DELETE) {
            openDeleteDialog(perm);
        }
        // if (action === ACTIONS.VIEW) {
        //     setIsShowSplit(true);
        // }
        // if (action === ACTIONS.EDIT) {
        //     setIsShowSplit(true);
        //     // fetchSoDetails(perm.estimateId)
        // }
    };

    const openDeleteDialog = (items: Rules) => {
        setIsDeleteDialogVisible(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
    };

    const onDelete = async () => {
        setLoading(true);

        try {
            const response = await DeleteCall(`/company/rules/${selectedRuleId}`);

            if (response.code === 'SUCCESS') {
                setRules((prevRules) => prevRules.filter((rule) => rule.ruleId !== selectedRuleId));
                closeDeleteDialog();
                setAlert('success', 'Rule successfully deleted!');
            } else {
                setAlert('error', 'Something went wrong!');
                closeDeleteDialog();
            }
        } catch (error) {
            setAlert('error', 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className={`panel-container ${isShowSplit ? (layoutState.isMobile ? 'mobile-split' : 'split') : ''}`}>
                    <div className="left-panel">
                        <div className="header">{header}</div>
                        <div
                            className="bg-[#ffffff] border border-1  p-3  mt-4 shadow-lg"
                            style={{ borderColor: '#CBD5E1', borderRadius: '10px', WebkitBoxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)', MozBoxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)', boxShadow: '0px 0px 2px -2px rgba(0,0,0,0.75)' }}
                        >
                            {/* <div className="search-box  mt-5 w-70">{inputboxfeild}</div> */}
                            <div className="flex gap-4">
                                <div className="mt-2">{dropdownFieldDeparment}</div>
                                <div className="mt-2">{dropdownFieldSubCategory}</div>
                            </div>

                            <CustomDataTable
                                ref={dataTableRef}
                                filter
                                page={page}
                                limit={limit} // no of items per page
                                totalRecords={totalRecords} // total records from api response
                                // isView={true}
                                isEdit={true} // show edit button
                                isDelete={true} // show delete button
                                // extraButtons={[
                                //     {
                                //         icon: 'pi pi-cloud-upload',
                                //         onClick: (item) => openDialog()
                                //     },
                                //     {
                                //         icon: 'pi pi-external-link',
                                //         onClick: async (item) => {
                                //             setDialogVisible(true);
                                //             setPoId(item.poId); // Set the poId from the clicked item

                                //             await fetchTrackingData(item.poId);
                                //         }
                                //     }
                                // ]}
                                data={rules.map((item: any) => ({
                                    ruleId: item.ruleId,
                                    subCategoryName: item.subCategories?.subCategoryName,
                                    section: item.section,
                                    ratedCriteria: item.ratedCriteria,
                                    criteriaEvaluation: item.criteriaEvaluation,
                                    score: item.score,
                                    ratiosCopack: item.ratiosCopack,
                                    ratiosRawpack: item.ratiosRawpack
                                }))}
                                columns={[
                                    {
                                        header: 'Sr No',
                                        field: 'ruleId',
                                        filter: true,
                                        sortable: true,
                                        bodyStyle: { minWidth: 50, maxWidth: 50 },
                                        headerStyle: dataTableHeaderStyle,
                                        filterPlaceholder: 'Sr No'
                                    },
                                    {
                                        header: 'DEPARTMENT PROCU CATEGORY',
                                        field: 'supplierid',
                                        // body: renderVendor,
                                        filter: true,
                                        // filterElement: vendorDropdown,
                                        bodyStyle: { minWidth: 200, maxWidth: 200 },
                                        headerStyle: dataTableHeaderStyle,
                                        filterPlaceholder: 'Supplier Id'
                                    },
                                    {
                                        header: 'SUB CATEGORY',
                                        field: 'subCategoryName',
                                        sortable: true,
                                        filter: true,
                                        filterPlaceholder: 'Supplier Name',
                                        headerStyle: dataTableHeaderStyle,
                                        style: { minWidth: 180, maxWidth: 180 }
                                    },
                                    {
                                        header: 'CRITERIA CATEGORY',
                                        field: 'section',
                                        // body: renderWarehouse,
                                        filter: true,
                                        // filterElement: warehouseDropdown,
                                        bodyStyle: { minWidth: 150, maxWidth: 150 },
                                        headerStyle: dataTableHeaderStyle,
                                        filterPlaceholder: 'Search Procurement Category'
                                    },
                                    {
                                        header: 'CRITERIA',
                                        field: 'ratedCriteria',
                                        // body: renderStatus,
                                        filter: true,
                                        filterPlaceholder: 'Search Supplier Category',
                                        bodyStyle: { minWidth: 150, maxWidth: 150 },
                                        headerStyle: dataTableHeaderStyle
                                        // filterElement: statusDropdown
                                    }
                                    // {
                                    //     header: 'CRITERIA EVALUATION LIST',
                                    //     field: 'criteriaEvaluation',
                                    //     filter: true,
                                    //     filterPlaceholder: 'Search Supplier Manufacturing Name',
                                    //     bodyStyle: { minWidth: 150, maxWidth: 150 },
                                    //     headerStyle: dataTableHeaderStyle
                                    //     // body: renderPOTotal
                                    // },
                                    // {
                                    //     header: 'CRITERIA SCORE',
                                    //     field: 'score',
                                    //     filter: true,
                                    //     filterPlaceholder: 'Search Site Address',
                                    //     bodyStyle: { minWidth: 150, maxWidth: 150 },
                                    //     headerStyle: dataTableHeaderStyle
                                    // },
                                    // {
                                    //     header: 'RATIOS COPACK',
                                    //     field: 'ratiosCopack',
                                    //     filter: true,
                                    //     filterPlaceholder: 'Search Factory Name',
                                    //     bodyStyle: { minWidth: 150, maxWidth: 150 },
                                    //     headerStyle: dataTableHeaderStyle
                                    // },
                                    // {
                                    //     header: 'RATIOS RAW&PACK',
                                    //     field: 'ratiosRawpack',
                                    //     filter: true,
                                    //     filterPlaceholder: 'Search Warehouse Location',
                                    //     bodyStyle: { minWidth: 150, maxWidth: 150 },
                                    //     headerStyle: dataTableHeaderStyle
                                    // }
                                ]}
                                onLoad={(params: any) => fetchData(params)}
                                // // onView={(item: any) => onRowSelect(item, 'view')}
                                // onEdit={(item: any) => onRowSelect(item, 'edit')}
                                onDelete={(item: any) => onRowSelect(item, 'delete')}
                            />
                        </div>
                    </div>
                </div>

                <Dialog
                    header="Delete confirmation"
                    visible={isDeleteDialogVisible}
                    style={{ width: layoutState.isMobile ? '90vw' : '50vw' }}
                    className="delete-dialog"
                    headerStyle={{ backgroundColor: '#ffdddb', color: '#8c1d18' }}
                    footer={
                        <div className="flex justify-content-end p-2">
                            <Button label="Cancel" severity="secondary" text onClick={closeDeleteDialog} />
                            <Button label="Delete" severity="danger" onClick={onDelete} />
                        </div>
                    }
                    onHide={closeDeleteDialog}
                >
                    {isLoading && (
                        <div className="center-pos">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                        </div>
                    )}
                    <div className="flex flex-column w-full surface-border p-3">
                        <div className="flex align-items-center">
                            <i className="pi pi-info-circle text-6xl red" style={{ marginRight: 10 }}></i>
                            <span>
                                This will permanently delete the selected rule.
                                <br />
                                Do you still want to delete it? This action cannot be undone.
                            </span>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageCapaRulesPage;
