import CardLayout from '../../components/PageCard/PageCard';
import './Agile_pro.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiBaseTemplate from './agileTemplate'; // Snake_case base template from API
import axios from 'axios'; // Import axios
import { useAuth } from '../../contexts/AuthContext';// --- API Configuration ---
const API_URL = "http://3.111.226.182/factops/coform/fill_agile";
 // Or get this from props, context, or URL params
 // Define placeholder string for checks

// --- Initial Form State (CamelCase) ---
const initialFormData = {
    // Case 1
    companyName: '',
    gstin: '', // 'yes' or 'no'
    state: 'Maharashtra', // Default, can be overwritten by fetched data
    district: 'Pune',   // Default, can be overwritten by fetched data
    stateJurisdiction: '',
    sectorCircle: '',
    centreJurisdiction: '', // commissionerate
    division: '',
    range: '',
    registrationReason: '',

    // Case 2
    lease: '', // 'yes' or 'no' / maps to whether_the_establishment_on_lease
    leasedFrom: '', // maps to leased_from_date
    leasedTo: '',   // maps to leased_end_date
    naturePossession: '', // maps to nature_of_position_of_permises
    possessionOther: '',  // maps to if_selected_others
    proofType: '', 
    buildingStatus: '', // maps to whether_the_building_or_permissios_of_establishment
    changeOwnership: '', // 'yes' or 'no' / maps to if_hired (boolean)
    leasedFromRepeat: '', 
    leasedToRepeat: '',   

    // Case 3
    optionForComposition: '', 
    compositionDeclarationChecked: false, 
    categoryOfRegisteredPerson: { 
        manufacturerNonNotified: false, 
        supplierFoodDrinks: false,      
        anyOtherEligible: false,        
    },
    natureOfBusinessActivity: { 
        factory: false,
        wholesaleBusiness: false,
        retailBusiness: false,
        warehouse: false,
        boundedWhereHouse: false, 
        supplierOfServices: false,
        office: false,
        leasingBusiness: false,
        receiptOfGoodsOrServices: false, 
        eouStpEhtp: false,
        worksContract: false,
        export: false,
        import: false,
        othersPleaseSpecify: false, 
        othersValue: '',            
    },

    // Case 4
    primaryBusinessActivity: '', 
    primaryBusinessSpecify: '', 
    exactWork: '', 
    workSubCategory: '', 
    natureOfWorkBusiness: '', 
    hsnCode: '', 
    goodsDescription: '', 
    sacCode: '', 
    serviceDescription: '', 

    // Case 5 & 6 (Director Details)
    aadhaarAuthGstn: 'no', 
    directors: [], 

    // Case 7
    policeStation: '', 
    employerParticularsBranch: '', 
    employerParticularsInspection: '', 
    bankName: '', 
    bankIdentityProofFile: '',
    bankAddressProofFile: '',
    shopEstablishmentRequired: 'no', 
    establishmentCategory: '', 
    natureOfBusinessShop: '', 

    // Case 8 (Declarations and final signatory details)
    declarationGstChecked: false,       
    declarationEsicChecked: false,      
    declarationPtChecked: false,        
    declarationEpfoChecked: false,      
    declarationBankChecked: false,      
    declarationBankAuthorizeName: 'ICICI Bank', 
    declarationShopChecked: false,      
    declarationPlace: 'Tirupathi',      
    declarationDate: '2025-04-09',      
    declarationDesignation: 'Director', 
    declarationDinPan: 'FY******3G',    
    digitalSignatureFile: '',          
};


