import React, { useState, useEffect } from 'react';
import CardLayout from '../../components/PageCard/PageCard';
import './Spice_partb.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';


const API_URL = 'http://3.111.226.182/factops/coform/fill_inc';

const initialApiTemplateStructure = { /* ... as defined before ... */
    "weather_AOA_entrenched": "", "number_of_articles": 0, "article_details": {},
    "company": {"have_share_capitals": null},
    "capital_structure_of_the_company": {
        "unclassified_authorized_share_capital": 0,
        "equity_share_capital": {"number_of_classes": 0, "description": {}},
        "preferences_share_capital": {"number_of_classes": 0, "description": {}},
        "member_details": {"maximum_number_of_members": "", "maximum_number_of_members_excluding_proposed_employees": "", "number_of_members": "", "number_of_members_excluding_proposed_employees": ""}
    },
    "address_of_company": {"correspondence_address": {"line1": "", "line2": "", "pincode": "", "mobile": "", "phone": "", "fax": "", "state_or_ut": "", "district": "", "city": "", "area_or_locality": "", "email": ""}, "is_correspondence_address_same_as_registered_address": null, "registrar": ""},
    "subscrier_and_director_counts": {"total_number_of_first_subscribers": {"having_valid_din": 0, "not_having_valid_din": 0}, "number_of_non_individual_first_subscribers": {"having_valid_din": 0, "not_having_valid_din": 0}, "number_of_first_subscribers_cum_directors": {"having_valid_din": 0, "not_having_valid_din": 0}, "total_number_of_directors": {"having_valid_din": 0, "not_having_valid_din": 0}},
    "subscribers": {
        "6A_non_individual_subscribers": {}, 
        "6B_individual_with_DIN": {},      
        "6C_individual_without_DIN": {}    
    },
    "subscribers_cum_directors": {
        "7A_Subscriber_Cum_Director_With_DIN": [], 
        "7B_Subscriber_Without_DIN": [],          
        "7C_Director_With_DIN": [],               
        "7D_Director_Without_DIN": []             
    }
};
const deepClone = (obj) => { /* ... */ 
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);
    if (Array.isArray(obj)) {
        const clonedArray = [];
        for (let i = 0; i < obj.length; i++) clonedArray[i] = deepClone(obj[i]);
        return clonedArray;
    }
    const clonedObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) clonedObj[key] = deepClone(obj[key]);
    }
    return clonedObj;
};


// --- DETAILED INITIAL STRUCTURES FOR DYNAMIC LISTS (as defined above) ---
const initialNonIndividualSubscriber = { /* ... */ 
  category: '', cin: '', entityName: '', regAddrL1: '', regAddrL2: '', regAddrCountry: '', regAddrPin: '', regAddrLocality: '',
  regAddrCity: '', regAddrDistrict: '', regAddrState: '', regAddrPhone: '', regAddrFax: '', regAddrEmail: '',
  authPersonDin: '', authPersonFirstName: '', authPersonMiddleName: '', authPersonSurname: '',
  authPersonFatherFirstName: '', authPersonFatherMiddleName: '', authPersonFatherSurname: '',
  authPersonGender: '', authPersonDob: '', authPersonNationality: '', authPersonPan: '',
  authPersonPob: '', authPersonOccupationType: '', authPersonOccupationArea: '', authPersonOccupationOther: '',
  authPersonEducation: '', authPersonEducationOther: '',
  authPersonPresAddrL1: '', authPersonPresAddrL2: '', authPersonPresAddrCountry: '', authPersonPresAddrPin: '',
  authPersonPresAddrLocality: '', authPersonPresAddrCity: '', authPersonPresAddrDistrict: '', authPersonPresAddrState: '',
  authPersonPresAddrPhone: '', authPersonPresAddrFax: '', authPersonPresAddrEmail: '',
  authPersonIdProofType: '', authPersonIdProofNo: '', authPersonResProofType: '', authPersonResProofNo: '',
  authPersonIdProofFile: null, authPersonResProofFile: null, 
  totalSubscribedShareCapital: '',
  equityShares: [{ class_of_shares: 'Equity', subscribed_capital: '', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }], 
  preferenceShares: [{ class_of_shares: 'Preference', subscribed_capital: '', number_of_preference_shares: '', nominal_amount_per_share: '', total_amount: '' }], 
  forexRequired: 'not_required', 
};
const initialIndividualSubscriberDIN = { /* ... */ 
  din: '', name: '', total_subscribed_share_capital_in_inr: '',
  equityShares: [{ class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }],
  preferenceShares: [{ class_of_shares: 'Preference', number_of_preference_shares: '', nominal_amount_per_share: '', total_amount: '' }],
  forexRequired: 'not_required',
};
const initialIndividualSubscriberNoDIN = { /* ... */ 
  firstName: '', middleName: '', surname: '', fatherFirstName: '', fatherMiddleName: '', fatherSurname: '',
  gender: '', dob: '', nationality: '', pob: '', occupationType: '', occupationArea: '', occupationOther: '',
  education: '', educationOther: '', pan: '', email: '',
  permAddrL1: '', permAddrL2: '', permAddrCountry: '', permAddrPin: '', permAddrLocality: '',
  permAddrCity: '', permAddrDistrict: '', permAddrState: '', permAddrPhone: '',
  isSameAsPermanent: true,
  presAddrL1: '', presAddrL2: '', presAddrCountry: '', presAddrPin: '', presAddrLocality: '',
  presAddrCity: '', presAddrDistrict: '', presAddrState: '', presAddrPhone: '',
  durationOfStayYears: '', durationOfStayMonths: '',
  prevAddrL1: '', 
  idProofType: '', idProofNo: '', idProofFile: null,
  resProofType: '', resProofNo: '', resProofFile: null,
  totalSubscribedShareCapital: '',
  equityShares: [{ class_of_shares: 'Equity', subscribed_capital: '', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }],
  preferenceShares: [{ class_of_shares: 'Preference', subscribed_capital: '', number_of_preference_shares: '', nominal_amount_per_share: '', total_amount: '' }],
  forexRequired: 'not_required',
};
const initialSubscriberDirectorDIN = { /* ... */ 
  din: '', name: '', designation: '', category: '', role: '', 
  email_id: '', nominee_company_name: '', total_subscribed_share_capital_inr: '',
  equityShares: [{ class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }],
  preferenceShares: [], 
  interests: [{ cin_llpin_fcrn_registration_number: '', name: '', address: '', nature_of_interest: '', designation_other_specify_if_needed:'', percentage_of_shareholding: '0', amount_in_inr: '' }],
  forexRequired: 'not_required',
};
const initialSubscriberDirectorNoDIN = { /* ... */ 
    firstName: '', middleName: '', surname: '', fathers_first_name: '', fathers_middle_name: '', fathers_surname: '',
    gender: '', dob: '', nationality: '', place_of_birth: '', is_citizen_of_india: 'Yes', is_resident_in_india: 'Yes',
    occupation_type: '', occupation_area: '', educational_qualification: '', pan: '',
    designation: '', category: '', is_chairman: false, is_executive_director: false, is_non_executive_director: false,
    nominee_company_name: '', mobile_number: '', email_id: '',
    permanent_address: { line_1: '', line_2: '', country: '', pin_code: '', area_locality: '', city: '', district: '', state_ut: '', phone: '' },
    is_present_address_same_as_permanent: true,
    present_address: { line_1: '', line_2: '', country: '', pin_code: '', area_locality: '', city: '', district: '', state_ut: '', phone: '' },
    duration_of_stay_at_present_address: { years: '', months: '' },
    identity_proof_type: '', identity_proof_number: '', residential_proof_type: '', residential_proof_number: '',
    idProofFile: null, resProofFile: null,
    total_subscribed_share_capital: '',
    equityShares: [{ class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }],
    preferenceShares: [],
    interests: [{ cin_llpin_fcrn_registration_number: '', name: '', address: '', nature_of_interest: '', designation_other_specify_if_needed: '', percentage_of_shareholding: '0', amount: '' }],
    forexRequired: 'not_required',
};
const initialDirectorDIN = { /* ... */ 
    director_identification_number_din: '', name: '', designation: '', category: '',
    chairman: false, executive_director: false, non_executive_director: false,
    nominee_company_name: '', email_id: '',
    interests: [{ cin_llpin_fcrn_registration_number: '', name: '', address: '', nature_of_interest: '', designation_other_specify: '', percentage_of_shareholding: '0', amount: '' }],
};
const initialDirectorNoDIN = { /* ... */ 
    firstName: '', middleName: '', surname: '', fathers_first_name: '', fathers_middle_name: '', fathers_surname: '',
    gender: '', dob: '', nationality: '', place_of_birth: '', is_citizen_of_india: false, is_resident_in_india: false,
    occupation_type: '', area_of_occupation: '', educational_qualification: '', income_tax_pan: '',
    designation: '', category: '', is_chairman: false, is_executive_director: false, is_non_executive_director: false,
    nominee_company_name: '', mobile_no: '', email_id: '',
    permanent_address: { line_1: '', line_2: '', country: '', pin_code: '', area_locality: '', city: '', district: '', state_ut: '', phone: '' },
    present_address: { line_1: '', line_2: '', country: '', pin_code: '', area_locality: '', city: '', district: '', state_ut: '', phone: '' },
    is_present_address_same_as_permanent: true, 
    duration_of_stay_at_present_address: { years: '', months: '' }, 
    identity_proof: '', identity_proof_no: '', residential_proof: '', residential_proof_no: '',
    proof_of_identity_file: null, proof_of_residential_address_file: null,
    interests: [{ cin_llpin_fcrn_registration_number: '', name: '', address: '', nature_of_interest: '', designation_other_specify: '', percentage_of_shareholding: '0', amount: '' }],
};


