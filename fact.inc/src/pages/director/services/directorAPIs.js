import { API_BASE_URL, AUTH_TOKEN, ORG_ID } from "../constants";

export const fetchDirectorInfoAPI = async (orgId = ORG_ID) => {
  if (!orgId) {
    console.log("ORG_ID not available for fetchDirectorInfoAPI, skipping fetch.");
    return { status: "success", data: [] };
  }
  try {
    const response = await fetch(`http://3.111.226.182/factops/coform/getDirectorDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ org_id: orgId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Network error in fetchDirectorInfoAPI:", error);
    throw error;
  }
};

export const saveDirectorNameDetailsAPI = async (directorData, orgId = ORG_ID) => {
  const payload = {
    org_id: orgId,
    name: directorData.fullName,
    firstname: directorData.preferredFirstName,
    middlename: directorData.preferredMiddleName || "",
    lastname: directorData.preferredLastName,
    ffname: directorData.fatherFirstName,
    fmname: directorData.fatherMiddleName || "",
    flname: directorData.fatherLastName,
  };
  if (directorData.dir_id) {
    payload.dir_id = directorData.dir_id;
  }

  try {
    const response = await fetch(`${API_BASE_URL}dirBaseDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Network error in saveDirectorNameDetailsAPI:", error);
    throw error;
  }
};

export const saveDirectorAddressDetailsAPI = async (directorData, orgId = ORG_ID) => {
  const payload = {
    org_id: orgId,
    dir_id: directorData.dir_id,
    pe_line1: directorData.currentAddress1 || "",
    pe_line2: directorData.currentAddress2 || "",
    pe_city: directorData.currentCity || "",
    pe_state_or_ut: directorData.currentState || "",
    pe_pin_code: directorData.currentPin || "",
    pe_country: directorData.currentCountry || "India",
    pr_line1: directorData.permanentAddress1 || "",
    pr_line2: directorData.permanentAddress2 || "",
    pr_city: directorData.permanentCity || "",
    pr_state_or_ut: directorData.permanentState || "",
    pr_pin_code: directorData.permanentPin || "",
    pr_country: directorData.permanentCountry || "India",
  };
  try {
    const response = await fetch(`${API_BASE_URL}dirAddress`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Network error in saveDirectorAddressDetailsAPI:", error);
    throw error;
  }
};

export const saveDirectorPersonalAndDinDscDetailsAPI = async (directorData, orgId = ORG_ID) => {
  if (!directorData.dir_id) {
    console.error("Cannot save personal/DIN/DSC details: dir_id is missing.");
    return { status: "error", message: "Director ID is missing." };
  }

  const payload = {
    org_id: orgId,
    dir_id: directorData.dir_id,
    name: directorData.fullName,
    firstname: directorData.preferredFirstName,
    middlename: directorData.preferredMiddleName || "",
    lastname: directorData.preferredLastName,
    ffname: directorData.fatherFirstName,
    fmname: directorData.fatherMiddleName || "",
    flname: directorData.fatherLastName,

    dob: directorData.dob || null,
    gender: directorData.gender || null,
    nationality: directorData.nationality || null,
    email: directorData.email || null,
    mobile: directorData.phone || null,
    edu: directorData.education || null,
    occupation: directorData.occupationType || null,
    occupation_area: directorData.occupationArea || null,
    experience: directorData.experience || null,

    DIN: directorData.hasDIN === "yes" ? directorData.dinNumber : "",
    dsc_available: directorData.hasDSC === "yes",
  };

  try {
    const response = await fetch(`http://3.111.226.182/factops/coform/updateDirDetails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Network error in saveDirectorPersonalAndDinDscDetailsAPI:", error);
    throw error;
  }
};

/**
 * Uploads a director document.
 * @param {object} params - The parameters for the upload.
 * @param {File} params.file - The file to upload.
 * @param {string|number} params.dirId - The ID of the director.
 * @param {string} params.documentType - The type of the document (e.g., "PAN_attested_full").
 * @param {string|number} [params.orgId=ORG_ID] - The organization ID. Defaults to ORG_ID from constants.
 * @param {string} [params.category="Director"] - The category of the document. Defaults to "Director".
 * @returns {Promise<object>} The response from the API.
 */
export const uploadDirectorDocumentAPI = async ({
  file,
  dirId,
  documentType,
  orgId = ORG_ID,
  category = "Director",
}) => {
  if (!file) {
    console.error("uploadDirectorDocumentAPI: File is missing.");
    return { status: "error", message: "File is missing." };
  }
  if (!dirId) {
    console.error("uploadDirectorDocumentAPI: Director ID (dirId) is missing.");
    return { status: "error", message: "Director ID is missing." };
  }
  if (!orgId) {
    console.error("uploadDirectorDocumentAPI: Organization ID (orgId) is missing or invalid.");
    return { status: "error", message: "Organization ID is missing or invalid." };
  }
  if (!documentType) {
    console.error("uploadDirectorDocumentAPI: Document type is missing.");
    return { status: "error", message: "Document type is missing." };
  }

  const formData = new FormData();
  formData.append("org_id", String(orgId));
  formData.append("dir_id", String(dirId));
  formData.append("category", category);
  formData.append("document_type", documentType);
  formData.append("file", file, file.name);
  const UPLOAD_URL = "http://3.111.226.182/factops/findokk/upload";

  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: formData,
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        `uploadDirectorDocumentAPI: API error ${response.status} - ${response.statusText}.`,
        responseData
      );
      return {
        status: "error",
        message: responseData.message || `Request failed with status ${response.status}`,
        data: responseData,
        statusCode: response.status,
      };
    }
    console.log("uploadDirectorDocumentAPI: File uploaded successfully.", responseData);
    return {
      status: "success",
      ...responseData,
      statusCode: response.status,
    };

  } catch (error) {
    console.error("uploadDirectorDocumentAPI: Network error or JSON parsing error.", error);
    return {
      status: "error",
      message: error.message || "Network error or JSON parsing error occurred.",
      errorObject: error,
    };
  }
};