export default function NameReservation() {
    const totalCards = 8;
    const [currentCard, setCurrentCard] = useState(1);
    const navigate = useNavigate();
    const { token, orgId } = useAuth();
    const [formData, setFormData] = useState(initialFormData);
    const [directorCount, setDirectorCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData(prevFormData => {
            const newDirectors = [...(prevFormData.directors || [])];
            while (newDirectors.length < directorCount) {
                newDirectors.push({ 
                    din: '', pan: '', mobile: '', email: '',
                    firstName: '', middleName: '', lastName: '',
                    photographFile: '',
                });
            }
            if (newDirectors.length > directorCount) {
                newDirectors.splice(directorCount); 
            }
            return { ...prevFormData, directors: newDirectors };
        });
    }, [directorCount]);

    const mapApiDataToFormData = (apiData) => {
        if (!apiData || Object.keys(apiData).length === 0) {
            return initialFormData; 
        }
        const directorDetailsFromApi = apiData.section_12_director_details?.dir_details || [];
        console.log("Extracted Director Details from API:", directorDetailsFromApi); // Add this log

        const mappedDirectors = directorDetailsFromApi.map(dir => ({
            din: dir.din || '',
            pan: dir.pan || '', // API has null, map correctly
            mobile: dir.personal_mobile_number || '', // Use correct API key
            email: dir.personal_email_id || '',     // Use correct API key
            firstName: dir.first_name || '',
            middleName: dir.middle_name || '',
            lastName: dir.last_name || '',
            photographFile: '', // Initialize as empty, API doesn't provide this directly here
            // You might want to map aadhaar_authentication_for_GST if needed
            // aadhaarAuthGst: dir.aadhaar_authentication_for_GST || null,
        }));
        console.log("Mapped Directors for Form State:", mappedDirectors); // Add this log
        const newFormData = {
            companyName: apiData.company_name || '',
            gstin: apiData.do_you_want_to_apply_for_gstin || '',
            state: apiData.state || initialFormData.state,
            district: apiData.district || initialFormData.district,
            stateJurisdiction: apiData.state_jurisdiction || '',
            sectorCircle: apiData.sector_circle_ward_charge_unit || '',
            centreJurisdiction: apiData.center_jurisdiction?.commissionerate || '',
            division: apiData.center_jurisdiction?.division || '',
            range: apiData.center_jurisdiction?.range || '',
            registrationReason: apiData.reason_to_obtain_registration || '',
            lease: apiData.whether_the_establishment_on_lease || '',
            leasedFrom: apiData.leased_from_date || '',
            leasedTo: apiData.leased_end_date || '',
            naturePossession: apiData.nature_of_position_of_permises || '',
            possessionOther: apiData.if_selected_others || '',
            buildingStatus: apiData.whether_the_building_or_permissios_of_establishment || '',
            changeOwnership: apiData.if_hired ? 'yes' : 'no',
            optionForComposition: apiData.option_for_composition || '',
            compositionDeclarationChecked: apiData.section_8a_decleration === 'checked', 
            categoryOfRegisteredPerson: {
                manufacturerNonNotified: apiData.section_8b_category_of_registered_person?.manufaturer_of_non_notified_goods || false,
                supplierFoodDrinks: apiData.section_8b_category_of_registered_person?.supplier_of_food_and_non_alcoholic_drinks || false,
                anyOtherEligible: apiData.section_8b_category_of_registered_person?.any_other_eligible_supplier || false,
            },
            natureOfBusinessActivity: {
                factory: apiData.nature_of_business_activity?.factory || false,
                wholesaleBusiness: apiData.nature_of_business_activity?.wholesale_business || false,
                retailBusiness: apiData.nature_of_business_activity?.retail_business || false,
                warehouse: apiData.nature_of_business_activity?.warehouse || false,
                boundedWhereHouse: apiData.nature_of_business_activity?.bounded_where_house || false,
                supplierOfServices: apiData.nature_of_business_activity?.supplier_of_services || false,
                office: apiData.nature_of_business_activity?.office || false,
                leasingBusiness: apiData.nature_of_business_activity?.leasing_business || false,
                receiptOfGoodsOrServices: apiData.nature_of_business_activity?.reciept_of_goods_or_services || false,
                eouStpEhtp: apiData.nature_of_business_activity?.eou_stp_ehtp || false,
                worksContract: apiData.nature_of_business_activity?.works_contract || false,
                export: apiData.nature_of_business_activity?.export || false,
                import: apiData.nature_of_business_activity?.import || false,
                othersPleaseSpecify: apiData.nature_of_business_activity?.others_please_specify || false,
                othersValue: apiData.nature_of_business_activity?.others_value || apiData.section_9_if_others_specify || '',
            },
            primaryBusinessActivity: apiData.primary_business_activity || '',
            primaryBusinessSpecify: apiData.section_9a_if_others_selected || '',
            exactWork: apiData.extra_nature_of_business || '',
            workSubCategory: apiData.work_sub_category || '',
            natureOfWorkBusiness: apiData.nature_of_work_business || '',
            hsnCode: apiData.details_of_goods_supplied_by_business?.hsn_code || '',
            goodsDescription: apiData.details_of_goods_supplied_by_business?.description_of_goods || '',
            sacCode: apiData.details_of_services_supplied_by_the_business?.service_accounting_code || '',
            serviceDescription: apiData.details_of_services_supplied_by_the_business?.description_of_service || '',
            aadhaarAuthGstn: apiData.aadhaar_auth_for_gstn || 'no', 


           directors: mappedDirectors,

           proofType: initialFormData.proofType, // Example: if proofType isn't in API response
            leasedFromRepeat: initialFormData.leasedFromRepeat, // Example
            leasedToRepeat: initialFormData.leasedToRepeat, // Example
            bankIdentityProofFile: initialFormData.bankIdentityProofFile, // Example
            bankAddressProofFile: initialFormData.bankAddressProofFile, // Example
            digitalSignatureFile: initialFormData.digitalSignatureFile, // Example
            policeStation: apiData.section_13_police_station || '',
            employerParticularsBranch: apiData.employers_particulars?.branch_office || '',
            employerParticularsInspection: apiData.employers_particulars?.inspection_division || '',
            bankName: apiData.bank_name || '',
            shopEstablishmentRequired: apiData.whether_registration_is_required_under_shop_and_establishment || 'no',
            establishmentCategory: apiData.category_of_establishment || '',
            natureOfBusinessShop: apiData.section_16b_nature_of_business || '',
            declarationGstChecked: apiData.decleration?.decleration_1 === 'checked',
            declarationEsicChecked: apiData.decleration?.decleration_2 === 'checked',
            declarationPtChecked: apiData.decleration?.decleration_3 === 'checked',
            declarationEpfoChecked: apiData.decleration?.decleration_4 === 'checked',
            declarationBankChecked: apiData.decleration?.decleration_5?.startsWith('I authorize') || apiData.decleration?.decleration_5 === 'checked',
            declarationBankAuthorizeName: extractBankNameFromDeclaration(apiData.decleration?.decleration_5) || initialFormData.declarationBankAuthorizeName, 
            declarationShopChecked: apiData.decleration?.decleration_6 === 'checked',
            declarationPlace: apiData.place || '',
            declarationDate: apiData.date || '',
            declarationDesignation: apiData.designation || '',
            declarationDinPan: apiData.din_or_pan || '',
        };
        
        if (apiData.section_12_director_details?.number_of_directors) {
           setDirectorCount(parseInt(apiData.section_12_director_details.number_of_directors, 10));
        } else if (apiData.director_details_list?.length) {
           setDirectorCount(apiData.director_details_list.length);
        }
        return newFormData;
    };

    

    const extractBankNameFromDeclaration = (declarationText) => {
        if (typeof declarationText === 'string' && declarationText.startsWith('I authorize ')) {
            const match = declarationText.match(/I authorize (.*?) Bank and its officials/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    };

    const mapFormDataToApiTemplate = (currentFormData, currentDirectorCount) => {
        const apiPayloadData = {
            ...apiBaseTemplate, 
            company_name: currentFormData.companyName,
            do_you_want_to_apply_for_gstin: currentFormData.gstin,
            state: currentFormData.state,
            district: currentFormData.district,
            state_jurisdiction: currentFormData.stateJurisdiction,
            sector_circle_ward_charge_unit: currentFormData.sectorCircle,
            center_jurisdiction: {
                commissionerate: currentFormData.centreJurisdiction,
                division: currentFormData.division,
                range: currentFormData.range,
            },
            reason_to_obtain_registration: currentFormData.registrationReason,
            whether_the_establishment_on_lease: currentFormData.lease,
            leased_from_date: currentFormData.leasedFrom,
            leased_end_date: currentFormData.leasedTo,
            nature_of_position_of_permises: currentFormData.naturePossession,
            if_selected_others: currentFormData.possessionOther,
            whether_the_building_or_permissios_of_establishment: currentFormData.buildingStatus,
            if_hired: currentFormData.changeOwnership === 'yes',
            option_for_composition: currentFormData.optionForComposition,
            section_8a_decleration: currentFormData.compositionDeclarationChecked ? 'checked' : 'unchecked', 
            section_8b_category_of_registered_person: {
                manufaturer_of_non_notified_goods: currentFormData.categoryOfRegisteredPerson.manufacturerNonNotified,
                supplier_of_food_and_non_alcoholic_drinks: currentFormData.categoryOfRegisteredPerson.supplierFoodDrinks,
                any_other_eligible_supplier: currentFormData.categoryOfRegisteredPerson.anyOtherEligible,
            },
            nature_of_business_activity: {
                factory: currentFormData.natureOfBusinessActivity.factory,
                wholesale_business: currentFormData.natureOfBusinessActivity.wholesaleBusiness,
                retail_business: currentFormData.natureOfBusinessActivity.retailBusiness,
                warehouse: currentFormData.natureOfBusinessActivity.warehouse,
                bounded_where_house: currentFormData.natureOfBusinessActivity.boundedWhereHouse,
                supplier_of_services: currentFormData.natureOfBusinessActivity.supplierOfServices,
                office: currentFormData.natureOfBusinessActivity.office,
                leasing_business: currentFormData.natureOfBusinessActivity.leasingBusiness,
                reciept_of_goods_or_services: currentFormData.natureOfBusinessActivity.receiptOfGoodsOrServices,
                eou_stp_ehtp: currentFormData.natureOfBusinessActivity.eouStpEhtp,
                works_contract: currentFormData.natureOfBusinessActivity.worksContract,
                export: currentFormData.natureOfBusinessActivity.export,
                import: currentFormData.natureOfBusinessActivity.import,
                others_please_specify: currentFormData.natureOfBusinessActivity.othersPleaseSpecify,
                others_value: currentFormData.natureOfBusinessActivity.othersValue,
            },
            section_9_if_others_specify: currentFormData.natureOfBusinessActivity.othersPleaseSpecify ? currentFormData.natureOfBusinessActivity.othersValue : '',
            primary_business_activity: currentFormData.primaryBusinessActivity,
            section_9a_if_others_selected: currentFormData.primaryBusinessSpecify, 
            extra_nature_of_business: currentFormData.exactWork,
            work_sub_category: currentFormData.workSubCategory,
            nature_of_work_business: currentFormData.natureOfWorkBusiness,
            details_of_goods_supplied_by_business: {
                hsn_code: currentFormData.hsnCode,
                description_of_goods: currentFormData.goodsDescription,
            },
            details_of_services_supplied_by_the_business: {
                service_accounting_code: currentFormData.sacCode,
                description_of_service: currentFormData.serviceDescription,
            },
            aadhaar_auth_for_gstn: currentFormData.aadhaarAuthGstn, 
            section_12_director_details: {
                number_of_directors: currentDirectorCount.toString(), 
            },
            director_details_list: currentFormData.directors.slice(0, currentDirectorCount).map(dir => ({
                din: dir.din,
                pan: dir.pan,
                mobile: dir.mobile,
                email: dir.email,
                first_name: dir.firstName,
                middle_name: dir.middleName,
                last_name: dir.lastName,
                photograph_file_ref: dir.photographFile, 
            })),
            section_13_police_station: currentFormData.policeStation,
            employers_particulars: {
                branch_office: currentFormData.employerParticularsBranch,
                inspection_division: currentFormData.employerParticularsInspection,
            },
            bank_name: currentFormData.bankName,
            whether_registration_is_required_under_shop_and_establishment: currentFormData.shopEstablishmentRequired,
            category_of_establishment: currentFormData.establishmentCategory,
            section_16b_nature_of_business: currentFormData.natureOfBusinessShop,
            decleration: {
                decleration_1: currentFormData.declarationGstChecked ? 'checked' : 'unchecked', 
                decleration_2: currentFormData.declarationEsicChecked ? 'checked' : 'unchecked',
                decleration_3: currentFormData.declarationPtChecked ? 'checked' : 'unchecked',
                decleration_4: currentFormData.declarationEpfoChecked ? 'checked' : 'unchecked',
                decleration_5: currentFormData.declarationBankChecked ? `I authorize ${currentFormData.declarationBankAuthorizeName} Bank and its officials to contact me/us on phone/ email/ SMS for any communication related to my/our account(s) across products and services either offered by ICICI bank or its group companies or associates. I understand that the bank account number generated through this application can be different from the preferred bank account number entered by me. I/we undertake to complete all documentary requirements and furnish all information as may be required by ICICI bank from time to time.` : 'unchecked',
                decleration_6: currentFormData.declarationShopChecked ? 'checked' : 'unchecked',
            },
            place: currentFormData.declarationPlace,
            date: currentFormData.declarationDate,
            designation: currentFormData.declarationDesignation,
            din_or_pan: currentFormData.declarationDinPan, 
        };
        return apiPayloadData;
    };

   const getAxiosConfig = () => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    const handleAxiosError = (err, contextMessage) => {
        console.error(`${contextMessage}:`, err);
        let errorMessage = "An unexpected error occurred.";
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const apiError = err.response.data;
            errorMessage = `API Error: ${err.response.status} - ${apiError.detail || apiError.message || err.message}`;
        } else if (err.request) {
            // The request was made but no response was received
            errorMessage = "No response from server. Please check your network connection.";
        } else {
            // Something happened in setting up the request that triggered an Error
            errorMessage = `Request setup error: ${err.message}`;
        }
        setError(errorMessage);
    };


    useEffect(() => {
        const fetchAgileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.post(API_URL, 
                    { org_id: orgId, data: {} }, 
                    getAxiosConfig()
                );
                
                const result = response.data; // axios automatically parses JSON
                if (result && result.data) {
                    const mappedData = mapApiDataToFormData(result.data);
                    setFormData(prevData => ({ ...initialFormData, ...prevData, ...mappedData })); 
                } else {
                    console.warn("Fetched data is not in the expected format or is empty:", result);
                    setFormData(initialFormData); 
                }
            } catch (err) {
                handleAxiosError(err, "Failed to fetch agile data");
                setFormData(initialFormData); 
            } finally {
                setIsLoading(false);
            }
        };
        if (token && orgId) {
            fetchAgileData();
        } else {
            console.warn("Missing token or orgId. Fetch call skipped.");
            setFormData(initialFormData);
        }
        
    }, []); 

    useEffect(() => {
        if (currentCard === 6 && window.bootstrap && window.bootstrap.Tab) {
            const triggerEls = document.querySelectorAll('#page6Content [data-bs-toggle="tab"]');
            triggerEls.forEach((tab) => {
                const existingListener = tab.__handler;
                if (existingListener) {
                    tab.removeEventListener('click', existingListener);
                }
                const newListener = function (e) {
                    e.preventDefault();
                    const tabInstance = new window.bootstrap.Tab(tab);
                    tabInstance.show();
                };
                tab.addEventListener('click', newListener);
                tab.__handler = newListener; 
            });
        }
    }, [currentCard, directorCount]);


    const handleNext = async () => {
      if (!token || !orgId) {
          console.warn("Missing token or orgId. Skipping save.");
          if (currentCard < totalCards) {
            setCurrentCard(prev => prev + 1);
          }
          return;
        }
        setIsLoading(true);
        setError(null);

        const payloadData = mapFormDataToApiTemplate(formData, directorCount);
        const payload = {
            org_id: orgId,
            data: payloadData
        };

        console.log(`Attempting to save data before moving from card ${currentCard}:`, JSON.stringify(payload, null, 2));

        try {
            const response = await axios.post(API_URL, payload, getAxiosConfig());
            const result = response.data;
            console.log(`Data saved successfully before moving from card ${currentCard}:`, result);
            // Optionally update formData if API returns modified data
            // if (result && result.data) {
            //     const mappedData = mapApiDataToFormData(result.data);
            //     setFormData(prevData => ({ ...prevData, ...mappedData }));
            // }
        } catch (err) {
            handleAxiosError(err, `Failed to save data on page ${currentCard}`);
            // Decide if you want to prevent navigation on save error.
            // For now, it will proceed but show an error.
        } finally {
            setIsLoading(false);
            if (currentCard < totalCards) {
                setCurrentCard(prev => prev + 1);
            } else {
                console.log("Save attempted on the last page via 'Next' logic. Consider using 'Submit'.");
            }
        }
    };
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalCards) {
          setCurrentCard(pageNumber);
        }
      };

    const handlePrev = () => {
        if (currentCard > 1) {
          setCurrentCard(prev => prev - 1); 
        }
      };

 const handleFinalSubmit = async () => {
  if (!token || !orgId) {
    console.warn("Missing token or orgId. Cannot submit.");
    setError("Cannot submit: Authentication details missing.");
    return;
  }

        setIsLoading(true);
        setError(null);

        const payloadData = mapFormDataToApiTemplate(formData, directorCount);
        const payload = {
            org_id: orgId,
            data: payloadData
        };

        console.log("Submitting final payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await axios.post(API_URL, payload, getAxiosConfig());
            const result = response.data;
            console.log('Form submitted successfully:', result);
            navigate('/coi');

        } catch (err) {
            handleAxiosError(err, "Failed to submit agile form");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNestedChange = (parentKey, childKey, value, type = 'text') => {
        setFormData(prev => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: type === 'checkbox' ? value : value 
            }
        }));
    };
    
    const handleDirectorChange = (index, field, value, type = 'text') => {
        setFormData(prev => {
            const newDirectors = [...prev.directors];
            if (newDirectors[index]) {
                if (type === 'file') {
                    newDirectors[index] = { ...newDirectors[index], [field]: value }; 
                } else {
                    newDirectors[index] = { ...newDirectors[index], [field]: value };
                }
            }
            return { ...prev, directors: newDirectors };
        });
    };

    const exampleData = {
        companyName: 'EcoVibe Solutions Pvt Ltd', gstin: 'yes', state: 'Maharashtra', district: 'Pune',
        stateJurisdiction: 'Maharashtra State Jurisdiction 5', sectorCircle: 'Sector 17, Circle A',
        centreJurisdiction: 'Pune Commissionerate', division: 'Division 2', range: 'Range III',
        registrationReason: 'To enable nationwide interstate commerce and B2B services',
        lease: 'yes', leasedFrom: '2025-03-20', leasedTo: '2026-02-19', naturePossession: 'Leased',
        possessionOther: '', proofType: 'Electricity Bill', buildingStatus: 'Leased', changeOwnership: 'no',
      };

    const renderCardContent = () => {
        if (isLoading && !(currentCard === 1 && !formData.companyName)) { 
             return <p>Processing...</p>;
        }
        if (isLoading && currentCard === 1 && !formData.companyName) { 
             return <p>Loading form data...</p>;
        }
        if (error) return <p className="text-danger">Error: {error}</p>;

        switch (currentCard) {
            case 1:
                return (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div id="page1Content" className="page-content active">
                            <div className="row g-3">
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="companyName" className="form-label_Ap">Name of the Company <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="companyName" name="companyName" placeholder="Enter Name of the Company" required value={formData.companyName} onChange={handleChange} disabled/>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label className="form-label_Ap">1. Do you want to apply for GSTIN? <span className="text-danger">*</span></label>
                                    <div className="d-flex align-items-center gap-3 mt-1">
                                        {['yes', 'no'].map((option) => (
                                            <div className="form-check form-check-inline" key={option}>
                                                <input className="form-check-input" type="radio" name="gstin" id={`gstin-${option}`} value={option} checked={formData.gstin === option} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor={`gstin-${option}`}>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="state" className="form-label_Ap">2. State</label>
                                    <input type="text" className="form-control" id="state" name="state" value={formData.state} onChange={handleChange}disabled />
                                    </div>
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="district" className="form-label_Ap">3. District</label>
                                    <input type="text" className="form-control" id="district" name="district" value={formData.district} onChange={handleChange} disabled/>
                                    </div>
                                <div className="col-12"><div className="form-divider"></div></div>
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="stateJurisdiction" className="form-label_Ap">4. State Jurisdiction</label>
                                    <input type="text" className="form-control" id="stateJurisdiction" name="stateJurisdiction" value={formData.stateJurisdiction} onChange={handleChange} />
                                </div>
                                <div className="col-md-6 mb-1">
                                    <label htmlFor="sectorCircle" className="form-label_Ap">Sector / Circle / Ward</label>
                                    <input type="text" className="form-control" id="sectorCircle" name="sectorCircle" value={formData.sectorCircle} onChange={handleChange} />
                                </div>
                                <div className="col-12"><div className="form-divider"></div></div>
                                <div className="col-md-4 mb-1">
                                    <label htmlFor="centreJurisdiction" className="form-label_Ap">5. Commissionerate</label>
                                    <input type="text" className="form-control" id="centreJurisdiction" name="centreJurisdiction" value={formData.centreJurisdiction} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 mb-1">
                                    <label htmlFor="division" className="form-label_Ap">Division</label>
                                    <input type="text" className="form-control" id="division" name="division" value={formData.division} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 mb-1">
                                    <label htmlFor="range" className="form-label_Ap">Range</label>
                                    <input type="text" className="form-control" id="range" name="range" value={formData.range} onChange={handleChange} />
                                </div>
                                <div className="col-12"><div className="form-divider"></div></div>
                                <div className="col-12 mb-1">
                                    <label htmlFor="registrationReason" className="form-label_Ap">6. Reason for Registration</label>
                                    <input type="text" className="form-control" id="registrationReason" name="registrationReason" value={formData.registrationReason} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </form>
                );

            case 2:
                return (
                    <div id="page2Content" className="page-content active">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4 mb-2">
                                <label className="form-label_Ap">7. Whether the Establishment on Lease <span className="text-danger">*</span></label>
                                <div className="d-flex align-items-center gap-3">
                                    {['yes', 'no'].map((option) => (
                                        <div className="form-check" key={option}>
                                            <input className="form-check-input" type="radio" name="lease" id={`lease-${option}`} value={option} checked={formData.lease === option} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor={`lease-${option}`}>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-4 mb-2">
                                <label htmlFor="leasedFrom" className="form-label_Ap">Leased from Date</label>
                                <input type="date" className="form-control" id="leasedFrom" name="leasedFrom" value={formData.leasedFrom} onChange={handleChange} disabled={formData.lease !== 'yes'} />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label htmlFor="leasedTo" className="form-label_Ap">Leased to Date</label>
                                <input type="date" className="form-control" id="leasedTo" name="leasedTo" value={formData.leasedTo} onChange={handleChange} disabled={formData.lease !== 'yes'} />
                            </div>
                            <div className="col-12"><div className="form-divider"></div></div>
                            <div className="col-md-6">
                                <label htmlFor="naturePossession" className="form-label_Ap">7a. Nature of possession of premises</label>
                                <select className="form-select" id="naturePossession" name="naturePossession" value={formData.naturePossession} onChange={handleChange}>
                                    <option value="">Select</option> <option value="Owned">Owned</option> <option value="Leased">Leased</option> <option value="Rented">Rented</option>
                                    <option value="Consent">Consent</option> <option value="Shared">Shared</option> <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="possessionOther" className="form-label_Ap">If selected Others</label>
                                <input type="text" className="form-control" id="possessionOther" name="possessionOther" value={formData.possessionOther} onChange={handleChange} disabled={formData.naturePossession !== 'Others'} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="proofType" className="form-label_Ap">b. Proof of Principal Place</label>
                                <input type="text" className="form-control" id="proofType" name="proofType" value={formData.proofType} onChange={handleChange} placeholder="e.g. Electricity Bill (document type)" />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="buildingStatus" className="form-label_Ap">c. Building Status</label>
                                <input type="text" className="form-control" id="buildingStatus" name="buildingStatus" value={formData.buildingStatus} onChange={handleChange} placeholder="e.g., Owned, Rented" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label_Ap">Change in ownership</label>
                                <div className="d-flex align-items-center gap-3">
                                    {['yes', 'no'].map((option) => (
                                        <div className="form-check" key={option}>
                                            <input className="form-check-input" type="radio" name="changeOwnership" id={`change-${option}`} value={option} checked={formData.changeOwnership === option} onChange={handleChange}/>
                                            <label className="form-check-label" htmlFor={`change-${option}`}>{option.charAt(0).toUpperCase() + option.slice(1)}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-4"> {/* Adjusted for alignment */}
                                <label htmlFor="leasedFromRepeat" className="form-label_Ap">Leased from (If ownership changed)</label>
                                <input type="date" className="form-control" id="leasedFromRepeat" name="leasedFromRepeat" value={formData.leasedFromRepeat} onChange={handleChange} disabled={formData.changeOwnership !== 'yes'}/>
                            </div>
                            <div className="col-md-4"> {/* Adjusted for alignment */}
                                <label htmlFor="leasedToRepeat" className="form-label_Ap">Leased to (If ownership changed)</label>
                                <input type="date" className="form-control" id="leasedToRepeat" name="leasedToRepeat" value={formData.leasedToRepeat} onChange={handleChange} disabled={formData.changeOwnership !== 'yes'}/>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div id="page3Content" className="page-content active">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label_Ap">8. Option for Composition</label>
                                <div className="d-flex align-items-center gap-4">
                                    {['yes', 'no'].map(opt => (
                                    <div className="form-check" key={`comp-${opt}`}>
                                        <input className="form-check-input" type="radio" name="optionForComposition" id={`composition${opt}`} value={opt} checked={formData.optionForComposition === opt} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor={`composition${opt}`}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</label>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label_Ap">8a. Composition Declaration</label>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="compositionDeclarationChecked" name="compositionDeclarationChecked" checked={formData.compositionDeclarationChecked} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="compositionDeclarationChecked">
                                        I hereby declare that aforesaid business shall abide by the conditions and restrictions specified in the Act or Rules for opting to pay tax under the composition levy.
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6"> 
                                <label className="form-label_Ap">8b. Category of Registered Person</label>
                                {Object.keys(formData.categoryOfRegisteredPerson).map(key => {
                                    const labels = { manufacturerNonNotified: "1. Manufacturer of non-notified goods", supplierFoodDrinks: "2. Supplier of food and non-alcoholic drinks", anyOtherEligible: "3. Any other eligible Supplier" };
                                    return (
                                        <div className="form-check" key={key}>
                                            <input type="checkbox" className="form-check-input" id={`catReg-${key}`} name={key} checked={formData.categoryOfRegisteredPerson[key]} onChange={(e) => handleNestedChange('categoryOfRegisteredPerson', e.target.name, e.target.checked, 'checkbox')} />
                                            <label className="form-check-label" htmlFor={`catReg-${key}`}>{labels[key]}</label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="col-12"><div className="form-divider"></div></div>
                            <div className="col-12 mt-3">
                                <label className="form-label_Ap">9. Nature of Business Activity being carried out at above mentioned Premises (Please tick applicable)</label>
                                <div className="business-grid mt-3">
                                    {[
                                        { id: "factory", label: "Factory / Manufacturing" }, { id: "wholesaleBusiness", label: "Wholesale Business" },
                                        { id: "retailBusiness", label: "Retail Business" }, { id: "warehouse", label: "Warehouse / Depot" },
                                        { id: "boundedWhereHouse", label: "Bounded Warehouse"}, { id: "supplierOfServices", label: "Supplier of Services" },
                                        { id: "office", label: "Office / Sale Office" }, { id: "leasingBusiness", label: "Leasing Business" },
                                        { id: "receiptOfGoodsOrServices", label: "Recipient of Goods or Services" }, { id: "eouStpEhtp", label: "EOU / STP / EHTP" },
                                        { id: "worksContract", label: "Works Contract" }, { id: "export", label: "Export" },
                                        { id: "import", label: "Import" }, { id: "othersPleaseSpecify", label: "Others (Specify below)" }
                                    ].map(item => (
                                        <div className="form-check" key={item.id}>
                                            <input type="checkbox" className="form-check-input" id={`nature_${item.id}`} name={item.id} checked={formData.natureOfBusinessActivity[item.id]} onChange={(e) => handleNestedChange('natureOfBusinessActivity', e.target.name, e.target.checked, 'checkbox')} />
                                            <label className="form-check-label" htmlFor={`nature_${item.id}`}>{item.label}</label>
                                        </div>
                                    ))}
                                </div>
                                {formData.natureOfBusinessActivity.othersPleaseSpecify && (
                                    <div className="mt-2">
                                        <label htmlFor="natureOfBusinessActivity.othersValue" className="form-label_Ap">Specify Other Business Activity</label>
                                        <input type="text" className="form-control" id="natureOfBusinessActivity.othersValue" name="othersValue" value={formData.natureOfBusinessActivity.othersValue} onChange={(e) => handleNestedChange('natureOfBusinessActivity', e.target.name, e.target.value)} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div id="page4Content" className="page-content active">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-6 mb-3 mt-4">
                            <label htmlFor="primaryBusinessActivity" className="form-label_Ap">
                                9a. Primary Business Activity
                            </label>
                            <select
                                id="primaryBusinessActivity"
                                name="primaryBusinessActivity"
                                className="form-control"
                                value={formData.primaryBusinessActivity}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Business Activity --</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Trading">Trading</option>
                                <option value="Service">Service</option>
                                <option value="Others">Others</option>
                            </select>
                            </div>

                            <div className="col-md-6 mb-3 mt-4">
                                <label htmlFor="primaryBusinessSpecify" className="form-label_Ap">If Others selected, please specify</label>
                                <input type="text" className="form-control" id="primaryBusinessSpecify" name="primaryBusinessSpecify" placeholder="e.g., Manufacturing of BLDC motors" value={formData.primaryBusinessSpecify} onChange={handleChange} disabled={formData.primaryBusinessActivity?.toLowerCase() !== 'others'}/>
                            </div>
                            <div className="col-12"><div className="form-divider"></div></div>
                            <div className="col-md-4 mb-3 mt-4">
                                <label htmlFor="exactWork" className="form-label_Ap">9b. Exact Nature of Work (Extra Nature of Business)</label>
                                <input type="text" className="form-control" id="exactWork" name="exactWork" placeholder="e.g., Miscellaneous" value={formData.exactWork} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3 mt-4">
                            <label htmlFor="workSubCategory" className="form-label_Ap">
                                Work Sub-Category
                            </label>
                            <select
                                id="workSubCategory"
                                name="workSubCategory"
                                className="form-control"
                                value={formData.workSubCategory}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Sub-Category --</option>
                                <option value="Software Development">Software Development</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Legal Services">Legal Services</option>
                                <option value="Design">Design</option>
                                <option value="Others">Others</option>
                            </select>
                            </div>

                            <div className="col-md-4 mb-3 mt-4">
                                <label htmlFor="natureOfWorkBusiness" className="form-label_Ap">Nature of Work Business <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" id="natureOfWorkBusiness" name="natureOfWorkBusiness" placeholder="e.g., Category A" value={formData.natureOfWorkBusiness} onChange={handleChange} required />
                            </div>
                            <div className="col-12"><div className="form-divider"></div></div>
                            <div className="col-md-12 mt-4"><label className="form-label_Ap fw-semibold">10. Details of the Goods supplied by the Business</label></div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="hsnCode" className="form-label_Ap">HSN code (4 Digit)</label>
                                <input type="text" className="form-control" id="hsnCode" name="hsnCode" placeholder="e.g., 9985" value={formData.hsnCode} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="goodsDescription" className="form-label_Ap">Description of Goods</label>
                                <input type="text" className="form-control" id="goodsDescription" name="goodsDescription" placeholder="e.g., Electronic parts" value={formData.goodsDescription} onChange={handleChange} />
                            </div>
                            <div className="col-12"><div className="form-divider"></div></div>
                            <div className="col-md-12 mt-3"><label className="form-label_Ap fw-semibold">11. Details of Services supplied by the Business</label></div>
                            <div className="col-md-6">
                                <label htmlFor="sacCode" className="form-label_Ap">Service Accounting Code (6 Digit)</label>
                                <input type="text" id="sacCode" name="sacCode" className="form-control" placeholder="e.g., 998312" value={formData.sacCode} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="serviceDescription" className="form-label_Ap">Description of Services</label>
                                <input type="text" id="serviceDescription" name="serviceDescription" className="form-control" placeholder="e.g., Software Development" value={formData.serviceDescription} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );

          case 5:
    return (
        <div id="page5Content" className="page-content active">
            <div className="col-12 mb-3">
                <label className="form-label_Ap fw-semibold mt-4">12. Director / Primary Owners / Office Bearer Details</label>
                <p className="text-muted fst-italic small mb-2">
                    (Minimum number of directors / Primary Owners / Office Bearers to be entered for OPC shall be 1, 2 in case of private company, 3 in case of public limited company and 5 in case of Producer Company)
                </p>
                <div className="row g-2 align-items-center mb-3">
                    <div className="col-md-4">
                        <label htmlFor="numberOfDirectors" className="form-label_Ap">*Select the number of directors?</label>
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            id="numberOfDirectors"
                            name="numberOfDirectors"
                            className="form-control"
                            min={1}
                            value={directorCount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 1) setDirectorCount(val);
                                else if (e.target.value === '') setDirectorCount(1);
                            }}
                        />
                    </div>
                </div>

                <div className="col-12 mt-1 mb-3"><div className="form-divider"></div></div>

                <label className="form-label_Ap fw-semibold mt-4">12a. Enter Director details who is also an Authorized Signatory / Primary Owner / Office Bearer</label>
                <p className="text-muted fst-italic small mb-2">
                    (Search and select the name of the director)
                </p>

                {/* ✅ New: Director Details Block */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="form-label_Ap">DIN</label>
                        <input type="text" className="form-control" value="12345589" readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label_Ap">PAN</label>
                        <input type="text" className="form-control" placeholder="e.g., ABCDE1234F" readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label_Ap">Personal Mobile Number</label>
                        <input type="text" className="form-control" value="9962025367" readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label_Ap">Personal Email ID</label>
                        <input type="email" className="form-control" value="mlakshminathan@yahoo.co" readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">First Name</label>
                        <input type="text" className="form-control" value="Manickavasagam" readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">Middle Name</label>
                        <input type="text" className="form-control" value="Megha" readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">Last Name</label>
                        <input type="text" className="form-control" value="Lakshminathan" readOnly />
                    </div>
                      {/* Aadhaar Authentication Block */}
            <div className="row g-3">
                <div className="col-md-6 mb-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <label className="form-label_Ap m-0">
                            Do you wish to perform Aadhaar authentication for GSTN registration <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex align-items-center gap-4">
                            {['yes', 'no'].map(opt => (
                                <div className="form-check form-check-inline mb-0" key={`aadhaarAuth-${opt}`}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="aadhaarAuthGstn"
                                        id={`aadhaar${opt}`}
                                        value={opt}
                                        checked={formData.aadhaarAuthGstn === opt}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor={`aadhaar${opt}`}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">Photograph</label>
                        <input type="file" className="form-control" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">Proof of appointment of Authorized Signatory for GSTN</label>
                        <input type="file" className="form-control" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label_Ap">Specimen Signature of Authorized Signatory for EPFO</label>
                        <input type="file" className="form-control" />
                    </div>
                </div>

            </div>

          
        </div>
    );

            case 6: 
                return (
                    <div id="page6Content" className="page-content active">
                        <ul className="nav nav-tabs mb-3" role="tablist">
                            {[...Array(directorCount)].map((_, i) => (
                                <li className="nav-item" key={`tab-${i}`}>
                                    <button className={`nav-link ${i === 0 ? 'active' : ''}`} id={`tabDir${i + 1}`} data-bs-toggle="tab" data-bs-target={`#dirPane${i + 1}`} type="button" role="tab" aria-controls={`dirPane${i + 1}`} aria-selected={i === 0 ? 'true' : 'false'}>
                                        Director {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-content">
                            {formData.directors.slice(0, directorCount).map((director, i) => (
                                <div className={`tab-pane fade ${i === 0 ? 'show active' : ''}`} id={`dirPane${i + 1}`} role="tabpanel" aria-labelledby={`tabDir${i + 1}`} key={`pane-${i}`}>
                                    <h5 className="mb-3">Details for Director {i + 1}</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6 mt-2">
                                            <label className="form-label_Ap">DIN</label>
                                            <input type="text" className="form-control" placeholder="e.g., 12345678" value={director.din} onChange={(e) => handleDirectorChange(i, 'din', e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <label className="form-label_Ap">PAN</label>
                                            <input type="text" className="form-control" placeholder="e.g., ABCDE1234F" value={director.pan} onChange={(e) => handleDirectorChange(i, 'pan', e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mt-3">
                                            <label className="form-label_Ap">Personal Mobile Number</label>
                                            <input type="text" className="form-control" placeholder="mobile number" value={director.mobile} onChange={(e) => handleDirectorChange(i, 'mobile', e.target.value)} />
                                        </div>
                                        <div className="col-md-6 mt-3">
                                            <label className="form-label_Ap">Personal Email ID</label>
                                            <input type="email" className="form-control" placeholder="email" value={director.email} onChange={(e) => handleDirectorChange(i, 'email', e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mt-2">
                                            <label className="form-label_Ap">First Name</label>
                                            <input type="text" className="form-control" placeholder="first name" value={director.firstName} onChange={(e) => handleDirectorChange(i, 'firstName', e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mt-2">
                                            <label className="form-label_Ap">Middle Name</label>
                                            <input type="text" className="form-control" placeholder="middle name" value={director.middleName} onChange={(e) => handleDirectorChange(i, 'middleName', e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mt-2">
                                            <label className="form-label_Ap">Last Name</label>
                                            <input type="text" className="form-control" placeholder="last name" value={director.lastName} onChange={(e) => handleDirectorChange(i, 'lastName', e.target.value)} />
                                        </div>
                                        <div className="col-md-4 mt-3">
                                            <label className="form-label_Ap">Photograph</label>
                                            <input type="file" className="form-control" onChange={(e) => handleDirectorChange(i, 'photographFile', e.target.files[0]?.name || '', 'file')} />
                                            {director.photographFile && <small className="text-muted d-block mt-1">Selected: {typeof director.photographFile === 'string' ? director.photographFile : director.photographFile.name}</small>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div id="page7Content" className="page-content active">
                        <div className="row g-3 align-items-start">
                            <div className="col-md-12">
                                <label htmlFor="policeStation" className="form-label_Ap">13. Police Station</label>
                                <input type="text" id="policeStation" name="policeStation" className="form-control" placeholder="e.g., Gachibowli PS" value={formData.policeStation} onChange={handleChange} />
                            </div>
                            <div className="col-12 mt-3"><div className="form-divider"></div></div>
                        </div>
                        <div className="row g-3 align-items-start mt-1">
                            <div className="col-md-12"><label className="form-label_Ap fw-semibold">14. Employer’s Particulars</label></div>
                            <div className="col-md-6">
                                <label htmlFor="employerParticularsBranch" className="form-label_Ap">Appropriate Branch Office</label>
                                <input type="text" id="employerParticularsBranch" name="employerParticularsBranch" className="form-control" placeholder="e.g., Hyderabad Regional Office" value={formData.employerParticularsBranch} onChange={handleChange} />
                            </div>
                            <div className="col-md-6"> 
                                <label htmlFor="employerParticularsInspection" className="form-label_Ap">Inspection Division</label>
                                <input type="text" id="employerParticularsInspection" name="employerParticularsInspection" className="form-control" placeholder="e.g., Central Division" value={formData.employerParticularsInspection} onChange={handleChange} />
                            </div>
                            <div className="col-12 mt-3"><div className="form-divider"></div></div>
                        </div>
                        <div className="row g-3 align-items-center">
                            <div className="col-md-12 mt-3"><label className="form-label_Ap fw-semibold">15. Bank Particulars</label></div>
                            <div className="col-md-4 mt-1">
                                <label htmlFor="bankName" className="form-label_Ap">Bank Name</label>
                                <input type="text" className="form-control" id="bankName" name="bankName" placeholder="e.g., HDFC Bank" value={formData.bankName} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mt-1">
                                <label htmlFor="bankIdentityProofFile" className="form-label_Ap">Proof of Identity (PAN/Passport)</label>
                                <input type="file" className="form-control" id="bankIdentityProofFile" name="bankIdentityProofFile" onChange={(e) => handleChange({ target: { name: 'bankIdentityProofFile', value: e.target.files[0]?.name || ''}})} />
                                {formData.bankIdentityProofFile && <small className="text-muted d-block mt-1">Selected: {formData.bankIdentityProofFile}</small>}
                            </div>
                            <div className="col-md-4 mt-1">
                                <label htmlFor="bankAddressProofFile" className="form-label_Ap">Proof of Address (Utility Bill/Bank Statement)</label>
                                <input type="file" className="form-control" id="bankAddressProofFile" name="bankAddressProofFile" onChange={(e) => handleChange({ target: { name: 'bankAddressProofFile', value: e.target.files[0]?.name || ''}})} />
                                {formData.bankAddressProofFile && <small className="text-muted d-block mt-1">Selected: {formData.bankAddressProofFile}</small>}
                            </div>
                            <div className="col-12 mt-3"><div className="form-divider"></div></div>
                        </div>
                        <div className="row g-3 align-items-center mt-3">
                            <div className="col-md-4">
                                <label className="form-label_Ap d-block">16. Whether registration is required under shops and establishment</label>
                                {['yes', 'no'].map(opt => (
                                <div className="form-check form-check-inline" key={`shopEst-${opt}`}>
                                    <input className="form-check-input" type="radio" name="shopEstablishmentRequired" id={`shopEst${opt}`} value={opt} checked={formData.shopEstablishmentRequired === opt} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor={`shopEst${opt}`}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</label>
                                </div>
                                ))}
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="establishmentCategory" className="form-label_Ap">16a. Category of Establishment</label>
                                <input type="text" className="form-control" id="establishmentCategory" name="establishmentCategory" placeholder="e.g., IT/Services" value={formData.establishmentCategory} onChange={handleChange} disabled={formData.shopEstablishmentRequired !== 'yes'}/>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="natureOfBusinessShop" className="form-label_Ap">16b. Nature of Business</label>
                                <input type="text" className="form-control" id="natureOfBusinessShop" name="natureOfBusinessShop" placeholder="e.g., Software Development" value={formData.natureOfBusinessShop} onChange={handleChange} disabled={formData.shopEstablishmentRequired !== 'yes'}/>
                            </div>
                        </div>
                    </div>
                );

            case 8:
                return (
                    <div id="page8Content" className="page-content active" style={{ padding: '0 30px' }}>
                        <div className="input-section full-width mb-3 mt-0">
                            <label className="fw-semibold d-block">GST Declaration (By Authorized Signatory)</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="declarationGstChecked" name="declarationGstChecked" checked={formData.declarationGstChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationGstChecked">I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.</label>
                            </div>
                        </div>
                        <div className="input-section full-width mb-3">
                            <label className="fw-semibold d-block">ESIC Declaration (By Office Bearer)</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="declarationEsicChecked" name="declarationEsicChecked" checked={formData.declarationEsicChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationEsicChecked"><span className="text-danger">*</span>I hereby declare that the statement given above is correct to the best of my knowledge and belief.</label>
                            </div>
                        </div>
                        <div className="input-section full-width mb-3">
                            <label className="fw-semibold d-block">Professional Tax Declaration</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="declarationPtChecked" name="declarationPtChecked" checked={formData.declarationPtChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationPtChecked">The above information is true to the best of knowledge and belief.</label>
                            </div>
                        </div>
                        <div className="input-section full-width mb-3">
                            <label className="fw-semibold d-block">EPFO Declaration (By Primary Owner)</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="declarationEpfoChecked" name="declarationEpfoChecked" checked={formData.declarationEpfoChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationEpfoChecked"><span className="text-danger">*</span>I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.</label>
                            </div>
                        </div>
                        <div className="input-section full-width mb-3">
                            <label className="fw-semibold d-block">Bank Declaration (By Authorized Signatory)</label>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" id="declarationBankChecked" name="declarationBankChecked" checked={formData.declarationBankChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationBankChecked"><span className="text-danger">*</span>I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.</label>
                            </div>
                            <div className="d-flex align-items-center mb-2 flex-wrap">
                                <span className="me-2">I authorize</span>
                                <input type="text" className="form-control d-inline-block" style={{ width: '150px', minWidth: '100px' }} placeholder="Bank Name" name="declarationBankAuthorizeName" value={formData.declarationBankAuthorizeName} onChange={handleChange} />
                                <span className="ms-2">Bank and its officials to contact me/us on phone/ email/ SMS for any communication related to my/our account(s) across products and services either offered by ICICI bank or its group companies or associates.</span>
                            </div>
                            <p className="mb-1">I understand that the bank account number generated through this application can be different from the preferred bank account number entered by me.</p><p className="mb-0">I/we undertake to complete all documentary requirements and furnish all information as may be required by ICICI bank from time to time.</p>
                        </div>
                        <div className="input-section full-width mb-3">
                            <label className="fw-semibold d-block">Shops and Establishment Declaration</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="declarationShopChecked" name="declarationShopChecked" checked={formData.declarationShopChecked} onChange={handleChange} />
                                <label className="form-check-label" htmlFor="declarationShopChecked">I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.</label>
                            </div>
                        </div>
                        <div className="row g-3 align-items-center mt-4">
                            <div className="col-md-4">
                                <label className="form-label_Ap fw-semibold"><span className="text-danger">*</span>Place</label>
                                <input type="text" className="form-control" name="declarationPlace" value={formData.declarationPlace} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label_Ap fw-semibold"><span className="text-danger">*</span>Date</label>
                                <input type="date" className="form-control" name="declarationDate" value={formData.declarationDate} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label_Ap fw-semibold"><span className="text-danger">*</span>Designation</label>
                                <input type="text" className="form-control" name="declarationDesignation" value={formData.declarationDesignation} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mt-2">
                                <label className="form-label_Ap fw-semibold"><span className="text-danger">*</span>DIN/PAN</label>
                                <input type="text" className="form-control" name="declarationDinPan" value={formData.declarationDinPan} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mt-3">
                                <label className="form-label_Ap"><span className="text-danger">*</span>To be digitally signed by director</label>
                                <input type="file" className="form-control" name="digitalSignatureFile" onChange={(e) => handleChange({ target: { name: 'digitalSignatureFile', value: e.target.files[0]?.name || ''}})} />
                                {formData.digitalSignatureFile && <small className="text-muted d-block mt-1">Selected: {formData.digitalSignatureFile}</small>}
                            </div>
                        </div>
                        <p className="fst-italic small mt-2">(Authorized Signatory / Primary Owner / Office Bearer signing the AGILE-PRO-S form should be same as the one signing the SPICe+ form)</p>
                    </div>
                );
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <CardLayout
            title="AGILE PRO-S"
            currentCard={currentCard}
            totalCards={totalCards}
            onNext={handleNext} 
            onPrev={handlePrev}
            onPageChange={handlePageChange}
            onFinalSubmit={handleFinalSubmit}
            isLoading={isLoading} 
            onFillExampleData={() => setFormData(prev => ({...initialFormData, ...prev, ...exampleData}))} 
        >
            {renderCardContent()}
        </CardLayout>
    );
}