export default function SpicePartB() {
  const totalCards = 19; // This might become dynamic later
  const [currentCard, setCurrentCard] = useState(1);
  const navigate = useNavigate();
  const { token, orgId } = useAuth();
  

  const [formData, setFormData] = useState({ /* ... as defined before ... */
    aoaIsEntrenched: null, entrenchedArticlesCount: '', entrenchedArticles: [{ articleNumber: '', description: '' }], companyType: '', authCapitalTotal: '', authCapitalClassified: '', subCapitalTotal: '', authCapitalUnclassified: '',
    maxMembers: '', maxMembersExcl: '', numMembers: '', numMembersExclEmp: '',
    corrAddrLine1: '', corrAddrLine2: '', corrAddrPincode: '', corrAddrMobile: '', corrAddrPhone: '', corrAddrFax: '', corrAddrState: '', corrAddrDistrict: '', corrAddrCity: '', corrAddrLocality: '', corrAddrEmail: '',
    addrSameAsReg: null, regOfficeLongitude: '', regOfficeLatitude: '', attachOfficeProof: null, attachUtilityBill: null, rocOffice: '',
    opc_subscriber_name: '', opc_company_name: '', opc_nominee_fname: '', opc_nominee_mname: '', opc_nominee_lname: '',
    stamp_duty_state: '', stamp_duty_electronic: 'Yes', stamp_duty_form: '', stamp_duty_moa: '', stamp_duty_aoa: '', stamp_paid_total_form: '', stamp_paid_total_moa: '', stamp_paid_total_aoa: '', stamp_paid_total_others: '',
    pan_area_code: '', pan_ao_type: '', pan_range_code: '', pan_ao_no: '', tan_area_code: '', tan_ao_type: '', tan_range_code: '', tan_ao_no: '', incomeSources: { business: false, capitalGains: false, houseProperty: false, other: false, none: false }, business_prof_code: '',
    attach_moa: null, attach_aoa: null, attach_subscriber_decl: null, attach_foreign_coi: null, attach_promoter_res: null, attach_director_interest: null, attach_optional: null,
    declaration_rule_1: false, declaration_rule_2: false, declarant_name: '', declaration_auth_promoter: false, border_country_consent: 'No', din_pan_passport_no: '',
    prof_cert_name: '', prof_cert_institute: '', prof_cert_office_addr: '', prof_cert_checkbox_i: false, professional_type: 'ca', membership_status: 'associate', membership_number: '', practice_certificate_number: '', prof_income_tax_pan: '', director_sign_name_card40: '', director_sign_din_pan: '',
    equityClassesCount: 1, equityShareClasses: [{ authNum: '', subNum: '', authNominal: '', subNominal: '' }], prefClassesCount: 0, prefShareClasses: [{ authNum: '', subNum: '', authNominal: '', subNominal: '' }],
  });

  const [aValidDinCount, setAValidDinCount] = useState(0); /* ... */
  const [aNoDinCount, setANoDinCount] = useState(0);
  const [bValidDinCount, setBValidDinCount] = useState(0);
  const [bNoDinCount, setBNoDinCount] = useState(0);
  const [cValidDinCount, setCValidDinCount] = useState(0);
  const [cNoDinCount, setCNoDinCount] = useState(0);
  const [dValidDinCount, setDValidDinCount] = useState(0);
  const [dNoDinCount, setDNoDinCount] = useState(0);

  const [nonIndividualSubscribers, setNonIndividualSubscribers] = useState([]);
  const [nonIndTab, setNonIndTab] = useState(0);
  // Note: equityClasses & prefClasses are used locally in Case 6 JSX, might need to be part of nonIndividualSubscribers objects
  // const [equityClasses, setEquityClasses] = useState([{ num: '', nominal: '' }]);
  // const [prefClasses, setPrefClasses] = useState([{ num: '', nominal: '' }]);

  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [noDinSubscribers, setNoDinSubscribers] = useState([]);
  const [noDinTab, setNoDinTab] = useState(0);
  const [cDirectors, setCDirectors] = useState([]);
  const [cActiveTab, setCActiveTab] = useState(0);
  const [noDinDirectors, setNoDinDirectors] = useState([]);
  const [noDinActiveTab, setNoDinActiveTab] = useState(0);
  const [otherDinDirectors, setOtherDinDirectors] = useState([]);
  const [otherDinTab, setOtherDinTab] = useState(0);
  const [directorsOnlyNoDin, setDirectorsOnlyNoDin] = useState([]);
  const [directorsOnlyNoDinTab, setDirectorsOnlyNoDinTab] = useState(0);

  const calculateTotal = (num, nominal) => { /* ... */ 
    const n = parseFloat(num) || 0;
    const nom = parseFloat(nominal) || 0;
    return isNaN(n*nom) ? '' : (n * nom).toFixed(2);
  };

  useEffect(() => {
    if (!token || !orgId) {
      console.warn("Token or Org ID missing – skipping fetch.");
      return;
    }

    const loadInitialData = async () => {
      try {
        const response = await axios.post(API_URL, { org_id: orgId }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        let fetchedData = null;

        if (response.data?.status === 'success' && response.data.template) {
          fetchedData = response.data.template;
        } else if (response.data?.data) {
          fetchedData = response.data.data;
        } else if (response.data && typeof response.data === 'object') {
          fetchedData = response.data;
        }
       
        
        if (fetchedData) {
          console.log("Fetched data to be mapped:", fetchedData);
          const getValue = (apiPath, defaultValue = '', source = fetchedData) => { /* ... */ 
                let value = source;
                const pathParts = apiPath.split('.');
                for (const part of pathParts) {
                    if (value && typeof value === 'object' && part in value) value = value[part];
                    else return defaultValue;
                }
                return value !== null && value !== undefined ? value : defaultValue;
          };

          setFormData(prevFormData => { /* ... mapping for simple formData fields (Cases 1,2,3,4,13-24) ... */
            const newFormData = { ...prevFormData };
            // Case 1
            const apiAoaEntrenched = getValue('weather_AOA_entrenched', null); newFormData.aoaIsEntrenched = apiAoaEntrenched === "Yes" ? true : (apiAoaEntrenched === "No" ? false : null); newFormData.entrenchedArticlesCount = String(getValue('number_of_articles', '')); const apiArticleDetails = getValue('article_details', {}); const articles = []; if (apiArticleDetails && typeof apiArticleDetails === 'object' && Object.keys(apiArticleDetails).length > 0) { Object.values(apiArticleDetails).forEach(detail => articles.push({ articleNumber: detail.article_number || '', description: detail.brief_details || '' })); } newFormData.entrenchedArticles = articles.length > 0 ? articles : [{ articleNumber: '', description: '' }]; const apiHaveShareCapitals = getValue('company.have_share_capitals', null); newFormData.companyType = apiHaveShareCapitals === true ? "shareCapitalYes" : (apiHaveShareCapitals === false ? "shareCapitalNo" : ''); newFormData.authCapitalUnclassified = String(getValue('capital_structure_of_the_company.unclassified_authorized_share_capital', ''));
            // Case 2
            const capStructureApi = getValue('capital_structure_of_the_company', {}); newFormData.equityClassesCount = getValue('equity_share_capital.number_of_classes', 1, capStructureApi); const equityApiDesc = getValue('equity_share_capital.description', {}, capStructureApi); const loadedEquityClasses = []; if (equityApiDesc && newFormData.equityClassesCount > 0) { for (let i = 1; i <= newFormData.equityClassesCount; i++) { const desc = equityApiDesc[`description_${i}`]; if (desc) { loadedEquityClasses.push({ authNum: String(getValue('Number_of_equity_shares.authorized_capital', '', desc)), subNum: String(getValue('Number_of_equity_shares.suscribed_capital', '', desc)), authNominal: String(getValue('nominal_amount_per_share.authorized_capital', '', desc)), subNominal: String(getValue('nominal_amount_per_share.suscribed_capital', '', desc)), }); } else loadedEquityClasses.push({ authNum: '', subNum: '', authNominal: '', subNominal: '' }); } } newFormData.equityShareClasses = loadedEquityClasses.length > 0 ? loadedEquityClasses : [{ authNum: '', subNum: '', authNominal: '', subNominal: '' }]; newFormData.prefClassesCount = getValue('preferences_share_capital.number_of_classes', 0, capStructureApi); const prefApiDesc = getValue('preferences_share_capital.description', {}, capStructureApi); const loadedPrefClasses = []; if (prefApiDesc && newFormData.prefClassesCount > 0) { for (let i = 1; i <= newFormData.prefClassesCount; i++) { const desc = prefApiDesc[`description_${i}`]; if (desc) { loadedPrefClasses.push({ authNum: String(getValue('Number_of_preference_shares.authorized_capital', '', desc)), subNum: String(getValue('Number_of_preference_shares.suscribed_capital', '', desc)), authNominal: String(getValue('nominal_amount_per_share.authorized_capital', '', desc)), subNominal: String(getValue('nominal_amount_per_share.suscribed_capital', '', desc)), }); } else loadedPrefClasses.push({ authNum: '', subNum: '', authNominal: '', subNominal: '' }); } } newFormData.prefShareClasses = loadedPrefClasses.length > 0 ? loadedPrefClasses : [{ authNum: '', subNum: '', authNominal: '', subNominal: '' }]; let eqAuthTotalCalc = 0, eqSubTotalCalc = 0, prAuthTotalCalc = 0, prSubTotalCalc = 0; newFormData.equityShareClasses.forEach(s => { eqAuthTotalCalc += (parseFloat(s.authNum) || 0) * (parseFloat(s.authNominal) || 0); eqSubTotalCalc += (parseFloat(s.subNum) || 0) * (parseFloat(s.subNominal) || 0); }); newFormData.prefShareClasses.forEach(s => { prAuthTotalCalc += (parseFloat(s.authNum) || 0) * (parseFloat(s.authNominal) || 0); prSubTotalCalc += (parseFloat(s.subNum) || 0) * (parseFloat(s.subNominal) || 0); }); newFormData.authCapitalTotal = (eqAuthTotalCalc + prAuthTotalCalc).toString(); newFormData.subCapitalTotal = (eqSubTotalCalc + prSubTotalCalc).toString(); newFormData.authCapitalClassified = (eqAuthTotalCalc + prAuthTotalCalc).toString(); const memberDetailsApi = getValue('member_details', {}, capStructureApi); newFormData.maxMembers = String(getValue('maximum_number_of_members', '', memberDetailsApi)); newFormData.maxMembersExcl = String(getValue('maximum_number_of_members_excluding_proposed_employees', '', memberDetailsApi)); newFormData.numMembers = String(getValue('number_of_members', '', memberDetailsApi)); newFormData.numMembersExclEmp = String(getValue('number_of_members_excluding_proposed_employees', '', memberDetailsApi));
            // Case 3
            const corrAddrApi = getValue('address_of_company.correspondence_address', {}); newFormData.corrAddrLine1 = String(getValue('line1', '', corrAddrApi)); newFormData.corrAddrLine2 = String(getValue('line2', '', corrAddrApi)); newFormData.corrAddrPincode = String(getValue('pincode', '', corrAddrApi)); newFormData.corrAddrMobile = String(getValue('mobile', '', corrAddrApi)); newFormData.corrAddrPhone = String(getValue('phone', '', corrAddrApi)); newFormData.corrAddrFax = String(getValue('fax', '', corrAddrApi)); newFormData.corrAddrState = String(getValue('state_or_ut', '', corrAddrApi)); newFormData.corrAddrDistrict = String(getValue('district', '', corrAddrApi)); newFormData.corrAddrCity = String(getValue('city', '', corrAddrApi)); newFormData.corrAddrLocality = String(getValue('area_or_locality', '', corrAddrApi)); newFormData.corrAddrEmail = String(getValue('email', '', corrAddrApi));
            // Case 4
            newFormData.addrSameAsReg = getValue('address_of_company.is_correspondence_address_same_as_registered_address', null); newFormData.rocOffice = String(getValue('address_of_company.registrar', ''));
            // ... map other formData fields ...
            return newFormData;
          });

          const countsApi = getValue('subscrier_and_director_counts', {});
          setAValidDinCount(getValue('total_number_of_first_subscribers.having_valid_din', 0, countsApi));
          setANoDinCount(getValue('total_number_of_first_subscribers.not_having_valid_din', 0, countsApi));
          setBValidDinCount(getValue('number_of_non_individual_first_subscribers.having_valid_din', 0, countsApi));
          setBNoDinCount(getValue('number_of_non_individual_first_subscribers.not_having_valid_din', 0, countsApi));
          setCValidDinCount(getValue('number_of_first_subscribers_cum_directors.having_valid_din', 0, countsApi));
          setCNoDinCount(getValue('number_of_first_subscribers_cum_directors.not_having_valid_din', 0, countsApi));
          setDValidDinCount(getValue('total_number_of_directors.having_valid_din', 0, countsApi));
          setDNoDinCount(getValue('total_number_of_directors.not_having_valid_din', 0, countsApi));

          const subscribersApi = getValue('subscribers', {});
          const subscribersDirectorsApi = getValue('subscribers_cum_directors', {});

          // --- Mapping for 6A_non_individual_subscribers ---
          const api6AData = getValue('6A_non_individual_subscribers', {}, subscribersApi);
          const loaded6A = Object.entries(api6AData).map(([key, item]) => {
            const entityDetails = getValue('entity_details', {}, item);
            const regAddress = getValue('registered_address', {}, entityDetails);
            const authPerson = getValue('authorized_person', {}, item);
            const authPresAddress = getValue('present_address', {}, authPerson);
            const equityCap = getValue('equity_share_capital', {}, item);
            const prefCap = getValue('preference_share_capital', {}, item);

            return {
              // Entity Details
              category: getValue('category', '', entityDetails),
              cin: getValue('cin_or_frn_or_other_number', '', entityDetails),
              entityName: getValue('name', '', entityDetails),
              regAddrL1: getValue('line1', '', regAddress),
              regAddrL2: getValue('line2', '', regAddress),
              regAddrCountry: getValue('country', '', regAddress),
              regAddrPin: getValue('pincode', '', regAddress),
              regAddrLocality: getValue('area_or_locality', '', regAddress),
              regAddrCity: getValue('city', '', regAddress),
              regAddrDistrict: getValue('district', '', regAddress),
              regAddrState: getValue('state_or_ut', '', regAddress),
              regAddrPhone: getValue('phone', '', regAddress),
              regAddrFax: getValue('fax', '', regAddress),
              regAddrEmail: getValue('email', '', regAddress),
              // Authorized Person
              authPersonDin: getValue('din', '', authPerson),
              authPersonFirstName: getValue('first_name', '', authPerson),
              authPersonMiddleName: getValue('middle_name', '', authPerson),
              authPersonSurname: getValue('surname', '', authPerson),
              authPersonFatherFirstName: getValue('father_first_name', '', authPerson),
              authPersonFatherMiddleName: getValue('father_middle_name', '', authPerson),
              authPersonFatherSurname: getValue('father_surname', '', authPerson),
              authPersonGender: getValue('gender', '', authPerson),
              authPersonDob: getValue('dob', '', authPerson),
              authPersonNationality: getValue('nationality', '', authPerson),
              authPersonPan: getValue('pan', '', authPerson),
              authPersonPob: getValue('place_of_birth', '', authPerson),
              authPersonOccupationType: getValue('occupation_type', '', authPerson),
              authPersonOccupationArea: getValue('occupation_area', '', authPerson),
              authPersonOccupationOther: getValue('occupation_other', '', authPerson),
              authPersonEducation: getValue('education_qualification', '', authPerson),
              authPersonEducationOther: getValue('education_other', '', authPerson),
              authPersonPresAddrL1: getValue('line1', '', authPresAddress),
              authPersonPresAddrL2: getValue('line2', '', authPresAddress),
              authPersonPresAddrCountry: getValue('country', '', authPresAddress),
              authPersonPresAddrPin: getValue('pincode', '', authPresAddress),
              authPersonPresAddrLocality: getValue('area_or_locality', '', authPresAddress),
              authPersonPresAddrCity: getValue('city', '', authPresAddress),
              authPersonPresAddrDistrict: getValue('district', '', authPresAddress),
              authPersonPresAddrState: getValue('state_or_ut', '', authPresAddress),
              authPersonPresAddrPhone: getValue('phone', '', authPresAddress),
              authPersonPresAddrFax: getValue('fax', '', authPresAddress),
              authPersonPresAddrEmail: getValue('email', '', authPresAddress),
              authPersonIdProofType: getValue('identity_proof', '', authPerson),
              authPersonIdProofNo: getValue('identity_proof_no', '', authPerson),
              authPersonResProofType: getValue('residential_proof', '', authPerson),
              authPersonResProofNo: getValue('residential_proof_no', '', authPerson),
              authPersonIdProofFile: getValue('proof_of_identity_file', null, authPerson), // Store filename/URL
              authPersonResProofFile: getValue('proof_of_address_file', null, authPerson),
              // Share Capital
              totalSubscribedShareCapital: getValue('total_subscribed_share_capital', '', item),
              equityShares: Array.from({length: getValue('number_of_classes', 0, equityCap)}, (_, i) => {
                  const desc = getValue(`description_${i+1}`, {}, equityCap);
                  return {
                      class_of_shares: getValue('class_of_shares', 'Equity', desc),
                      subscribed_capital: getValue('subscribed_capital', '', desc), // This might be total, API has components
                      number_of_equity_shares: getValue('number_of_equity_shares', '', desc),
                      nominal_amount_per_share: getValue('nominal_amount_per_share', '', desc),
                      total_amount: getValue('total_amount', '', desc),
                  };
              }),
              preferenceShares: Array.from({length: getValue('number_of_classes', 0, prefCap)}, (_, i) => {
                  const desc = getValue(`description_${i+1}`, {}, prefCap);
                  return {
                      class_of_shares: getValue('class_of_shares', 'Preference', desc),
                      subscribed_capital: getValue('subscribed_capital', '', desc),
                      number_of_preference_shares: getValue('number_of_preference_shares', '', desc),
                      nominal_amount_per_share: getValue('nominal_amount_per_share', '', desc),
                      total_amount: getValue('total_amount', '', desc),
                  };
              }),
              forexRequired: 'not_required', // TODO: Determine from API if available
            };
          });
          setNonIndividualSubscribers(loaded6A.length > 0 ? loaded6A : [deepClone(initialNonIndividualSubscriber)]);


          // --- Mapping for 7A_Subscriber_Cum_Director_With_DIN ---
          const api7AData = getValue('7A_Subscriber_Cum_Director_With_DIN', [], subscribersDirectorsApi);
          const loaded7A = api7AData.map(itemWrapper => {
            const item = Object.values(itemWrapper)[0] || {}; // API uses dynamic key like "subscriber_director_1"
            const interestsApi = getValue('interest_in_other_entities', {}, item);
            return {
                din: getValue('din', '', item),
                name: getValue('name', '', item),
                designation: getValue('designation', '', item),
                category: getValue('category', '', item),
                role: getValue('chairman', false, item) ? 'Chairman' : (getValue('executive_director', false, item) ? 'Executive' : (getValue('non_executive_director', false, item) ? 'NonExecutive' : '')),
                email_id: getValue('email_id', '', item),
                nominee_company_name: getValue('nominee_company_name', '', item),
                total_subscribed_share_capital_inr: getValue('total_subscribed_share_capital_inr', '', item),
                equityShares: (getValue('equity_share_capital', [], item)).map(eqClassWrapper => {
                    const eqClass = Object.values(eqClassWrapper)[0] || {}; // API uses dynamic key like "equity_class_1"
                    return {
                        class_of_shares: getValue('class_of_shares', 'Equity', eqClass),
                        number_of_equity_shares: getValue('number_of_equity_shares', '', eqClass),
                        nominal_amount_per_share: getValue('nominal_amount_per_share', '', eqClass),
                        total_amount: getValue('total_amount', '', eqClass),
                    };
                }),
                preferenceShares: (getValue('preference_share_capital', [], item)).map(prClassWrapper => { /* Similar to equity */ return {}; }),
                interests: Object.entries(interestsApi).map(([entityKey, entityData]) => ({
                    cin_llpin_fcrn_registration_number: getValue('cin_llpin_fcrn_registration_number', '', entityData),
                    name: getValue('name', '', entityData),
                    address: getValue('address', '', entityData),
                    nature_of_interest: getValue('nature_of_interest', '', entityData),
                    designation_other_specify_if_needed: getValue('designation_other_specify_if_needed', '', entityData),
                    percentage_of_shareholding: getValue('percentage_of_shareholding', '0', entityData),
                    amount_in_inr: getValue('amount_in_inr', '', entityData),
                })),
                forexRequired: 'not_required', // TODO: Determine from API
            };
          });
          setCDirectors(loaded7A.length > 0 ? loaded7A : [deepClone(initialSubscriberDirectorDIN)]);
          
          // TODO: Implement mapping for 6B, 6C, 7B, 7C, 7D similarly
          const api6BData = getValue('6B_individual_with_DIN', {}, subscribersApi);
          const loaded6B = Object.entries(api6BData).map(([key, item]) => { // API returns object, UI uses array
            const equityCap = getValue('equity_share_capital', {}, item);
            const prefCap = getValue('preference_share_capital', {}, item);
            return {
              din: getValue('din', '', item),
              name: getValue('name', '', item),
              total_subscribed_share_capital_in_inr: getValue('total_subscribed_share_capital_in_inr', '', item),
              equityShares: Array.from({length: getValue('number_of_classes', 0, equityCap)}, (_, i) => {
                  const desc = getValue(`descriptions.description_${i+1}`, {}, equityCap);
                  const subCap = getValue('subscribed_capital', {}, desc);
                  return {
                      class_of_shares: getValue('class_of_shares', 'Equity', desc),
                      number_of_equity_shares: String(getValue('number_of_equity_shares', '', subCap)),
                      nominal_amount_per_share: String(getValue('nominal_amount_per_share', '', subCap)),
                      total_amount: String(getValue('total_amount', '', subCap)),
                  };
              }),
              preferenceShares: Array.from({length: getValue('number_of_classes', 0, prefCap)}, (_, i) => {
                  const desc = getValue(`descriptions.description_${i+1}`, {}, prefCap);
                  const subCap = getValue('subscribed_capital', {}, desc);
                  return {
                      class_of_shares: getValue('class_of_shares', 'Preference', desc),
                      number_of_preference_shares: String(getValue('number_of_preference_shares', '', subCap)),
                      nominal_amount_per_share: String(getValue('nominal_amount_per_share', '', subCap)),
                      total_amount: String(getValue('total_amount', '', subCap)),
                  };
              }),
              forexRequired: 'not_required', // Assuming default, API doesn't specify for 6B
            };
          });
          // Initialize with empty objects if API returns nothing but counts imply entries should exist
          const num6B = aValidDinCount - bValidDinCount;
          setSubscribers(loaded6B.length > 0 ? loaded6B : (num6B > 0 ? Array.from({ length: num6B }, () => deepClone(initialIndividualSubscriberDIN)) : []));


          // --- Mapping for 6C_individual_without_DIN ---
          const api6CData = getValue('6C_individual_without_DIN', {}, subscribersApi);
          const loaded6C = Object.entries(api6CData).map(([key, item]) => {
            const personal = getValue('personal_details', {}, item);
            const permAddr = getValue('permanent_address', {}, item);
            const presAddr = getValue('present_address', {}, item);
            const duration = getValue('duration_of_stay', {}, item); // API is {years:"", months:""}
            const prevAddr = getValue('previous_address', {}, item);
            const equityCap = getValue('equity_share_capital', {}, item);
            const prefCap = getValue('preference_share_capital', {}, item);
            return {
              firstName: getValue('first_name', '', personal), middleName: getValue('middle_name', '', personal), surname: getValue('surname', '', personal),
              fatherFirstName: getValue('father_first_name', '', personal), fatherMiddleName: getValue('father_middle_name', '', personal), fatherSurname: getValue('father_surname', '', personal),
              gender: getValue('gender', '', personal), dob: getValue('dob', '', personal), nationality: getValue('nationality', '', personal), pob: getValue('place_of_birth', '', personal),
              occupationType: getValue('occupation_type', '', personal), occupationArea: getValue('occupation_area', '', personal), occupationOther: getValue('occupation_other', '', personal),
              education: getValue('education_qualification', '', personal), educationOther: getValue('education_other', '', personal), pan: getValue('pan', '', personal), email: getValue('email', '', personal),
              permAddrL1: getValue('permanent_line1', '', permAddr), permAddrL2: getValue('permanent_line2', '', permAddr), permAddrCountry: getValue('permanent_country', '', permAddr), permAddrPin: getValue('permanent_pincode', '', permAddr), permAddrLocality: getValue('permanent_area_or_locality', '', permAddr), permAddrCity: getValue('permanent_city', '', permAddr), permAddrDistrict: getValue('permanent_district', '', permAddr), permAddrState: getValue('permanent_state_or_ut', '', permAddr), permAddrPhone: getValue('permanent_phone', '', permAddr),
              isSameAsPermanent: getValue('is_same_as_permanent', true, item),
              presAddrL1: getValue('present_line1', '', presAddr), presAddrL2: getValue('present_line2', '', presAddr), presAddrCountry: getValue('present_country', '', presAddr), presAddrPin: getValue('present_pincode', '', presAddr), presAddrLocality: getValue('present_area_or_locality', '', presAddr), presAddrCity: getValue('present_city', '', presAddr), presAddrDistrict: getValue('present_district', '', presAddr), presAddrState: getValue('present_state_or_ut', '', presAddr), presAddrPhone: getValue('present_phone', '', presAddr),
              durationOfStayYears: getValue('years', '', duration), durationOfStayMonths: getValue('months', '', duration),
              prevAddrL1: getValue('previous_line1', '', prevAddr), prevAddrL2: getValue('previous_line2', '', prevAddr), prevAddrCountry: getValue('previous_country', '', prevAddr), prevAddrPin: getValue('previous_pincode', '', prevAddr), prevAddrLocality: getValue('previous_area_or_locality', '', prevAddr), prevAddrCity: getValue('previous_city', '', prevAddr), prevAddrDistrict: getValue('previous_district', '', prevAddr), prevAddrState: getValue('previous_state_or_ut', '', prevAddr), prevAddrPhone: getValue('previous_phone', '', prevAddr),
              idProofType: getValue('identity_proof', '', item), idProofNo: getValue('identity_proof_no', '', item), idProofFile: getValue('identity_proof_file', null, item),
              resProofType: getValue('residential_proof', '', item), resProofNo: getValue('residential_proof_no', '', item), resProofFile: getValue('residential_proof_file', null, item),
              totalSubscribedShareCapital: getValue('total_subscribed_share_capital', '', item),
              equityShares: Array.from({length: getValue('number_of_classes', 0, equityCap)}, (_, i) => {
                  const desc = getValue(`description_${i+1}`, {}, equityCap);
                  return {
                      class_of_shares: getValue('class_of_shares', 'Equity', desc),
                      subscribed_capital: String(getValue('subscribed_capital', '', desc)),
                      number_of_equity_shares: String(getValue('number_of_equity_shares', '', desc)),
                      nominal_amount_per_share: String(getValue('nominal_amount_per_share', '', desc)),
                      total_amount: String(getValue('total_amount', '', desc)),
                  };
              }),
              preferenceShares: Array.from({length: getValue('number_of_classes', 0, prefCap)}, (_, i) => {
                  const desc = getValue(`description_${i+1}`, {}, prefCap);
                   return {
                      class_of_shares: getValue('class_of_shares', 'Preference', desc),
                      subscribed_capital: String(getValue('subscribed_capital', '', desc)),
                      number_of_preference_shares: String(getValue('number_of_preference_shares', '', desc)),
                      nominal_amount_per_share: String(getValue('nominal_amount_per_share', '', desc)),
                      total_amount: String(getValue('total_amount', '', desc)),
                  };
              }),
              forexRequired: 'not_required',
            };
          });
          const num6C = aNoDinCount - bNoDinCount;
          setNoDinSubscribers(loaded6C.length > 0 ? loaded6C : (num6C > 0 ? Array.from({ length: num6C }, () => deepClone(initialIndividualSubscriberNoDIN)) : []));


          // --- Mapping for 7B_Subscriber_Without_DIN ---
          const api7BDataArray = getValue('7B_Subscriber_Without_DIN', [], subscribersDirectorsApi);
          const loaded7B = api7BDataArray.map(itemWrapper => {
            const directorKey = Object.keys(itemWrapper)[0]; // e.g., "subscriber_director_without_din_1"
            const item = directorKey ? itemWrapper[directorKey] : {};
            
            const permAddr = getValue('permanent_address', {}, item);
            const presAddr = getValue('present_address', {}, item);
            const duration = getValue('duration_of_stay_at_present_address', {}, item); // API is {years:"", months:""}
            const interestsApi = getValue('interest_in_other_entities', {}, item);
            const equityCap = getValue('equity_share_capital', [], item); // API is an array of keyed objects
            const prefCap = getValue('preference_share_capital', [], item);

            return {
                firstName: getValue('first_name', '', item),
                middleName: getValue('middle_name', '', item),
                surname: getValue('surname', '', item),
                fathers_first_name: getValue('fathers_first_name', '', item),
                fathers_middle_name: getValue('fathers_middle_name', '', item),
                fathers_surname: getValue('fathers_surname', '', item),
                gender: getValue('gender', '', item),
                dob: getValue('dob', '', item),
                nationality: getValue('nationality', '', item),
                place_of_birth: getValue('place_of_birth', '', item),
                is_citizen_of_india: getValue('is_citizen_of_india', 'Yes', item),
                is_resident_in_india: getValue('is_resident_in_india', 'Yes', item),
                occupation_type: getValue('occupation_type', '', item),
                occupation_area: getValue('occupation_area', '', item),
                educational_qualification: getValue('educational_qualification', '', item),
                pan: getValue('pan', '', item),
                designation: getValue('designation', '', item),
                category: getValue('category', '', item),
                is_chairman: getValue('is_chairman', false, item),
                is_executive_director: getValue('is_executive_director', false, item), // API has this, UI was defaulting to true
                is_non_executive_director: getValue('is_non_executive_director', false, item),
                nominee_company_name: getValue('nominee_company_name', '', item),
                mobile_number: getValue('mobile_number', '', item),
                email_id: getValue('email_id', '', item),
                permanent_address: {
                    line_1: getValue('line_1', '', permAddr), line_2: getValue('line_2', '', permAddr),
                    country: getValue('country', '', permAddr), pin_code: getValue('pin_code', '', permAddr),
                    area_locality: getValue('area_locality', '', permAddr), city: getValue('city', '', permAddr),
                    district: getValue('district', '', permAddr), state_ut: getValue('state_ut', '', permAddr),
                    phone: getValue('phone', '', permAddr),
                },
                is_present_address_same_as_permanent: getValue('is_present_address_same_as_permanent', true, item),
                present_address: getValue('is_present_address_same_as_permanent', true, item) ? {} : {
                    line_1: getValue('line_1', '', presAddr), line_2: getValue('line_2', '', presAddr),
                    // ... map all present_address fields from API
                },
                duration_of_stay_at_present_address: { years: getValue('years', '', duration), months: getValue('months', '', duration) },
                identity_proof_type: getValue('identity_proof_type', '', item),
                identity_proof_number: getValue('identity_proof_number', '', item),
                residential_proof_type: getValue('residential_proof_type', '', item),
                residential_proof_number: getValue('residential_proof_number', '', item),
                // API for 7B doesn't list file fields
                total_subscribed_share_capital: getValue('total_subscribed_share_capital', '', item),
                equityShares: equityCap.map(eqClassWrapper => {
                    const classKey = Object.keys(eqClassWrapper)[0]; // e.g. "equity_class_1"
                    const eqClass = classKey ? eqClassWrapper[classKey] : {};
                    return {
                        class_of_shares: getValue('class_of_shares', 'Equity', eqClass),
                        subscribed_capital: getValue('subscribed_capital', '', eqClass), // API has this
                        number_of_equity_shares: String(getValue('number_of_equity_shares', '', eqClass)),
                        nominal_amount_per_share: String(getValue('nominal_amount_per_share', '', eqClass)),
                        total_amount: String(getValue('total_amount', '', eqClass)),
                    };
                }),
                preferenceShares: prefCap.map(prClassWrapper => { /* Similar for pref */ return {}; }),
                interests: Object.entries(interestsApi).map(([entityKey, entityData]) => ({ /* ... map interest fields ... */ })),
                forexRequired: 'not_required', // Default
            };
          });
          setNoDinDirectors(loaded7B.length > 0 ? loaded7B : (cNoDinCount > 0 ? Array.from({length: cNoDinCount}, () => deepClone(initialSubscriberDirectorNoDIN)) : []));

          // --- Mapping for 7C_Director_With_DIN ---
          const api7CDataArray = getValue('7C_Director_With_DIN', [], subscribersDirectorsApi);
          const loaded7C = api7CDataArray.map(itemWrapper => {
            const directorKey = Object.keys(itemWrapper)[0];
            const item = directorKey ? itemWrapper[directorKey] : {};
            const interestsApi = getValue('declaration_of_interests', {}, item);
            return {
                director_identification_number_din: getValue('director_identification_number_din', '', item),
                name: getValue('name', '', item),
                designation: getValue('designation', '', item),
                category: getValue('category', '', item),
                chairman: getValue('chairman', false, item),
                executive_director: getValue('executive_director', false, item), // API has boolean, UI might have role string
                non_executive_director: getValue('non_executive_director', false, item),
                role: getValue('chairman', false, item) ? 'Chairman' : (getValue('executive_director', false, item) ? 'Executive' : (getValue('non_executive_director', false, item) ? 'NonExecutive' : '')),
                nominee_company_name: getValue('nominee_company_name', '', item),
                email_id: getValue('email_id', '', item),
                interests: Object.entries(interestsApi).map(([entityKey, entityData]) => ({
                    cin_llpin_fcrn_registration_number: getValue('cin_llpin_fcrn_registration_number', '', entityData),
                    name: getValue('name', '', entityData),
                    address: getValue('address', '', entityData),
                    nature_of_interest: getValue('nature_of_interest', '', entityData),
                    designation_other_specify: getValue('designation_other_specify', '', entityData),
                    percentage_of_shareholding: getValue('percentage_of_shareholding', '0', entityData),
                    amount: getValue('amount', '', entityData),
                })),
            };
          });
          setOtherDinDirectors(loaded7C.length > 0 ? loaded7C : (dValidDinCount - cValidDinCount > 0 ? Array.from({length: dValidDinCount - cValidDinCount}, () => deepClone(initialDirectorDIN)) : []));
          
          // --- Mapping for 7D_Director_Without_DIN ---
          const api7DDataArray = getValue('7D_Director_Without_DIN', [], subscribersDirectorsApi);
          const loaded7D = api7DDataArray.map(itemWrapper => {
            const directorKey = Object.keys(itemWrapper)[0]; // e.g., "director_without_din_1"
            const item = directorKey ? itemWrapper[directorKey] : {};
            
            const permAddrApi = getValue('permanent_address', {}, item);
            const presAddrApi = getValue('present_address', {}, item);
            const durationStrApi = getValue('duration_of_stay_at_present_address', '', item); // API is "YY/MM"
            const durationParts = durationStrApi.split('/');
            const interestsApi = getValue('declaration_of_interests', {}, item);

            // Determine if present address is same as permanent based on API data
            // If present_address object is empty or not provided, assume it's same as permanent for UI convenience
            const isPresAddrSame = !Object.values(presAddrApi).some(value => value !== "");


            const uiTypes = [];
            if (getValue('is_chairman', false, item)) uiTypes.push('Chairman');
            if (getValue('is_executive_director', false, item)) uiTypes.push('Executive'); // Check default if API can omit this
            if (getValue('is_non_executive_director', false, item)) uiTypes.push('NonExecutive');


            return {
                firstName: getValue('first_name', '', item),
                middleName: getValue('middle_name', '', item),
                surname: getValue('surname', '', item),
                fathers_first_name: getValue('fathers_first_name', '', item),
                fathers_middle_name: getValue('fathers_middle_name', '', item),
                fathers_surname: getValue('fathers_surname', '', item),
                gender: getValue('gender', '', item),
                dob: getValue('dob', '', item),
                nationality: getValue('nationality', '', item),
                place_of_birth: getValue('place_of_birth', '', item),
                is_citizen_of_india: getValue('is_citizen_of_india', false, item), // API uses boolean
                is_resident_in_india: getValue('is_resident_in_india', false, item), // API uses boolean
                occupation_type: getValue('occupation_type', '', item),
                area_of_occupation: getValue('area_of_occupation', '', item),
                educational_qualification: getValue('educational_qualification', '', item),
                income_tax_pan: getValue('income_tax_pan', '', item),
                designation: getValue('designation', '', item),
                category: getValue('category', '', item),
                is_chairman: getValue('is_chairman', false, item), // Store raw booleans
                is_executive_director: getValue('is_executive_director', false, item),
                is_non_executive_director: getValue('is_non_executive_director', false, item),
                types: uiTypes, // For UI checkbox group state
                nominee_company_name: getValue('nominee_company_name', '', item),
                mobile_no: getValue('mobile_no', '', item),
                email_id: getValue('email_id', '', item),
                // For UI, flatten or keep nested based on your initialDirectorNoDIN structure
                permanent_address: { // UI state might have flat permAddr_line_1 or nested
                    line_1: getValue('line_1', '', permAddrApi),
                    line_2: getValue('line_2', '', permAddrApi),
                    country: getValue('country', '', permAddrApi),
                    pin_code: getValue('pin_code', '', permAddrApi),
                    area_locality: getValue('area_locality', '', permAddrApi),
                    city: getValue('city', '', permAddrApi),
                    district: getValue('district', '', permAddrApi),
                    state_ut: getValue('state_ut', '', permAddrApi),
                    phone: getValue('phone', '', permAddrApi),
                },
                is_present_address_same_as_permanent: isPresAddrSame, // For UI radio button
                present_address: { // Populate even if same, UI can hide it
                    line_1: getValue('line_1', '', presAddrApi),
                    line_2: getValue('line_2', '', presAddrApi),
                    // ... map all present address fields
                },
                duration_of_stay_at_present_address: { // For UI object
                    years: durationParts[0] || '',
                    months: durationParts[1] || '',
                },
                stayDuration: durationStrApi, // Keep original string if UI needs it
                identity_proof_type: getValue('identity_proof', '', item), // API key is identity_proof
                identity_proof_no: getValue('identity_proof_no', '', item),
                residential_proof_type: getValue('residential_proof', '', item), // API key is residential_proof
                residential_proof_no: getValue('residential_proof_no', '', item),
                idProofFile: getValue('proof_of_identity', null, item), // Map API key to UI state key
                resProofFile: getValue('proof_of_residential_address', null, item), // Map API key to UI state key
                interests: Object.entries(interestsApi).map(([entityKey, entityData]) => ({
                    cin_llpin_fcrn_registration_number: getValue('cin_llpin_fcrn_registration_number', '', entityData),
                    name: getValue('name', '', entityData),
                    address: getValue('address', '', entityData),
                    nature_of_interest: getValue('nature_of_interest', '', entityData),
                    designation_other_specify: getValue('designation_other_specify', '', entityData),
                    percentage_of_shareholding: getValue('percentage_of_shareholding', '0', entityData),
                    amount: getValue('amount', '', entityData),
                })),
            };
          });
          // Initialize with empty objects if API returns nothing but counts from Case 5 imply entries should exist
          const num7D = dNoDinCount - cNoDinCount; // Assuming cNoDinCount is for 7B
          setDirectorsOnlyNoDin(loaded7D.length > 0 ? loaded7D : (num7D > 0 ? Array.from({length: num7D}, () => deepClone(initialDirectorNoDIN)) : []));
        } else { /* ... */ }
      } catch (error) { /* ... */ }
    };
   
    loadInitialData();
}, [token, orgId], []); // Empty dependency array

  const handleSaveData = async () => {
    let templateToSave = deepClone(initialApiTemplateStructure);
    // == formData simple fields (Cases 1,2,3,4,13-24) ==
    /* ... mapping for simple formData fields to templateToSave ... */
    // Case 1
    templateToSave.weather_AOA_entrenched = formData.aoaIsEntrenched === true ? "Yes" : (formData.aoaIsEntrenched === false ? "No" : ""); templateToSave.number_of_articles = Number(formData.entrenchedArticlesCount) || 0; templateToSave.article_details = {}; (formData.entrenchedArticles || []).forEach((article, index) => { if (article.articleNumber || article.description || index < templateToSave.number_of_articles) { templateToSave.article_details[String(index + 1)] = { article_number: article.articleNumber || "", brief_details: article.description || "" }; }}); if (templateToSave.number_of_articles === 0) templateToSave.article_details = {}; templateToSave.company.have_share_capitals = formData.companyType === "shareCapitalYes";
    // Capital Structure (Part from formData directly)
    const targetCapStructure = templateToSave.capital_structure_of_the_company; targetCapStructure.unclassified_authorized_share_capital = Number(formData.authCapitalUnclassified) || 0;
    // Case 2 (Capital Structure from formData.equityShareClasses & formData.prefShareClasses)
    targetCapStructure.equity_share_capital.number_of_classes = Number(formData.equityClassesCount) || 0; targetCapStructure.equity_share_capital.description = {}; (formData.equityShareClasses || []).slice(0, targetCapStructure.equity_share_capital.number_of_classes).forEach((eqClass, index) => { const descKey = `description_${index + 1}`; targetCapStructure.equity_share_capital.description[descKey] = { Number_of_equity_shares: { authorized_capital: eqClass.authNum || "0", suscribed_capital: eqClass.subNum || "0" }, nominal_amount_per_share: { authorized_capital: eqClass.authNominal || "0", suscribed_capital: eqClass.subNominal || "0" }, total_amount_per_share: { authorized_capital: calculateTotal(eqClass.authNum, eqClass.authNominal) || "0", suscribed_capital: calculateTotal(eqClass.subNum, eqClass.subNominal) || "0" } }; });
    targetCapStructure.preferences_share_capital.number_of_classes = Number(formData.prefClassesCount) || 0; targetCapStructure.preferences_share_capital.description = {}; (formData.prefShareClasses || []).slice(0, targetCapStructure.preferences_share_capital.number_of_classes).forEach((prClass, index) => { const descKey = `description_${index + 1}`; targetCapStructure.preferences_share_capital.description[descKey] = { Number_of_preference_shares: { authorized_capital: prClass.authNum || "0", suscribed_capital: prClass.subNum || "0" }, nominal_amount_per_share: { authorized_capital: prClass.authNominal || "0", suscribed_capital: prClass.subNominal || "0" }, total_amount_per_share: { authorized_capital: calculateTotal(prClass.authNum, prClass.authNominal) || "0", suscribed_capital: calculateTotal(prClass.subNum, prClass.subNominal) || "0" } }; });
    targetCapStructure.member_details = { maximum_number_of_members: formData.maxMembers || "", maximum_number_of_members_excluding_proposed_employees: formData.maxMembersExcl || "", number_of_members: formData.numMembers || "", number_of_members_excluding_proposed_employees: formData.numMembersExclEmp || "" };
    // Case 3
    templateToSave.address_of_company.correspondence_address = { line1: formData.corrAddrLine1 || "", line2: formData.corrAddrLine2 || "", pincode: formData.corrAddrPincode || "", mobile: formData.corrAddrMobile || "", phone: formData.corrAddrPhone || "", fax: formData.corrAddrFax || "", state_or_ut: formData.corrAddrState || "", district: formData.corrAddrDistrict || "", city: formData.corrAddrCity || "", area_or_locality: formData.corrAddrLocality || "", email: formData.corrAddrEmail || "" };
    // Case 4
    templateToSave.address_of_company.is_correspondence_address_same_as_registered_address = formData.addrSameAsReg; templateToSave.address_of_company.registrar = formData.rocOffice || "";
    // Case 5 (Counts)
    templateToSave.subscrier_and_director_counts = { total_number_of_first_subscribers: { having_valid_din: aValidDinCount, not_having_valid_din: aNoDinCount }, number_of_non_individual_first_subscribers: { having_valid_din: bValidDinCount, not_having_valid_din: bNoDinCount }, number_of_first_subscribers_cum_directors: { having_valid_din: cValidDinCount, not_having_valid_din: cNoDinCount }, total_number_of_directors: { having_valid_din: dValidDinCount, not_having_valid_din: dNoDinCount } };


    // --- Saving 6A_non_individual_subscribers ---
    templateToSave.subscribers["6A_non_individual_subscribers"] = {};
    nonIndividualSubscribers.forEach((sub, index) => {
        const subKey = (index + 1).toString();
        templateToSave.subscribers["6A_non_individual_subscribers"][subKey] = {
            entity_details: {
                category: sub.category || "",
                cin_or_frn_or_other_number: sub.cin || "",
                name: sub.entityName || "",
                registered_address: {
                    line1: sub.regAddrL1 || "", line2: sub.regAddrL2 || "", country: sub.regAddrCountry || "", pincode: sub.regAddrPin || "",
                    area_or_locality: sub.regAddrLocality || "", city: sub.regAddrCity || "", district: sub.regAddrDistrict || "",
                    state_or_ut: sub.regAddrState || "", phone: sub.regAddrPhone || "", fax: sub.regAddrFax || "", email: sub.regAddrEmail || "",
                },
            },
            authorized_person: {
                din: sub.authPersonDin || "", first_name: sub.authPersonFirstName || "", middle_name: sub.authPersonMiddleName || "", surname: sub.authPersonSurname || "",
                father_first_name: sub.authPersonFatherFirstName || "", father_middle_name: sub.authPersonFatherMiddleName || "", father_surname: sub.authPersonFatherSurname || "",
                gender: sub.authPersonGender || "", dob: sub.authPersonDob || "", nationality: sub.authPersonNationality || "", pan: sub.authPersonPan || "",
                place_of_birth: sub.authPersonPob || "", occupation_type: sub.authPersonOccupationType || "", occupation_area: sub.authPersonOccupationArea || "",
                occupation_other: sub.authPersonOccupationOther || "", education_qualification: sub.authPersonEducation || "", education_other: sub.authPersonEducationOther || "",
                present_address: {
                    line1: sub.authPersonPresAddrL1 || "", line2: sub.authPersonPresAddrL2 || "", country: sub.authPersonPresAddrCountry || "", pincode: sub.authPersonPresAddrPin || "",
                    area_or_locality: sub.authPersonPresAddrLocality || "", city: sub.authPersonPresAddrCity || "", district: sub.authPersonPresAddrDistrict || "",
                    state_or_ut: sub.authPersonPresAddrState || "", phone: sub.authPersonPresAddrPhone || "", fax: sub.authPersonPresAddrFax || "", email: sub.authPersonPresAddrEmail || "",
                },
                identity_proof: sub.authPersonIdProofType || "", identity_proof_no: sub.authPersonIdProofNo || "",
                residential_proof: sub.authPersonResProofType || "", residential_proof_no: sub.authPersonResProofNo || "",
                proof_of_identity_file: sub.authPersonIdProofFile ? "file_placeholder.pdf" : "", // Replace with actual file handling logic
                proof_of_address_file: sub.authPersonResProofFile ? "file_placeholder.pdf" : "",
            },
            total_subscribed_share_capital: sub.totalSubscribedShareCapital || "",
            equity_share_capital: {
                number_of_classes: sub.equityShares?.length || 0,
                ...(sub.equityShares?.reduce((acc, eqClass, eqIdx) => {
                    acc[`description_${eqIdx + 1}`] = {
                        class_of_shares: eqClass.class_of_shares || "Equity",
                        subscribed_capital: eqClass.subscribed_capital || "", // Or calculate if needed
                        number_of_equity_shares: eqClass.number_of_equity_shares || "",
                        nominal_amount_per_share: eqClass.nominal_amount_per_share || "",
                        total_amount: eqClass.total_amount || calculateTotal(eqClass.number_of_equity_shares, eqClass.nominal_amount_per_share),
                    };
                    return acc;
                }, {}) || {})
            },
            preference_share_capital: {
                number_of_classes: sub.preferenceShares?.length || 0,
                ...(sub.preferenceShares?.reduce((acc, prClass, prIdx) => {
                    acc[`description_${prIdx + 1}`] = {
                        class_of_shares: prClass.class_of_shares || "Preference",
                        subscribed_capital: prClass.subscribed_capital || "",
                        number_of_preference_shares: prClass.number_of_preference_shares || "",
                        nominal_amount_per_share: prClass.nominal_amount_per_share || "",
                        total_amount: prClass.total_amount || calculateTotal(prClass.number_of_preference_shares, prClass.nominal_amount_per_share),
                    };
                    return acc;
                }, {}) || {})
            },
        };
    });

    // --- Saving 7A_Subscriber_Cum_Director_With_DIN ---
    templateToSave.subscribers_cum_directors["7A_Subscriber_Cum_Director_With_DIN"] = cDirectors.map((dir, index) => {
        const dirKey = `subscriber_director_${index + 1}`;
        return {
            [dirKey]: {
                din: dir.din || "",
                name: dir.name || "",
                designation: dir.designation || "",
                category: dir.category || "",
                chairman: dir.role || "",
                executive_director: dir.role || "",
                non_executive_director: dir.role  || "",
                nominee_company_name: dir.nominee_company_name || "",
                email_id: dir.email_id || "",
                total_subscribed_share_capital_inr: dir.total_subscribed_share_capital_inr || "",
                equity_share_capital: (dir.equityShares || []).map((eqClass, eqIdx) => {
                    const classKey = `equity_class_${eqIdx + 1}`;
                    return {
                        [classKey]: {
                            class_of_shares: eqClass.class_of_shares || "Equity",
                            subscribed_capital: calculateTotal(eqClass.number_of_equity_shares, eqClass.nominal_amount_per_share), // This might be the total
                            number_of_equity_shares: eqClass.number_of_equity_shares || "",
                            nominal_amount_per_share: eqClass.nominal_amount_per_share || "",
                            total_amount: calculateTotal(eqClass.number_of_equity_shares, eqClass.nominal_amount_per_share),
                        }
                    };
                }),
                preference_share_capital: (dir.preferenceShares || []).map((prClass, prIdx) => { /* Similar to equity */ return {}; }),
                interest_in_other_entities: (dir.interests || []).reduce((acc, interest, interestIdx) => {
                    const entityKey = `entity_${interestIdx + 1}`;
                    acc[entityKey] = {
                        cin_llpin_fcrn_registration_number: interest.cin_llpin_fcrn_registration_number || "",
                        name: interest.name || "",
                        address: interest.address || "",
                        nature_of_interest: interest.nature_of_interest || "",
                        designation_other_specify_if_needed: interest.designation_other_specify_if_needed || "",
                        percentage_of_shareholding: interest.percentage_of_shareholding || "0",
                        amount_in_inr: interest.amount_in_inr || "",
                    };
                    return acc;
                }, {}),
            }
        };
    });
    
    // TODO: Implement saving for 6B, 6C, 7B, 7C, 7D
    // Inside handleSaveData -> after mapping 6A and 7A

    // --- Saving 6B_individual_with_DIN ---
    templateToSave.subscribers["6B_individual_with_DIN"] = {};
    subscribers.forEach((sub, index) => {
        const subKey = (index + 1).toString();
        templateToSave.subscribers["6B_individual_with_DIN"][subKey] = {
            din: sub.din || "",
            name: sub.name || "",
            total_subscribed_share_capital_in_inr: sub.total_subscribed_share_capital_in_inr || "",
            equity_share_capital: {
                number_of_classes: sub.equityShares?.length || 0,
                descriptions: (sub.equityShares || []).reduce((acc, eqClass, eqIdx) => {
                    acc[`description_${eqIdx + 1}`] = {
                        class_of_shares: eqClass.class_of_shares || "Equity",
                        subscribed_capital: {
                             number_of_equity_shares: eqClass.number_of_equity_shares || "",
                             nominal_amount_per_share: eqClass.nominal_amount_per_share || "",
                             total_amount: eqClass.total_amount || calculateTotal(eqClass.number_of_equity_shares, eqClass.nominal_amount_per_share),
                        }
                    };
                    return acc;
                }, {})
            },
            preference_share_capital: { /* ... similar to equity ... */
                 number_of_classes: sub.preferenceShares?.length || 0,
                 descriptions: (sub.preferenceShares || []).reduce((acc, prClass, prIdx) => {
                    acc[`description_${prIdx + 1}`] = {
                        class_of_shares: prClass.class_of_shares || "Preference",
                        subscribed_capital: {
                             number_of_preference_shares: prClass.number_of_preference_shares || "",
                             nominal_amount_per_share: prClass.nominal_amount_per_share || "",
                             total_amount: prClass.total_amount || calculateTotal(prClass.number_of_preference_shares, prClass.nominal_amount_per_share),
                        }
                    };
                    return acc;
                }, {})
            },
            // forexRequired might not be part of this API structure, check API doc
        };
    });

    // --- Saving 6C_individual_without_DIN ---
    templateToSave.subscribers["6C_individual_without_DIN"] = {};
    noDinSubscribers.forEach((sub, index) => {
        const subKey = (index + 1).toString();
        templateToSave.subscribers["6C_individual_without_DIN"][subKey] = {
            personal_details: {
                first_name: sub.firstName || "", middle_name: sub.middleName || "", surname: sub.surname || "",
                // ... map all personal details ...
                pan: sub.pan || "", email: sub.email || "",
            },
            permanent_address: {
                permanent_line1: sub.permAddrL1 || "", // ... map all permanent address fields ...
            },
            is_same_as_permanent: sub.isSameAsPermanent,
            present_address: {
                present_line1: sub.presAddrL1 || "", // ... map all present address fields ...
            },
            duration_of_stay: { years: sub.durationOfStayYears || "", months: sub.durationOfStayMonths || "" },
            previous_address: { previous_line1: sub.prevAddrL1 || "" /* ... */ },
            identity_proof: sub.idProofType || "", identity_proof_no: sub.idProofNo || "",
            residential_proof: sub.resProofType || "", residential_proof_no: sub.resProofNo || "",
            identity_proof_file: sub.idProofFile ? "id_proof.pdf" : "", // Placeholder
            residential_proof_file: sub.resProofFile ? "res_proof.pdf" : "", // Placeholder
            total_subscribed_share_capital: sub.totalSubscribedShareCapital || "",
            equity_share_capital: { /* ... similar to 6B ... */ },
            preference_share_capital: { /* ... similar to 6B ... */ },
        };
    });

 
    templateToSave.subscribers_cum_directors["7B_Subscriber_Without_DIN"] = noDinDirectors.map((dir, index) => {
      const dirKey = `subscriber_director_without_din_${index + 1}`;
      return {
          [dirKey]: {
              first_name: dir.firstName || "",
              middle_name: dir.middleName || "",
              surname: dir.surname || "",
              fathers_first_name: dir.fathers_first_name || "",
              fathers_middle_name: dir.fathers_middle_name || "",
              fathers_surname: dir.fathers_surname || "",
              gender: dir.gender || "",
              dob: dir.dob || "",
              nationality: dir.nationality || "",
              place_of_birth: dir.place_of_birth || "",
              is_citizen_of_india: dir.is_citizen_of_india === 'Yes' || dir.is_citizen_of_india === true ? "Yes" : "No", // API expects string "Yes"/"No" as per template
              is_resident_in_india: dir.is_resident_in_india === 'Yes' || dir.is_resident_in_india === true ? "Yes" : "No", // API expects string "Yes"/"No"
              occupation_type: dir.occupation_type || "",
              occupation_area: dir.occupation_area || "",
              educational_qualification: dir.educational_qualification || "",
              pan: dir.pan || "",
              designation: dir.designation || "",
              category: dir.category || "",
              is_chairman: dir.is_chairman || false,
              is_executive_director: dir.is_executive_director === undefined ? false : dir.is_executive_director, // API uses boolean
              is_non_executive_director: dir.is_non_executive_director || false,
              nominee_company_name: dir.nominee_company_name || "",
              mobile_number: dir.mobile_number || "",
              email_id: dir.email_id || "",
              permanent_address: {
                  line_1: dir.permanent_address?.line_1 || "",
                  line_2: dir.permanent_address?.line_2 || "",
                  country: dir.permanent_address?.country || "",
                  pin_code: dir.permanent_address?.pin_code || "",
                  area_locality: dir.permanent_address?.area_locality || "",
                  city: dir.permanent_address?.city || "",
                  district: dir.permanent_address?.district || "",
                  state_ut: dir.permanent_address?.state_ut || "",
                  phone: dir.permanent_address?.phone || "",
              },
              is_present_address_same_as_permanent: dir.is_present_address_same_as_permanent === undefined ? true : dir.is_present_address_same_as_permanent,
              present_address: (dir.is_present_address_same_as_permanent === false && dir.present_address) ? {
                  line_1: dir.present_address.line_1 || "",
                  line_2: dir.present_address.line_2 || "",
                  country: dir.present_address.country || "",
                  pin_code: dir.present_address.pin_code || "",
                  area_locality: dir.present_address.area_locality || "",
                  city: dir.present_address.city || "",
                  district: dir.present_address.district || "",
                  state_ut: dir.present_address.state_ut || "",
                  phone: dir.present_address.phone || "",
              } : {}, // Send empty object if same, as per API template
              duration_of_stay_at_present_address: { // API expects object
                  years: dir.duration_of_stay_at_present_address?.years || "",
                  months: dir.duration_of_stay_at_present_address?.months || "",
              },
              identity_proof_type: dir.identity_proof_type || "",
              identity_proof_number: dir.identity_proof_number || "",
              residential_proof_type: dir.residential_proof_type || "",
              residential_proof_number: dir.residential_proof_number || "",
              // API for 7B does not list file fields, unlike 7D. Omitting them here.
              total_subscribed_share_capital: dir.total_subscribed_share_capital || "",
              equity_share_capital: (dir.equityShares || []).map((eqClass, eqIdx) => ({
                  [`equity_class_${eqIdx + 1}`]: {
                      class_of_shares: eqClass.class_of_shares || "Equity",
                      subscribed_capital: eqClass.subscribed_capital || "", // API has this field here
                      number_of_equity_shares: eqClass.number_of_equity_shares || "",
                      nominal_amount_per_share: eqClass.nominal_amount_per_share || "",
                      total_amount: eqClass.total_amount || calculateTotal(eqClass.number_of_equity_shares, eqClass.nominal_amount_per_share),
                  }
              })),
              preference_share_capital: (dir.preferenceShares || []).map((prClass, prIdx) => ({ /* ... similar ... */ })),
              interest_in_other_entities: (dir.interests || []).reduce((acc, interest, iIdx) => {
                  acc[`entity_${iIdx + 1}`] = {
                      cin_llpin_fcrn_registration_number: interest.cin_llpin_fcrn_registration_number || "",
                      name: interest.name || "",
                      address: interest.address || "",
                      nature_of_interest: interest.nature_of_interest || "",
                      designation_other_specify_if_needed: interest.designation_other_specify_if_needed || "",
                      percentage_of_shareholding: interest.percentage_of_shareholding || "0",
                      amount: interest.amount || "",
                  };
                  return acc;
              }, {}),
          }
      };
  });
  
  // --- Saving 7C_Director_With_DIN ---
  templateToSave.subscribers_cum_directors["7C_Director_With_DIN"] = otherDinDirectors.map((dir, index) => {
      const dirKey = `director_with_din_${index + 1}`;
      return {
          [dirKey]: {
              director_identification_number_din: dir.director_identification_number_din || "",
              name: dir.name || "",
              designation: dir.designation || "",
              category: dir.category || "",
              chairman: dir.chairman || dir.role === 'Chairman' || false,
              executive_director: dir.executive_director || dir.role === 'Executive' || false,
              non_executive_director: dir.non_executive_director || dir.role === 'NonExecutive' || false,
              nominee_company_name: dir.nominee_company_name || "",
              email_id: dir.email_id || "",
              declaration_of_interests: (dir.interests || []).reduce((acc, interest, iIdx) => {
                  acc[`entity_${iIdx + 1}`] = {
                      cin_llpin_fcrn_registration_number: interest.cin_llpin_fcrn_registration_number || "",
                      name: interest.name || "",
                      address: interest.address || "",
                      nature_of_interest: interest.nature_of_interest || "",
                      designation_other_specify: interest.designation_other_specify || interest.designation_other_specify_if_needed || "",
                      percentage_of_shareholding: interest.percentage_of_shareholding || "0",
                      amount: interest.amount || interest.amount_in_inr || "",
                  };
                  return acc;
              }, {})
          }
      };
  });

  // --- Saving 7D_Director_Without_DIN ---
// Inside handleSaveData function...

    // --- Saving 7D_Director_Without_DIN ---
    templateToSave.subscribers_cum_directors["7D_Director_Without_DIN"] = directorsOnlyNoDin.map((dir, index) => {
      const dirKey = `director_without_din_${index + 1}`;
      
      // Handle type checkboxes for API booleans
      const isChairman = dir.types?.includes('Chairman') || dir.is_chairman || false;
      const isExecutiveDirector = dir.types?.includes('Executive') || (dir.is_executive_director === undefined ? false : dir.is_executive_director); // Default to false if not set
      const isNonExecutiveDirector = dir.types?.includes('NonExecutive') || dir.is_non_executive_director || false;

      // Format duration of stay
      let durationOfStayApi = "";
      if (dir.duration_of_stay_at_present_address?.years || dir.duration_of_stay_at_present_address?.months) {
          durationOfStayApi = `${dir.duration_of_stay_at_present_address.years || '00'}/${dir.duration_of_stay_at_present_address.months || '00'}`;
      } else if (dir.stayDuration) { // Fallback if UI uses single string
           durationOfStayApi = dir.stayDuration;
      }


      return {
          [dirKey]: {
              first_name: dir.firstName || "",
              middle_name: dir.middleName || "",
              surname: dir.surname || "",
              fathers_first_name: dir.fathers_first_name || "", // Assuming state matches API
              fathers_middle_name: dir.fathers_middle_name || "",
              fathers_surname: dir.fathers_surname || "",
              gender: dir.gender || "",
              dob: dir.dob || "", // Ensure YYYY-MM-DD
              nationality: dir.nationality || "",
              place_of_birth: dir.place_of_birth || "", // API key
              is_citizen_of_india: dir.is_citizen_of_india === 'Yes' || dir.is_citizen_of_india === true, // API wants boolean
              is_resident_in_india: dir.is_resident_in_india === 'Yes' || dir.is_resident_in_india === true, // API wants boolean
              occupation_type: dir.occupation_type || "",
              area_of_occupation: dir.area_of_occupation || "", // API key
              educational_qualification: dir.educational_qualification || "", // API key
              income_tax_pan: dir.income_tax_pan || "", // API key
              designation: dir.designation || "",
              category: dir.category || "",
              is_chairman: isChairman,
              is_executive_director: isExecutiveDirector,
              is_non_executive_director: isNonExecutiveDirector,
              nominee_company_name: dir.nominee_company_name || "",
              mobile_no: dir.mobile_no || "", // API key
              email_id: dir.email_id || "",   // API key
              permanent_address: {
                  line_1: dir.permAddr_line_1 || dir.permanent_address?.line_1 || "",
                  line_2: dir.permAddr_line_2 || dir.permanent_address?.line_2 || "",
                  country: dir.permAddr_country || dir.permanent_address?.country || "",
                  pin_code: dir.permAddr_pin_code || dir.permanent_address?.pin_code || "",
                  area_locality: dir.permAddr_area_locality || dir.permanent_address?.area_locality || "",
                  city: dir.permAddr_city || dir.permanent_address?.city || "",
                  district: dir.permAddr_district || dir.permanent_address?.district || "",
                  state_ut: dir.permAddr_state_ut || dir.permanent_address?.state_ut || "",
                  phone: dir.permAddr_phone || dir.permanent_address?.phone || "",
              },
              // API expects present_address object always, even if empty when same as permanent
              present_address: (dir.is_present_address_same_as_permanent === false || dir.addrSame === 'No') && (dir.present_address || dir.presAddr_line_1) ? {
                  line_1: dir.presAddr_line_1 || dir.present_address?.line_1 || "",
                  line_2: dir.presAddr_line_2 || dir.present_address?.line_2 || "",
                  country: dir.presAddr_country || dir.present_address?.country || "",
                  pin_code: dir.presAddr_pin_code || dir.present_address?.pin_code || "",
                  area_locality: dir.presAddr_area_locality || dir.present_address?.area_locality || "",
                  city: dir.presAddr_city || dir.present_address?.city || "",
                  district: dir.presAddr_district || dir.present_address?.district || "",
                  state_ut: dir.presAddr_state_ut || dir.present_address?.state_ut || "",
                  phone: dir.presAddr_phone || dir.present_address?.phone || "",
              } : { // Send empty structure as per API template if same or not provided
                  line_1: "", line_2: "", country: "", pin_code: "", area_locality: "",
                  city: "", district: "", state_ut: "", phone: ""
              },
              duration_of_stay_at_present_address: durationOfStayApi, // API wants string "YY/MM"
              identity_proof: dir.identity_proof_type || dir.identity_proof || "", // API key
              identity_proof_no: dir.identity_proof_no || "",
              residential_proof: dir.residential_proof_type || dir.residential_proof || "", // API key
              residential_proof_no: dir.residential_proof_no || "",
              proof_of_identity: dir.idProofFile ? (typeof dir.idProofFile === 'string' ? dir.idProofFile : dir.idProofFile.name) : "", // Placeholder for filename/URL
              proof_of_residential_address: dir.resProofFile ? (typeof dir.resProofFile === 'string' ? dir.resProofFile : dir.resProofFile.name) : "", // Placeholder
              declaration_of_interests: (dir.interests || []).reduce((acc, interest, iIdx) => {
                  acc[`entity_${iIdx + 1}`] = {
                      cin_llpin_fcrn_registration_number: interest.cin_llpin_fcrn_registration_number || interest.cin || "",
                      name: interest.name || "",
                      address: interest.address || "",
                      nature_of_interest: interest.nature_of_interest || "",
                      designation_other_specify: interest.designation_other_specify || "", // API key
                      percentage_of_shareholding: interest.percentage_of_shareholding || interest.shareholding || "0",
                      amount: interest.amount || "",
                  };
                  return acc;
              }, {}),
          }
      };
  });
  const apiPayload = { org_id: orgId, data: templateToSave };
  console.log("Payload to be sent to API for saving (7B,7C,7D focus):", apiPayload.data.subscribers_cum_directors);
  // ... rest of try-catch


    // ... rest of the save logic
    
   

    try {
      const response = await axios.post(API_URL, apiPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data?.status === 'success' || response.data?.message?.includes('success')) {
        toast.success("Data saved successfully!");
        return true;
      } else {
        toast.error("Failed to save: " + (response.data.message || 'Unknown error'));
        return false;
      }} catch (error) { 
        console.error("Error saving data:", error);
        if (error.response) console.error("Error saving data - response:", error.response.data);
        toast.error(`Error saving data: ${error.response?.data?.message || error.message}`);
        return false;
    }
  };

  const handleChange = (field, value) => { /* ... */ 
    if (field.includes('.')) {
        const keys = field.split('.');
        setFormData(prev => { let updated = { ...prev }; let current = updated;
            for (let i = 0; i < keys.length - 1; i++) { if (!current[keys[i]] || typeof current[keys[i]] !== 'object') current[keys[i]] = {}; current = current[keys[i]]; }
            current[keys[keys.length - 1]] = value; return updated;
        });
    } else if (field === 'incomeSource') { const { sourceName, checked } = value; setFormData(prev => ({ ...prev, incomeSources: { ...prev.incomeSources, [sourceName]: checked }}));
    } else { setFormData(prev => ({ ...prev, [field]: value })); }
  };
  const handleClassCountChange = (value) => { /* ... */ 
    const count = parseInt(value || 0, 10);
    const currentClasses = formData.equityShareClasses || [];
    const newClasses = Array.from({ length: count }, (_, i) => currentClasses[i] || { authNum: '', subNum: '', authNominal: '', subNominal: '' });
    setFormData(prev => ({ ...prev, equityClassesCount: count, equityShareClasses: newClasses }));
  };
  const handleChangeClass = (index, field, value) => { /* ... */ 
    setFormData(prev => {
        const updatedClasses = [...(prev.equityShareClasses || [])];
        if (!updatedClasses[index]) updatedClasses[index] = { authNum: '', subNum: '', authNominal: '', subNominal: '' };
        updatedClasses[index][field] = value;
        return { ...prev, equityShareClasses: updatedClasses };
    });
  };
  const handlePrefClassCountChange = (value) => { /* ... */ 
    const count = parseInt(value || 0, 10);
    const current = formData.prefShareClasses || [];
    const newClasses = Array.from({ length: count }, (_, i) => current[i] || { authNum: '', subNum: '', authNominal: '', subNominal: '' });
    setFormData(prev => ({ ...prev, prefClassesCount: count, prefShareClasses: newClasses }));
  };
  const handlePrefClassChange = (index, field, value) => { /* ... */ 
    setFormData(prev => {
        const updated = [...(prev.prefShareClasses || [])];
        if(!updated[index]) updated[index] = { authNum: '', subNum: '', authNominal: '', subNominal: '' };
        updated[index][field] = value;
        return {...prev, prefShareClasses: updated };
    });
  };
  const handleFileChange = (field, file) => { /* ... */ 
      setFormData(prev => ({ ...prev, [field]: file ? file.name : null }));
  };
  const handleNext = async () => { /* ... */ 
    const savedSuccessfully = await handleSaveData();
    if (savedSuccessfully) {
      if (currentCard < totalCards) setCurrentCard(prev => prev + 1);
      else { console.log('Reached last step or form submitted'); toast.success("Form successfully submitted!"); }
    } else { toast.error("Could not proceed. Please check errors."); }
  };
  const handlePrev = () => { /* ... */ if (currentCard > 1) setCurrentCard(prev => prev - 1); };
  const handlePageChange = (pageNumber) => { /* ... */ if (pageNumber >= 1 && pageNumber <= totalCards) setCurrentCard(pageNumber);};
  const handleInnerFormSubmit = (e) => e.preventDefault();


  const renderCardContent = () => {
    const getCurrentItem = (array, tabIndex) => array?.[tabIndex] || {};
    
    // Specific handler for nonIndividualSubscribers address (example)
    const handleNonIndRegAddressChange = (tabIndex, field, value) => { /* ... */ 
      const updated = [...nonIndividualSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialNonIndividualSubscriber);
      updated[tabIndex][field] = value; 
      setNonIndividualSubscribers(updated);
  };
  const handleNonIndAuthPersonChange = (tabIndex, field, value) => { /* ... */ 
      const updated = [...nonIndividualSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialNonIndividualSubscriber);
      updated[tabIndex][field] = value;
      setNonIndividualSubscribers(updated);
  };
  const handleNonIndAuthPersonPresAddressChange = (tabIndex, field, value) => { /* ... */ 
      const updated = [...nonIndividualSubscribers];
       if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialNonIndividualSubscriber);
      updated[tabIndex][field] = value; 
      setNonIndividualSubscribers(updated);
  };
  const handleNonIndEquityClassCountChange = (tabIndex, countStr) => { /* ... */
      const count = parseInt(countStr, 10) || 0;
      const updated = [...nonIndividualSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialNonIndividualSubscriber);
      if (!updated[tabIndex].equityShares) updated[tabIndex].equityShares = []; // Ensure array exists
      const currentShares = updated[tabIndex].equityShares;
      updated[tabIndex].equityShares = Array.from({ length: count }, (_, i) =>
          currentShares[i] || { class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }
      );
      setNonIndividualSubscribers(updated);
  };
  const handleNonIndEquityShareChange = (tabIndex, shareIndex, field, value) => { /* ... */ 
      const updated = [...nonIndividualSubscribers];
      if (!updated[tabIndex]?.equityShares?.[shareIndex]) return; 
      updated[tabIndex].equityShares[shareIndex][field] = value;
      if (field === 'number_of_equity_shares' || field === 'nominal_amount_per_share') {
          const num = parseFloat(updated[tabIndex].equityShares[shareIndex].number_of_equity_shares) || 0;
          const nom = parseFloat(updated[tabIndex].equityShares[shareIndex].nominal_amount_per_share) || 0;
          updated[tabIndex].equityShares[shareIndex].total_amount = (num * nom).toFixed(2);
      }
      setNonIndividualSubscribers(updated);
  };
  // Add similar handlers for Preference Shares for NonIndividualSubscribers


  // For Case 7 (IndividualSubscriberDIN - `subscribers` state)
  const handleSubscriberChange = (tabIndex, field, value) => {
      const updated = [...subscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberDIN);
      updated[tabIndex][field] = value;
      setSubscribers(updated);
  };
  const handleSubscriberEquityClassCountChange = (tabIndex, countStr) => {
      const count = parseInt(countStr, 10) || 0;
      const updated = [...subscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberDIN);
      if(!updated[tabIndex].equityShares) updated[tabIndex].equityShares = [];
      const currentShares = updated[tabIndex].equityShares;
      updated[tabIndex].equityShares = Array.from({ length: count }, (_, i) =>
          currentShares[i] || { class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }
      );
      setSubscribers(updated);
  };
  const handleSubscriberEquityShareChange = (tabIndex, shareIndex, field, value) => {
      const updated = [...subscribers];
      if (!updated[tabIndex]?.equityShares?.[shareIndex]) return;
      updated[tabIndex].equityShares[shareIndex][field] = value;
       if (field === 'number_of_equity_shares' || field === 'nominal_amount_per_share') {
          const num = parseFloat(updated[tabIndex].equityShares[shareIndex].number_of_equity_shares) || 0;
          const nom = parseFloat(updated[tabIndex].equityShares[shareIndex].nominal_amount_per_share) || 0;
          updated[tabIndex].equityShares[shareIndex].total_amount = (num * nom).toFixed(2);
      }
      setSubscribers(updated);
  };
  const handleSubscriberPrefClassCountChange = (tabIndex, countStr) => { /* ... Similar to equity ... */
      const count = parseInt(countStr, 10) || 0;
      const updated = [...subscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberDIN);
      if(!updated[tabIndex].preferenceShares) updated[tabIndex].preferenceShares = [];
      const currentShares = updated[tabIndex].preferenceShares;
      updated[tabIndex].preferenceShares = Array.from({ length: count }, (_, i) =>
          currentShares[i] || { class_of_shares: 'Preference', number_of_preference_shares: '', nominal_amount_per_share: '', total_amount: '' }
      );
      setSubscribers(updated);
  };
  const handleSubscriberPrefShareChange = (tabIndex, shareIndex, field, value) => { /* ... Similar to equity ... */
      const updated = [...subscribers];
      if (!updated[tabIndex]?.preferenceShares?.[shareIndex]) return;
      updated[tabIndex].preferenceShares[shareIndex][field] = value;
      if (field === 'number_of_preference_shares' || field === 'nominal_amount_per_share') {
          const num = parseFloat(updated[tabIndex].preferenceShares[shareIndex].number_of_preference_shares) || 0;
          const nom = parseFloat(updated[tabIndex].preferenceShares[shareIndex].nominal_amount_per_share) || 0;
          updated[tabIndex].preferenceShares[shareIndex].total_amount = (num * nom).toFixed(2);
      }
      setSubscribers(updated);
  };


  // For Case 8 (IndividualSubscriberNoDIN - `noDinSubscribers` state)
  const handleNoDinSubscriberChange = (tabIndex, fieldPath, value) => {
      const updated = [...noDinSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberNoDIN);
      let current = updated[tabIndex];
      const parts = fieldPath.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setNoDinSubscribers(updated);
  };
  const handleNoDinSubscriberEquityClassCountChange = (tabIndex, countStr) => { /* ... */
      const count = parseInt(countStr, 10) || 0;
      const updated = [...noDinSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberNoDIN);
      if(!updated[tabIndex].equityShares) updated[tabIndex].equityShares = [];
      const currentShares = updated[tabIndex].equityShares;
      updated[tabIndex].equityShares = Array.from({ length: count }, (_, i) =>
          currentShares[i] || { class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }
      );
      setNoDinSubscribers(updated);
  };
  const handleNoDinSubscriberEquityShareChange = (tabIndex, shareIndex, field, value) => { /* ... */
      const updated = [...noDinSubscribers];
      if (!updated[tabIndex]?.equityShares?.[shareIndex]) return;
      updated[tabIndex].equityShares[shareIndex][field] = value;
      if (field === 'number_of_equity_shares' || field === 'nominal_amount_per_share') {
          const num = parseFloat(updated[tabIndex].equityShares[shareIndex].number_of_equity_shares) || 0;
          const nom = parseFloat(updated[tabIndex].equityShares[shareIndex].nominal_amount_per_share) || 0;
          updated[tabIndex].equityShares[shareIndex].total_amount = (num * nom).toFixed(2);
      }
      setNoDinSubscribers(updated);
  };
  // ... Add handlers for Preference shares for IndividualSubscriberNoDIN ...
   const handleNoDinSubscriberFileChange = (tabIndex, field, file) => {
      const updated = [...noDinSubscribers];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialIndividualSubscriberNoDIN);
      updated[tabIndex][field] = file; // Store file object or name
      setNoDinSubscribers(updated);
  };


  // For Case 9 (SubscriberDirectorDIN - `cDirectors` state)
  const handleCDirectorChange = (tabIndex, fieldPath, value) => { /* ... Similar to handleNoDinSubscriberChange ... */
      const updated = [...cDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialSubscriberDirectorDIN);
      let current = updated[tabIndex];
      const parts = fieldPath.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setCDirectors(updated);
  };
  const handleCDirectorEquityClassCountChange = (tabIndex, countStr) => { /* ... */
      const count = parseInt(countStr, 10) || 0;
      const updated = [...cDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialSubscriberDirectorDIN);
      if(!updated[tabIndex].equityShares) updated[tabIndex].equityShares = [];
      const currentShares = updated[tabIndex].equityShares;
      updated[tabIndex].equityShares = Array.from({ length: count }, (_, i) =>
          currentShares[i] || { class_of_shares: 'Equity', number_of_equity_shares: '', nominal_amount_per_share: '', total_amount: '' }
      );
      setCDirectors(updated);
   };
  const handleCDirectorEquityShareChange = (tabIndex, shareIndex, field, value) => { /* ... */
      const updated = [...cDirectors];
      if (!updated[tabIndex]?.equityShares?.[shareIndex]) return;
      updated[tabIndex].equityShares[shareIndex][field] = value;
      if (field === 'number_of_equity_shares' || field === 'nominal_amount_per_share') {
          const num = parseFloat(updated[tabIndex].equityShares[shareIndex].number_of_equity_shares) || 0;
          const nom = parseFloat(updated[tabIndex].equityShares[shareIndex].nominal_amount_per_share) || 0;
          updated[tabIndex].equityShares[shareIndex].total_amount = (num * nom).toFixed(2);
      }
      setCDirectors(updated);
  };
  const handleCDirectorInterestCountChange = (tabIndex, countStr) => {
      const count = parseInt(countStr, 10) || 0;
      const updated = [...cDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialSubscriberDirectorDIN);
      if(!updated[tabIndex].interests) updated[tabIndex].interests = [];
      const currentInterests = updated[tabIndex].interests;
      updated[tabIndex].interests = Array.from({ length: count }, (_, i) =>
          currentInterests[i] || { cin_llpin_fcrn_registration_number: '', name: '', address: '', nature_of_interest: '', designation_other_specify_if_needed:'', percentage_of_shareholding: '0', amount_in_inr: '' }
      );
      setCDirectors(updated);
  };
  const handleCDirectorInterestChange = (tabIndex, interestIndex, field, value) => {
      const updated = [...cDirectors];
      if (!updated[tabIndex]?.interests?.[interestIndex]) return;
      updated[tabIndex].interests[interestIndex][field] = value;
      setCDirectors(updated);
  };


  // For Case 10 (SubscriberDirectorNoDIN - `noDinDirectors` state)
  const updateNoDinDirectorField = (tabIndex, fieldPath, value) => { /* ... Similar to handleNoDinSubscriberChange ... */
      const updated = [...noDinDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialSubscriberDirectorNoDIN);
      let current = updated[tabIndex];
      const parts = fieldPath.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setNoDinDirectors(updated);
  };
  const handleNoDinDirectorFileChange = (tabIndex, field, file) => { /* ... For file uploads ... */
      const updated = [...noDinDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialSubscriberDirectorNoDIN);
      updated[tabIndex][field] = file; 
      setNoDinDirectors(updated);
   };
  // ... Add Equity/Pref/Interest count/change handlers for noDinDirectors


  // For Case 11 (DirectorDIN - `otherDinDirectors` state)
  const updateOtherDinDirectorField = (tabIndex, fieldPath, value) => { /* ... */
      const updated = [...otherDinDirectors];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialDirectorDIN);
      let current = updated[tabIndex];
      const parts = fieldPath.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setOtherDinDirectors(updated);
  };
  // ... Add Interest count/change handlers for otherDinDirectors


  // For Case 12 (DirectorNoDIN - `directorsOnlyNoDin` state)
  const updateDirectorsOnlyNoDinField = (tabIndex, fieldPath, value) => { /* ... */
      const updated = [...directorsOnlyNoDin];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialDirectorNoDIN);
      let current = updated[tabIndex];
      const parts = fieldPath.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setDirectorsOnlyNoDin(updated);
  };
  const handleDirectorsOnlyNoDinFileChange = (tabIndex, field, file) => { /* ... */
      const updated = [...directorsOnlyNoDin];
      if (!updated[tabIndex]) updated[tabIndex] = deepClone(initialDirectorNoDIN);
      updated[tabIndex][field] = file; 
      setDirectorsOnlyNoDin(updated);
  };


    switch (currentCard) {
      case 1: /* ... Case 1 JSX ... */ 
            return ( /* ... Your Case 1 JSX ... */
          <form onSubmit={handleInnerFormSubmit}>
            <div className="section-heading">1. Structure of the Company</div>
            <div className="row mb-3"><div className="col-md-12"><label className="form-label_sp">1(a) <span className="text-danger">*</span>Whether AOA is entrenched?</label><div className="form-check form-check-inline ms-2"><input className="form-check-input" type="radio" name="aoaEntrenched" id="aoaYes" value="Yes" checked={formData.aoaIsEntrenched === true} onChange={() => handleChange('aoaIsEntrenched', true)} /><label className="form-check-label" htmlFor="aoaYes">Yes</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="aoaEntrenched" id="aoaNo" value="No" checked={formData.aoaIsEntrenched === false} onChange={() => { handleChange('aoaIsEntrenched', false); handleChange('entrenchedArticlesCount', '0'); handleChange('entrenchedArticles', [{ articleNumber: '', description: '' }]); }} /><label className="form-check-label" htmlFor="aoaNo">No</label></div></div></div>
            {formData.aoaIsEntrenched === true && (<><div className="row mb-3 mt-2"><div className="col-md-5"><label htmlFor="entrenchedArticlesCount" className="form-label_sp d-block">(b) Number of Articles to which provisions of entrenchment is applicable</label></div><div className="col-md-2"><input type="number" className="form-control" id="entrenchedArticlesCount" value={formData.entrenchedArticlesCount} onChange={(e) => { const value = e.target.value; const count = parseInt(value, 10); handleChange('entrenchedArticlesCount', value); if (!isNaN(count) && count >= 0) { const currentArticles = formData.entrenchedArticles || []; const newArticles = Array.from({ length: count }, (_, i) => currentArticles[i] || { articleNumber: '', description: '' }); handleChange('entrenchedArticles', newArticles.length > 0 ? newArticles : [{ articleNumber: '', description: '' }]); } else if (value === '') { handleChange('entrenchedArticles', [{ articleNumber: '', description: '' }]);} }} min="0" placeholder="Enter number" /></div></div>{formData.entrenchedArticles && formData.entrenchedArticles.length > 0 && Number(formData.entrenchedArticlesCount) > 0 && (<div className="mt-3"><div className="section-heading mb-2">Details of such articles</div><div className="table-responsive"><table className="table table-bordered table-sm"><thead><tr><th style={{width: '10%'}}>Sr. No.</th><th style={{width: '10%'}}>Article Number</th><th>Short description on entrenchment of the clause</th></tr></thead><tbody>{formData.entrenchedArticles.map((article, index) => (<tr key={index}><td className="text-center">{index + 1}</td><td><input type="text" className="form-control form-control-sm" value={article.articleNumber} onChange={(e) => { const updatedArticles = [...formData.entrenchedArticles]; updatedArticles[index] = { ...updatedArticles[index], articleNumber: e.target.value }; handleChange('entrenchedArticles', updatedArticles); }}/></td><td><input type="text" className="form-control form-control-sm" value={article.description} onChange={(e) => { const updatedArticles = [...formData.entrenchedArticles]; updatedArticles[index] = { ...updatedArticles[index], description: e.target.value }; handleChange('entrenchedArticles', updatedArticles); }}/></td></tr>))}</tbody></table></div></div>)}</>)}
            <div className="section-heading mb-2 mt-3">2. Company</div><label className="form-label_sp"><span className="text-danger">*</span>Company is?</label><div className="mb-3"><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="companyType" id="shareCapitalYes" value="shareCapitalYes" checked={formData.companyType === 'shareCapitalYes'} onChange={(e) => handleChange('companyType', e.target.value)} /><label className="form-check-label" htmlFor="shareCapitalYes">Having share capital</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="companyType" id="shareCapitalNo" value="shareCapitalNo" checked={formData.companyType === 'shareCapitalNo'} onChange={(e) => handleChange('companyType', e.target.value)} /><label className="form-check-label" htmlFor="shareCapitalNo">Not having share capital</label></div></div>
            <div className="section-heading">3A. Capital structure of the company</div><div className="row mb-3"><div className="col-md-3"><label htmlFor="auth_capital_total" className="form-label_sp">Total authorized share capital (INR)</label><input type="number" className="form-control" id="auth_capital_total" value={formData.authCapitalTotal} readOnly onChange={(e) => handleChange('authCapitalTotal', e.target.value)} /></div><div className="col-md-3"><label htmlFor="auth_capital_classified" className="form-label_sp">Classified authorized share capital (INR)</label><input type="number" className="form-control" id="auth_capital_classified" value={formData.authCapitalClassified} readOnly onChange={(e) => handleChange('authCapitalClassified', e.target.value)} /></div><div className="col-md-3"><label htmlFor="sub_capital_total" className="form-label_sp">Subscribed share capital (INR)</label><input type="number" className="form-control" id="sub_capital_total" value={formData.subCapitalTotal} readOnly onChange={(e) => handleChange('subCapitalTotal', e.target.value)} /></div><div className="col-md-3"><label htmlFor="auth_capital_unclassified" className="form-label_sp"><span className="text-danger">*</span>Unclassified authorized share capital (INR)</label><input type="number" className="form-control" id="auth_capital_unclassified" value={formData.authCapitalUnclassified} onChange={(e) => handleChange('authCapitalUnclassified', e.target.value)} /></div></div>
          </form>
        );
      case 2: /* ... Case 2 JSX ... */ 
            return (
              <>
                {/* 3A(i) Equity Share Capital */}
                <div className="sub-heading">3A(i) <span className="text-danger">*</span>Equity share capital</div>
                <div className="row mb-3">
                  <div className="col-md-4 d-flex align-items-center">
                    <label htmlFor="equity_classes_count" className="form-label_sp me-2 mb-0">Number of classes:</label>
                    <input type="number" id="equity_classes_count" value={formData.equityClassesCount} onChange={(e) => handleClassCountChange(e.target.value)} className="form-control" style={{ maxWidth: '100px' }} />
                  </div>
                </div>
                <div className="sub-heading" style={{ fontSize: '0.8rem', marginTop: '0' }}>Description of equity share capital</div>
                {formData.equityShareClasses.map((share, index) => {
                  const equityAuthTotal = (parseFloat(share.authNum) || 0) * (parseFloat(share.authNominal) || 0);
                  const equitySubTotal = (parseFloat(share.subNum) || 0) * (parseFloat(share.subNominal) || 0);
                  return (
                    <div key={`equity-class-${index}`}>
                      <div className="sub-heading">Class {index + 1}</div>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead><tr><th>Class of shares</th><th>Authorized capital</th><th>Subscribed capital</th></tr></thead>
                          <tbody>
                            <tr><td>Number of equity shares</td><td><input type="number" className="form-control" value={share.authNum} onChange={(e) => handleChangeClass(index, 'authNum', e.target.value)}/></td><td><input type="number" className="form-control" value={share.subNum} onChange={(e) => handleChangeClass(index, 'subNum', e.target.value)}/></td></tr>
                            <tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.authNominal} onChange={(e) => handleChangeClass(index, 'authNominal', e.target.value)}/></td><td><input type="number" className="form-control" value={share.subNominal} onChange={(e) => handleChangeClass(index, 'subNominal', e.target.value)}/></td></tr>
                            <tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={equityAuthTotal.toFixed(2)} readOnly /></td><td><input type="number" className="form-control" value={equitySubTotal.toFixed(2)} readOnly /></td></tr>
                          </tbody></table></div></div>);
                })}
                {/* 3A(ii) Preference Share Capital */}
                <div className="sub-heading">3A(ii) <span className="text-danger">*</span>Preference share capital</div>
                <div className="row mb-3"><div className="col-md-4 d-flex align-items-center"><label htmlFor="pref_classes_count" className="form-label_sp me-2 mb-0">Number of classes:</label><input type="number" id="pref_classes_count" value={formData.prefClassesCount} onChange={(e) => handlePrefClassCountChange(e.target.value)} className="form-control" style={{ maxWidth: '100px' }}/></div></div>
                <div className="sub-heading" style={{ fontSize: '0.8rem', marginTop: '0' }}>Description of Preference share capital</div> {/* Corrected margin */}
                {formData.prefShareClasses.map((share, index) => {
                  const prefAuthTotal = (parseFloat(share.authNum) || 0) * (parseFloat(share.authNominal) || 0);
                  const prefSubTotal = (parseFloat(share.subNum) || 0) * (parseFloat(share.subNominal) || 0);
                  return (
                    <div key={`pref-class-${index}`}><div className="sub-heading">Class {index + 1}</div><div className="table-responsive"><table className="table table-bordered"><thead><tr><th>Class of shares</th><th>Authorized capital</th><th>Subscribed capital</th></tr></thead><tbody>
                            <tr><td>Number of preference shares</td><td><input type="number" className="form-control" value={share.authNum} onChange={(e) => handlePrefClassChange(index, 'authNum', e.target.value)}/></td><td><input type="number" className="form-control" value={share.subNum} onChange={(e) => handlePrefClassChange(index, 'subNum', e.target.value)}/></td></tr>
                            <tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.authNominal} onChange={(e) => handlePrefClassChange(index, 'authNominal', e.target.value)}/></td><td><input type="number" className="form-control" value={share.subNominal} onChange={(e) => handlePrefClassChange(index, 'subNominal', e.target.value)}/></td></tr>
                            <tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={prefAuthTotal.toFixed(2)} readOnly /></td><td><input type="number" className="form-control" value={prefSubTotal.toFixed(2)} readOnly /></td></tr>
                          </tbody></table></div></div>);
                })}
                {/* 3B Details of number of members */}
                <div className="section-heading">3B <span className="text-danger">*</span>Details of number of members</div>
                <div className="row mb-3">
                  <div className="col-md-6"><label htmlFor="max_members" className="form-label_sp">(a) Enter the maximum number of members</label><input type="number" id="max_members" name="max_members" className="form-control" value={formData.maxMembers} onChange={(e) => handleChange('maxMembers', e.target.value)}/></div>
                  <div className="col-md-6"><label htmlFor="max_members_excl" className="form-label_sp">(b) Maximum number excluding proposed employees</label><input type="number" id="max_members_excl" name="max_members_excl" className="form-control" value={formData.maxMembersExcl} onChange={(e) => handleChange('maxMembersExcl', e.target.value)}/></div>
                  <div className="col-md-6 mt-3"><label htmlFor="num_members" className="form-label_sp">(c) Number of members</label><input type="number" id="num_members" name="num_members" className="form-control" value={formData.numMembers} onChange={(e) => handleChange('numMembers', e.target.value)}/></div>
                  <div className="col-md-6 mt-3"><label htmlFor="num_members_excl_emp" className="form-label_sp">(d) Number of members excluding proposed employee(s)</label><input type="number" id="num_members_excl_emp" name="num_members_excl_emp" className="form-control" value={formData.numMembersExclEmp} onChange={(e) => handleChange('numMembersExclEmp', e.target.value)}/></div>
                </div>
              </>
            );
      case 3: /* ... Case 3 JSX ... */ 
            return (
              <>
                <div className="section-heading mb-3">4. Correspondence Address</div>
                <div className="sub-heading mb-2">4A <span className="text-danger">*</span>Correspondence Address</div>
                <div className="row mb-3"><div className="col-md-6"><label htmlFor="corr_addr_line1" className="form-label_sp"><span className="text-danger">*</span>Line 1</label><input type="text" id="corr_addr_line1" name="corr_addr_line1" className="form-control" value={formData.corrAddrLine1} onChange={(e) => handleChange('corrAddrLine1', e.target.value)}/></div><div className="col-md-6"><label htmlFor="corr_addr_line2" className="form-label_sp">Line 2</label><input type="text" id="corr_addr_line2" name="corr_addr_line2" className="form-control" value={formData.corrAddrLine2} onChange={(e) => handleChange('corrAddrLine2', e.target.value)}/></div></div>
                <div className="row mb-3"><div className="col-md-3 col-6"><label htmlFor="corr_addr_pincode" className="form-label_sp"><span className="text-danger">*</span>Pin code</label><input type="text" id="corr_addr_pincode" name="corr_addr_pincode" className="form-control" value={formData.corrAddrPincode} onChange={(e) => handleChange('corrAddrPincode', e.target.value)}/></div><div className="col-md-3 col-6"><label htmlFor="corr_addr_mobile" className="form-label_sp">Mobile No.</label><input type="tel" id="corr_addr_mobile" name="corr_addr_mobile" className="form-control" value={formData.corrAddrMobile} onChange={(e) => handleChange('corrAddrMobile', e.target.value)}/></div><div className="col-md-3 col-6 mt-3 mt-md-0"><label htmlFor="corr_addr_phone" className="form-label_sp">Phone No.</label><input type="tel" id="corr_addr_phone" name="corr_addr_phone" className="form-control" value={formData.corrAddrPhone} onChange={(e) => handleChange('corrAddrPhone', e.target.value)}/></div><div className="col-md-3 col-6 mt-3 mt-md-0"><label htmlFor="corr_addr_fax" className="form-label_sp">Fax</label><input type="tel" id="corr_addr_fax" name="corr_addr_fax" className="form-control" value={formData.corrAddrFax} onChange={(e) => handleChange('corrAddrFax', e.target.value)}/></div></div>
                <div className="row mb-3"><div className="col-md-6"><label htmlFor="corr_addr_state" className="form-label_sp"><span className="text-danger">*</span>State/UT</label><input type="text" id="corr_addr_state" name="corr_addr_state" className="form-control" value={formData.corrAddrState} onChange={(e) => handleChange('corrAddrState', e.target.value)}/></div><div className="col-md-6"><label htmlFor="corr_addr_district" className="form-label_sp"><span className="text-danger">*</span>District</label><input type="text" id="corr_addr_district" name="corr_addr_district" className="form-control" value={formData.corrAddrDistrict} onChange={(e) => handleChange('corrAddrDistrict', e.target.value)}/></div></div>
                <div className="row mb-3"><div className="col-md-6"><label htmlFor="corr_addr_city" className="form-label_sp"><span className="text-danger">*</span>City</label><input type="text" id="corr_addr_city" name="corr_addr_city" className="form-control" value={formData.corrAddrCity} onChange={(e) => handleChange('corrAddrCity', e.target.value)}/></div><div className="col-md-6"><label htmlFor="corr_addr_locality" className="form-label_sp"><span className="text-danger">*</span>Area/Locality</label><input type="text" id="corr_addr_locality" name="corr_addr_locality" className="form-control" value={formData.corrAddrLocality} onChange={(e) => handleChange('corrAddrLocality', e.target.value)}/></div></div>
                <div className="row mb-3"><div className="col-12"><label htmlFor="corr_addr_email" className="form-label_sp"><span className="text-danger">*</span>Email ID of the company</label><input type="email" id="corr_addr_email" name="corr_addr_email" className="form-control" value={formData.corrAddrEmail} onChange={(e) => handleChange('corrAddrEmail', e.target.value)}/></div></div>
              </>
            );
      case 4: /* ... Case 4 JSX ... */ 
             return (
               <>
                 <div className="row mb-3"><div className="col-12"><label className="form-label_sp">4B <span className="text-danger">*</span>Is correspondence address same as registered office address?<span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>(If Yes, provide Longitude and Latitude)</span></label><div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="addrSameAsReg" id="addrSameYesP3" value="Yes" checked={formData.addrSameAsReg === true} onChange={() => handleChange('addrSameAsReg', true)}/> <label className="form-check-label" htmlFor="addrSameYesP3">Yes</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="addrSameAsReg" id="addrSameNoP3" value="No" checked={formData.addrSameAsReg === false} onChange={() => handleChange('addrSameAsReg', false)}/> <label className="form-check-label" htmlFor="addrSameNoP3">No</label></div></div></div></div>
                 {formData.addrSameAsReg && (<div className="row mb-3"><div className="col-md-4"><label htmlFor="reg_office_longitude" className="form-label_sp">Longitude</label><input type="text" id="reg_office_longitude" name="reg_office_longitude" value={formData.regOfficeLongitude} onChange={(e) => handleChange('regOfficeLongitude', e.target.value)} className="form-control" /></div><div className="col-md-4"><label htmlFor="reg_office_latitude" className="form-label_sp">Latitude</label><input type="text" id="reg_office_latitude" name="reg_office_latitude" value={formData.regOfficeLatitude} onChange={(e) => handleChange('regOfficeLatitude', e.target.value)} className="form-control" /></div></div>)}
                 <div className="sub-heading mt-3">Attachments (Registered Office):</div>
                  <div className="row mb-3"><div className="col-md-6"><label htmlFor="attach_office_proof" className="form-label_sp" style={{ fontSize: '0.8rem' }}>1. Proof of Office address & NOC {formData.attachOfficeProof && `(Selected: ${formData.attachOfficeProof})`}</label><input type="file" className="form-control" id="attach_office_proof" name="attach_office_proof" onChange={(e) => handleFileChange('attachOfficeProof', e.target.files[0])} /> <span className="text-muted" style={{ fontSize: '0.75rem' }}>(e.g., Lease Deed, Rent Agreement, NOC. Max 2MB)</span></div><div className="col-md-6"><label htmlFor="attach_utility_bill" className="form-label_sp" style={{ fontSize: '0.8rem' }}>2. Copy of utility bill (≤ 2 months old) {formData.attachUtilityBill && `(Selected: ${formData.attachUtilityBill})`}</label><input type="file" className="form-control" id="attach_utility_bill" name="attach_utility_bill" onChange={(e) => handleFileChange('attachUtilityBill', e.target.files[0])} /> <span className="text-muted" style={{ fontSize: '0.75rem' }}>(e.g., Electricity, Gas, Phone Bill. Max 2MB)</span></div></div>
                   <div className="row mt-4"><div className="col-12"><label htmlFor="roc_office" className="form-label_sp">4C <span className="text-danger">*</span>Registrar of Companies (ROC)</label><input type="text" id="roc_office" name="roc_office" value={formData.rocOffice} onChange={(e) => handleChange('rocOffice', e.target.value)} className="form-control" /></div></div>
               </>
             );
      case 5: /* ... Case 5 JSX from your prompt ... */ 
            return (
              <>
                <div className="section-heading mb-3">5 <span className="text-danger">*</span> Number of first subscriber(s) to MOA and directors of the company</div>
                <div className="table-responsive"><table className="table table-bordered"><thead><tr><th>Category</th><th>Having valid DIN</th><th>Not having valid DIN</th><th>Total</th></tr></thead><tbody>
                <tr><td>(a) Total number of first subscribers (non-individual + individual)</td><td><input type="number" className="form-control" value={aValidDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setAValidDinCount(val); const diff = Math.max(val - bValidDinCount, 0); setSubscribers(Array.from({ length: diff }, (_, i) => subscribers[i] || deepClone(initialIndividualSubscriberDIN) )); setActiveTab(0);}}/></td><td><input type="number" className="form-control" value={aNoDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setANoDinCount(val); const diff = Math.max(val - bNoDinCount, 0); setNoDinSubscribers(Array.from({ length: diff }, (_, i) => noDinSubscribers[i] || deepClone(initialIndividualSubscriberNoDIN) )); setNoDinTab(0);}}/></td><td><input type="number" className="form-control" value={aValidDinCount + aNoDinCount} readOnly/></td></tr>
                <tr><td>(b) Number of non-individual first subscriber(s)</td><td><input type="number" className="form-control" value={bValidDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setBValidDinCount(val); const diff = Math.max(aValidDinCount - val, 0); setSubscribers(Array.from({ length: diff }, (_, i) => subscribers[i] || deepClone(initialIndividualSubscriberDIN))); setActiveTab(0); /* Non-ind with DIN might need its own list if structure differs from individual */}}/></td><td><input type="number" className="form-control" value={bNoDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setBNoDinCount(val); const diff = Math.max(aNoDinCount - val, 0); setNoDinSubscribers(Array.from({ length: diff }, (_, i) => noDinSubscribers[i] || deepClone(initialIndividualSubscriberNoDIN) )); setNoDinTab(0); setNonIndividualSubscribers(Array.from({ length: val }, (_, i) => nonIndividualSubscribers[i] || deepClone(initialNonIndividualSubscriber) )); setNonIndTab(0);}}/></td><td><input type="number" className="form-control" value={bValidDinCount + bNoDinCount} readOnly /></td></tr>
                <tr><td>(c) Number of individual first subscriber(s) cum director(s)</td><td><input type="number" className="form-control" value={cValidDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setCValidDinCount(val); setCDirectors(Array.from({ length: val }, (_, i) => cDirectors[i] || deepClone(initialSubscriberDirectorDIN) )); setCActiveTab(0);}}/></td><td><input type="number" className="form-control" value={cNoDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setCNoDinCount(val); setNoDinDirectors(Array.from({ length: val }, (_, i) => noDinDirectors[i] || deepClone(initialSubscriberDirectorNoDIN) )); setNoDinActiveTab(0);}}/></td><td><input type="number" className="form-control" value={cValidDinCount + cNoDinCount} readOnly /></td></tr>
                <tr><td>(d) Total number of directors (directors who are not subscribers + subscriber cum directors)</td><td><input type="number" className="form-control" value={dValidDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setDValidDinCount(val); const diff = Math.max(val - cValidDinCount, 0); setOtherDinDirectors(Array.from({ length: diff }, (_, i) => otherDinDirectors[i] || deepClone(initialDirectorDIN) )); setOtherDinTab(0);}}/></td><td><input type="number" className="form-control" value={dNoDinCount} onChange={(e) => { const val = parseInt(e.target.value || 0, 10); setDNoDinCount(val); const diff = Math.max(val - cNoDinCount, 0); setDirectorsOnlyNoDin(Array.from({ length: diff }, (_, i) => directorsOnlyNoDin[i] || deepClone(initialDirectorNoDIN) )); setDirectorsOnlyNoDinTab(0);}}/></td><td><input type="number" className="form-control" value={dValidDinCount + dNoDinCount} readOnly /></td></tr>
                </tbody></table></div></>
            );

        case 6: { // Particulars of non-individual first subscriber(s) - 6A
            const currentItem = getCurrentItem(nonIndividualSubscribers, nonIndTab);
            return (
                <>
                    <div className="tab-container">
                        {nonIndividualSubscribers.map((_, index) => ( <button key={`nonind-tab-${index}`} className={`tab-button ${nonIndTab === index ? 'active' : ''}`} onClick={() => setNonIndTab(index)}> Entity {index + 1} </button>))}
                    </div>
                      {/* Render form only if data exists */}
                    {nonIndividualSubscribers[nonIndTab] && (
                      <div className="subscriber-form">
                        <div className="section-heading mb-3">
                          6A <span className="text-danger">*</span> Particulars of non-individual first subscriber(s)
                        </div>
              
                        <div className="sub-heading" style={{ fontSize: '0.8rem' }}>6A(i) Particulars of entity</div>
              
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label_sp"><span className="text-danger">*</span> Category</label>
                            <input type="text" className="form-control" value={nonIndividualSubscribers[nonIndTab].category || ''} onChange={(e) => {
                              const updated = [...nonIndividualSubscribers];
                              updated[nonIndTab].category = e.target.value;
                              setNonIndividualSubscribers(updated);
                            }} />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label_sp"><span className="text-danger">*</span> CIN/FCRN/Other Regn. No.</label>
                            <input type="text" className="form-control" value={nonIndividualSubscribers[nonIndTab].cin || ''} onChange={(e) => {
                              const updated = [...nonIndividualSubscribers];
                              updated[nonIndTab].cin = e.target.value;
                              setNonIndividualSubscribers(updated);
                            }} />
                          </div>
                        </div>
              
                        <div className="row mb-3">
                          <div className="col-12">
                            <label className="form-label_sp"><span className="text-danger">*</span> Name of the body corporate</label>
                            <input type="text" className="form-control" value={nonIndividualSubscribers[nonIndTab].entityName || ''} onChange={(e) => {
                              const updated = [...nonIndividualSubscribers];
                              updated[nonIndTab].entityName = e.target.value;
                              setNonIndividualSubscribers(updated);
                            }} />
                          </div>
                        </div>
              
                        {/* Additional address, authorized person, and other sections should follow similar structure */}

                         {/* Registered office address heading */}
      <div className="sub-heading" style={{ fontSize: '0.8rem' }}>Registered office/Principal place of business address</div>

    <div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_l1" className="form-label_sp">
      <span className="text-danger">*</span> Line 1
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_l1"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrL1 || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrL1 = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_l2" className="form-label_sp">Line 2</label>
    <input
      type="text"
      id="non_ind_sub_addr_l2"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrL2 || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrL2 = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>


   {/* Country & Pincode */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_country" className="form-label_sp">
      <span className="text-danger">*</span> Country
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_country"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrCountry || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrCountry = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-3">
    <label htmlFor="non_ind_sub_addr_pin" className="form-label_sp">
      <span className="text-danger">*</span> Pin code
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_pin"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrPin || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrPin = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Area/Locality & City */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_locality" className="form-label_sp">
      <span className="text-danger">*</span> Area/Locality
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_locality"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrLocality || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrLocality = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_city" className="form-label_sp">
      <span className="text-danger">*</span> City
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_city"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrCity || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrCity = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* District & State */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_district" className="form-label_sp">District</label>
    <input
      type="text"
      id="non_ind_sub_addr_district"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrDistrict || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrDistrict = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_sub_addr_state" className="form-label_sp">
      <span className="text-danger">*</span> State/UT
    </label>
    <input
      type="text"
      id="non_ind_sub_addr_state"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrState || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrState = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Phone, Fax, Email */}
<div className="row mb-3">
  <div className="col-md-4 col-6">
    <label htmlFor="non_ind_sub_addr_phone" className="form-label_sp">
      <span className="text-danger">*</span> Phone (STD/ISD)
    </label>
    <input
      type="tel"
      id="non_ind_sub_addr_phone"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrPhone || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrPhone = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-4 col-6">
    <label htmlFor="non_ind_sub_addr_fax" className="form-label_sp">Fax</label>
    <input
      type="tel"
      id="non_ind_sub_addr_fax"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrFax || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrFax = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-4">
    <label htmlFor="non_ind_sub_addr_email" className="form-label_sp">
      <span className="text-danger">*</span> Email ID
    </label>
    <input
      type="email"
      id="non_ind_sub_addr_email"
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab].regAddrEmail || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        updated[nonIndTab].regAddrEmail = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>


    <div className="sub-heading mb-3" style={{ fontSize: '0.8rem' }}>
            6A(ii) Particulars of the person authorized by the entity
          </div>

          {/* DIN and PAN */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="non_ind_auth_din" className="form-label_sp">Director Identification Number (DIN)</label>
              <input type="text" id="non_ind_auth_din" className="form-control " 
              value={nonIndividualSubscribers[nonIndTab].authPersonDin || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonDin = e.target.value;
                setNonIndividualSubscribers(updated);
      }} />
            </div>
            <div className="col-md-6">
            <label htmlFor="non_ind_auth_pan" className="form-label_sp">Income tax-PAN</label>
            <input type="text" id="non_ind_auth_pan" className="form-control" 
              value={nonIndividualSubscribers[nonIndTab].authPersonPan || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonPan = e.target.value;
                setNonIndividualSubscribers(updated);
      }}
            
            />
            
            
            </div>
          </div>

          {/* Full Name & Father's Name */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_fname" className="form-label_sp"><span className="text-danger">*</span>First Name</label>
              <input type="text" id="non_ind_auth_fname" className="form-control"
                value={nonIndividualSubscribers[nonIndTab].authPersonFirstName || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonFirstName = e.target.value;
                setNonIndividualSubscribers(updated);
                }} />

            </div>
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_mname" className="form-label_sp">Middle Name</label>
              <input type="text" id="non_ind_auth_mname" className="form-control" 
                value={nonIndividualSubscribers[nonIndTab].authPersonMiddleName || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonMiddleName = e.target.value;
                setNonIndividualSubscribers(updated);
                }}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_lname" className="form-label_sp"><span className="text-danger">*</span>Surname</label>
              <input type="text" id="non_ind_auth_lname" className="form-control"
              value={nonIndividualSubscribers[nonIndTab].authPersonSurname || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonSurname = e.target.value;
                setNonIndividualSubscribers(updated);
                }}
               />
            </div>
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_father_fname" className="form-label_sp"><span className="text-danger">*</span>Father's First Name</label>
              <input type="text" id="non_ind_auth_father_fname" className="form-control" 
              value={nonIndividualSubscribers[nonIndTab].authPersonFatherFirstName || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonFatherFirstName = e.target.value;
                setNonIndividualSubscribers(updated);
                }}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_father_mname" className="form-label_sp">Father's Middle Name</label>
              <input type="text" id="non_ind_auth_father_mname" className="form-control" 
              value={nonIndividualSubscribers[nonIndTab].authPersonFatherMiddleName || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonFatherMiddleName = e.target.value;
                setNonIndividualSubscribers(updated);
                }}/>
            </div>
            <div className="col-md-4">
              <label htmlFor="non_ind_auth_father_lname" className="form-label_sp"><span className="text-danger">*</span>Father's Surname</label>
              <input type="text" id="non_ind_auth_father_lname" className="form-control"
              value={nonIndividualSubscribers[nonIndTab].authPersonFatherSurname || ''}
              onChange={(e) => {
                const updated = [...nonIndividualSubscribers];
                updated[nonIndTab].authPersonFatherSurname = e.target.value;
                setNonIndividualSubscribers(updated);
                }} />
            </div>
          </div>
{/* Gender, DOB, POB */}
<div className="row mb-3">
  <div className="col-md-4">
    <label htmlFor="non_ind_auth_gender" className="form-label_sp"><span className="text-danger">*</span>Gender</label>
    <select 
      id="non_ind_auth_gender" 
      className="form-select"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonGender || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {}; // Ensure object exists
        updated[nonIndTab].authPersonGender = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    >
      <option value="">-- Select --</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Transgender">Transgender</option>
    </select>
  </div>

  <div className="col-md-4">
    <label htmlFor="non_ind_auth_dob" className="form-label_sp"><span className="text-danger">*</span>Date of Birth</label>
    <input 
      type="date" 
      id="non_ind_auth_dob" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonDob || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonDob = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-4">
    <label htmlFor="non_ind_auth_pob" className="form-label_sp"><span className="text-danger">*</span>Place of Birth (District & State)</label>
    <input 
      type="text" 
      id="non_ind_auth_pob" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPob || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPob = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Nationality & Area of Occupation */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_nationality" className="form-label_sp"><span className="text-danger">*</span>Nationality</label>
    <input 
      type="text" 
      id="non_ind_auth_nationality" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonNationality || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonNationality = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_occupation_area" className="form-label_sp"><span className="text-danger">*</span>Area of Occupation</label>
    <input 
      type="text" 
      id="non_ind_auth_occupation_area" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonOccupationArea || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonOccupationArea = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Occupation Type & Others */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_occupation_type" className="form-label_sp"><span className="text-danger">*</span>Occupation Type</label>
    <select 
      id="non_ind_auth_occupation_type" 
      className="form-select"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonOccupationType || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonOccupationType = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    >
      <option value="">-- Select --</option>
      <option value="Business">Business</option>
      <option value="Professional">Professional</option>
      <option value="Government">Government</option>
      <option value="Employment">Employment</option>
      <option value="Private Employment">Private Employment</option>
      <option value="Housewife">Housewife</option>
      <option value="Student">Student</option>
      <option value="Others">Others</option>
    </select>
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_occupation_other" className="form-label_sp">
      If 'Others' occupation selected, please specify
    </label>
    <input 
      type="text" 
      id="non_ind_auth_occupation_other" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonOccupationOther || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonOccupationOther = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
      // Optionally disable if occupation type is not 'Others'
      disabled={nonIndividualSubscribers[nonIndTab]?.authPersonOccupationType !== 'Others'}
    />
  </div>
