import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LandingPage.css'; // Assuming CSS is in this file
import { useCompanyType } from '../../contexts/CompanyTypeContext';   
import { useAuth } from '../../contexts/AuthContext';

const companyData = {
    proprietary: {
        name: "Proprietorship",
        structure: "Not a separate legal entity",
        members: "1 owner",
        liability: "Unlimited",
        tax: "Individual slab rates",
        governing: "No specific Act",
        registration: "Easy (Udyam/MSME, GST etc.)",
        compliance: "Low",
        suitable: "Freelancers, Local Businesses",
        Transferability: "Not transferable",
        Annual_Filing: "Not mandatory",
        Bank_Loan: "Low",
        Survivability: "Ends with owner"
    },
    opc: {
        name: "One Person Company",
        structure: "Companies Act, 2013",
        members: "1 shareholder/director",
        liability: "Limited to shareholder",
        tax: "22% or 15% (new mfg) + surcharge",
        governing: "Companies Act, 2013",
        registration: "Moderate (~10–15 days)",
        compliance: "High (ROC, Audits, Meetings)",
        suitable: "Solo Founders",
        Transferability: "Restricted",
        Annual_Filing: "Mandatory with ROC",
        Bank_Loan: "Medium",
        Survivability: "Continues with nominee"
    },
    partnership: {
        name: "Partnership Firm",
        structure: "Partnership Act, 1932",
        members: "Min 2 partners",
        liability: "Unlimited",
        tax: "Firm: 30%, Partners: Slab Rate",
        governing: "Partnership Act, 1932",
        registration: "Easy (~2–3 days, optional)",
        compliance: "Low (No ROC)",
        suitable: "Small, Informal Businesses",
        Transferability: "Difficult",
        Annual_Filing: "Not mandatory",
        Bank_Loan: "Low to medium",
        Survivability: "May dissolve"   
    },
    llp: {
        name: "Limited Liability Partnership (LLP)",
        structure: "LLP Act, 2008",
        members: "Min 2 partners – no max",
        liability: "Limited to contribution",
        tax: "30% + Surcharge",
        governing: "LLP Act, 2008",
        registration: "Moderate (~10–15 days)",
        compliance: "Moderate (ROC Filing)",
        suitable: "Services, Professionals, Small Businesses",
        Transferability: "Allowed via agreement",
        Annual_Filing: "Mandatory ROC filing",
        Bank_Loan: "Medium to High",
        Survivability: "Continues as per agreement"
    },
    pvtltd: {
        name: "Private Limited (Pvt. Ltd.)",
        structure: "Companies Act, 2013",
        members: "Min 2 – Max 200 shareholders",
        liability: "Limited to shareholding",
        tax: "22% or 15% (new mfg) + Surcharge",
        governing: "Companies Act, 2013",
        registration: "Moderate (~10–15 days)",
        compliance: "High (ROC, Audits, Meetings)",
        suitable: "Startups, Investors, Scalable",
        Transferability: "Easy with share transfer",
        Annual_Filing: "Mandatory ROC + Audit",
        Bank_Loan: "High",
        Survivability: "Strong continuity"
    },
    section8: {
        name: "Section 8 Company",
        structure: "Companies Act, 2013",
        members: "Min 2 – No max",
        liability: "Limited",
        tax: "Exempt (Profit reinvested)",
        governing: "Companies Act, 2013",
        registration: "Moderate (~15–20 days)",
        compliance: "High (Like Pvt Ltd)",
        suitable: "NGOs needing 80G/12A/FCRA",
        Transferability: "Not allowed",
        Annual_Filing: "ROC, Audit, Income Tax",
        Bank_Loan: "Medium to High",
        Survivability: "Strong continuity"
    },
    trust: {
        name: "Trust",
        structure: "Indian Trusts Act, 1882 / State Trust Acts",
        members: "Min 2 Trustees",
        liability: "Limited (Public Charitable)",
        tax: "Exempt (if registered as charity)",
        governing: "Indian Trusts Act, 1882 / State Acts",
        registration: "Varies (~2–4 weeks)",
        compliance: "Low to Medium (Activity based)",
        suitable: "Charities, NGOs, Religious Orgs",
        Transferability: "Not allowed",
        Annual_Filing: "Based on trust deed",
        Bank_Loan: "Medium",
        Survivability: "Continues as per deed"
    },
    society: {
        name: "Society",
        structure: "Societies Registration Act, 1860",
        members: "Min 7 (Varies by State)",
        liability: "Limited (Members)",
        tax: "Exempt (Not-for-profit)",
        governing: "Societies Registration Act, 1860",
        registration: "Moderate (~20–30 days)",
        compliance: "Medium (Annual Reports)",
        suitable: "Social, Educational, Cultural Orgs",
        Transferability: "Not allowed",
        Annual_Filing: "As per by-laws",
        Bank_Loan: "Medium",
        Survivability: "Continues with governing body"
    }
};
const forProfitCompanies = [
    { type: 'proprietary', name: companyData.proprietary.name, label: 'Proprietary Firm' },
    { type: 'opc', name: companyData.opc.name, label: 'One Person Company' },
    { type: 'partnership', name: companyData.partnership.name, label: 'Partnership Firm' },
    { type: 'llp', name: companyData.llp.name, label: '<span>Limited Liability</span><span>Partnership (LLP)</span>' },
    { type: 'pvtltd', name: companyData.pvtltd.name, label: 'Private Limited Company' },
];
const orgTypeToInternalType = {
    "Proprietorship": "proprietary",
    "One Person Company": "opc",
    "Partnership Firm": "partnership",
    "Limited Liability Partnership": "llp",
    "Private Limited Company": "pvtltd",
    "Section 8 Company": "section8",
    "Trust": "trust",
    "Society": "society"
};

