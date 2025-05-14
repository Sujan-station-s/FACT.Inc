import React from "react";

const indianDocsConfig = [
  {
    icon: "bi-credit-card-2-front",
    title: "PAN Card",
    subtitle: "Permanent Account Number",
    colorClass: "primary",
    required: true,
  },
  {
    icon: "bi-person-vcard",
    title: "Aadhaar",
    subtitle: "Unique ID",
    colorClass: "secondary",
    required: true,
  },
  {
    icon: "bi-passport",
    title: "Passport",
    subtitle: "(Optional) Travel Document",
    colorClass: "info",
    required: false,
  },
  {
    icon: "bi-person-bounding-box",
    title: "Photo",
    subtitle: "Recent Photo",
    colorClass: "success",
    required: true,
  },
  {
    icon: "bi-credit-card",
    title: "Bank Statement",
    subtitle: "Recent (max 2 months old)",
    colorClass: "warning",
    required: true,
  },
  {
    icon: "bi-file-earmark-text",
    title: "PassBook",
    subtitle: "(Alternative to Bank Stmt)",
    colorClass: "danger",
    required: false,
  },
  {
    icon: "bi-phone",
    title: "Mobile Bill",
    subtitle: "Recent (max 2 months old)",
    colorClass: "info",
    required: false,
  },
  {
    icon: "bi-telephone",
    title: "Telephone Bill",
    subtitle: "Recent (max 2 months old)",
    colorClass: "secondary",
    required: false,
  },
  {
    icon: "bi-lightning-charge",
    title: "Electricity Bill",
    subtitle: "Recent (max 2 months old)",
    colorClass: "success",
    required: false,
  },
  // Added based on user feedback implicitly from point 5's list
  {
    icon: "bi-person-badge-fill", // Using a generic icon, replace if a better one exists
    title: "Voter ID",
    subtitle: "Election Card (Optional)",
    colorClass: "primary",
    required: false,
  },
  {
    icon: "bi-card-heading", // Using a generic icon
    title: "Driving Licence",
    subtitle: "Driver's License (Optional)",
    colorClass: "info",
    required: false,
  },
  {
    icon: "bi-fire", // Using a generic icon
    title: "Gas Bill",
    subtitle: "Recent (max 2 months old, Optional)",
    colorClass: "warning",
    required: false,
  },
  {
    icon: "bi-droplet-fill", // Using a generic icon
    title: "Water Bill",
    subtitle: "Recent (max 2 months old, Optional)",
    colorClass: "danger",
    required: false,
  },
  {
    icon: "bi-receipt", // Using a generic icon
    title: "Property Tax Receipt",
    subtitle: "Latest Receipt (Optional)",
    colorClass: "success",
    required: false,
  },
];

const nriDocsConfig = [
  {
    icon: "bi-passport",
    title: "Passport",
    subtitle: "Valid Passport (Notarized)",
    colorClass: "primary",
    required: true,
  },
  {
    icon: "bi-person-bounding-box",
    title: "Photo",
    subtitle: "Recent Photo",
    colorClass: "success",
    required: true,
  },
  {
    icon: "bi-card-text",
    title: "Visa",
    subtitle: "(If applicable) Valid Visa",
    colorClass: "secondary",
    required: false,
  },
  {
    icon: "bi-geo-alt",
    title: "Address Proof",
    subtitle: "Overseas Address Proof (Notarized)",
    colorClass: "warning",
    required: true,
  },
  {
    icon: "bi-bank",
    title: "Bank Statement",
    subtitle: "Overseas Bank Stmt (Notarized)",
    colorClass: "info",
    required: false,
  },
];

// This function is critical for mapping UI titles to backend/storage keys.
// Ensure keys returned here match what the backend uses or what fetchDirectorInfo populates in `data.documents`.
const getApiDocKey = (docTitle, directorType) => {
  const title = docTitle.toLowerCase();
  if (title.includes("pan card")) return "PAN_file";
  if (title.includes("aadhaar")) return "Aadhaar_file";
  if (title.includes("photo")) return "photo"; // Often 'photo' is a direct key

  if (title.includes("bank statement")) {
    return "Bank_statement"; // Or just "Bank_statement" if server returns that. Assuming "_file" for consistency.
  }

  if (title.includes("passport")) return "passport";
  if (title.includes("address proof") && directorType === "nri")
    return "Address_proof_file";

  if (title.includes("passbook")) return "Bank_passbook"; // Alternative "Bank_passbook"
  if (title.includes("mobile bill") || title.includes("telephone bill"))
    return "Teliphone_bill"; // Note: "Teliphone_bill_file"
  if (title.includes("electricity bill")) return "Electricity_bill"; // Note: "Electricity_bill_file"

  // Mappings for newly added documents, ensuring they follow the pattern for `data.documents` keys
  if (title.includes("voter id")) return "Voter_id_file";
  if (title.includes("driving licence")) return "Driving_licence_file";
  if (title.includes("gas bill")) return "Gas_bill"; // Using _file convention
  if (title.includes("water bill")) return "Water_bill"; // Using _file convention
  if (title.includes("property tax")) return "Property_tax_reciept"; // Using _file, note "reciept"

  if (title.includes("visa") && directorType === "nri") return "Visa_file";

  console.warn(
    `[DirectorDocsForm/getApiDocKey] No specific API document key mapping for docTitle: "${docTitle}" (directorType: ${directorType}). Using fallback.`
  );
  // Fallback, might not match backend keys. Best to define all explicitly.
  return docTitle.toLowerCase().replace(/\s+/g, "_") + "_file";
};