</div>

{/* Educational Qualification */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_education" className="form-label_sp"><span className="text-danger">*</span>Educational Qualification</label>
    <select 
      id="non_ind_auth_education" 
      className="form-select"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonEducation || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonEducation = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    >
      <option value="">-- Select --</option>
      <option value="Primary education">Primary education</option>
      <option value="Secondary education">Secondary education</option>
      <option value="Vocational qualification">Vocational qualification</option>
      <option value="Bachelor's degree">Bachelor's degree</option>
      <option value="Master's degree">Master's degree</option>
      <option value="Doctorate or higher">Doctorate or higher</option>
      <option value="Professional Diploma">Professional Diploma</option>
      <option value="Others">Others</option>
    </select>
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_education_other" className="form-label_sp">
      If 'Others' education selected, please specify
    </label>
    <input 
      type="text" 
      id="non_ind_auth_education_other" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonEducationOther || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonEducationOther = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
      // Optionally disable if education is not 'Others'
      disabled={nonIndividualSubscribers[nonIndTab]?.authPersonEducation !== 'Others'}
    />
  </div>
</div>

<div className="sub-heading mb-3" style={{ fontSize: '0.8rem' }}>
  Present Address (Authorized Person)
</div>

{/* Address lines */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_l1" className="form-label_sp">
      <span className="text-danger">*</span> Line 1
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_l1" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrL1 || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrL1 = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_l2" className="form-label_sp">Line 2</label>
    <input 
      type="text" 
      id="non_ind_auth_addr_l2" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrL2 || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrL2 = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Country and Pincode */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_country" className="form-label_sp">
      <span className="text-danger">*</span> Country
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_country" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrCountry || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrCountry = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-3">
    <label htmlFor="non_ind_auth_addr_pin" className="form-label_sp">
      <span className="text-danger">*</span> Pin code
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_pin" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrPin || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrPin = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Locality and City */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_locality" className="form-label_sp">
      <span className="text-danger">*</span> Area/Locality
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_locality" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrLocality || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrLocality = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_city" className="form-label_sp">
      <span className="text-danger">*</span> City
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_city" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrCity || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrCity = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* District and State */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_district" className="form-label_sp">District</label>
    <input 
      type="text" 
      id="non_ind_auth_addr_district" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrDistrict || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrDistrict = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_addr_state" className="form-label_sp">
      <span className="text-danger">*</span> State/UT
    </label>
    <input 
      type="text" 
      id="non_ind_auth_addr_state" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrState || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrState = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Phone, Fax, Email */}
<div className="row mb-3">
  <div className="col-md-4 col-6">
    <label htmlFor="non_ind_auth_addr_phone" className="form-label_sp">
      <span className="text-danger">*</span> Phone (STD/ISD)
    </label>
    <input 
      type="tel" 
      id="non_ind_auth_addr_phone" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrPhone || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrPhone = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-4 col-6">
    <label htmlFor="non_ind_auth_addr_fax" className="form-label_sp">Fax</label>
    <input 
      type="tel" 
      id="non_ind_auth_addr_fax" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrFax || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrFax = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
  <div className="col-md-4">
    <label htmlFor="non_ind_auth_addr_email" className="form-label_sp">Email ID</label>
    <input 
      type="email" 
      id="non_ind_auth_addr_email" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonPresAddrEmail || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonPresAddrEmail = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

<hr />

{/* Identity Proof */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_id_proof" className="form-label_sp">
      <span className="text-danger">*</span> Identity Proof Type
    </label>
    <select 
      id="non_ind_auth_id_proof" 
      className="form-select"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonIdProofType || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonIdProofType = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    >
      <option value="">-- Select Proof --</option>
      <option value="Voter Identity Card">Voter Identity Card</option>
      <option value="Passport">Passport</option>
      <option value="Driving License">Driving License</option>
      <option value="Aadhaar Card">Aadhaar Card</option>
      <option value="Other">Other</option>
    </select>
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_id_proof_no" className="form-label_sp">
      <span className="text-danger">*</span> Identity Proof No.
    </label>
    <input 
      type="text" 
      id="non_ind_auth_id_proof_no" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonIdProofNo || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonIdProofNo = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>

{/* Residential Proof */}
<div className="row mb-3">
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_res_proof" className="form-label_sp">
      <span className="text-danger">*</span> Residential Proof Type
    </label>
    <select 
      id="non_ind_auth_res_proof" 
      className="form-select"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonResProofType || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonResProofType = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    >
      <option value="">-- Select Proof --</option>
      <option value="Bank Statement">Bank Statement</option>
      <option value="Electricity Bill">Electricity Bill</option>
      <option value="Telephone Bill">Telephone Bill</option>
      <option value="Mobile Bill">Mobile Bill</option>
      {/* You might want to add 'Other' here if applicable */}
    </select>
  </div>
  <div className="col-md-6">
    <label htmlFor="non_ind_auth_res_proof_no" className="form-label_sp">
      <span className="text-danger">*</span> Residential Proof No.
    </label>
    <input 
      type="text" 
      id="non_ind_auth_res_proof_no" 
      className="form-control"
      value={nonIndividualSubscribers[nonIndTab]?.authPersonResProofNo || ''}
      onChange={(e) => {
        const updated = [...nonIndividualSubscribers];
        if (!updated[nonIndTab]) updated[nonIndTab] = {};
        updated[nonIndTab].authPersonResProofNo = e.target.value;
        setNonIndividualSubscribers(updated);
      }}
    />
  </div>
</div>
    
          {/* Upload Files */}
          <div className="row mb-3">
    <div className="col-md-6">
      <label htmlFor="attach_office_proof" className="form-label_sp" style={{ fontSize: '0.8rem' }}>
        (a) <span className="text-danger">*</span> Proof of Identity (Attachment)
      </label>
      <input 
        type="file" 
        className="form-control" 
        id="attach_office_proof" 
        name="attach_office_proof" 
        onChange={(e) => {
          const updated = [...nonIndividualSubscribers];
          if (!updated[nonIndTab]) updated[nonIndTab] = {};
          updated[nonIndTab].authPersonIdProofFile = e.target.files[0] || null;
          setNonIndividualSubscribers(updated);
        }}
      />
      {/* Optionally, display the selected file name if it's stored */}
      {nonIndividualSubscribers[nonIndTab]?.authPersonIdProofFile && (
        <small className="form-text text-muted">
          Selected: {nonIndividualSubscribers[nonIndTab].authPersonIdProofFile.name}
        </small>
      )}
    </div>
    <div className="col-md-6">
      <label htmlFor="attach_utility_bill" className="form-label_sp" style={{ fontSize: '0.8rem' }}>
        (b) <span className="text-danger">*</span> Residential Proof (Attachment)
      </label>
      <input 
        type="file" 
        className="form-control" 
        id="attach_utility_bill" 
        name="attach_utility_bill"
        onChange={(e) => {
          const updated = [...nonIndividualSubscribers];
          if (!updated[nonIndTab]) updated[nonIndTab] = {};
          updated[nonIndTab].authPersonResProofFile = e.target.files[0] || null;
          setNonIndividualSubscribers(updated);
        }}
      />
      {nonIndividualSubscribers[nonIndTab]?.authPersonResProofFile && (
        <small className="form-text text-muted">
          Selected: {nonIndividualSubscribers[nonIndTab].authPersonResProofFile.name}
        </small>
      )}
    </div>
  </div>

  <div className="sub-heading mb-3">Description of Share capital</div>
  
  <div className="row mb-3">
    <div className="col-md-6">
      <label htmlFor="non_ind_sub_capital" className="form-label_sp">
        Total subscribed share capital (in INR)
      </label>
      <input 
        type="number" 
        id="non_ind_sub_capital" 
        className="form-control"
        value={nonIndividualSubscribers[nonIndTab]?.totalSubscribedShareCapital || ''}
        onChange={(e) => {
          const updated = [...nonIndividualSubscribers];
          if (!updated[nonIndTab]) updated[nonIndTab] = {};
          updated[nonIndTab].totalSubscribedShareCapital = e.target.value;
          setNonIndividualSubscribers(updated);
        }}
      />
    </div>
  </div>

  <div className="sub-heading mb-2">Description of equity share capital</div>

  <div className="row mb-3">
    <div className="col-md-4 d-flex align-items-center">
      <label htmlFor="non_ind_equity_classes_count" className="form-label_sp me-2 mb-0">
        <span className="text-danger">*</span> Number of classes:
      </label>
      <input
        type="number"
        id="non_ind_equity_classes_count" // Changed ID for clarity, was non_ind_sub_equity_classes
        className="form-control"
        style={{ maxWidth: '100px' }}
        min="0" // Good to have a min value
        value={nonIndividualSubscribers[nonIndTab]?.equityShareClasses?.length || 0}
        onChange={(e) => {
          const count = parseInt(e.target.value || 0, 10);
          const updatedSubscribers = [...nonIndividualSubscribers];
          if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};
          
          const currentClasses = updatedSubscribers[nonIndTab].equityShareClasses || [];
          const newClasses = Array.from({ length: count }, (_, i) => 
            currentClasses[i] || { num: '', nominal: '' }
          );
          updatedSubscribers[nonIndTab].equityShareClasses = newClasses;
          setNonIndividualSubscribers(updatedSubscribers);
        }}
      />
    </div>
  </div>

  {(nonIndividualSubscribers[nonIndTab]?.equityShareClasses || []).map((share, idx) => {
    const total = (parseFloat(share.num) || 0) * (parseFloat(share.nominal) || 0);
    return (
      <div key={`equity-${idx}`} className="table-responsive mb-4"> {/* Added unique key prefix */}
        <div className="sub-heading mb-2">Equity Share Class {idx + 1}</div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Class of shares</th>
              <th>Subscribed capital</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Number of equity shares</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={share.num || ''}
                  onChange={(e) => {
                    const updatedSubscribers = [...nonIndividualSubscribers];
                    // Ensure the path exists
                    if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};
                    if (!updatedSubscribers[nonIndTab].equityShareClasses) updatedSubscribers[nonIndTab].equityShareClasses = [];
                    if (!updatedSubscribers[nonIndTab].equityShareClasses[idx]) updatedSubscribers[nonIndTab].equityShareClasses[idx] = { num: '', nominal: ''};
                    
                    updatedSubscribers[nonIndTab].equityShareClasses[idx].num = e.target.value;
                    setNonIndividualSubscribers(updatedSubscribers);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Nominal amount per share (in INR)</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={share.nominal || ''}
                  onChange={(e) => {
                    const updatedSubscribers = [...nonIndividualSubscribers];
                    if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};
                    if (!updatedSubscribers[nonIndTab].equityShareClasses) updatedSubscribers[nonIndTab].equityShareClasses = [];
                    if (!updatedSubscribers[nonIndTab].equityShareClasses[idx]) updatedSubscribers[nonIndTab].equityShareClasses[idx] = { num: '', nominal: ''};

                    updatedSubscribers[nonIndTab].equityShareClasses[idx].nominal = e.target.value;
                    setNonIndividualSubscribers(updatedSubscribers);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Total amount (in INR)</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={total}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  })}

  <div className="sub-heading mb-2">Description of Preference share capital</div>

  <div className="row mb-3">
    <div className="col-md-4 d-flex align-items-center">
      <label htmlFor="non_ind_pref_classes_count" className="form-label_sp me-2 mb-0"> {/* Updated htmlFor */}
        <span className="text-danger">*</span> Number of classes:
      </label>
      <input
        type="number"
        id="non_ind_pref_classes_count" // UNIQUE ID
        className="form-control"
        style={{ maxWidth: '100px' }}
        min="0"
        value={nonIndividualSubscribers[nonIndTab]?.preferenceShareClasses?.length || 0}
        onChange={(e) => {
          const count = parseInt(e.target.value || 0, 10);
          const updatedSubscribers = [...nonIndividualSubscribers];
          if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};

          const currentClasses = updatedSubscribers[nonIndTab].preferenceShareClasses || [];
          const newClasses = Array.from({ length: count }, (_, i) => 
            currentClasses[i] || { num: '', nominal: '' }
          );
          updatedSubscribers[nonIndTab].preferenceShareClasses = newClasses;
          setNonIndividualSubscribers(updatedSubscribers);
        }}
      />
    </div>
  </div>

  {(nonIndividualSubscribers[nonIndTab]?.preferenceShareClasses || []).map((share, idx) => {
    const total = (parseFloat(share.num) || 0) * (parseFloat(share.nominal) || 0);
    return (
      <div key={`pref-${idx}`} className="table-responsive mb-4"> {/* Added unique key prefix */}
        {/* Note: The sub-heading says "Equity Share Class" - you might want to change this to "Preference Share Class" */}
        <div className="sub-heading mb-2">Preference Share Class {idx + 1}</div> 
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Class of shares</th>
              <th>Subscribed capital</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Number of Preference Share</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={share.num || ''}
                  onChange={(e) => {
                    const updatedSubscribers = [...nonIndividualSubscribers];
                    if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};
                    if (!updatedSubscribers[nonIndTab].preferenceShareClasses) updatedSubscribers[nonIndTab].preferenceShareClasses = [];
                    if (!updatedSubscribers[nonIndTab].preferenceShareClasses[idx]) updatedSubscribers[nonIndTab].preferenceShareClasses[idx] = { num: '', nominal: ''};
                    
                    updatedSubscribers[nonIndTab].preferenceShareClasses[idx].num = e.target.value;
                    setNonIndividualSubscribers(updatedSubscribers);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Nominal amount per share (in INR)</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={share.nominal || ''}
                  onChange={(e) => {
                    const updatedSubscribers = [...nonIndividualSubscribers];
                    if (!updatedSubscribers[nonIndTab]) updatedSubscribers[nonIndTab] = {};
                    if (!updatedSubscribers[nonIndTab].preferenceShareClasses) updatedSubscribers[nonIndTab].preferenceShareClasses = [];
                    if (!updatedSubscribers[nonIndTab].preferenceShareClasses[idx]) updatedSubscribers[nonIndTab].preferenceShareClasses[idx] = { num: '', nominal: ''};

                    updatedSubscribers[nonIndTab].preferenceShareClasses[idx].nominal = e.target.value;
                    setNonIndividualSubscribers(updatedSubscribers);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Total amount (in INR)</td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={total}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  })}

</div>

)}
</>
  );
  }
         
  case 7: {
    // 6B: Individual Subscribers with DIN
    const currentItem = getCurrentItem(subscribers, activeTab); // subscribers[activeTab] or {}
    // Ensure currentItem and its properties are safely accessed, defaulting to empty arrays if needed.
    const currentEquityShares = currentItem?.equityShares || [];
    const currentPrefShares = currentItem?.preferenceShares || [];
  
    // Helper function (if not defined elsewhere)
    const calculateTotalLocal = (num, nominal) => {
        return (parseFloat(num) || 0) * (parseFloat(nominal) || 0);
    };
  
    return (
      <>
        <div className="tab-container">
          {subscribers.map((_, index) => (
            <button
              key={`ind-din-sub-tab-${index}`}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              Subscriber {index + 1}
            </button>
          ))}
        </div>
  
        {/* Subscriber Form: Conditionally render if currentItem is available */}
        {subscribers.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
          <div className="subscriber-form">
            <div className="sub-heading mb-3">
              6B Particulars of individual first subscriber(s) other than subscriber cum director (having valid DIN)
            </div>
  
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor={`ind_din_sub_din_${activeTab}`} className="form-label_sp">Director Identification Number (DIN)</label>
                <input
                  type="text"
                  id={`ind_din_sub_din_${activeTab}`}
                  className="form-control"
                  value={currentItem.din || ''}
                  onChange={(e) => handleSubscriberChange(activeTab, 'din', e.target.value)}
                />
              </div>
  
              <div className="col-md-8"> {/* Changed col-md-4 to col-md-8 to match your new snippet */}
                <label htmlFor={`ind_din_sub_name_${activeTab}`} className="form-label_sp"><span className="text-danger">*</span> Name</label>
                <input
                  type="text"
                  id={`ind_din_sub_name_${activeTab}`}
                  className="form-control"
                  value={currentItem.name || ''}
                  onChange={(e) => handleSubscriberChange(activeTab, 'name', e.target.value)}
                  // readOnly={!!currentItem.din} // Name becomes read-only if DIN is present
                />
              </div>
            </div>
  
            {/* Total Subscribed Capital */}
            <div className="sub-heading mb-3">Description of Share capital</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor={`ind_din_total_subscribed_capital_${activeTab}`} className="form-label_sp">Total subscribed share capital (in INR)</label>
                <input
                  type="number"
                  id={`ind_din_total_subscribed_capital_${activeTab}`}
                  className="form-control"
                  value={currentItem.total_subscribed_share_capital_in_inr || ''}
                  onChange={(e) => handleSubscriberChange(activeTab, 'total_subscribed_share_capital_in_inr', e.target.value)}
                />
              </div>
            </div>
  
            {/* Equity Share Capital Section */}
            <div className="sub-heading mb-3">Description of equity share capital</div>
            <div className="row mb-3">
              <div className="col-md-4 d-flex align-items-center">
                <label htmlFor={`ind_din_equity_classes_count_${activeTab}`} className="form-label_sp me-2 mb-0"> {/* Changed mb-2 to mb-0 as per new snippet */}
                  <span className="text-danger">*</span> Number of classes:
                </label>
                <input
                  type="number"
                  id={`ind_din_equity_classes_count_${activeTab}`}
                  className="form-control"
                  style={{ maxWidth: '100px' }}
                  min="0"
                  value={currentEquityShares.length}
                  onChange={(e) => handleSubscriberEquityClassCountChange(activeTab, e.target.value)}
                />
              </div>
            </div>
  
            {/* Render individual equity tables */}
            {currentEquityShares.map((share, idx) => {
              // Use pre-calculated total_amount if available, otherwise calculate for display
              const displayTotal = share.total_amount !== undefined && share.total_amount !== ''
                                 ? share.total_amount
                                 : calculateTotalLocal(share.number_of_equity_shares, share.nominal_amount_per_share);
              return (
                <div key={`ind-din-eq-${activeTab}-${idx}`} className="mb-4">
                  <div className="sub-heading mb-2">Equity Share Class {idx + 1}</div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead>
                      <tbody>
                        <tr>
                          <td>Number of equity shares</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={share.number_of_equity_shares || ''}
                              onChange={(e) => handleSubscriberEquityShareChange(activeTab, idx, 'number_of_equity_shares', e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Nominal amount per share (in INR)</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={share.nominal_amount_per_share || ''}
                              onChange={(e) => handleSubscriberEquityShareChange(activeTab, idx, 'nominal_amount_per_share', e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Total amount (in INR)</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={displayTotal} // Display calculated or stored total
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
  
  
            {/* Preference Share Capital Section */}
            <div className="sub-heading mb-3">Description of preference share capital</div>
            <div className="row mb-3">
              <div className="col-md-4 d-flex align-items-center">
                <label htmlFor={`ind_din_pref_classes_count_${activeTab}`} className="form-label_sp me-2 mb-0">
                  <span className="text-danger">*</span> Number of classes:
                </label>
                <input
                  type="number"
                  id={`ind_din_pref_classes_count_${activeTab}`}
                  className="form-control"
                  style={{ maxWidth: '100px' }}
                  min="0"
                  value={currentPrefShares.length}
                  onChange={(e) => handleSubscriberPrefClassCountChange(activeTab, e.target.value)}
                />
              </div>
            </div>
  
            {/* Render individual preference share tables */}
            {currentPrefShares.map((share, idx) => {
               const displayTotal = share.total_amount !== undefined && share.total_amount !== ''
                                 ? share.total_amount
                                 : calculateTotalLocal(share.number_of_preference_shares, share.nominal_amount_per_share);
              return (
                <div key={`ind-din-pref-${activeTab}-${idx}`} className="mb-4">
                  <div className="sub-heading mb-2">Preference Share Class {idx + 1}</div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead>
                      <tbody>
                        <tr>
                          <td>Number of preference shares</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={share.number_of_preference_shares || ''}
                              onChange={(e) => handleSubscriberPrefShareChange(activeTab, idx, 'number_of_preference_shares', e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Nominal amount per share (in INR)</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={share.nominal_amount_per_share || ''}
                              onChange={(e) => handleSubscriberPrefShareChange(activeTab, idx, 'nominal_amount_per_share', e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Total amount (in INR)</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={displayTotal}
                              readOnly
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
  
            <hr />
  
            {/* Forex radio options */}
            <div className="row mt-3">
              <div className="col-12">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`forex-ind-din-${activeTab}`}
                    id={`forex-ind-din-yes-${activeTab}`}
                    checked={currentItem.forexRequired === true}
                    onChange={() => handleSubscriberChange(activeTab, 'forexRequired', true)}
                  />
                  <label className="form-check-label" htmlFor={`forex-ind-din-yes-${activeTab}`}>
                    I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith.
                  </label>
                </div>
  
                <div className="text-center mb-4">OR</div>
  
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`forex-ind-din-${activeTab}`}
                    id={`forex-ind-din-no-${activeTab}`}
                    // Handles both false and 'not_required' for the "No" option
                    checked={currentItem.forexRequired === false || currentItem.forexRequired === 'not_required'}
                    onChange={() => handleSubscriberChange(activeTab, 'forexRequired', false)} // Or 'not_required' depending on your desired stored value
                  />
                  <label className="form-check-label" htmlFor={`forex-ind-din-no-${activeTab}`}>
                    I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares.
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          subscribers.length === 0 && <div className="p-3 text-muted">No individual subscribers with DIN entered yet. Add subscribers to see the form.</div>
        )}
      </>
    );
  }
  
      case 8: { // 6C: Individual Subscribers without DIN
          const currentItem = getCurrentItem(noDinSubscribers, noDinTab);
          const currentEquityShares = currentItem.equityShares || [];
          const currentPrefShares = currentItem.preferenceShares || [];
          let showPreviousAddress = false;
          if (currentItem.durationOfStayYears !== undefined && currentItem.durationOfStayYears < 1 && currentItem.durationOfStayYears !== '') {
              showPreviousAddress = true;
          }
      
          return (
              <>
                  <div className="tab-container">{noDinSubscribers.map((_, index) => (<button key={`ind-nodin-sub-tab-${index}`} className={`tab-button ${noDinTab === index ? 'active' : ''}`} onClick={() => setNoDinTab(index)}> Subscriber {index + 1} </button>))}</div>
                  {noDinSubscribers.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
                      <div className="subscriber-form"> 
                          <div className="sub-heading mb-3">6C <span className="text-danger">*</span> Particulars of individual first subscriber(s) other than subscriber cum director (Not having valid DIN)</div>
                          {/* Personal Details */}
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">First Name <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.firstName || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'firstName', e.target.value)}/></div>
                              <div className="col-md-4"><label className="form-label_sp">Middle Name</label><input type="text" className="form-control" value={currentItem.middleName || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'middleName', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp">Surname <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.surname || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'surname', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">Father's First Name <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.fatherFirstName || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'fatherFirstName', e.target.value)}/></div>
                              <div className="col-md-4"><label className="form-label_sp">Father's Middle Name</label><input type="text" className="form-control" value={currentItem.fatherMiddleName || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'fatherMiddleName', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp">Father's Surname <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.fatherSurname || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'fatherSurname', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-3"><label className="form-label_sp">Gender <span className="text-danger">*</span></label><select className="form-select" value={currentItem.gender || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'gender', e.target.value)}><option value="">-- Select --</option><option value="Male">Male</option><option value="Female">Female</option><option value="Transgender">Transgender</option></select></div>
                              <div className="col-md-3"><label className="form-label_sp">Date of Birth <span className="text-danger">*</span></label><input type="date" className="form-control" value={currentItem.dob || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'dob', e.target.value)}/></div>
                              <div className="col-md-3"><label className="form-label_sp">Nationality <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.nationality || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'nationality', e.target.value)}/></div>
                              <div className="col-md-3"><label className="form-label_sp">Place of Birth (District & State) <span className="text-danger">*</span></label><input type="text" className="form-control" value={currentItem.pob || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'pob', e.target.value)}/></div>
                          </div>
                           <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">PAN</label><input type="text" className="form-control" value={currentItem.pan || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'pan', e.target.value.toUpperCase())}/></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span>Email ID</label><input type="email" className="form-control" value={currentItem.email || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'email', e.target.value)}/></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span>Occupation type</label><select className="form-select" value={currentItem.occupationType || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'occupationType', e.target.value)}><option value="">-- Select --</option><option value="Business">Business</option><option value="Professional">Professional</option><option value="Government">Government</option><option value="Employment">Employment</option><option value="Private Employment">Private Employment</option><option value="Housewife">Housewife</option><option value="Student">Student</option><option value="Others">Others</option></select></div>
                              <div className="col-md-4"><label className="form-label_sp">If 'Others' selected, specify</label><input type="text" className="form-control" value={currentItem.occupationOther || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'occupationOther', e.target.value)}/></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span>Area of Occupation</label><input type="text" className="form-control" value={currentItem.occupationArea || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'occupationArea', e.target.value)}/></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Educational Qualification</label><select className="form-select" value={currentItem.education || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'education', e.target.value)}><option value="">-- Select --</option><option value="Primary education">Primary education</option><option value="Secondary education">Secondary education</option><option value="Vocational qualification">Vocational qualification</option><option value="Bachelor's degree">Bachelor's degree</option><option value="Master's degree">Master's degree</option><option value="Doctorate or higher">Doctorate or higher</option><option value="Professional Diploma">Professional Diploma</option><option value="Others">Others</option></select></div>
                              <div className="col-md-6"><label className="form-label_sp">If 'Others' education selected, please specify</label><input type="text" className="form-control" value={currentItem.educationOther || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'educationOther', e.target.value)}/></div>
                          </div>
  
                          {/* Permanent Address */}
                          <div className="sub-heading mb-3">Permanent Address</div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Line 1</label><input type="text" className="form-control" value={currentItem.permAddrL1 || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrL1', e.target.value)} /></div><div className="col-md-6"><label className="form-label_sp">Line 2</label><input type="text" className="form-control" value={currentItem.permAddrL2 || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrL2', e.target.value)} /></div></div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Country</label><input type="text" className="form-control" value={currentItem.permAddrCountry || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrCountry', e.target.value)} /></div><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Pin code</label><input type="text" className="form-control" value={currentItem.permAddrPin || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrPin', e.target.value)} /></div></div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Area/Locality</label><input type="text" className="form-control" value={currentItem.permAddrLocality || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrLocality', e.target.value)} /></div><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>City</label><input type="text" className="form-control" value={currentItem.permAddrCity || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrCity', e.target.value)} /></div></div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp">District</label><input type="text" className="form-control" value={currentItem.permAddrDistrict || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrDistrict', e.target.value)} /></div><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>State/UT</label><input type="text" className="form-control" value={currentItem.permAddrState || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrState', e.target.value)} /></div></div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Phone (STD/ISD)</label><input type="tel" className="form-control" value={currentItem.permAddrPhone || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'permAddrPhone', e.target.value)}/></div><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Whether present residential address same as permanent?</label><div><input className="form-check-input" type="radio" name={`indSubNodinAddrSame-${noDinTab}`} id={`indSubNodinAddrSameYes-${noDinTab}`} checked={currentItem.isSameAsPermanent === true} onChange={() => handleNoDinSubscriberChange(noDinTab, 'isSameAsPermanent', true)} /> Yes <input className="form-check-input" type="radio" name={`indSubNodinAddrSame-${noDinTab}`} id={`indSubNodinAddrSameNo-${noDinTab}`} checked={currentItem.isSameAsPermanent === false} onChange={() => handleNoDinSubscriberChange(noDinTab, 'isSameAsPermanent', false)} /> No </div></div></div>
                          
                          {/* Present Address (Conditional) */}
                          {currentItem.isSameAsPermanent === false && (
                              <>
                                  <div className="sub-heading"><span className="text-danger">*</span>Present Address</div><p className="text-muted fst-italic small mb-3">(Only if 'No' was selected)</p>
                                  <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Line 1</label><input type="text" className="form-control" value={currentItem.presAddrL1 || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'presAddrL1', e.target.value)} /></div><div className="col-md-6"><label className="form-label_sp">Line 2</label><input type="text" className="form-control" value={currentItem.presAddrL2 || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'presAddrL2', e.target.value)} /></div></div>
                                  {/* ... other present address fields ... */}
                                   <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp">Phone (STD/ISD)</label><input type="tel" className="form-control" value={currentItem.presAddrPhone || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'presAddrPhone', e.target.value)} /></div></div>
                              </>
                          )}
  
                          {/* Stay Duration & Previous Address */}
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">Duration of stay (YY/MM)</label><input type="text" placeholder="YY/MM" className="form-control" value={`${currentItem.durationOfStayYears || ''}/${currentItem.durationOfStayMonths || ''}`} onChange={(e) => { const parts = e.target.value.split('/'); handleNoDinSubscriberChange(noDinTab, 'durationOfStayYears', parts[0]); handleNoDinSubscriberChange(noDinTab, 'durationOfStayMonths', parts[1]); }} /></div>
                              {showPreviousAddress && <div className="col-md-8"><label className="form-label_sp">If stay 1 year, previous address</label><textarea rows="1" className="form-control" value={currentItem.prevAddrL1 || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'prevAddrL1', e.target.value)}></textarea></div>}
                          </div>
  
                          {/* Proofs & File Uploads */}
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Identity Proof Type</label><select className="form-select" value={currentItem.idProofType || ''} onChange={(e)=>handleNoDinSubscriberChange(noDinTab, 'idProofType', e.target.value)}><option value="">-- Select --</option><option>Voter Identity Card</option><option>Passport</option><option>Driving License</option><option>Aadhaar Card</option><option>Other</option></select></div>
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Identity Proof No.</label><input type="text" className="form-control" value={currentItem.idProofNo || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'idProofNo', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Residential Proof Type</label><select className="form-select" value={currentItem.resProofType || ''} onChange={(e)=>handleNoDinSubscriberChange(noDinTab, 'resProofType', e.target.value)}><option value="">-- Select --</option><option>Bank Statement</option><option>Electricity Bill</option><option>Telephone Bill</option><option>Mobile Bill</option></select></div>
                              <div className="col-md-6"><label className="form-label_sp">Residential Proof No.</label><input type="text" className="form-control" value={currentItem.resProofNo || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'resProofNo', e.target.value)} /></div>
                          </div>
                          <div className="sub-heading" style={{ fontSize: "0.8rem" }}>Submit the proof of identity and proof of address</div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp small">(a) <span className="text-danger">*</span>Proof of identity (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleNoDinSubscriberFileChange(noDinTab, 'idProofFile', e.target.files[0])}/> {currentItem.idProofFile && <small>{typeof currentItem.idProofFile === 'string' ? currentItem.idProofFile : currentItem.idProofFile.name}</small>} </div>
                              <div className="col-md-6"><label className="form-label_sp small">(b) <span className="text-danger">*</span>Residential Proof (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleNoDinSubscriberFileChange(noDinTab, 'resProofFile', e.target.files[0])}/> {currentItem.resProofFile && <small>{typeof currentItem.resProofFile === 'string' ? currentItem.resProofFile : currentItem.resProofFile.name}</small>} </div>
                          </div>
                          
                          {/* Share Capital */}
                          <div className="sub-heading">Description of Share capital</div>
                          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp">Total subscribed share capital (by this individual) (in INR)</label><input type="number" className="form-control" value={currentItem.totalSubscribedShareCapital || ''} onChange={(e) => handleNoDinSubscriberChange(noDinTab, 'totalSubscribedShareCapital', e.target.value)}/></div></div>
                          <div className="sub-heading">Description of equity share capital</div>
                          <div className="row mb-3"><div className="col-md-4 d-flex align-items-center"><label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span>Number of classes:</label><input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentEquityShares.length} onChange={(e) => handleNoDinSubscriberEquityClassCountChange(noDinTab, e.target.value)}/></div></div>
                          {currentEquityShares.map((share, idx) => { const total = calculateTotal(share.number_of_equity_shares, share.nominal_amount_per_share); return (<div key={`nodin-sub-eq-${idx}`} className="table-responsive mb-3"><table className="data-table table table-bordered"><thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead><tbody><tr><td>Number of equity shares (Class {idx + 1})</td><td><input type="number" className="form-control" value={share.number_of_equity_shares || ''} onChange={(e) => handleNoDinSubscriberEquityShareChange(noDinTab, idx, 'number_of_equity_shares', e.target.value)}/></td></tr><tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.nominal_amount_per_share || ''} onChange={(e) => handleNoDinSubscriberEquityShareChange(noDinTab, idx, 'nominal_amount_per_share', e.target.value)}/></td></tr><tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={share.total_amount || total} readOnly /></td></tr></tbody></table></div>);})}
                          <div className="sub-heading">Description of preference share capital</div>
                          <div className="row mb-3"><div className="col-md-4 d-flex align-items-center"><label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span>Number of classes:</label><input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentPrefShares.length} onChange={(e) => { const count = parseInt(e.target.value, 10) || 0; const updated = [...noDinSubscribers]; if(!updated[noDinTab].preferenceShares) updated[noDinTab].preferenceShares = []; const current = updated[noDinTab].preferenceShares; updated[noDinTab].preferenceShares = Array.from({length: count}, (_,i)=> current[i] || {class_of_shares: 'Preference', number_of_preference_shares:'', nominal_amount_per_share:'', total_amount:''}); setNoDinSubscribers(updated); }}/></div></div>
                          {currentPrefShares.map((share, idx) => { const total = calculateTotal(share.number_of_preference_shares, share.nominal_amount_per_share); return (<div key={`nodin-sub-pref-${idx}`} className="table-responsive mb-3"><table className="data-table table table-bordered"><thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead><tbody><tr><td>Number of preference shares (Class {idx + 1})</td><td><input type="number" className="form-control" value={share.number_of_preference_shares||''} onChange={(e)=>{const u=[...noDinSubscribers]; u[noDinTab].preferenceShares[idx].number_of_preference_shares = e.target.value; setNoDinSubscribers(u);}}/></td></tr><tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.nominal_amount_per_share||''} onChange={(e)=>{const u=[...noDinSubscribers]; u[noDinTab].preferenceShares[idx].nominal_amount_per_share = e.target.value; setNoDinSubscribers(u);}}/></td></tr><tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={share.total_amount || total} readOnly /></td></tr></tbody></table></div>);})}
                          
                          {/* Forex Declaration */}
                          <div className="row mt-3"> <div className="col-12"> <div className="form-check mb-2"> <input className="form-check-input" type="radio" name={`indSubNodinForex-${noDinTab}`} id={`indSubNodinForexRequired-${noDinTab}`} checked={currentItem.forexRequired === true} onChange={() => handleNoDinSubscriberChange(noDinTab, 'forexRequired', true)} /> <label className="form-check-label" htmlFor={`indSubNodinForexRequired-${noDinTab}`}> I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments)
                          Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith. </label> </div> <div className="text-center mb-4">OR</div> <div className="form-check mb-2"> <input className="form-check-input" type="radio" name={`indSubNodinForex-${noDinTab}`} id={`indSubNodinForexNotRequired-${noDinTab}`} checked={currentItem.forexRequired === false || currentItem.forexRequired === 'not_required'} onChange={() => handleNoDinSubscriberChange(noDinTab, 'forexRequired', false)} /> <label className="form-check-label" htmlFor={`indSubNodinForexNotRequired-${noDinTab}`}>  I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt
                            Instruments) Rules, 2019 prior to subscription of shares.</label> </div> </div> </div>
                      </div>
                  ) : (noDinSubscribers.length === 0 && <div className="p-3 text-muted">No individual subscribers without DIN entered.</div>)}
              </>
          );
      }

  case 9: { // 7A: Subscriber cum Director WITH DIN
    const currentItem = getCurrentItem(cDirectors, cActiveTab);
    const currentEquityShares = currentItem.equityShares || [];
    const currentPrefShares = currentItem.preferenceShares || [];
    const currentInterests = currentItem.interests || [];

    return (
      <>
        <div className="tab-container">
          {cDirectors.map((_, index) => (
            <button
              key={`cdir-din-tab-${index}`}
              className={`tab-button ${cActiveTab === index ? 'active' : ''}`}
              onClick={() => setCActiveTab(index)}
            >
              Director {index + 1}
            </button>
          ))}
        </div>

        {cDirectors.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
          <div className="subscriber-form">
            <div className="section-heading mb-1" style={{ border: 'none', marginBottom: '5px', paddingBottom: '0' }}>
              7A Particulars of Subscriber(s) cum Directors/Director (having valid DIN)
            </div>
            <div className="sub-heading" style={{ fontSize: '0.8rem', marginTop: '0' }}>
              7A(i) Detail of Subscriber cum Director {cActiveTab + 1}
            </div>

            {/* DIN and Name */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label_sp">Director Identification Number (DIN)</label>
                <input type="text" className="form-control" value={currentItem.din || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'din', e.target.value)} />
              </div>
              <div className="col-md-8">
                <label className="form-label_sp"><span className="text-danger">*</span> Name</label>
                <input type="text" className="form-control" value={currentItem.name || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'name', e.target.value)} readOnly={!!currentItem.din} />
              </div>
            </div>

            {/* Designation & Category */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label_sp"><span className="text-danger">*</span> Designation</label>
                <select className="form-select" value={currentItem.designation || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'designation', e.target.value)}>
                  <option value="">-- Select --</option><option value="Director">Director</option><option value="Managing Director">Managing Director</option><option value="Whole time director">Whole time director</option><option value="Nominee director">Nominee director</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label_sp"><span className="text-danger">*</span> Category</label>
                <select className="form-select" value={currentItem.category || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'category', e.target.value)}>
                  <option value="">-- Select --</option><option value="Promoter">Promoter</option><option value="Professional">Professional</option><option value="Independent">Independent</option><option value="Nominee">Nominee</option>
                </select>
              </div>
            </div>

            {/* Whether: Role (Chairman/Executive/NonExecutive) */}
            <div className="row mb-3">
              <div className="col-12"> {/* Changed to col-12 for better layout if needed */}
                <label className="form-label_sp">Whether:</label>
                <div>
                  {['Chairman', 'Executive', 'NonExecutive'].map((roleValue) => (
                    <div className="form-check form-check-inline" key={roleValue}>
                      <input className="form-check-input" type="radio" id={`cdir-role-${roleValue}-${cActiveTab}`} name={`cdir_role_${cActiveTab}`} value={roleValue} checked={currentItem.role === roleValue} onChange={() => handleCDirectorChange(cActiveTab, 'role', roleValue)} />
                      <label className="form-check-label" htmlFor={`cdir-role-${roleValue}-${cActiveTab}`}>{roleValue === 'NonExecutive' ? 'Non-executive Director' : `${roleValue} Director`}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email and Nominee Entity */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label_sp"><span className="text-danger">*</span> Email ID</label>
                <input type="email" className="form-control" value={currentItem.email_id || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'email_id', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label_sp">Name of the Nominee Entity</label>
                <input type="text" className="form-control" value={currentItem.nominee_company_name || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'nominee_company_name', e.target.value)} />
              </div>
            </div>

            <div className="sub-heading mb-2">Description of Share capital (Having DIN)</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label_sp">Total subscribed share capital (in INR)</label>
                <input type="number" className="form-control" value={currentItem.total_subscribed_share_capital_inr || ''} onChange={(e) => handleCDirectorChange(cActiveTab, 'total_subscribed_share_capital_inr', e.target.value)} />
              </div>
            </div>

            {/* Equity Share Capital */}
            <div className="sub-heading">Description of equity share capital</div>
            <div className="row mb-3">
              <div className="col-md-4 d-flex align-items-center">
                <label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of classes:</label>
                <input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentEquityShares.length} onChange={(e) => handleCDirectorEquityClassCountChange(cActiveTab, e.target.value)} />
              </div>
            </div>
            {currentEquityShares.map((share, idx) => { const total = calculateTotal(share.number_of_equity_shares, share.nominal_amount_per_share); return (<div key={`cdir-eq-${idx}`} className="table-responsive mb-3"><div className="sub-heading">Equity Share Class {idx + 1}</div><table className="data-table table table-bordered"><thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead><tbody><tr><td>Number of equity shares</td><td><input type="number" className="form-control" value={share.number_of_equity_shares || ''} onChange={(e) => handleCDirectorEquityShareChange(cActiveTab, idx, 'number_of_equity_shares', e.target.value)} /></td></tr><tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.nominal_amount_per_share || ''} onChange={(e) => handleCDirectorEquityShareChange(cActiveTab, idx, 'nominal_amount_per_share', e.target.value)} /></td></tr><tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={share.total_amount || total} readOnly /></td></tr></tbody></table></div>);})}
            
            {/* Preference Share Capital */}
            <div className="sub-heading">Description of preference share capital</div>
            <div className="row mb-3">
              <div className="col-md-4 d-flex align-items-center">
                <label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of classes:</label>
                <input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentPrefShares.length} onChange={(e) => { /* handleCDirectorPrefClassCountChange(cActiveTab, e.target.value) */ }} /> {/* TODO: Implement handleCDirectorPrefClassCountChange */}
              </div>
            </div>
            {currentPrefShares.map((share, idx) => { const total = calculateTotal(share.number_of_preference_shares, share.nominal_amount_per_share); return (<div key={`cdir-pref-${idx}`} className="table-responsive mb-3"><div className="sub-heading">Preference Share Class {idx + 1}</div><table className="data-table table table-bordered"><thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead><tbody><tr><td>Number of preference shares</td><td><input type="number" className="form-control" value={share.number_of_preference_shares || ''} onChange={(e) => { /* handleCDirectorPrefShareChange(cActiveTab, idx, 'number_of_preference_shares', e.target.value) */ }} /></td></tr><tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.nominal_amount_per_share || ''} onChange={(e) => { /* handleCDirectorPrefShareChange(cActiveTab, idx, 'nominal_amount_per_share', e.target.value) */ }} /></td></tr><tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={share.total_amount || total} readOnly /></td></tr></tbody></table></div>);})} {/* TODO: Implement handleCDirectorPrefShareChange */}
            
            {/* Declaration of Interests */}
            <div className="sub-heading mb-2">7A(ii) Declaration of entities in which Subscriber/Director is interested</div>
            <div className="row mb-3">
              <div className="col-md-6 d-flex align-items-center">
                <label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of entities:</label>
                <input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentInterests.length} onChange={(e) => handleCDirectorInterestCountChange(cActiveTab, e.target.value)} />
              </div>
            </div>
            {currentInterests.map((entity, idx) => (
              <div key={`cdir-interest-${idx}`} className="mb-4 border p-3 rounded bg-light">
                <div className="sub-heading mt-0 mb-3 small text-primary fw-bold">Entity {idx + 1}</div>
                <div className="row mb-3">
                  <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>CIN/LLPIN/FCRN/Regn. No.</label><input type="text" className="form-control" value={entity.cin_llpin_fcrn_registration_number || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'cin_llpin_fcrn_registration_number', e.target.value)} /></div>
                  <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Name</label><input type="text" className="form-control" value={entity.name || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'name', e.target.value)} /></div>
                </div>
                <div className="mb-3"><label className="form-label_sp"><span className="text-danger">*</span>Address</label><textarea className="form-control" rows={2} value={entity.address || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'address', e.target.value)} /></div>
                <div className="row mb-3">
                  <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span>Nature of Interest</label><input type="text" className="form-control" value={entity.nature_of_interest || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'nature_of_interest', e.target.value)} /></div>
                  <div className="col-md-4"><label className="form-label_sp">Designation (Other specify if needed)</label><input type="text" className="form-control" value={entity.designation_other_specify_if_needed || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'designation_other_specify_if_needed', e.target.value)} /></div>
                   <div className="col-md-4"><label className="form-label_sp">Percentage of Shareholding</label><input type="number" step="0.01" className="form-control" value={entity.percentage_of_shareholding || '0'} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'percentage_of_shareholding', e.target.value)} /></div>
                </div>
                 <div className="row mb-3">
                  <div className="col-md-4"><label className="form-label_sp">Amount (in INR)</label><input type="number" className="form-control" value={entity.amount_in_inr || ''} onChange={e => handleCDirectorInterestChange(cActiveTab, idx, 'amount_in_inr', e.target.value)} /></div>
                </div>
              </div>
            ))}
            {/* Forex Declaration */}
             <hr />
            <div className="row mt-3">
                <div className="col-12">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" name={`forex-cdir-${cActiveTab}`} id={`forex-cdir-yes-${cActiveTab}`} checked={currentItem.forexRequired === true} onChange={() => handleCDirectorChange(cActiveTab, 'forexRequired', true)}/>
                    <label className="form-check-label" htmlFor={`forex-cdir-yes-${cActiveTab}`}>I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments)
                    Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith.</label>
                  </div>
                  <div className="text-center mb-4">OR</div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" name={`forex-cdir-${cActiveTab}`} id={`forex-cdir-no-${cActiveTab}`} checked={currentItem.forexRequired === false || currentItem.forexRequired === 'not_required'} onChange={() => handleCDirectorChange(cActiveTab, 'forexRequired', false)}/>
                    <label className="form-check-label" htmlFor={`forex-cdir-no-${cActiveTab}`}>I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt
                      Instruments) Rules, 2019 prior to subscription of shares.</label>
                  </div>
                </div>
            </div>
          </div>
        ) : (cDirectors.length === 0 && <div className="p-3 text-muted">No Subscriber cum Directors with DIN entered in section 5.</div>)}
      </>
    );
}