const notForProfitCompanies = [
    { type: 'trust', name: companyData.trust.name, label: 'Trust' },
    { type: 'society', name: companyData.society.name, label: 'Society' },
    { type: 'section8', name: companyData.section8.name, label: 'Section 8 Company' },
];
const comparisonFeatures = [
    { key: 'structure', label: 'Legal Status' },
    { key: 'liability', label: 'Liability' },
    { key: 'members', label: 'Members/Partners Required' },
    { key: 'tax', label: 'Taxation' },
    { key: 'governing', label: 'Governing Law' },
    { key: 'registration', label: 'Registration Time & Ease' },
    { key: 'compliance', label: 'Compliance Requirements' },
    { key: 'suitable', label: 'Suitable For' },
    { key: 'Transferability', label: 'Transferability of Ownership' },
    { key: 'Annual_Filing', label: 'Annual Filing Requirement' },
    { key: 'Bank_Loan', label: 'Bank Loan Preference' },
    { key: 'Survivability', label: 'Survivability' }
];


// --- CompanyOptionCard Component (Unchanged) ---
const CompanyOptionCard = ({ company, isSelectedPrimary, isSelectedSecondary, onSelect }) => {
    const { type, label, name } = company;
    const isSelected = isSelectedPrimary || isSelectedSecondary;
    const handleSelect = () => {
        onSelect(type, name); // Pass only type and name now
    };
    const cardClasses = `company-option-card ${isSelectedPrimary ? 'selected-primary' : ''} ${isSelectedSecondary ? 'selected-secondary' : ''}`;




    return (
        <div
            className={cardClasses}
            onClick={handleSelect}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect()}
        >
            <div className="custom-checkbox">
                {isSelected && <i className="fas fa-check"></i>}
            </div>
            <label dangerouslySetInnerHTML={{ __html: label }} />
        </div>
    );
};

