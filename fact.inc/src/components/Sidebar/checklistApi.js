import { API_BASE_URL, AUTH_TOKEN, ORG_ID, requiredCompanyDocuments } from "../../pages/director/constants";
import { fetchDirectorInfoAPI, uploadDirectorDocumentAPI as uploadDirectorDocAPI } from '../../pages/director/services/directorAPIs';
export { fetchDirectorInfoAPI, uploadDirectorDocAPI };

const serverKeyToApiDocType = (serverKey) => {
  switch (serverKey) {
    case "Electricity_bill":        return "electricity_bill";
    case "Teliphone_bill":          return "teliphone_bill";
    case "Gas_bill":                return "gas_bill";
    case "company_water_bill":      return "water_bill";
    case "Property_tax_reciept":    return "property_tax_report";
    case "company_lease_agreement": return "lease_rent_aggrement";
    case "company_noc":             return "noc";
    case "company_title_deed":      return "title_deed";
    case "company_sale_deed":       return "sale_deed";
    default:
      return serverKey.toLowerCase();
  }
};

export const fetchCompanyDocsAPI = async (orgId = ORG_ID) => {
  console.log(`Fetching company docs for ORG_ID: ${orgId} from new API using POST`);
  const API_ENDPOINT = `http://3.111.226.182/factops/findokk/getorgfiles`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ org_id: orgId }),
    });

    if (!response.ok) {
      let errorDataText = "Could not retrieve error details.";
      try {
          errorDataText = await response.text();
      } catch (e) {
          console.error("Failed to parse error response text:", e);
      }
      console.error("fetchCompanyDocsAPI failed with status:", response.status, errorDataText);
      throw new Error(`Network response was not ok: ${response.status} - ${errorDataText}`);
    }

    const responseData = await response.json();

    if (responseData.status === "success" && Array.isArray(responseData.data)) {
      const processedDocs = {};

      requiredCompanyDocuments.forEach(baseDoc => {
        processedDocs[baseDoc.serverDocKey] = {
          path: null,
          status: baseDoc.status || "pending",
          uploaded_at: null,
        };
      });

      responseData.data.forEach(apiDoc => {
        if (!apiDoc.document_type) return;

        const apiDocTypeLower = apiDoc.document_type.toLowerCase();
        let matchedServerDocKey = null;

        for (const baseDoc of requiredCompanyDocuments) {
          if (serverKeyToApiDocType(baseDoc.serverDocKey) === apiDocTypeLower) {
            matchedServerDocKey = baseDoc.serverDocKey;
            break;
          }
        }
        
        if (matchedServerDocKey) {
          if (apiDoc.file_path) {
            processedDocs[matchedServerDocKey] = {
              path: apiDoc.file_path,
              status: "uploaded",
              uploaded_at: apiDoc.uploaded_at,
            };
          }
        }
      });
      return { status: "success", data: processedDocs };

    } else {
      console.error("fetchCompanyDocsAPI returned success false or invalid data structure:", responseData);
      return { status: "error", message: responseData.message || "Failed to process company documents from API." };
    }

  } catch (error) {
    console.error("Error in fetchCompanyDocsAPI:", error);
    return { status: "error", message: error.message || "An unexpected error occurred while fetching company documents." };
  }
};

/**
 * Uploads a company document using the generalized uploadDirectorDocAPI.
 * @param {object} params - The parameters for the upload.
 * @param {File} params.file - The file to upload.
 * @param {string} params.documentType - The API-specific type of the document (e.g., "electricity_bill").
 * @param {string|number} [params.orgId=ORG_ID] - The organization ID.
 * @returns {Promise<object>} The response from the API.
 */
export const uploadCompanyDocumentAPI = async ({ file, documentType, orgId = ORG_ID }) => {
  console.log(`Uploading COMPANY document: Type=${documentType}, File=${file.name}, ORG_ID=${orgId} using generalized uploader`);

  if (!file || !documentType || !orgId) {
    const errorMessage = `Missing data for company upload: file=${!!file}, documentType=${!!documentType}, orgId=${!!orgId}`;
    console.error("[uploadCompanyDocumentAPI]", errorMessage);
    return { status: "error", message: errorMessage };
  }
  return uploadDirectorDocAPI({
    file: file,
    dirId: "0",
    documentType: documentType,
    orgId: orgId,
    category: "Entity_Formation_documents",
  });
};

export const getApiDocumentType = (docName, ownerType = 'company', directorType = 'indian') => {
    const title = docName.toLowerCase().trim();

    if (ownerType === 'director') {
        if (title.includes("pan")) return "PAN_attested_full";
        if (title.includes("aadhaar")) return "aadhaar_attested_full";
        if (title.includes("photo")) return "photo";
        if (title.includes("bank statement")) return "Bank_statement";
        if (title.includes("passbook") || title.includes("bank passbook")) return "Bank_passbook";
        if (title.includes("mobile bill") || title.includes("telephone bill")) return "Teliphone_bill";
        if (title.includes("electricity bill")) return "Electricity_bill";
        if (title.includes("voter id")) return "voter_attested_full";
        if (title.includes("driving licen") || title.includes("driving licen")) return "drivingLicence_attested_full"; // "licence" and "license"
        if (title.includes("gas bill")) return "Gas_bill";
        if (title.includes("water bill")) return "Water_bill";
        if (title.includes("property tax")) return "Property_tax_reciept";
        if (title.includes("passport")) return "passport";
        if (title.includes("address proof") && directorType === "nri") return "ADDRESS_PROOF_attested_full";
        if (title.includes("visa") && directorType === "nri") return "VISA_attested_full";

    } else if (ownerType === 'company') {
        if (title.includes("electricity bill")) return "electricity_bill";
        if (title.includes("telephone bill")) return "teliphone_bill";
        if (title.includes("gas bill")) return "gas_bill";
        if (title.includes("water bill")) return "water_bill";
        if (title.includes("property tax receipt")) return "property_tax_report";
        if (title.includes("rental or lease agreement")) return "Lease_rent_Aggrement";
        if (title.includes("noc")) return "NOC";
        if (title.includes("title deed")) return "title_deed";
        if (title.includes("sale deed")) return "Sale_deed";
        if (title.includes("internet bill")) return "internet_bill";
    }
    
    console.warn(`[getApiDocumentType] No specific mapping for: "${docName}" (Owner: ${ownerType}, DirType: ${directorType}). Using fallback.`);
    return `${ownerType === 'company' ? 'company_' : ''}${docName.toUpperCase().replace(/\s+/g, "_").replace(/[()]/g, '')}`;
};