case 10: { // 7B: Subscriber cum Director WITHOUT DIN
  const currentItem = getCurrentItem(noDinDirectors, noDinActiveTab);
  // Ensure nested arrays always exist for the current item, even if empty, for safe rendering
  const currentEquityShares = currentItem.equityShares || [];
  const currentPrefShares = currentItem.preferenceShares || [];
  const currentInterests = currentItem.interests || [];
  
  let showPreviousAddress = false;
  if (currentItem.duration_of_stay_at_present_address?.years !== undefined && 
      currentItem.duration_of_stay_at_present_address.years !== '' && // Check for non-empty string too
      parseInt(currentItem.duration_of_stay_at_present_address.years, 10) < 1) {
    showPreviousAddress = true;
  }

  return (
    <>
      <div className="tab-container">
        {noDinDirectors.map((_, index) => (
          <button
            key={`subdir-nodin-tab-${index}`}
            className={`tab-button ${noDinActiveTab === index ? 'active' : ''}`}
            onClick={() => setNoDinActiveTab(index)}
          >
            Director {index + 1}
          </button>
        ))}
      </div>

      {noDinDirectors.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
        <form className="subscriber-form" onSubmit={handleInnerFormSubmit}> {/* Added form tag */}
          <div className="section-heading mb-1">
            7B Particulars of Subscriber(s) cum Directors (Not having valid DIN)
          </div>
          <div className="sub-heading" style={{ fontSize: '0.8rem', marginTop: '0' }}>
            7B(i) Detail of Subscriber cum Director {noDinActiveTab + 1}
          </div>
            
          {/* --- Personal Details --- */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label_sp"><span className="text-danger">*</span> First Name</label>
              <input type="text" className="form-control" value={currentItem.firstName || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'firstName', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label_sp">Middle Name</label>
              <input type="text" className="form-control" value={currentItem.middleName || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'middleName', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label_sp"><span className="text-danger">*</span> Surname</label>
              <input type="text" className="form-control" value={currentItem.surname || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'surname', e.target.value)} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label_sp"><span className="text-danger">*</span> Father's First Name</label>
              <input type="text" className="form-control" value={currentItem.fathers_first_name || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'fathers_first_name', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label_sp">Father's Middle Name</label>
              <input type="text" className="form-control" value={currentItem.fathers_middle_name || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'fathers_middle_name', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label_sp"><span className="text-danger">*</span> Father's Surname</label>
              <input type="text" className="form-control" value={currentItem.fathers_surname || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'fathers_surname', e.target.value)} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-3"> {/* Adjusted from col-md-4 for better fit */}
              <label className="form-label_sp"><span className="text-danger">*</span> Gender</label>
              <select className="form-select" value={currentItem.gender || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'gender', e.target.value)}>
                <option value="">-- Select --</option><option value="Male">Male</option><option value="Female">Female</option><option value="Transgender">Transgender</option>
              </select>
            </div>
            <div className="col-md-3"> {/* Adjusted */}
              <label className="form-label_sp"><span className="text-danger">*</span> Date of Birth</label>
              <input type="date" className="form-control" value={currentItem.dob || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'dob', e.target.value)} />
            </div>
            <div className="col-md-3"> {/* Adjusted */}
              <label className="form-label_sp"><span className="text-danger">*</span> Nationality</label>
              <input type="text" className="form-control" value={currentItem.nationality || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'nationality', e.target.value)} />
            </div>
            <div className="col-md-3"> {/* Adjusted */}
              <label className="form-label_sp"><span className="text-danger">*</span> Place of Birth (District & State)</label>
              <input type="text" className="form-control" value={currentItem.place_of_birth || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'place_of_birth', e.target.value)} />
            </div>
          </div>
          
          <div className="row mb-3">
              <div className="col-md-4">
                  <label className="form-label_sp">Whether citizen of India?</label>
                  <div>
                      <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dir_nodin_citizen_${noDinActiveTab}`} id={`dirNoDinCitizenYes_${noDinActiveTab}`} value="Yes" checked={currentItem.is_citizen_of_india === 'Yes' || currentItem.is_citizen_of_india === true} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_citizen_of_india', 'Yes')} /> <label className="form-check-label" htmlFor={`dirNoDinCitizenYes_${noDinActiveTab}`}>Yes</label> </div>
                      <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dir_nodin_citizen_${noDinActiveTab}`} id={`dirNoDinCitizenNo_${noDinActiveTab}`} value="No" checked={currentItem.is_citizen_of_india === 'No' || currentItem.is_citizen_of_india === false} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_citizen_of_india', 'No')} /> <label className="form-check-label" htmlFor={`dirNoDinCitizenNo_${noDinActiveTab}`}>No</label> </div>
                  </div>
              </div>
              <div className="col-md-4">
                  <label className="form-label_sp">Whether resident in India?</label>
                  <div>
                      <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dir_nodin_resident_${noDinActiveTab}`} id={`dirNoDinResidentYes_${noDinActiveTab}`} value="Yes" checked={currentItem.is_resident_in_india === 'Yes' || currentItem.is_resident_in_india === true} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_resident_in_india', 'Yes')} /> <label className="form-check-label" htmlFor={`dirNoDinResidentYes_${noDinActiveTab}`}>Yes</label> </div>
                      <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dir_nodin_resident_${noDinActiveTab}`} id={`dirNoDinResidentNo_${noDinActiveTab}`} value="No" checked={currentItem.is_resident_in_india === 'No' || currentItem.is_resident_in_india === false} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_resident_in_india', 'No')} /> <label className="form-check-label" htmlFor={`dirNoDinResidentNo_${noDinActiveTab}`}>No</label> </div>
                  </div>
              </div>
          </div>

          {/* --- Professional/Contact Details --- */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label_sp"><span className="text-danger">*</span> Occupation type</label>
              <select className="form-select" value={currentItem.occupation_type || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'occupation_type', e.target.value)}>
                  <option value="">-- Select --</option><option value="Business">Business</option><option value="Professional">Professional</option><option value="Government">Government</option><option value="Employment">Employment</option><option value="Private Employment">Private Employment</option><option value="Housewife">Housewife</option><option value="Student">Student</option><option value="Others">Others</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label_sp"><span className="text-danger">*</span> Area of Occupation</label>
              <input type="text" className="form-control" value={currentItem.occupation_area || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'occupation_area', e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-12"> {/* This was col-12 in your example for Case 10 */}
              <label className="form-label_sp">If 'Others' occupation, specify</label>
              <input type="text" className="form-control" value={currentItem.occupationOther || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'occupation_other', e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label_sp"><span className="text-danger">*</span> Educational Qualification</label>
              <select className="form-select" value={currentItem.educational_qualification || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'educational_qualification', e.target.value)}>
                  <option value="">-- Select --</option><option value="Primary education">Primary education</option><option value="Secondary education">Secondary education</option><option value="Vocational qualification">Vocational qualification</option><option value="Bachelor's degree">Bachelor's degree</option><option value="Master's degree">Master's degree</option><option value="Doctorate or higher">Doctorate or higher</option><option value="Professional Diploma">Professional Diploma</option><option value="Others">Others</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label_sp">If 'Others' qualification, specify</label>
              <input type="text" className="form-control" value={currentItem.educationOther || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'education_other', e.target.value)} />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4"><label className="form-label_sp">PAN</label><input type="text" className="form-control" value={currentItem.pan || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'pan', e.target.value.toUpperCase())} /></div>
            <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Mobile No</label><input type="tel" className="form-control" value={currentItem.mobile_number || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'mobile_number', e.target.value)} /></div>
            <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Email ID</label><input type="email" className="form-control" value={currentItem.email_id || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'email_id', e.target.value)} /></div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label_sp"><span className="text-danger">*</span> Designation</label>
              <select className="form-select" value={currentItem.designation || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'designation', e.target.value)}>
                  <option value="">-- Select --</option><option value="Director">Director</option><option value="Managing Director">Managing Director</option><option value="Whole time director">Whole time director</option><option value="Nominee director">Nominee director</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label_sp">Type:</label>
              <div>
                <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`subdir-nodin-type-chairman-${noDinActiveTab}`} checked={currentItem.is_chairman || false} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'is_chairman', e.target.checked)} /><label className="form-check-label" htmlFor={`subdir-nodin-type-chairman-${noDinActiveTab}`}>Chairman</label></div>
                <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`subdir-nodin-type-exec-${noDinActiveTab}`} checked={currentItem.is_executive_director === undefined ? true : currentItem.is_executive_director} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'is_executive_director', e.target.checked)} /><label className="form-check-label" htmlFor={`subdir-nodin-type-exec-${noDinActiveTab}`}>Executive</label></div>
                <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`subdir-nodin-type-nonexec-${noDinActiveTab}`} checked={currentItem.is_non_executive_director || false} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'is_non_executive_director', e.target.checked)} /><label className="form-check-label" htmlFor={`subdir-nodin-type-nonexec-${noDinActiveTab}`}>Non-executive</label></div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6"><label className="form-label_sp">If Nominee, name of entity</label><input type="text" className="form-control" value={currentItem.nominee_company_name || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'nominee_company_name', e.target.value)} /></div>
            <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Category</label><select className="form-select" value={currentItem.category || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'category', e.target.value)}><option value="">-- Select --</option><option value="Promoter">Promoter</option><option value="Professional">Professional</option><option value="Independent">Independent</option><option value="Nominee">Nominee</option></select></div>
          </div>

          {/* --- Permanent Address Details --- */}
          <div className="sub-heading">Permanent Address</div>
          <div className="row mb-3">
              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Line 1</label><input type="text" className="form-control" value={currentItem.permanent_address?.line_1 || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.line_1', e.target.value)} /></div>
              <div className="col-md-6"><label className="form-label_sp">Line 2</label><input type="text" className="form-control" value={currentItem.permanent_address?.line_2 || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.line_2', e.target.value)} /></div>
              </div>

         <div className="row mb-3">
  <div className="col-md-4">
    <label className="form-label_sp">Phone</label>
    <input
      type="tel"
      className="form-control"
      value={currentItem.permanent_address?.phone || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.phone', e.target.value)}
    />
  </div>
  <div className="col-md-4">
    <label className="form-label_sp"><span className="asterisk">*</span> Pin code</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.pin_code || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.pin_code', e.target.value)}
    />
  </div>
  <div className="col-md-4">
    <label className="form-label_sp"><span className="asterisk">*</span> Country</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.country || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.country', e.target.value)}
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col-md-6">
    <label className="form-label_sp"><span className="asterisk">*</span> Area / Locality</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.area_locality || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.area_locality', e.target.value)}
    />
  </div>
  <div className="col-md-6">
    <label className="form-label_sp">District</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.district || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.district', e.target.value)}
    />
  </div>
</div>

<div className="row mb-3">
  <div className="col-md-6">
    <label className="form-label_sp"><span className="asterisk">*</span> City</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.city || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.city', e.target.value)}
    />
  </div>
  <div className="col-md-6">
    <label className="form-label_sp"><span className="asterisk">*</span> State/UT</label>
    <input
      type="text"
      className="form-control"
      value={currentItem.permanent_address?.state_ut || ''}
      onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'permanent_address.state_ut', e.target.value)}
    />
  </div>
</div>

  
          {/* ... (Country, Pincode, Locality, City, District, State, Phone for Permanent Address) ... */}
           <div className="row mb-3">
              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Present address same as permanent?</label>
                  <div>
                      <input className="form-check-input" type="radio" name={`subdirNoDinAddrSame-${noDinActiveTab}`} checked={currentItem.is_present_address_same_as_permanent === true} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_present_address_same_as_permanent', true)} /> Yes 
                      <input className="form-check-input" type="radio" name={`subdirNoDinAddrSame-${noDinActiveTab}`} checked={currentItem.is_present_address_same_as_permanent === false} onChange={() => updateNoDinDirectorField(noDinActiveTab, 'is_present_address_same_as_permanent', false)} /> No
                  </div>
                  
              </div>
          </div>
          
          {/* --- Present Address Details (Conditional) --- */}
          {currentItem.is_present_address_same_as_permanent === false && (
               <>
      <div className="sub-heading">
        <span className="text-danger">*</span>Present Address
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label_sp">
            <span className="text-danger">*</span>Line 1
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.line_1 || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.line_1',
                e.target.value
              )
            }
          />
        </div>
        <div className="col-md-6">
          <label className="form-label_sp">Line 2</label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.line_2 || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.line_2',
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-3 col-6">
          <label className="form-label_sp">
            <span className="asterisk">*</span>Country
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.country || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.country',
                e.target.value
              )
            }
          />
        </div>
        <div className="col-md-3 col-6">
          <label className="form-label_sp">
            <span className="asterisk">*</span>Pin code
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.pin_code || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.pin_code',
                e.target.value
              )
            }
          />
        </div>
        <div className="col-md-3 col-6">
          <label className="form-label_sp">
            <span className="asterisk">*</span>Area/Locality
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.area_locality || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.area_locality',
                e.target.value
              )
            }
          />
        </div>
        <div className="col-md-3 col-6">
          <label className="form-label_sp">
            <span className="asterisk">*</span>City
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.city || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.city',
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label_sp">District</label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.district || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.district',
                e.target.value
              )
            }
          />
        </div>
        <div className="col-md-6">
          <label className="form-label_sp">
            <span className="asterisk">*</span>State/UT
          </label>
          <input
            type="text"
            className="form-control"
            value={currentItem.present_address?.state_ut || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.state_ut',
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label_sp">Phone (STD/ISD)</label>
          <input
            type="tel"
            className="form-control"
            value={currentItem.present_address?.phone || ''}
            onChange={(e) =>
              updateNoDinDirectorField(
                noDinActiveTab,
                'present_address.phone',
                e.target.value
              )
            }
          />
        </div>
      </div>
    </>
          )}

          {/* --- Stay Duration and Proofs --- */}
          <div className="row mb-3">
              <div className="col-md-4"><label className="form-label_sp">Duration of stay at present address (YY/MM)</label><input type="text" placeholder="YY/MM" className="form-control" value={`${currentItem.duration_of_stay_at_present_address?.years || ''}/${currentItem.duration_of_stay_at_present_address?.months || ''}`} onChange={(e) => { const parts = e.target.value.split('/'); updateNoDinDirectorField(noDinActiveTab, 'duration_of_stay_at_present_address.years', parts[0]); updateNoDinDirectorField(noDinActiveTab, 'duration_of_stay_at_present_address.months', parts[1]); }} /></div>
              {showPreviousAddress && <div className="col-md-8"><label className="form-label_sp">If stay at present address 1 year, previous address</label><textarea rows="1" className="form-control" value={currentItem.previous_address?.previous_line1 || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'previous_address.previous_line1', e.target.value)}></textarea></div>}
          </div>
          <hr />
          <div className="row mb-3">
