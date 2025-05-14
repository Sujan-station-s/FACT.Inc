export const API_BASE_URL = "http://3.111.226.182/factops/coform/";
export const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjgyMDMxLCJpYXQiOjE3NDcxOTU2MzEsImp0aSI6ImM0OTQ5OGIyMzBjNjQ4NzFhNmMyNDVjYTI4ZTMwY2FlIiwiZW1haWwiOiJvRUl0N1A3cFJTc0V3Tmt1TTJLM0NtRnU0WHlnNEhDeEItQVpRNzg5aF9pWXZtSFZQMTRzdm9pNXdNZDJfWWwzN2JNPSIsIm1vYmlsZSI6IjB4amhXS0hSU1NSUFVKR3llNlhUWl9fdjlibnRnVFYzSmkwOVEwTkpFSkpuRU5kelFQaz0iLCJ1c2VyX2lkIjoxMTExMTEsInJvbGUiOiJnZW5lcmFsIn0.4mwhbAbLcoypjWF42U0PLqIR7nElCOYwgU1AthR2F8I";
export const ORG_ID = 101101;

export const MIN_DIRECTORS = 2;
export const MAX_DIRECTORS = 15;

export const initialDirectorData = {
  dir_id: null,
  fullName: "",
  preferredFirstName: "",
  preferredMiddleName: "",
  preferredLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherLastName: "",
  dob: "",
  gender: "",
  nationality: "Indian",
  email: "",
  phone: "",
  education: "",
  occupationType: "",
  occupationArea: "",
  experience: "",
  hasDIN: "no",
  dinNumber: "",
  hasDSC: "no",
  isDSCRegistered: "no",
  currentAddress1: "",
  currentAddress2: "",
  currentCity: "",
  currentState: "",
  currentPin: "",
  currentCountry: "India",
  showPermanentAddress: false,
  permanentAddress1: "",
  permanentAddress2: "",
  permanentCity: "",
  permanentState: "",
  permanentPin: "",
  permanentCountry: "India",
  directorType: "indian",
  documents: {}, // Added to store paths of uploaded documents
};

export const directorSubPageNavItems = [
  { id: "name", label: "Name", icon: "bi-person-badge" },
  { id: "personal", label: "Personal", icon: "bi-person-lines-fill" },
  { id: "din", label: "DIN/DSC", icon: "bi-file-earmark-text" },
  { id: "address", label: "Address", icon: "bi-geo-alt" },
  { id: "docs", label: "Docs", icon: "bi-file-earmark-check" },
];

export const indianStates = [
  { value: "", label: "Select state", disabled: true },
  { value: "AN", label: "Andaman and Nicobar Islands" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "AR", label: "Arunachal Pradesh" },
  { value: "AS", label: "Assam" },
  { value: "BR", label: "Bihar" },
  { value: "CH", label: "Chandigarh" },
  { value: "CT", label: "Chhattisgarh" },
  { value: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "DL", label: "Delhi" },
  { value: "GA", label: "Goa" },
  { value: "GJ", label: "Gujarat" },
  { value: "HR", label: "Haryana" },
  { value: "HP", label: "Himachal Pradesh" },
  { value: "JK", label: "Jammu and Kashmir" },
  { value: "JH", label: "Jharkhand" },
  { value: "KA", label: "Karnataka" },
  { value: "KL", label: "Kerala" },
  { value: "LA", label: "Ladakh" },
  { value: "LD", label: "Lakshadweep" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "MN", label: "Manipur" },
  { value: "ML", label: "Meghalaya" },
  { value: "MZ", label: "Mizoram" },
  { value: "NL", label: "Nagaland" },
  { value: "OR", label: "Odisha" },
  { value: "PY", label: "Puducherry" },
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "SK", label: "Sikkim" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "TR", label: "Tripura" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "UT", label: "Uttarakhand" },
  { value: "WB", label: "West Bengal" },
];