// --- ComparisonOverlay Component (Unchanged) ---
const ComparisonOverlay = ({ selectedCompanies, onClose, isVisible }) => {
    if (!isVisible || selectedCompanies.length !== 2) return null;

    const company1 = selectedCompanies[0];
    const company2 = selectedCompanies[1];
    const data1 = companyData[company1.type] || {};
    const data2 = companyData[company2.type] || {};

    return (
        <div className={`comparison-overlay ${isVisible ? 'active' : ''}`} id="comparison-overlay">
            <div className="comparison-header">
                <h3 className="comparison-title">Company Type Comparison</h3>
                <button className="close-btn" id="close-comparison" onClick={onClose} aria-label="Close Comparison">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <div className="table-responsive comparison-table-container">
                <table className="comparison-table" id="comparison-table">
                    <thead>
                        <tr>
                            <th className="feature-column">Features</th>
                            <th className="primary-column">{company1.name}</th>
                            <th className="secondary-column">{company2.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonFeatures.map(feature => (
                            <tr key={feature.key}>
                                <th>{feature.label}</th>
                                <td>{data1[feature.key] || '-'}</td>
                                <td>{data2[feature.key] || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- CompanySelection Component ---
const CompanySelection = () => {
    const navigate = useNavigate();
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [showComparisonOverlay, setShowComparisonOverlay] = useState(false);
    const location = useLocation();
    const { setCompanyType } = useCompanyType();    
    const [savedOrgType, setSavedOrgType] = useState(null);
    const [pendingSelection, setPendingSelection] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { token, orgId } = useAuth();

const handleSelectCompany = (type, name) => {
    const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
    const isChangingSaved = (
        savedOrgType &&
        selectedCompanies.length === 1 &&
        selectedCompanies[0].type !== type
    );

    // ⛔ EXIT EARLY IF CHANGING SAVED SELECTION — SHOW MODAL INSTEAD
    if (isChangingSaved) {
        setPendingSelection({ type, name });
        setShowConfirmationModal(true);
        return;
    }

    // ✅ Proceed with selection update
    setSelectedCompanies(prevSelected => {
        let newSelected = [...prevSelected];
        const selectedIndex = newSelected.findIndex(c => c.type === type);
        const isAlreadySelected = selectedIndex !== -1;

        if (isAlreadySelected) {
            newSelected = newSelected.filter(c => c.type !== type);
        } else {
            if (!isMobile) {
                if (newSelected.length === 0) {
                    newSelected.push({ type, name });
                } else if (newSelected.length === 1) {
                    newSelected.push({ type, name });
                } else {
                    newSelected = [newSelected[0], { type, name }];
                }
            } else {
                if (newSelected.length >= 2) {
                    newSelected.shift();
                }
                newSelected.push({ type, name });
            }
        }

        return newSelected;
    });
};
const updateSelection = (type, name, isMobile) => {
    setSelectedCompanies(prev => {
        let newSelected = [...prev];
        const alreadyIndex = newSelected.findIndex(c => c.type === type);

        if (alreadyIndex !== -1) {
            return newSelected.filter(c => c.type !== type); // Deselect
        }

        if (!isMobile) {
            if (newSelected.length < 2) {
                return [...newSelected, { type, name }];
            } else {
                return [newSelected[0], { type, name }];
            }
        } else {
            if (newSelected.length >= 2) newSelected.shift();
            return [...newSelected, { type, name }];
        }
    });
};
const handleModalConfirm = () => {
    if (pendingSelection) {
        // Always reset to only the newly selected type
        setSelectedCompanies([{ type: pendingSelection.type, name: pendingSelection.name }]);
    }

    setShowConfirmationModal(false);
    setPendingSelection(null);
};


const handleModalCancel = () => {
    setShowConfirmationModal(false);
    setPendingSelection(null);
};

    
     // This is a number, API expects a string for org_id

    useEffect(() => {
        const fetchOrgType = async () => {
            try {
                const response = await fetch('http://3.111.226.182/factops/coform/getOrgType', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        org_id: String(orgId) // Ensure org_id is sent as a string
                    })
                });
        
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ detail: "Failed to parse error response" }));
                    throw new Error(`API error fetching org_type, status: ${response.status}, message: ${errorData.detail || response.statusText}`);
                }
        
                const data = await response.json();
                if (data.status === 'success' && data.org_type) {
                    console.log('Landing Page: org_type fetched:', data.org_type);
        
                    const internalType = orgTypeToInternalType[data.org_type];
                     setSavedOrgType(internalType);
                    if (internalType) {
                        const matchedCompany = [...forProfitCompanies, ...notForProfitCompanies]
                            .find(c => c.type === internalType);
        
                        if (matchedCompany) {
                            setSelectedCompanies([{ type: matchedCompany.type, name: matchedCompany.name }]);
                        } else {
                            console.warn(`Landing Page: No matching company found for internal type: ${internalType} (from API org_type: ${data.org_type})`);
                        }
                    } else {
                         console.warn(`Landing Page: No internal type mapping found for API org_type: ${data.org_type}`);
                    }
                } else if (data.status !== 'success') {
                    console.warn('Landing Page: API indicated not success for getOrgType:', data.message || data.detail);
                }
            } catch (error) {
                console.error('Landing Page: Error fetching org_type:', error);
            }
        };
        fetchOrgType();
    }, []); // Removed token and orgId from dependencies as they are constants in this scope

    useEffect(() => {
        setShowComparisonOverlay(selectedCompanies.length === 2);
    }, [selectedCompanies]);
    
    const handleCloseComparison = () => {
        const isMobile = window.matchMedia('(max-width: 991.98px)').matches;

        if (isMobile && selectedCompanies.length === 2) {
            setSelectedCompanies(prevSelected => [prevSelected[0]]);
        }
        setShowComparisonOverlay(false);
    };

    // --- MODIFIED handleProceed function ---
    const handleProceed = async () => {
        if (selectedCompanies.length === 1) {
            const selectedCompany = selectedCompanies[0]; // e.g., { type: 'pvtltd', name: 'Private Limited (Pvt. Ltd.)' }

            // Find the API-friendly name (the key in orgTypeToInternalType that matches selectedCompany.type)
            let apiOrgTypeName = null;
            for (const [key, value] of Object.entries(orgTypeToInternalType)) {
                if (value === selectedCompany.type) {
                    apiOrgTypeName = key;
                    break;
                }
            }

            if (!apiOrgTypeName) {
                console.error(`Landing Page: Could not find API org type name for internal type: ${selectedCompany.type}`);
                // It's good practice to inform the user, e.g., via alert or a more sophisticated notification
                alert(`Error: Could not determine the correct organization type name for "${selectedCompany.name}" for API submission. Please contact support.`);
                return; // Stop if no matching API type name is found
            }

            console.log(`Landing Page: Proceeding with selected company: ${selectedCompany.name} (Internal Type: ${selectedCompany.type}, API Type: ${apiOrgTypeName})`);

            try {
                const response = await fetch('http://3.111.226.182/factops/coform/assignOrgType', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        org_id: String(orgId), // API expects org_id as a string
                        type_of_org: apiOrgTypeName // Use the name expected by the API (e.g., "Private Limited Company")
                    })
                });

                const responseData = await response.json(); // Attempt to parse JSON for more detailed error messages

                if (!response.ok) {
                    // Log detailed error and show a user-friendly message
                    console.error('Landing Page: API error assigning org_type. Status:', response.status, 'Response:', responseData);
                    alert(`Error assigning organization type: ${responseData.message || responseData.detail || 'An unknown error occurred with the API.'} (Status: ${response.status})`);
                    return; // Stop further execution if API call fails
                }

                console.log('Landing Page: org_type assigned successfully:', responseData);

                // If API call is successful, then proceed with existing logic
                setCompanyType(selectedCompany); // Set globally { type, name (e.g. "Private Limited (Pvt. Ltd.)")}
                navigate('/fact.inc/NameReservation');    // Continue navigation

            } catch (error) {
                // Catch network errors or issues with fetch/JSON parsing itself
                console.error('Landing Page: Network or parsing error when assigning org_type:', error);
                alert(`An error occurred while communicating with the server: ${error.message}. Please check your network connection or try again later.`);
                // Don't proceed if there's an error
                return;
            }
        } else {
            // This case should ideally not be reachable if the button is disabled correctly
            console.warn("Landing Page: Proceed button clicked when selectedCompanies.length !== 1. This should not happen.");
        }
    };
    // --- END OF MODIFIED handleProceed function ---
    

     useEffect(() => {
        function normalizeZoom() {
            const zoom = window.devicePixelRatio;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const app = document.getElementById('app-container');
            if (!app) return;
            const isMobile = width <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

            if (isMobile) {
                app.style.transform = 'none';
                app.style.width = '100%';
                app.style.height = 'auto';
                 document.body.style.overflow = 'auto';
                 document.documentElement.style.overflow = 'auto';
                return;
            } else {
                 document.body.style.overflow = '';
                 document.documentElement.style.overflow = '';
            }

            if (zoom > 1) {
                const scale = 1 / zoom;
                app.style.transform = `scale(${scale})`;
                app.style.transformOrigin = 'top left';
                app.style.width = `${zoom * 100}vw`;
                app.style.height = `${zoom * 100}vh`;
            } else if (width <= 1366 && height <= 768) {
                const scale = 0.8;
                app.style.transform = `scale(${scale})`;
                app.style.transformOrigin = 'top left';
                app.style.width = `${100 / scale}vw`;
                app.style.height = `${100 / scale}vh`;
            } else {
                app.style.transform = 'none';
                app.style.width = '100%';
                app.style.height = '100vh';
            }
        }

        normalizeZoom();
        window.addEventListener('resize', normalizeZoom);
        window.addEventListener('orientationchange', normalizeZoom);

        return () => {
            window.removeEventListener('resize', normalizeZoom);
            window.removeEventListener('orientationchange', normalizeZoom);
            const app = document.getElementById('app-container');
            if(app) {
                app.style.transform = '';
                app.style.transformOrigin = '';
                app.style.width = '';
                app.style.height = '';
            }
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [location.pathname]);


    const getSelectionStatus = (type) => {
        const index = selectedCompanies.findIndex(c => c.type === type);
        return {
            isSelectedPrimary: index === 0,
            isSelectedSecondary: index === 1,
        };
    };

    const isProceedDisabled = selectedCompanies.length !== 1;
 
    return (
        <div id="app-container">
            <div className="left-card">
                <div className="selection-column">
                     <div className="selection-header mb-3">
                        <h2>Which type of company do you want to form?</h2>
                        <div className="info-note">
                            <i className="fas fa-info-circle"></i>
                            <span>
                                Not sure which type is right for you?
                                <span className="wrap-text">
                                    Select the types, see the comparison on the right, & then decide.
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="category-card for-profit">
                        <h6>For-Profit Companies</h6>
                        <div className="options-grid">
                            {forProfitCompanies.map(company => (
                                <CompanyOptionCard
                                    key={company.type}
                                    company={company}
                                    {...getSelectionStatus(company.type)}
                                    onSelect={handleSelectCompany}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="category-card not-for-profit">
                        <h6>Not-For-Profit Companies</h6>
                        <div className="options-grid">
                            {notForProfitCompanies.map(company => (
                                <CompanyOptionCard
                                    key={company.type}
                                    company={company}
                                    {...getSelectionStatus(company.type)}
                                    onSelect={handleSelectCompany}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="action-area">
                        <button
                            className="proceed-btn-new"
                            id="proceed-btn"
                            onClick={handleProceed} // Calls the modified async function
                            disabled={isProceedDisabled}
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
            <div className="right-card">
                 {!showComparisonOverlay && (
                    <div className="image-overlay-content">
                        <div className="image-logo">
                            <span className="logo-co">FACT.</span><span className="logo-form">Inc</span>
                        </div>
                        <p className="image-tagline">fast-track your company formation!</p>
                    </div>
                 )}
                 <ComparisonOverlay
                    selectedCompanies={selectedCompanies}
                    onClose={handleCloseComparison}
                    isVisible={showComparisonOverlay}
                />
            </div>
{showConfirmationModal && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <h3>Change Selected Type?</h3>

      <div className="modal-body">
        <p className="modal-subtitle">You’ve already selected:</p>
        <div className="modal-company old-company">{selectedCompanies[0]?.name}</div>

        <p className="modal-subtitle">Do you want to switch to:</p>
        <div className="modal-company new-company">{pendingSelection?.name}</div>
      </div>

      <div className="modal-actions">
        <button className="confirm-btn" onClick={handleModalConfirm}>Yes, switch</button>
        <button className="cancel-btn" onClick={handleModalCancel}>Cancel</button>
      </div>
    </div>
  </div>
)}


        </div>
    );
};
export default CompanySelection;