const DirectorDocsForm = ({
  data,
  onInputChange,
  activeDirectorIndex,
  selectedFiles,
  handleFileChange,
  handleQrClick,
}) => {
  const docsConfig =
    data.directorType === "indian" ? indianDocsConfig : nriDocsConfig;
  const directorType = data.directorType;

  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="director-type-selection mb-4">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <h6 className="section-title mb-0 me-3">
            Director Type (Director {activeDirectorIndex + 1})
          </h6>
          <div className="form-check form-check-inline mb-0">
            <input
              className="form-check-input"
              type="radio"
              name={`directorType-${activeDirectorIndex}`}
              id={`directorType_indian-${activeDirectorIndex}`}
              value="indian"
              checked={data.directorType === "indian"}
              onChange={(e) => onInputChange("directorType", e.target.value)}
            />
            <label
              className="form-check-label"
              htmlFor={`directorType_indian-${activeDirectorIndex}`}
            >
              Indian
            </label>
          </div>
          <div className="form-check form-check-inline mb-0">
            <input
              className="form-check-input"
              type="radio"
              name={`directorType-${activeDirectorIndex}`}
              id={`directorType_nri-${activeDirectorIndex}`}
              value="nri"
              checked={data.directorType === "nri"}
              onChange={(e) => onInputChange("directorType", e.target.value)}
            />
            <label
              className="form-check-label"
              htmlFor={`directorType_nri-${activeDirectorIndex}`}
            >
              NRI / Foreign
            </label>
          </div>
        </div>
      </div>

      <div
        className="document-verification-section"
        id={`${directorType}-docs-container`}
      >
        <div className="document-grid">
          {docsConfig.map((doc, index) => {
            const inputId = `${directorType}-doc-upload-${activeDirectorIndex}-${index}`;
            const localFileKey = `${activeDirectorIndex}-${directorType}-${doc.title}`;
            const locallySelectedFile = selectedFiles[localFileKey];

            const serverDocKey = getApiDocKey(doc.title, directorType);
            const serverUploadedFilePath =
              data.documents && serverDocKey
                ? data.documents[serverDocKey]
                : null;

            let fileDisplayName = null;
            let isUploadedFromServer = false;
            let displayIconClass = "bi-check-circle-fill";

            if (locallySelectedFile) {
              fileDisplayName = locallySelectedFile.name;
            } else if (serverUploadedFilePath) {
              try {
                fileDisplayName = decodeURIComponent(
                  serverUploadedFilePath.substring(
                    serverUploadedFilePath.lastIndexOf("/") + 1
                  )
                );
              } catch (e) {
                fileDisplayName = serverUploadedFilePath.substring(
                  serverUploadedFilePath.lastIndexOf("/") + 1
                );
              }
              isUploadedFromServer = true;
              displayIconClass = "bi-cloud-check-fill";
            }

            const docIdForQr = `${activeDirectorIndex}-${directorType}-${doc.title.replace(
              /\s+/g,
              "-"
            )}-${new Date().getTime()}`; // Added timestamp for more uniqueness if needed

            return (
              <div className="document-card-grid" key={inputId}>
                <div className="doc-header">
                  <div
                    className={`document-icon document-icon-${doc.colorClass}`}
                  >
                    <i className={`bi ${doc.icon}`}></i>
                  </div>
                  <div className="doc-info">
                    <h5 className="document-title">
                      {doc.title}{" "}
                      {doc.required && <span className="text-danger">*</span>}
                    </h5>
                    <p className="document-subtitle">{doc.subtitle}</p>
                    {fileDisplayName && (
                      <small
                        className={`d-block text-truncate ${
                          isUploadedFromServer ? "text-info" : "text-success"
                        }`}
                        title={fileDisplayName}
                      >
                        <i className={`bi ${displayIconClass} me-1`}></i>
                        {fileDisplayName}
                      </small>
                    )}
                  </div>
                </div>
                <div className="upload-options-row">
                  <label htmlFor={inputId} className="btn btn-upload">
                    <i className="bi bi-cloud-arrow-up-fill me-1"></i>
                    {fileDisplayName ? "Update" : "Upload"}{" "}
                    {/* Point 2: "Update" instead of "Change" */}
                  </label>
                  <input
                    type="file"
                    id={inputId}
                    className="d-none"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        activeDirectorIndex,
                        doc.title,
                        directorType,
                        serverDocKey
                      )
                    }
                  />
                  {isUploadedFromServer && serverUploadedFilePath && (
                    <a
                      href={serverUploadedFilePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-info btn-sm ms-2" // Point 1: Improved UI for View button
                      title={`View ${doc.title}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        textDecoration: "none",
                        flexBasis: "auto", // Allow button to size naturally
                        padding: "0.6rem 0.8rem", // Consistent padding with other buttons
                      }}
                    >
                      <i className="bi bi-eye-fill me-1"></i> View
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn btn-upload-option ms-2"
                    title="Scan QR (Mobile Upload)"
                    onClick={() =>
                      handleQrClick(
                        activeDirectorIndex,
                        doc.title,
                        directorType,
                        docIdForQr,
                        serverDocKey
                      )
                    }
                  >
                    <i className="bi bi-qr-code-scan"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default DirectorDocsForm;