export const requiredCompanyDocuments = [
  {
    id: "comp-elec-bill",
    name: "Electricity Bill",
    serverDocKey: "Electricity_bill", // Key for API fetch/upload
    status: "pending", // Default status, will be updated from API
    checked: false,
    link: null,
  },
  {
    id: "comp-tel-bill",
    name: "Telephone Bill",
    serverDocKey: "Teliphone_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-gas-bill",
    name: "Gas Bill",
    serverDocKey: "Gas_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-water-bill",
    name: "Water Bill",
    serverDocKey: "company_water_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-tax-receipt",
    name: "Property Tax Receipt",
    serverDocKey: "Property_tax_reciept",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-lease-agree",
    name: "Rental or Lease agreement (Attested)",
    serverDocKey: "company_lease_agreement",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-noc",
    name: "NOC (No Objection Certificate)", // Corrected name
    serverDocKey: "company_noc",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-title-deed",
    name: "Title Deed",
    serverDocKey: "company_title_deed",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "comp-sale-deed",
    name: "Sale Deed",
    serverDocKey: "company_sale_deed",
    status: "pending",
    checked: false,
    link: null,
  },
  // { id: "comp-moa", name: "MOA", serverDocKey: "company_moa", status: "pending", checked: false, link: null },
  // { id: "comp-aoa", name: "AOA", serverDocKey: "company_aoa", status: "pending", checked: false, link: null }
];

// --- NEW: Base structure for Director Documents (used for mapping) ---
// Define the *expected* documents per director for the checklist UI.
// Match 'id' prefixes and 'name' closely to how you want them displayed.
// Add 'serverDocKey' based on what fetchDirectorInfoAPI returns in its 'documents' object keys
// OR what getApiDocumentTypeForUpload uses.
export const requiredDirectorDocumentsBase = [
  // Identification
  {
    id: "doc-dir-pan",
    name: "PAN",
    serverDocKey: "PAN_file",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-aadhaar",
    name: "Aadhaar",
    serverDocKey: "Aadhaar_file",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-voter",
    name: "Voter ID",
    serverDocKey: "Voter_id_file",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-dl",
    name: "Driving License",
    serverDocKey: "Driving_licence_file",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-passport",
    name: "Passport",
    serverDocKey: "passport",
    status: "pending",
    checked: false,
    link: null,
  }, // Needed for NRI? Check directors.jsx logic

  // Address Proof (Examples - adjust based on requirements)
  {
    id: "doc-dir-elec-bill",
    name: "Electricity Bill",
    serverDocKey: "Electricity_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-tel-bill",
    name: "Telephone Bill",
    serverDocKey: "Teliphone_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-gas-bill",
    name: "Gas Bill",
    serverDocKey: "Gas_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-water-bill",
    name: "Water Bill",
    serverDocKey: "Water_bill",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-prop-tax",
    name: "Property Tax Receipt",
    serverDocKey: "Property_tax_reciept",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-bank-stmt",
    name: "Bank statement",
    serverDocKey: "Bank_statement",
    status: "pending",
    checked: false,
    link: null,
  },
  {
    id: "doc-dir-bank-pass",
    name: "Bank Passbook",
    serverDocKey: "Bank_passbook",
    status: "pending",
    checked: false,
    link: null,
  },

  // Other (Example)
  {
    id: "doc-dir-photo",
    name: "Photo",
    serverDocKey: "photo",
    status: "pending",
    checked: false,
    link: null,
  },

  // NRI Specific (Example - add serverDocKey based on API)
  // { id: "doc-dir-nri-addr", name: "Address Proof (NRI)", serverDocKey: "ADDRESS_PROOF_attested_full", status: "pending", checked: false, link: null, directorType: 'nri' },
  // { id: "doc-dir-nri-visa", name: "Visa (NRI)", serverDocKey: "VISA_attested_full", status: "pending", checked: false, link: null, directorType: 'nri' },
];