<div className="col-md-6">
  <label className="form-label_sp">
    <span className="text-danger">*</span> Identity Proof Type
  </label>
  <select
    className="form-select"
    value={currentItem.identity_proof_type || ''}
    onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'identity_proof_type', e.target.value)}
  >
    <option value="">-- Select Proof --</option>
    <option value="Voter Identity Card">Voter Identity Card</option>
    <option value="Passport">Passport</option>
    <option value="Driving License">Driving License</option>
    <option value="Aadhaar">Aadhaar</option>
    <option value="Bank Statement">Bank Statement</option>
  </select>
</div>
              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Identity Proof No.</label><input type="text" className="form-control" value={currentItem.identity_proof_number || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'identity_proof_number', e.target.value)} /></div>
          </div>
           <div className="row mb-3">
              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span>Residential Proof Type</label><select className="form-select" value={currentItem.residential_proof_type || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'residential_proof_type', e.target.value)}
                ><option value="">-- Select Proof --</option>
                    <option value="Voter Identity Card">Voter Identity Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Bank Statement">Bank Statement</option>
                
                </select></div>
              <div className="col-md-6"><label className="form-label_sp">Residential Proof No.</label><input type="text" className="form-control" value={currentItem.residential_proof_number || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'residential_proof_number', e.target.value)} /></div>
          </div>
          <div className="sub-heading" style={{ fontSize: "0.8rem" }}>Submit the proof of identity and proof of address</div>
          <div className="row mb-3">
              <div className="col-md-6"><label className="form-label_sp small">(a) <span className="text-danger">*</span>Proof of identity (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleNoDinDirectorFileChange(noDinActiveTab, 'idProofFile', e.target.files[0])}/> {currentItem.idProofFile && <small>{typeof currentItem.idProofFile === 'string' ? currentItem.idProofFile : currentItem.idProofFile.name}</small>}</div>
              <div className="col-md-6"><label className="form-label_sp small">(b) <span className="text-danger">*</span>Residential Proof (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleNoDinDirectorFileChange(noDinActiveTab, 'resProofFile', e.target.files[0])}/> {currentItem.resProofFile && <small>{typeof currentItem.resProofFile === 'string' ? currentItem.resProofFile : currentItem.resProofFile.name}</small>}</div>
          </div>
          
          {/* --- Share Capital Details --- */}
          <div className="sub-heading mb-2 mt-4">Description of Share capital (Not having DIN)</div>
          <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp">Total subscribed share capital (in INR)</label><input type="number" className="form-control" value={currentItem.total_subscribed_share_capital || ''} onChange={(e) => updateNoDinDirectorField(noDinActiveTab, 'total_subscribed_share_capital', e.target.value)} /></div></div>
          <div className="sub-heading">Description of equity share capital</div>
          <div className="row mb-3"><div className="col-md-4 d-flex align-items-center"><label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of classes:</label><input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentEquityShares.length} onChange={(e) => handleNoDinDirectorEquityClassCountChange(noDinActiveTab, e.target.value)} /></div></div>
          {currentEquityShares.map((share, idx) => { const total = calculateTotal(share.number_of_equity_shares, share.nominal_amount_per_share); return (<div key={`subdir-nodin-eq-${idx}`} className="table-responsive mb-3"><div className="sub-heading">Equity Share Class {idx + 1}</div><table className="data-table table table-bordered"><thead><tr><th>Details</th><th>Subscribed capital</th></tr></thead><tbody><tr><td>Number of equity shares</td><td><input type="number" className="form-control" value={share.number_of_equity_shares || ''} onChange={(e) => handleNoDinDirectorEquityShareChange(noDinActiveTab, idx, 'number_of_equity_shares', e.target.value)} /></td></tr><tr><td>Nominal amount per share (in INR)</td><td><input type="number" className="form-control" value={share.nominal_amount_per_share || ''} onChange={(e) => handleNoDinDirectorEquityShareChange(noDinActiveTab, idx, 'nominal_amount_per_share', e.target.value)} /></td></tr><tr><td>Total amount (in INR)</td><td><input type="number" className="form-control" value={share.total_amount || total} readOnly /></td></tr></tbody></table></div>);})}
          {/* ... Preference Share Capital for noDinDirector ... */}

          {/* --- Declaration of Interests --- */}
          <div className="sub-heading mb-2 mt-4">7B(ii) Declaration of entities in which Subscriber/Director (Not having DIN) is interested</div>
          <div className="row mb-3"><div className="col-md-6 d-flex align-items-center"><label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of entities:</label><input type="number" className="form-control" style={{ maxWidth: '100px' }} min="0" value={currentInterests.length} onChange={(e) => handleNoDinDirectorInterestCountChange(noDinActiveTab, e.target.value)} /></div></div>
          {currentInterests.map((entity, idx) => ( <div key={`subdir-nodin-interest-${idx}`} className="mb-4 border p-3 rounded bg-light"> {/* ... Interest Entity Fields using handleNoDinDirectorInterestChange ... */} </div> ))}
          
          {/* --- Forex Declaration --- */}
          <div className="row mt-3"><div className="col-12">{/* ... Forex Radio Buttons using updateNoDinDirectorField ... */}</div></div>
        </form> 
      ) : (noDinDirectors.length === 0 && <div className="p-3 text-muted">No Subscriber cum Directors without DIN entered in section 5.</div>)}
    </>
  );
}
case 11: { // 7C: Director WITH DIN (not subscriber)
    const currentItem = getCurrentItem(otherDinDirectors, otherDinTab);
    const currentInterests = currentItem.interests || [];

    return (
      <>
        <div className="tab-container">
          {otherDinDirectors.map((_, index) => ( <button key={`dir-din-tab-${index}`} className={`tab-button ${otherDinTab === index ? 'active' : ''}`} onClick={() => setOtherDinTab(index)}> Director {index + 1} </button> ))}
        </div>
        {otherDinDirectors.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
          <div className="subscriber-form">
            <div className="section-heading mb-1">7C Particulars of Directors (having valid DIN, not subscribers)</div>
            <div className="sub-heading">7C(i) Basic Details of Director {otherDinTab + 1}</div>
            <div className="row mb-3">
                <div className="col-md-4"><label className="form-label_sp">DIN</label><input type="text" className="form-control" value={currentItem.director_identification_number_din || ''} onChange={(e)=>updateOtherDinDirectorField(otherDinTab, 'director_identification_number_din', e.target.value)}/></div>
                <div className="col-md-8"><label className="form-label_sp">Name</label><input type="text" className="form-control" value={currentItem.name || ''} onChange={(e)=>updateOtherDinDirectorField(otherDinTab, 'name', e.target.value)} readOnly={!!currentItem.director_identification_number_din}/></div>
            </div>
           {/* Designation & Category */}
           <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor={`other_din_director_designation_${otherDinTab}`} className="form-label_sp">Designation</label>
                              <select
                                id={`other_din_director_designation_${otherDinTab}`}
                                className="form-select"
                                value={otherDinDirectors[otherDinTab].designation || ''}
                                onChange={(e) => {
                                  const updated = [...otherDinDirectors];
                                  updated[otherDinTab].designation = e.target.value;
                                  setOtherDinDirectors(updated);
                                }}
                              >
                                <option value="">-- Select --</option>
                                <option value="Director">Director</option>
                                <option value="Managing Director">Managing Director</option>
                                <option value="Whole time director">Whole time director</option>
                                <option value="Nominee director">Nominee director</option>
                              </select>
                            </div>
                
                            <div className="col-md-6">
                              <label htmlFor={`other_din_director_category_${otherDinTab}`} className="form-label_sp">Category</label>
                              <select
                                id={`other_din_director_category_${otherDinTab}`}
                                className="form-select"
                                value={otherDinDirectors[otherDinTab].category || ''}
                                onChange={(e) => {
                                  const updated = [...otherDinDirectors];
                                  updated[otherDinTab].category = e.target.value;
                                  setOtherDinDirectors(updated);
                                }}
                              >
                                <option value="">-- Select --</option>
                                <option value="Promoter">Promoter</option>
                                <option value="Professional">Professional</option>
                                <option value="Independent">Independent</option>
                                <option value="Nominee">Nominee</option>
                              </select>
                            </div>
                          </div>
                
                          {/* Role Checkboxes (changed to radio for single selection of role) */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <label className="form-label_sp">Whether:</label>
                              <div>
                                {["Chairman", "Executive", "NonExecutive"].map((roleValue) => (
                                  <div className="form-check form-check-inline" key={roleValue}>
                                    <input
                                      className="form-check-input"
                                      type="radio" // Assuming only one role can be selected
                                      name={`other_din_director_role_${otherDinTab}`} // Unique name for the radio group per director
                                      id={`other_din_director_role_${otherDinTab}_${roleValue.toLowerCase()}`}
                                      value={roleValue}
                                      checked={otherDinDirectors[otherDinTab].role === roleValue}
                                      onChange={() => {
                                        const updated = [...otherDinDirectors];
                                        updated[otherDinTab].role = roleValue;
                                        setOtherDinDirectors(updated);
                                      }}
                                    />
                                    <label className="form-check-label" htmlFor={`other_din_director_role_${otherDinTab}_${roleValue.toLowerCase()}`}>
                                      {roleValue === "NonExecutive" ? "Non-executive Director" : `${roleValue} Director`}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                
                
                          {/* Nominee Entity & Email */}
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label htmlFor={`other_din_director_nominee_${otherDinTab}`} className="form-label_sp">
                                Name of the company or institution whose nominee the appointee is
                              </label>
                              <input
                                type="text"
                                id={`other_din_director_nominee_${otherDinTab}`}
                                className="form-control"
                                value={otherDinDirectors[otherDinTab].nomineeEntity || ''}
                                onChange={(e) => {
                                  const updated = [...otherDinDirectors];
                                  updated[otherDinTab].nomineeEntity = e.target.value;
                                  setOtherDinDirectors(updated);
                                }}
                              />
                            </div>
                
                            <div className="col-md-6">
                              <label htmlFor={`other_din_director_email_${otherDinTab}`} className="form-label_sp">Email</label>
                              <input
                                type="email"
                                id={`other_din_director_email_${otherDinTab}`}
                                className="form-control"
                                value={otherDinDirectors[otherDinTab].email || ''}
                                onChange={(e) => {
                                  const updated = [...otherDinDirectors];
                                  updated[otherDinTab].email = e.target.value;
                                  setOtherDinDirectors(updated);
                                }}
                              />
                            </div>
                          </div>
                
                          {/* --- Declaration of Interests --- */}
                          <div className="sub-heading mb-2 mt-4">
                            7C(ii) Declaration of entities in which Director has interest
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-7 d-flex align-items-center"> {/* Adjusted column width */}
                              <label htmlFor={`other_din_director_interest_count_${otherDinTab}`} className="form-label_sp me-2 mb-0">
                                <span className="text-danger">*</span> Number of entities in which director has interest:
                              </label>
                              <input
                                type="number"
                                id={`other_din_director_interest_count_${otherDinTab}`}
                                className="form-control"
                                style={{ maxWidth: "100px" }}
                                min="0"
                                value={otherDinDirectors[otherDinTab]?.interests?.length || 0}
                                onChange={(e) => handleInterestCountChange(otherDinTab, e.target.value)}
                              />
                            </div>
                          </div>
                
                          {otherDinDirectors[otherDinTab]?.interests?.map((entity, interestIdx) => (
                            <div key={`other-din-interest-${interestIdx}`} className="mb-4 border p-3 rounded bg-light">
                              <div className="sub-heading mt-0 mb-3 small text-primary fw-bold">
                                Entity {interestIdx + 1}
                              </div>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label htmlFor={`other_din_interest_cin_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                    <span className="text-danger">*</span> CIN/LLPIN/FCRN/Regn. No.
                                  </label>
                                  <input
                                    type="text"
                                    id={`other_din_interest_cin_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.cin || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'cin', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label htmlFor={`other_din_interest_name_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                    <span className="text-danger">*</span> Name
                                  </label>
                                  <input
                                    type="text"
                                    id={`other_din_interest_name_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.name || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'name', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label htmlFor={`other_din_interest_addr_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                  <span className="text-danger">*</span> Address
                                </label>
                                <textarea
                                  id={`other_din_interest_addr_${otherDinTab}_${interestIdx}`}
                                  rows={2}
                                  className="form-control"
                                  value={entity.address || ''}
                                  onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'address', e.target.value)}
                                />
                              </div>
                              <div className="sub-heading" style={{ fontSize: "0.8rem" }}>
                                <span className="text-danger">*</span> Nature Of interest
                              </div>
                              <div className="row">
                                <div className="col-md-4">
                                  <label htmlFor={`other_din_interest_desig_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                    <span className="text-danger">*</span> Designation
                                  </label>
                                  <input
                                    type="text"
                                    id={`other_din_interest_desig_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.designation || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'designation', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label htmlFor={`other_din_interest_perc_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                    Percentage of Shareholding
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    id={`other_din_interest_perc_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.percentage || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'percentage', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label htmlFor={`other_din_interest_amount_${otherDinTab}_${interestIdx}`} className="form-label_sp">
                                    Amount (in INR)
                                  </label>
                                  <input
                                    type="number"
                                    id={`other_din_interest_amount_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.amount || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'amount', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-12">
                                  <label htmlFor={`other_din_interest_other_${otherDinTab}_${interestIdx}`} className="form-label_sp">Other(specify)</label>
                                  <input
                                    type="text"
                                    id={`other_din_interest_other_${otherDinTab}_${interestIdx}`}
                                    className="form-control"
                                    value={entity.other || ''}
                                    onChange={(e) => handleInterestChange(otherDinTab, interestIdx, 'other', e.target.value)}
                                  />
                                </div>
                              </div>
                              {interestIdx < (otherDinDirectors[otherDinTab]?.interests?.length || 0) - 1 && <hr className="mt-3" />}
                            </div>
                          ))}
                      
                     
                          </div>
                        ) : (otherDinDirectors.length === 0 && <div className="p-3 text-muted">No Directors with DIN (not subscribers) entered in section 5.</div>)}
                      </>
                    );
                }
                case 12: { // 7D: Director WITHOUT DIN (not subscriber)
                  const currentItem = getCurrentItem(directorsOnlyNoDin, directorsOnlyNoDinTab);
                  const currentInterests = currentItem.interests || []; // Ensure interests is an array
                  
                  let showPreviousAddress = false;
                  const stayYears = currentItem.duration_of_stay_at_present_address?.years;
                  if (stayYears !== undefined && stayYears !== '' && parseInt(stayYears, 10) < 1) {
                    showPreviousAddress = true;
                  }
              
                  return (
                    <>
                      <div className="tab-container">
                          {directorsOnlyNoDin.map((_, index) => (
                              <button 
                                  key={`dir-nodin-only-tab-${index}`} 
                                  className={`tab-button ${directorsOnlyNoDinTab === index ? 'active' : ''}`} 
                                  onClick={() => setDirectorsOnlyNoDinTab(index)}
                              > 
                                  Director {index + 1} 
                              </button>
                          ))}
                      </div>
              
                      {directorsOnlyNoDin.length > 0 && currentItem && Object.keys(currentItem).length > 0 ? (
                        <form className="subscriber-form" onSubmit={handleInnerFormSubmit}>
                          <div className="section-heading mb-2">7D(i) Basic Detail of Directors (Not having valid DIN)</div>
                          
                          {/* Personal Details */}
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> First Name</label><input type="text" className="form-control" value={currentItem.firstName || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'firstName', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp">Middle Name</label><input type="text" className="form-control" value={currentItem.middleName || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'middleName', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Surname</label><input type="text" className="form-control" value={currentItem.surname || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'surname', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Father's First Name</label><input type="text" className="form-control" value={currentItem.fathers_first_name || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'fathers_first_name', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp">Father's Middle Name</label><input type="text" className="form-control" value={currentItem.fathers_middle_name || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'fathers_middle_name', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Father's Surname</label><input type="text" className="form-control" value={currentItem.fathers_surname || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'fathers_surname', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Gender</label><select className="form-select" value={currentItem.gender || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'gender', e.target.value)}><option value="">-- Select --</option><option value="Male">Male</option><option value="Female">Female</option><option value="Transgender">Transgender</option></select></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Date of Birth</label><input type="date" className="form-control" value={currentItem.dob || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'dob', e.target.value)} /></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Nationality</label><input type="text" className="form-control" value={currentItem.nationality || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'nationality', e.target.value)} /></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Place of Birth</label><input type="text" className="form-control" value={currentItem.place_of_birth || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'place_of_birth', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">Citizen of India?</label><div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name={`dirOnlyNoDin_citizen_${directorsOnlyNoDinTab}`} checked={currentItem.is_citizen_of_india === true} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_citizen_of_india', true)} /><label className="form-check-label">Yes</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name={`dirOnlyNoDin_citizen_${directorsOnlyNoDinTab}`} checked={currentItem.is_citizen_of_india === false} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_citizen_of_india', false)} /><label className="form-check-label">No</label></div></div></div>
                              <div className="col-md-4"><label className="form-label_sp">Resident in India?</label><div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name={`dirOnlyNoDin_resident_${directorsOnlyNoDinTab}`} checked={currentItem.is_resident_in_india === true} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_resident_in_india', true)} /><label className="form-check-label">Yes</label></div><div className="form-check form-check-inline"><input className="form-check-input" type="radio" name={`dirOnlyNoDin_resident_${directorsOnlyNoDinTab}`} checked={currentItem.is_resident_in_india === false} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_resident_in_india', false)} /><label className="form-check-label">No</label></div></div></div>
                          </div>
              
                          {/* Occupation & Education Section */}
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Occupation type</label><select className="form-select" value={currentItem.occupation_type || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'occupation_type', e.target.value)}>{/* Options */}</select></div>
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Area of Occupation</label><input type="text" className="form-control" value={currentItem.area_of_occupation || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'area_of_occupation', e.target.value)} /></div>
                          </div>
                          {/* If Occupation is "Others", it's usually handled by the select itself or a conditional input. API does not have a separate "occupation_other" field for 7D, unlike 6A */}
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Educational Qualification</label><select className="form-select" value={currentItem.educational_qualification || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'educational_qualification', e.target.value)}>{/* Options */}</select></div>
                              {/* API for 7D does not have "education_other". If UI needs it, store in state but don't map to API unless API changes */}
                          </div>
              
                          {/* Contact & Designation Section */}
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">Income-tax PAN</label><input type="text" className="form-control" value={currentItem.income_tax_pan || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'income_tax_pan', e.target.value.toUpperCase())} /></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Mobile No</label><input type="tel" className="form-control" value={currentItem.mobile_no || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'mobile_no', e.target.value)} /></div>
                              <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Email ID</label><input type="email" className="form-control" value={currentItem.email_id || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'email_id', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Designation</label><select className="form-select" value={currentItem.designation || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'designation', e.target.value)}>{/* Options */}</select></div>
                              <div className="col-md-6">
                                  <label className="form-label_sp">Type:</label>
                                  <div>
                                      <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`dirOnlyNoDinTypeChairman-${directorsOnlyNoDinTab}`} checked={currentItem.is_chairman || false} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_chairman', e.target.checked)} /><label className="form-check-label" htmlFor={`dirOnlyNoDinTypeChairman-${directorsOnlyNoDinTab}`}>Chairman</label></div>
                                      <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`dirOnlyNoDinTypeExec-${directorsOnlyNoDinTab}`} checked={currentItem.is_executive_director === undefined ? false : currentItem.is_executive_director} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_executive_director', e.target.checked)} /><label className="form-check-label" htmlFor={`dirOnlyNoDinTypeExec-${directorsOnlyNoDinTab}`}>Executive</label></div>
                                      <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" id={`dirOnlyNoDinTypeNonExec-${directorsOnlyNoDinTab}`} checked={currentItem.is_non_executive_director || false} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_non_executive_director', e.target.checked)} /><label className="form-check-label" htmlFor={`dirOnlyNoDinTypeNonExec-${directorsOnlyNoDinTab}`}>Non-executive</label></div>
                                  </div>
                              </div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp">If Nominee, name of entity</label><input type="text" className="form-control" value={currentItem.nominee_company_name || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'nominee_company_name', e.target.value)} /></div>
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Category</label><select className="form-select" value={currentItem.category || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'category', e.target.value)}>{/* Options */}</select></div>
                          </div>
              
                          {/* Permanent Address */}
                          <div className="sub-heading">Permanent Address</div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Line 1</label><input type="text" className="form-control" value={currentItem.permanent_address?.line_1 || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.line_1', e.target.value)} /></div>
                              <div className="col-md-6"><label className="form-label_sp">Line 2</label><input type="text" className="form-control" value={currentItem.permanent_address?.line_2 || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.line_2', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Country</label><input type="text" className="form-control" value={currentItem.permanent_address?.country || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.country', e.target.value)} /></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Pin code</label><input type="text" className="form-control" value={currentItem.permanent_address?.pin_code || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.pin_code', e.target.value)} /></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> Area/Locality</label><input type="text" className="form-control" value={currentItem.permanent_address?.area_locality || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.area_locality', e.target.value)} /></div>
                              <div className="col-md-3"><label className="form-label_sp"><span className="text-danger">*</span> City</label><input type="text" className="form-control" value={currentItem.permanent_address?.city || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.city', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp">District</label><input type="text" className="form-control" value={currentItem.permanent_address?.district || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.district', e.target.value)} /></div>
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> State/UT</label><input type="text" className="form-control" value={currentItem.permanent_address?.state_ut || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.state_ut', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp">Phone (STD/ISD)</label><input type="tel" className="form-control" value={currentItem.permanent_address?.phone || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'permanent_address.phone', e.target.value)} /></div>
                              {/* Present Address Same as Permanent - API expects present_address object always, so this UI toggle is for convenience */}
                              <div className="col-md-6"> <label className="form-label_sp"><span className="text-danger">*</span> Present address same as permanent?</label> <div> <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dirOnlyNoDinAddrSame-${directorsOnlyNoDinTab}`} checked={currentItem.is_present_address_same_as_permanent === true} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_present_address_same_as_permanent', true)} /> Yes </div> <div className="form-check form-check-inline"> <input className="form-check-input" type="radio" name={`dirOnlyNoDinAddrSame-${directorsOnlyNoDinTab}`} checked={currentItem.is_present_address_same_as_permanent === false} onChange={() => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'is_present_address_same_as_permanent', false)} /> No </div> </div> </div>
                          </div>
                          
                          {/* Present Address - Conditionally shown in UI, but always structured in API if different */}
                          {currentItem.is_present_address_same_as_permanent === false && (
                            <>
                              <div className="sub-heading"><span className="text-danger">*</span>Present Address</div>
                              <div className="row mb-3"><div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Line 1</label><input type="text" className="form-control" value={currentItem.present_address?.line_1 || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'present_address.line_1', e.target.value)} /></div>{/* ... other present address fields ... */}</div>
                            </>
                          )}
              
                          {/* Stay Duration & Previous Address */}
                          <div className="row mb-3">
                              <div className="col-md-4"><label className="form-label_sp">Duration of stay at present address (YY/MM)</label><input type="text" placeholder="YY/MM" className="form-control" value={`${currentItem.duration_of_stay_at_present_address?.years || ''}/${currentItem.duration_of_stay_at_present_address?.months || ''}`} onChange={(e) => { const parts = e.target.value.split('/'); updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'duration_of_stay_at_present_address.years', parts[0]); updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'duration_of_stay_at_present_address.months', parts[1]); }} /></div>
                              {showPreviousAddress && <div className="col-md-8"><label className="form-label_sp">If stay at present address 1 year, previous address</label><textarea rows="1" className="form-control" value={currentItem.prevAddress?.previous_line1 || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'prevAddress.previous_line1', e.target.value)}></textarea></div>} {/* Assuming prevAddress state has nested fields */}
                          </div>
                          <hr />
              
                          {/* Identity and Residential Proof */}
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Identity Proof Type</label><select className="form-select" value={currentItem.identity_proof || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'identity_proof', e.target.value)}><option value="">-- Select --</option>{/* Options */}</select></div>
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Identity Proof No.</label><input type="text" className="form-control" value={currentItem.identity_proof_no || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'identity_proof_no', e.target.value)} /></div>
                          </div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Residential Proof Type</label><select className="form-select" value={currentItem.residential_proof || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'residential_proof', e.target.value)}><option value="">-- Select --</option>{/* Options */}</select></div>
                              <div className="col-md-6"><label className="form-label_sp">Residential Proof No.</label><input type="text" className="form-control" value={currentItem.residential_proof_no || ''} onChange={(e) => updateDirectorsOnlyNoDinField(directorsOnlyNoDinTab, 'residential_proof_no', e.target.value)} /></div>
                          </div>
                          
                          {/* File Uploads */}
                          <div className="sub-heading" style={{ fontSize: "0.8rem" }} > Submit the proof of identity and proof of address</div>
                          <div className="row mb-3">
                              <div className="col-md-6"><label className="form-label_sp small">(a) <span className="text-danger">*</span> Proof of identity (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleDirectorsOnlyNoDinFileChange(directorsOnlyNoDinTab, 'proof_of_identity_file', e.target.files[0])}/>{currentItem.proof_of_identity_file && <small>{typeof currentItem.proof_of_identity_file === 'string' ? currentItem.proof_of_identity_file : currentItem.proof_of_identity_file.name}</small>}</div>
                              <div className="col-md-6"><label className="form-label_sp small">(b) <span className="text-danger">*</span> Residential Proof (Attachment)</label><input type="file" className="form-control" onChange={(e) => handleDirectorsOnlyNoDinFileChange(directorsOnlyNoDinTab, 'proof_of_residential_address_file', e.target.files[0])}/>{currentItem.proof_of_residential_address_file && <small>{typeof currentItem.proof_of_residential_address_file === 'string' ? currentItem.proof_of_residential_address_file : currentItem.proof_of_residential_address_file.name}</small>}</div>
                          </div>
              
                          {/* Declaration of Interests */}
                          <div className="sub-heading">7D(ii) Declaration of entities in which Directors have interest</div>
                          <div className="row mb-3">
                              <div className="col-md-6 d-flex align-items-center">
                                  <label className="form-label_sp me-2 mb-0"><span className="text-danger">*</span> Number of entities:</label>
                                  <input type="number" className="form-control" style={{ maxWidth: "100px" }} min="0" value={currentInterests.length} onChange={(e) => handleDirectorsOnlyNoDinInterestCountChange(directorsOnlyNoDinTab, e.target.value)} />
                              </div>
                          </div>
                          {currentInterests.map((interest, idx) => (
                            <div key={`dirOnlyNoDin-interest-${idx}`} className="border p-3 rounded mb-3 bg-light">
                              <div className="sub-heading">Entity {idx + 1}</div>
                              <div className="row mb-3">
                                  <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> CIN/LLPIN/FCRN/Regn. No.</label><input type="text" className="form-control" value={interest.cin_llpin_fcrn_registration_number || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'cin_llpin_fcrn_registration_number', e.target.value)} /></div>
                                  <div className="col-md-6"><label className="form-label_sp"><span className="text-danger">*</span> Name</label><input type="text" className="form-control" value={interest.name || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'name', e.target.value)} /></div>
                              </div>
                              <div className="mb-3"><label className="form-label_sp"><span className="text-danger">*</span> Address</label><textarea className="form-control" rows="2" value={interest.address || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'address', e.target.value)} /></div>
                              <div className="sub-heading" style={{ fontSize: "0.8rem" }}><span className="text-danger">*</span> Nature of Interest</div>
                              <div className="row mb-3">
                                  <div className="col-md-4"><label className="form-label_sp"><span className="text-danger">*</span> Designation/Nature</label><input type="text" className="form-control" value={interest.nature_of_interest || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'nature_of_interest', e.target.value)} /></div> {/* Changed from designation to nature_of_interest */}
                                  <div className="col-md-4"><label className="form-label_sp">Percentage of Shareholding</label><input type="number" step="0.01" className="form-control" value={interest.percentage_of_shareholding || '0'} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'percentage_of_shareholding', e.target.value)} /></div>
                                  <div className="col-md-4"><label className="form-label_sp">Amount (in INR)</label><input type="number" className="form-control" value={interest.amount || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'amount', e.target.value)} /></div>
                              </div>
                              <div  className="row mt-2"><div className="col-12"><label className="form-label_sp">Other (specify Designation if not covered)</label><input type="text" className="form-control" value={interest.designation_other_specify || ''} onChange={(e) => handleDirectorsOnlyNoDinInterestChange(directorsOnlyNoDinTab, idx, 'designation_other_specify', e.target.value)} /></div></div>
                            </div>
                          ))}





                        </form>
                      ) : (directorsOnlyNoDin.length === 0 && <div className="p-3 text-muted">No Directors without DIN (not subscribers) entered in section 5.</div>)}
                    </>
                  );
              }
              case 13:
            return (
            <div>
            <div className="section-heading" style={{ border: 'none', marginBottom: '15px', paddingBottom: 0 }}>
            9 Particulars of payment of stamp duty
            </div>

            {/* 9A State or UT */}
            <div className="row mb-3 align-items-center">
            <label htmlFor="stamp_duty_state" className="col-md-5 col-lg-4 col-form-label_sp">
            9A State or UT for stamp duty:
            </label>
            <div className="col-md-7 col-lg-8">
            <input
            type="text"
            id="stamp_duty_state"
            name="stamp_duty_state"
            defaultValue=""
            className="form-control"
            />
            </div>
            </div>

            {/* 9B Pay electronically */}
            <div className="row mb-4 align-items-center">
            <label className="col-md-5 col-lg-4 col-form-label_sp">
            9B <span className="asterisk">*</span>Pay electronically via MCA 21?
            </label>
            <div className="col-md-7 col-lg-8">
            <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="stamp_duty_electronic"
            id="stampDutyYes"
            value="Yes"
            />
            <label className="form-check-label" htmlFor="stampDutyYes">Yes</label>
            </div>
            <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="stamp_duty_electronic"
            id="stampDutyNo"
            value="No"
            />
            <label className="form-check-label" htmlFor="stampDutyNo">No</label>
            </div>
            <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="stamp_duty_electronic"
            id="stampDutyNA"
            value="NA"
            />
            <label className="form-check-label" htmlFor="stampDutyNA">Not applicable</label>
            </div>
            </div>
            </div>

            {/* 9B(i) Stamp Duty Details */}
            <div className="sub-heading">9B(i) Details of stamp duty to be paid (if 'Yes' above)</div>
            <div className="table-responsive">
            <table className="data-table table table-bordered">
            <thead>
            <tr>
            <th>Document</th>
            <th>Form</th>
            <th>MoA</th>
            <th>AoA</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>Amount (Rs.)</td>
            <td>
            <input
            type="number"
            name="stamp_duty_form"
            defaultValue=""
            className="form-control"
            />
            </td>
            <td>
            <input
            type="number"
            name="stamp_duty_moa"
            defaultValue=""
            className="form-control"
            />
            </td>
            <td>
            <input
            type="number"
            name="stamp_duty_aoa"
            defaultValue=""
            className="form-control"
            />
            </td>
            </tr>
            </tbody>
            </table>
            </div>
            </div>
            );
            case 14:
            return (
            <div>
            <div className="sub-heading">9B(ii) Provide details of stamp duty already paid</div>

            <div className="table-responsive">
            <table className="data-table table table-bordered">
            <thead>
            <tr>
            <th>Type of document / Particulars</th>
            <th>Form</th>
            <th>MoA</th>
            <th>AoA</th>
            <th>Others</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>Total amount of stamp duty paid (in Rs.)</td>
            <td><input type="number" name="stamp_paid_total_form" className="form-control" /></td>
            <td><input type="number" name="stamp_paid_total_moa" className="form-control" /></td>
            <td><input type="number" name="stamp_paid_total_aoa" className="form-control" /></td>
            <td><input type="number" name="stamp_paid_total_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>Mode of payment of stamp duty</td>
            <td><input type="text" name="stamp_paid_mode_form" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_mode_moa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_mode_aoa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_mode_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>
            Name of vendor or treasury or Authority or any other competent agency authorized to collect stamp duty or to sell stamp papers or to emboss the documents or to dispense stamp vouchers on behalf of the Government
            </td>
            <td><input type="text" name="stamp_paid_vendor_form" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendor_moa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendor_aoa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendor_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>Serial number of embossing/stamps/stamp paper or treasury challan number</td>
            <td><input type="text" name="stamp_paid_serial_form" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_serial_moa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_serial_aoa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_serial_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>Registration number of vendor</td>
            <td><input type="text" name="stamp_paid_vendorreg_form" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendorreg_moa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendorreg_aoa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_vendorreg_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>Date of purchase of stamps / stamp paper / payment of stamp duty (DD/MM/YYYY)</td>
            <td><input type="date" name="stamp_paid_date_form" className="form-control" /></td>
            <td><input type="date" name="stamp_paid_date_moa" className="form-control" /></td>
            <td><input type="date" name="stamp_paid_date_aoa" className="form-control" /></td>
            <td><input type="date" name="stamp_paid_date_others" className="form-control" /></td>
            </tr>
            <tr>
            <td>Place of purchase of stamps / stamp paper / payment of stamp duty</td>
            <td><input type="text" name="stamp_paid_place_form" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_place_moa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_place_aoa" className="form-control" /></td>
            <td><input type="text" name="stamp_paid_place_others" className="form-control" /></td>
            </tr>
            </tbody>
            </table>
            </div>
            </div>
            );
            case 15:
            return (
            <div className="card-body" style={{ overflowY: 'auto', paddingRight: 'calc(1.5rem + 5px)' }}>
            <div className="section-heading" style={{ border: 'none', marginBottom: '15px', paddingBottom: '0' }}>
            10 <span className="asterisk">*</span>Additional Information for PAN/TAN
            </div>

            <div className="sub-heading">Information specific to PAN (AO Code)</div>
            <div className="row mb-3">
            <div className="col-md-3 col-6">
            <label htmlFor="pan_area_code" className="form-label_sp">Area Code</label>
            <input type="text" id="pan_area_code" name="pan_area_code" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="pan_ao_type" className="form-label_sp">AO type</label>
            <input type="text" id="pan_ao_type" name="pan_ao_type" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="pan_range_code" className="form-label_sp">Range Code</label>
            <input type="text" id="pan_range_code" name="pan_range_code" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="pan_ao_no" className="form-label_sp">AO No.</label>
            <input type="text" id="pan_ao_no" name="pan_ao_no" defaultValue="" className="form-control" />
            </div>
            </div>

            <div className="sub-heading">Information specific to TAN (AO Code)</div>
            <div className="row mb-3">
            <div className="col-md-3 col-6">
            <label htmlFor="tan_area_code" className="form-label_sp">Area Code</label>
            <input type="text" id="tan_area_code" name="tan_area_code" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="tan_ao_type" className="form-label_sp">AO type</label>
            <input type="text" id="tan_ao_type" name="tan_ao_type" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="tan_range_code" className="form-label_sp">Range Code</label>
            <input type="text" id="tan_range_code" name="tan_range_code" defaultValue="" className="form-control" />
            </div>
            <div className="col-md-3 col-6">
            <label htmlFor="tan_ao_no" className="form-label_sp">AO No.</label>
            <input type="text" id="tan_ao_no" name="tan_ao_no" defaultValue="" className="form-control" />
            </div>
            </div>

            <div className="sub-heading"><span className="asterisk">*</span>Source of Income</div>
            <div className="row mb-3">
            {[
            { id: 'incomeBusiness', label: 'Income from Business/profession', checked: true },
            { id: 'incomeCapitalGains', label: 'Capital Gains' },
            { id: 'incomeHouse', label: 'Income from house property' },
            { id: 'incomeOther', label: 'Income from other source', checked: true },
            { id: 'incomeNone', label: 'No Income' },
            ].map((income, i) => (
            <div className="col-md-4" key={i}>
            <div className="form-check">
            <input
            className="form-check-input"
            type="checkbox"
            name="incomeSource[]"
            value={income.label.replace(/\s+/g, '')}
            id={income.id}
            // defaultChecked={income.checked}
            />
            <label className="form-check-label" htmlFor={income.id}>
            {income.label}
            </label>
            </div>
            </div>
            ))}
            </div>

            <div className="row mb-3">
            <div className="col-md-4 d-flex align-items-center">
            <label htmlFor="business_prof_code" className="form-label_sp me-2 mb-0">
            <span className="asterisk">*</span>Business/Profession code:
            </label>
            <input
            type="text"
            id="business_prof_code"
            name="business_prof_code"
            defaultValue=""
            className="form-control"
            style={{ maxWidth: '100px' }}
            />
            </div>
            </div>

            <hr className="my-4" />
            <div className="sub-heading">Attachments</div>
            <div className="row g-3">
            {[
            { id: 'attach_moa', label: '(a) Memorandum of association', mandatory: true },
            { id: 'attach_aoa', label: '(b) Articles of association', mandatory: true },
            {
            id: 'attach_subscriber_decl',
            label: '(c) Declaration by first subscriber(s) and director(s)',
            description: '(Affidavit not required)',
            mandatory: true,
            },
            { id: 'attach_foreign_coi', label: '(d) Copy of COI of foreign body corporate & resolution' },
            { id: 'attach_promoter_res', label: '(e) Resolution passed by promoter company' },
            { id: 'attach_director_interest', label: '(f) Interest of first director(s) in other entities' },
            { id: 'attach_optional', label: '(g) Optional attachment(s) (if any)' },
            ].map((file, index) => (
            <div className="col-md-6 mb-2" key={index}>
            <label htmlFor={file.id} className="form-label_sp small">
            {file.label} <span className="field-description">{file.description || ''}</span>
            </label>
            <input type="file" className="form-control form-control-sm" id={file.id} name={file.id} />
            <span className="field-description">
            {file.mandatory ? '(Mandatory. Max 2MB)' : '(If applicable. Max 2MB)'}
            </span>
            </div>
            ))}
            </div>
            </div>
            );
            case 16:
            return (
            <div className="card-body">
            <div className="section-heading">Declaration</div>

            {[
            {
            id: "decl1",
            name: "declaration_rule_1",
            label:
            "I have gone through the provisions of the Companies Act, 2013, the rules thereunder and prescribed guidelines framed thereunder in respect of reservation of name, understood the meaning thereof and the proposed name is in conformity thereof.",
            },
            {
            id: "decl2",
            name: "declaration_rule_2",
            label:
            "I have used the search facilities available on the portal of the Ministry of Corporate Affairs (MCA) for checking the resemblance of the proposed name with the companies and Limited Liability Partnerships (LLPs) respectively already registered or the names already approved. I have also used the search facility for checking the resemblances of the proposed name with registered trademarks and trade mark subject of an application under the Trade Marks Act, 1999 and other relevant search for checking the resemblance of the proposed name to satisfy myself with the compliance of the provisions of the Act for resemblance of name and Rules thereof.",
            },
            {
            id: "decl3",
            name: "declaration_rule_3",
            label:
            "The proposed name is not in violation of the provisions of Emblems and Names (Prevention of Improper Use) Act, 1950 as amended from time to time.",
            },
            {
            id: "decl4",
            name: "declaration_rule_4",
            label:
            "The proposed name is not offensive to any section of people, e.g. proposed name does not contain profanity or words or phrases that are generally considered a slur against an ethnic group, religion, gender or heredity.",
            },
            {
            id: "decl5",
            name: "declaration_rule_5",
            label:
            "The proposed name is not such that its use by the company will constitute an offence under any law for the time being in force.",
            },
            {
            id: "decl6",
            name: "declaration_rule_6",
            label:
            "I undertake to be fully responsible for the consequences in case the name is subsequently found to be in contravention of the provisions of section 4(2) and section 4(4) of the Companies Act, 2013 and rules thereto and I have also gone through and understood the provisions of section 4(5) (ii) (a) and (b) of the Companies Act, 2013 and rules thereunder and fully declare myself responsible for the consequences thereof.",
            },
            ].map((item, idx) => (
            <div className="form-check mb-2" key={idx}>
            <input className="form-check-input" type="checkbox" id={item.id} name={item.name} />
            <label className="form-check-label small" htmlFor={item.id}>
            {item.label}
            </label>
            </div>
            ))}

            <hr className="my-4" />

            <div className="row mb-3 align-items-baseline">
            <label className="col-auto col-form-label_sp pe-1">
            I <span className="asterisk">*</span>
            </label>
            <div className="col">
            <input
            type="text"
            name="declarant_name"
            defaultValue=""
            className="form-control form-control-sm"
            />
            <span className="d-block text-nowrap mt-1">
            person named in the articles as a director of the company has been duly authorised by the promoters of the
            company to sign this
            </span>
            </div>
            </div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declAuth" name="declaration_auth_promoter"  />
            <label className="form-check-label small" htmlFor="declAuth">
            <span className="asterisk">*</span>form and declare that all the requirements of the Companies Act, 2013 and the
            rules made thereunder in respect of Director Identification Number (DIN), registration of the company and
            matters precedent or incidental thereto have been complied with.
            </label>
            </div>

            <div className="form-check mb-2">
            <input
            className="form-check-input"
            type="checkbox"
            id="declCommence"
            name="declaration_no_commence_business"
            // defaultChecked
            />
            <label className="form-check-label small" htmlFor="declCommence">
            I am authorized by the promoter subscribing to the Memorandum of Association and Articles of Association and
            the first director(s) to give this declaration and to sign and submit this Form.
            </label>
            </div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declNidhi" name="declaration_nidhi_rules" />
            <label className="form-check-label small" htmlFor="declNidhi">
            I further declare that, company shall not commence its business, unless all the required approval from the
            sectoral Regulators such as RBI, SEBI etc. have been obtained.
            </label>
            </div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declRegOffice" name="declaration_reg_office_capable" />
            <label className="form-check-label small" htmlFor="declRegOffice">
            I further declare that the company shall not commence the business of Nidhi, unless all the required approval
            including the declaration be issued under section 406 of the Act have been obtained from Central Government;
            </label>
            </div>
            </div>
            );
            case 17:
            return (
            <div className="card-body">
            <div className="section-heading">Declaration (Continued)</div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declFirstDir" name="declaration_first_directors_info"  />
            <label className="form-check-label small" htmlFor="declFirstDir">
            <span className="asterisk">*</span> I on behalf of the promoters and the first directors, hereby declare that the registered office is capable of receiving and
            acknowledging all communications and notices addressed to the proposed company on incorporation, shall be maintained at the given
            address at item 4 (a) of this form;
            </label>
            </div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declDinConfirm" name="declaration_din_allotment_confirm"  />
            <label className="form-check-label small" htmlFor="declDinConfirm">
            <span className="asterisk">*</span>I, on behalf of all the first director(s) named in the Articles of Association of the proposed company, solemnly declare, that the
            declaration given herein as stated above are true to the best of my knowledge and belief, the information given in this integrated
            application form for incorporation and attachments thereto are correct and complete, and nothing relevant to this form has been
            suppressed. All the required attachments have been completely, correctly and legibly attached to this form and are as per the original
            records maintained by the promoters subscribing to the Memorandum of Association and Articles of Association. </label>
            </div>

            <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="declNotDisqualified" name="declaration_not_disqualified" />
            <label className="form-check-label small" htmlFor="declNotDisqualified">
            I, on behalf of the proposed Directors whose particulars for allotment of DIN are filled as above, hereby confirm and declare that
            they are not restrained, disqualified, removed for being appointed as Director of a company under the provisions of the Companies
            Act, 2013 including sections 164 and 169, and have not been declared as proclaimed offender by any Economic Offence Court or
            Judicial Magistrate Court or High Court or any other Court, and not been already allotted a Director Identification Number (DIN) under
            section 154 of the Companies Act, 2013, and I further declare that I have read and understood the provisions of Sections 154, 155, 447
            and 448 read with Sections 449, 450 and 451 of the Companies Act, 2013.
            </label>
            </div>

            <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="declBorderCountryConsent" name="declaration_border_country_consent_check" />
            <label className="form-check-label small" htmlFor="declBorderCountryConsent">
            I, on behalf of the proposed directors, hereby declare that person seeking appointment is a national of a country which shares a
            land border with India, necessary security clearance from Ministry of Home Affairs, Government of India shall be attached with the
            consent
            <span className="ms-3">
            <label className="radio-option small">
            <input type="radio" name="border_country_consent" value="Yes" /> Yes
            </label>
            <label className="radio-option small">
            <input type="radio" name="border_country_consent" value="No"  /> No
            </label>
            </span>
            <span className="field-description">(If yes, attach clearance)</span>
            </label>
            </div>

            <div className="row mb-3 align-items-center">
            <div className="col-auto">
            <div className="form-check">
            <input className="form-check-input" type="checkbox" id="declDinPanPass" name="declaration_din_pan_passport" />
            <label className="form-check-label small" htmlFor="declDinPanPass">
            DIN/PAN/Passport Number
            </label>
            </div>
            </div>
            <div className="col-md-4">
            <input type="text" name="din_pan_passport_no" className="form-control form-control-sm" />
            </div>
            </div>

            <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" id="declMoaAoaSim" name="declaration_moa_aoa_similar" />
            <label className="form-check-label small" htmlFor="declMoaAoaSim">
            The MoA and AoA attached to the form in hard copy is exactly similar to e-MoA and e-AoA to be attached with the form.
            </label>
            </div>

            <div className="form-check mb-4">
            <input className="form-check-input" type="checkbox" id="declRule5iv" name="declaration_rule5iv" />
            <label className="form-check-label small" htmlFor="declRule5iv">
            I hereby declare as per Rule 5(iv) of Companies (Authorized to Register) Rules that the said LLP applying for conversion in this
            Part of the Act has filed all documents which are required to be filed under the LLP Act, 2008 with the Registrar LLP.
            </label>
            </div>

            <hr />

            {/* Declaration by Professional */}
            <div className="sub-heading">Declaration by Professional</div>
            <div className="row g-2 align-items-baseline small mb-3">
            <span className="col-auto">I</span>
            <div className="col-md-3">
            <label htmlFor="prof_decl_name_card40" className="visually-hidden">Professional Name</label>
            <input type="text" id="prof_decl_name_card40" name="prof_decl_name_card40" placeholder="Professional Name" className="form-control form-control-sm" />
            </div>
            <span className="col-auto">, a</span>
            <div className="col-md-3">
            <label htmlFor="prof_decl_designation_card40" className="visually-hidden">Professional Designation</label>
            <input type="text" id="prof_decl_designation_card40" name="prof_decl_designation_card40" placeholder="Professional Designation" className="form-control form-control-sm" />
            </div>
            <span className="col-auto">having Membership number</span>
            <div className="col-md-2">
            <label htmlFor="prof_decl_mem_no_card40" className="visually-hidden">Membership Number</label>
            <input type="text" id="prof_decl_mem_no_card40" name="prof_decl_mem_no_card40" placeholder="Membership No." className="form-control form-control-sm" />
            </div>
            <span className="col-auto">and/or COP number</span>
            <div className="col-md-2">
            <label htmlFor="prof_decl_cop_no_card40" className="visually-hidden">COP Number</label>
            <input type="text" id="prof_decl_cop_no_card40" name="prof_decl_cop_no_card40" placeholder="COP No." className="form-control form-control-sm" />
            </div>
            <span className="col">has been engaged to give declaration under section 7(1)(b) and such declaration is provided below</span>
            </div>

            <hr />

            {/* Digital Signature Block */}
            <div className="sub-heading mt-4">
            <span className="asterisk">*</span> To be digitally signed by director
            </div>
            <div className="row align-items-end">
            <div className="col-md-8">
            <label className="form-label_sp small">Director DSC</label>
            <input
            type="text"
            id="director_sign_name_card40"
            name="director_sign_name_card40"
            placeholder="Director Name for Signature"
            defaultValue=""
            className="form-control form-control-sm mb-1"
            />
            </div>
            <div className="col-md-4">
            <label htmlFor="director_sign_din_pan" className="form-label_sp small">
            <span className="asterisk">*</span> Director's DIN/PAN
            </label>
            <input
            type="text"
            id="director_sign_din_pan"
            name="director_sign_din_pan"
            // defaultValue="FY******3G"
            className="form-control form-control-sm"
            />
            </div>
            </div>
            </div>
            );
            case 18:
            return (
            <div className="card-body">
            <div className="section-heading mb-4">11 Declaration and Certification by Professional</div>

            {/* Professional Details */}
            <div className="mb-3 professional-declaration-inputs">
            <div className="row g-2 align-items-center mb-2">
            <label className="col-auto" style={{ width: "20px", textAlign: "right", fontWeight: 500 }}>
            I
            </label>
            <div className="col">
            <input
            type="text"
            id="prof_cert_name"
            name="prof_cert_name"
            className="form-control form-control-sm"
            placeholder="Professional's Name"
            />
            </div>
            <label className="col-auto ps-2">member of</label>
            </div>

            <div className="row g-2 align-items-center mb-2">
            <div className="col">
            <input
            type="text"
            id="prof_cert_institute"
            name="prof_cert_institute"
            className="form-control form-control-sm"
            placeholder="Institute Name (e.g., The Institute of Chartered Accountants of India)"
            />
            </div>
            <label className="col-auto ps-1">
            having office at <span className="asterisk">*</span>
            </label>
            </div>

            <div className="row g-2 align-items-center mb-3">
            <div className="col">
            <input
            type="text"
            id="prof_cert_office_addr"
            name="prof_cert_office_addr"
            className="form-control form-control-sm"
            placeholder="Office Address/City (e.g., Bengaluru)"
            />
            </div>
            </div>
            </div>

            {/* Declaration Paragraph */}
            <p className="small mb-4" style={{ textAlign: "justify", lineHeight: 1.6 }}>
            Who is engaged in the formation of the company declare that I have been duly engaged for the purpose of certification of this form. It is hereby also certified that I have gone through the provisions of the Companies Act, 2013 and rules thereunder for the subject matter of this form and matters incidental thereto and I have verified the above particulars (including attachment(s)) from the original/certified records maintained by the applicant which is subject matter of this form and found them to be true, correct and complete and no information material to this form has been suppressed. I further certify that;
            </p>

            {/* Certification Checkboxes */}
            {[
            "i   The draft memorandum and articles of association have been drawn up in conformity with the provisions of sections 4 and 5 and rules made thereunder; and",
            "ii  All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 7 of the Act and matters precedent or incidental thereto have been complied with.",
            "iii The said records have been properly prepared, signed by the required officers of the Company and maintained as per the relevant provisions of the Companies Act, 2013 and were found to be in order;",
            "iv  I have opened all the attachments to this form and have verified these to be as per requirements, complete and legible;",
            "v  I further declare that I have personally visited the premises of the proposed registered office given in the form at the address mentioned herein above and verified that the said proposed registered office of the company will be functioning for the business purposes of the company (wherever applicable in respect of the proposed registered office has been given).",
            "vi  It is understood that I shall be liable for action under Section 448 of the Companies Act, 2013 for wrong certification, if any found at any stage.",
            "vii The draft memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and",
            "viii All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with.",
            ].map((labelText, index) => (
            <div className="form-check mb-2" key={index}>
            <input className="form-check-input" type="checkbox" id={`profCert${index + 1}`} />
            <label className="form-check-label small" htmlFor={`profCert${index + 1}`}>
            {labelText}
            </label>
            </div>
            ))}
            </div>
            );
            case 19:
            return (
            <div className="card-body">
            <div className="row mb-3">
            {/* Professional Type */}
            <div className="col-md-6">
            <label className="form-label_sp">Professional Type:</label>
            <div>
            <div className="form-check">
            <input
            className="form-check-input"
            type="radio"
            name="professional_type"
            value="ca"
            id="profTypeCA"
            // defaultChecked
            />
            <label className="form-check-label small" htmlFor="profTypeCA">
            Chartered accountant (in whole-time practice)
            </label>
            </div>
            <div className="form-check">
            <input
            className="form-check-input"
            type="radio"
            name="professional_type"
            value="cs"
            id="profTypeCS"
            />
            <label className="form-check-label small" htmlFor="profTypeCS">
            Company secretary (in whole-time practice)
            </label>
            </div>
            <div className="form-check">
            <input
            className="form-check-input"
            type="radio"
            name="professional_type"
            value="cma"
            id="profTypeCMA"
            />
            <label className="form-check-label small" htmlFor="profTypeCMA">
            Cost accountant (in whole-time practice)
            </label>
            </div>
            <div className="form-check">
            <input
            className="form-check-input"
            type="radio"
            name="professional_type"
            value="advocate"
            id="profTypeAdv"
            />
            <label className="form-check-label small" htmlFor="profTypeAdv">
            Advocate
            </label>
            </div>
            </div>
            </div>

            {/* Membership Status and Details */}
            <div className="col-md-6">
            <label className="form-label_sp">Membership Status:</label>
            <div>
            <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="membership_status"
            value="associate"
            id="memAssociate"
            // defaultChecked
            />
            <label className="form-check-label small" htmlFor="memAssociate">
            Associate
            </label>
            </div>
            <div className="form-check form-check-inline">
            <input
            className="form-check-input"
            type="radio"
            name="membership_status"
            value="fellow"
            id="memFellow"
            />
            <label className="form-check-label small" htmlFor="memFellow">
            Fellow
            </label>
            </div>
            </div>

            <div className="mt-3">
            <label htmlFor="membership_number" className="form-label_sp small">
            Membership number
            </label>
            <input
            type="text"
            id="membership_number"
            name="membership_number"
            // defaultValue="******"
            className="form-control form-control-sm"
            />
            </div>

            <div className="mt-2">
            <label htmlFor="practice_certificate_number" className="form-label_sp small">
            Certificate of practice number
            </label>
            <input
            type="text"
            id="practice_certificate_number"
            name="practice_certificate_number"
            className="form-control form-control-sm"
            />
            </div>

            <div className="mt-2">
            <label htmlFor="income_tax_pan" className="form-label_sp small">
            Income-tax PAN
            </label>
            <input
            type="text"
            id="income_tax_pan"
            name="income_tax_pan"
            // defaultValue="BA*****5M"
            className="form-control form-control-sm"
            />
            </div>
            </div>
            </div>

            <hr />
            </div>
            );


    default:
      return <div>Unknown step: {currentCard}. Please go back to a valid step.</div>;
  }
}; // End of renderCardContent

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      <CardLayout
        title={`SPICe+ Part B `}
        currentCard={currentCard}
        totalCards={totalCards} 
        onNext={handleNext}
        onPrev={handlePrev}
        onPageChange={handlePageChange}
        onFinalSubmit={() => {
           console.log('Final Submit Triggered - Form data (formData):', formData);
           console.log('NonIndividualSubscribers (6A):', nonIndividualSubscribers);
           console.log('Subscribers with DIN (6B):', subscribers);
           console.log('Subscribers no DIN (6C):', noDinSubscribers);
           console.log('Subscriber Directors with DIN (7A):', cDirectors);
           console.log('Subscriber Directors no DIN (7B):', noDinDirectors);
           console.log('Directors with DIN (7C):', otherDinDirectors);
           console.log('Directors no DIN (7D):', directorsOnlyNoDin);
           // If totalCards is 12 and currentCard reaches 12, this is the final submit.
           // Otherwise, it's just the "Next" for the last defined card.
           if (currentCard === totalCards) {
             // Perform final submission logic / API call if different from handleSaveData
             toast.info("Final submission processing...");
             navigate('/fact.inc/e-MoA_e-AoA'); 
           } else {
            // This case should not be hit if onFinalSubmit is only for the true last card
             handleNext(); 
           }
        }}
      >
        {renderCardContent()}
      </CardLayout>
    </>
  );
}