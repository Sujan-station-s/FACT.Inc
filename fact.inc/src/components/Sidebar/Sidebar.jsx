import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./Sidebar.css"; // Ensure this CSS file includes the merged styles
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/coform_logo.jpeg"; // Make sure this path is correct
import {
  ORG_ID,
  requiredCompanyDocuments,
  requiredDirectorDocumentsBase,
  // initialDirectorData, // Not used here directly
} from "../../pages/director/constants"; // Import constants
import {
  fetchDirectorInfoAPI,
  fetchCompanyDocsAPI,
  uploadDirectorDocAPI,
  uploadCompanyDocumentAPI,
  getApiDocumentType,
} from "./checklistApi"; // Import API functions
import QrCodePopup from "../../pages/director/components/QrCodePopup"; // Import QR code popup
import eventEmitter from "../../utils/eventEmitter"; // IMPORT eventEmitter

// Import Bootstrap Icons CSS (ensure it's linked in your project's entry point like index.js or App.js)
// import 'bootstrap-icons/font/bootstrap-icons.css';
function capitalizeFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}
// --- Checklist Overlay Component (Integrated within Sidebar.jsx) ---
const ChecklistOverlay = ({ isOpen, onClose }) => {
  // --- State for Checklist ---
  const [activeTabId, setActiveTabId] = useState("company");
  const [openInlineUploadDocId, setOpenInlineUploadDocId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState({}); // Stores display names for selected files
  const [selectedFiles, setSelectedFiles] = useState({}); // Stores actual File objects { docId: File }

  // --- State for Document Data (Fetched) ---
  const [companyDocs, setCompanyDocs] = useState([]);
  const [directorDocs, setDirectorDocs] = useState([]); // Structure: [{ id: dir_id, name: ..., email: ..., documents: [...] }, ...]

  // --- State for Loading and Errors ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null); // Specific errors during upload
  const [isUploading, setIsUploading] = useState({}); // Track upload state per docId { docId: true/false }

  // --- State for QR Popup ---
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [qrPopupData, setQrPopupData] = useState(null);

  // --- Notification Helper (Optional - or use a context/library) ---
  const showNotification = useCallback(
    (message, type = "info", duration = 4000) => {
      console.log(`Notification [${type}]: ${message}`);
      if (type === "error") {
        setUploadError(message);
        setTimeout(() => setUploadError(null), duration);
      } else {
        // For non-error notifications, you might want a less intrusive way than alert
        // For now, console.log is fine, or implement a toast-like system if available
        // alert(`${type.toUpperCase()}: ${message}`);
      }
    },
    []
  );

  const fetchDataForOverlay = useCallback(
    async (showLoadMsg = true) => {
      if (!ORG_ID) {
        setError("Organization ID not found. Cannot load documents.");
        setIsLoading(false);
        return;
      }
      if (showLoadMsg) setIsLoading(true);
      setError(null);

      try {
        const [directorRes, companyRes] = await Promise.all([
          fetchDirectorInfoAPI(ORG_ID),
          fetchCompanyDocsAPI(ORG_ID),
        ]);

        // Process Director Data
        if (
          directorRes.status === "success" &&
          Array.isArray(directorRes.data)
        ) {
          const processedDirectors = directorRes.data.map(
            (directorApiData) => ({
              id: directorApiData.dir_id,
              name:
                directorApiData.preferredFirstName ||
                directorApiData.firstname ||
                `Director ${directorApiData.dir_id}`,
              firstname:
                directorApiData.preferredFirstName ||
                directorApiData.firstname ||
                "",
              email: directorApiData.email || "N/A",
              directorType: directorApiData.director_type || "indian",
              documents: requiredDirectorDocumentsBase
                .filter(
                  (baseDoc) =>
                    !baseDoc.directorType ||
                    baseDoc.directorType === directorApiData.director_type
                )
                .map((baseDoc) => {
                  // Normalize backend keys for safer matching
                  const normalizedDocMap = {};
                  Object.entries(directorApiData.documents || {}).forEach(
                    ([key, val]) => {
                      normalizedDocMap[key.trim().toLowerCase()] = val;
                    }
                  );
                  const normalizedKey = baseDoc.serverDocKey
                    .trim()
                    .toLowerCase();
                  const apiDocPath = normalizedDocMap[normalizedKey];

                  return {
                    ...baseDoc,
                    id: `${directorApiData.dir_id}-${baseDoc.id}`,
                    checked: !!apiDocPath,
                    link: apiDocPath || null,
                    status: apiDocPath ? "uploaded" : baseDoc.status,
                    serverDocKey: baseDoc.serverDocKey,
                  };
                }),
            })
          );
          setDirectorDocs(processedDirectors);
        } else {
          console.error(
            "Failed to fetch or process director data for checklist:",
            directorRes.message || directorRes
          );
          setError(
            (prev) => `${prev || ""} Failed to load director documents. `
          );
        }

        // Process Company Data
        if (companyRes.status === "success" && companyRes.data) {
          const fetchedCompanyDocs = companyRes.data;
          const processedCompanyDocs = requiredCompanyDocuments.map(
            (baseDoc) => {
              const apiDocInfo = fetchedCompanyDocs[baseDoc.serverDocKey];
              return {
                ...baseDoc,
                checked: !!apiDocInfo?.path,
                link: apiDocInfo?.path || null,
                status: apiDocInfo?.path ? "uploaded" : baseDoc.status,
              };
            }
          );
          setCompanyDocs(processedCompanyDocs);
        } else {
          console.error(
            "Failed to fetch or process company data for checklist:",
            companyRes.message || companyRes
          );
          setError((prev) => `${prev || ""} Failed to load company documents.`);
        }
      } catch (err) {
        console.error("Error fetching checklist data:", err);
        setError("Could not load document information. Please try again.");
        // Potentially clear docs on error if that's desired behavior
        // setCompanyDocs([]);
        // setDirectorDocs([]);
      } finally {
        if (showLoadMsg) setIsLoading(false);
      }
    },
    [ORG_ID]
  ); // Add requiredDirectorDocumentsBase, requiredCompanyDocuments if they can change, otherwise ORG_ID is enough if they are static

  // --- Fetch Data When Overlay Opens or ORG_ID changes ---
  useEffect(() => {
    if (isOpen && ORG_ID) {
      fetchDataForOverlay(true);
    } else if (!ORG_ID && isOpen) {
      setError("Organization ID not found. Cannot load documents.");
      setIsLoading(false);
      setCompanyDocs([]);
      setDirectorDocs([]);
    }
  }, [isOpen, ORG_ID, fetchDataForOverlay]);

  // --- EVENT EMITTER SUBSCRIPTION for updates from DirectorsPage ---
  useEffect(() => {
    const handleDirectorPageDocUpdate = (/* data */) => {
      // Data could be { orgId, dirId, documentKey, filePath }
      if (isOpen) {
        // Only refresh if the checklist is actually open
        showNotification(
          "Director document updated elsewhere, refreshing checklist...",
          "info",
          2500
        );
        fetchDataForOverlay(false); // Fetch without showing main loading spinner, background update
      }
    };

    const unsubscribe = eventEmitter.subscribe(
      "directorDocumentUpdatedByDirectorsPage",
      handleDirectorPageDocUpdate
    );
    return () => {
      unsubscribe();
    };
  }, [isOpen, fetchDataForOverlay, showNotification]);

  // --- Find Document Data (Searches current state) ---
  const findDocumentData = useCallback(
    (docId) => {
      const compDoc = companyDocs.find((doc) => doc.id === docId);
      if (compDoc)
        return {
          doc: compDoc,
          type: "company",
          directorId: null,
          serverDocKey: compDoc.serverDocKey,
        };

      for (const director of directorDocs) {
        const dirDoc = director.documents.find((doc) => doc.id === docId);
        if (dirDoc) {
          return {
            doc: dirDoc,
            type: "director",
            directorId: director.id,
            directorType: director.directorType,
            serverDocKey: dirDoc.serverDocKey,
          };
        }
      }
      return null;
    },
    [companyDocs, directorDocs]
  );

  // --- Get Status Info (Minor adjustment for clarity) ---
  const getStatusInfo = useCallback((doc) => {
    if (!doc)
      return {
        text: "Error",
        icon: "bi bi-question-circle",
        cssClass: "status-pending",
      };

    const { checked, link, status } = doc;

    if (checked || status === "uploaded") {
      return {
        text: "Uploaded",
        icon: "bi bi-check-circle-fill",
        cssClass: "status-uploaded",
      };
    }
    switch (status) {
      case "needed_soon":
        return {
          text: "Needed Soon",
          icon: "bi bi-exclamation-circle-fill",
          cssClass: "status-needed-soon",
        };
      case "critical":
        return {
          text: "Critical",
          icon: "bi bi-x-octagon-fill",
          cssClass: "status-critical",
        };
      case "available":
        return {
          text: "Available",
          icon: "bi bi-info-circle",
          cssClass: "status-pending",
        };
      case "pending":
      default:
        return {
          text: "Pending",
          icon: "bi bi-clock-history",
          cssClass: "status-pending",
        };
    }
  }, []);

  const toggleInlineUpload = (docId) => {
    setOpenInlineUploadDocId((prevId) => (prevId === docId ? null : docId));
    setSelectedFiles((prev) => ({ ...prev, [docId]: null }));
    setSelectedFileName((prev) => ({ ...prev, [docId]: null }));
    setUploadError(null);
    const inlineCard = document.getElementById(`upload-options-${docId}`);
    if (inlineCard) resetInlineCardState(inlineCard); // Check if inlineCard exists
  };

  const closeInlineUpload = (docId) => {
    if (openInlineUploadDocId === docId) {
      setOpenInlineUploadDocId(null);
      setSelectedFiles((prev) => ({ ...prev, [docId]: null }));
      setSelectedFileName((prev) => ({ ...prev, [docId]: null }));
      setUploadError(null);
    }
  };

  const handleFileSelected = (docId, event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [docId]: file }));
      setSelectedFileName((prev) => ({ ...prev, [docId]: file.name }));
      setUploadError(null);
    } else {
      setSelectedFiles((prev) => ({ ...prev, [docId]: null }));
      setSelectedFileName((prev) => ({ ...prev, [docId]: "No file selected" }));
    }
  };

  // --- CORE UPLOAD LOGIC ---
  const handleConfirmUpload = async (docId) => {
    const fileToUpload = selectedFiles[docId];
    const foundData = findDocumentData(docId);

    if (!fileToUpload) {
      showNotification("Please select a file first.", "warning");
      return;
    }
    if (!foundData) {
      showNotification("Error: Document data not found.", "error");
      return;
    }
    if (isUploading[docId]) return;

    setIsUploading((prev) => ({ ...prev, [docId]: true }));
    setUploadError(null);
    showNotification(`Uploading ${foundData.doc.name}...`, "info", 5000);

    try {
      let uploadResult;
      const apiDocType = getApiDocumentType(
        foundData.doc.name,
        foundData.type,
        foundData.directorType
      );

      if (!apiDocType) {
        throw new Error(
          `Could not determine API document type for ${foundData.doc.name}`
        );
      }

      if (foundData.type === "company") {
        uploadResult = await uploadCompanyDocumentAPI({
          file: fileToUpload,
          documentType: apiDocType,
          orgId: ORG_ID,
        });
      } else if (foundData.type === "director") {
        if (!foundData.directorId) {
          throw new Error("Director ID is missing for upload.");
        }
        uploadResult = await uploadDirectorDocAPI({
          file: fileToUpload,
          dirId: foundData.directorId,
          documentType: apiDocType,
          orgId: ORG_ID,
        });
      } else {
        throw new Error("Invalid document type found.");
      }

      if (uploadResult?.status === "success" && uploadResult.files?.[0]?.path) {
        const filePath = uploadResult.files[0].path;
        showNotification(
          `${foundData.doc.name} uploaded successfully!`,
          "success"
        );

        if (foundData.type === "company") {
          setCompanyDocs((prev) =>
            prev.map((doc) =>
              doc.id === docId
                ? { ...doc, checked: true, link: filePath, status: "uploaded" }
                : doc
            )
          );
          // EMIT EVENT for company doc update
          eventEmitter.emit("companyDocumentsUpdatedByChecklist", {
            orgId: ORG_ID,
            // documentKey: foundData.serverDocKey, // or apiDocType
            // filePath: filePath
          });
        } else {
          // director
          setDirectorDocs((prev) =>
            prev.map((dir) => {
              if (dir.id === foundData.directorId) {
                return {
                  ...dir,
                  documents: dir.documents.map((doc) =>
                    doc.id === docId
                      ? {
                          ...doc,
                          checked: true,
                          link: filePath,
                          status: "uploaded",
                        }
                      : doc
                  ),
                };
              }
              return dir;
            })
          );
          // EMIT EVENT for director doc update
          eventEmitter.emit("directorDocumentsUpdatedByChecklist", {
            orgId: ORG_ID,
            dirId: foundData.directorId,
            // documentKey: foundData.serverDocKey, // or apiDocType
            // filePath: filePath
          });
        }
        closeInlineUpload(docId);
      } else {
        throw new Error(
          uploadResult?.message || "Upload failed. No path returned."
        );
      }
    } catch (error) {
      console.error(`Upload failed for ${docId}:`, error);
      const errorMsg =
        error.message || "An unexpected error occurred during upload.";
      showNotification(
        `Upload failed for ${foundData.doc.name}: ${errorMsg}`,
        "error"
      );
      setUploadError(errorMsg);
    } finally {
      setIsUploading((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const resetInlineCardState = (inlineCard) => {
    if (!inlineCard) return;
    const uploadOptions = inlineCard.querySelector(".upload-options-container");
    const fileSection = inlineCard.querySelector(".custom-file-upload");
    const qrSection = inlineCard.querySelector(".qr-code-section");
    if (uploadOptions) uploadOptions.style.display = "flex";
    if (fileSection) fileSection.style.display = "none";
    if (qrSection) qrSection.style.display = "none";
  };

  const handleInlineOptionClick = (docId, optionType) => {
    const inlineCard = document.getElementById(`upload-options-${docId}`);
    if (!inlineCard) return;
    const uploadOptions = inlineCard.querySelector(".upload-options-container");
    const fileSection = inlineCard.querySelector(".custom-file-upload");
    const qrSection = inlineCard.querySelector(".qr-code-section");

    if (uploadOptions) uploadOptions.style.display = "none";
    if (fileSection) fileSection.style.display = "none";
    if (qrSection) qrSection.style.display = "none";

    if (optionType === "device" && fileSection)
      fileSection.style.display = "block";
    if (optionType === "qr" && qrSection) {
      qrSection.style.display = "block";
      handleQRClick(docId);
    }
    if (optionType === "generate")
      showNotification("Generate Option - Not Implemented Yet", "info");
  };

  const handleQRBack = (docId) => {
    const inlineCard = document.getElementById(`upload-options-${docId}`);
    if (inlineCard) resetInlineCardState(inlineCard);
    if (showQrPopup && qrPopupData?.docId === docId) {
      setShowQrPopup(false);
    }
  };

  const handleQRClick = useCallback(
    (docId) => {
      const foundData = findDocumentData(docId);
      if (!foundData) {
        showNotification(
          "Error: Document data not found for QR code.",
          "error"
        );
        return;
      }

      if (foundData.type === "director" && !foundData.directorId) {
        showNotification(
          `Cannot generate QR: Director ID missing for ${foundData.doc.name}. Save director details first.`,
          "warning"
        );
        const inlineCard = document.getElementById(`upload-options-${docId}`);
        if (inlineCard) {
          const qrSection = inlineCard.querySelector(".qr-code-section");
          if (qrSection) qrSection.style.display = "none";
          const uploadOptions = inlineCard.querySelector(
            ".upload-options-container"
          );
          if (uploadOptions) uploadOptions.style.display = "flex";
        }
        return;
      }

      const apiDocType = getApiDocumentType(
        foundData.doc.name,
        foundData.type,
        foundData.directorType
      );
      if (!apiDocType) {
        showNotification(
          `Error: Could not determine API type for ${foundData.doc.name}.`,
          "error"
        );
        return;
      }

      setQrPopupData({
        docId: docId,
        directorIndex:
          foundData.type === "director"
            ? directorDocs.findIndex((d) => d.id === foundData.directorId) // This index might not be stable or used by QrCodePopup correctly. dirId is more reliable.
            : -1,
        dirId: foundData.directorId,
        docTitle: foundData.doc.name,
        directorType: foundData.directorType,
        apiDocType: apiDocType,
        serverDocKey: foundData.serverDocKey,
        ownerType: foundData.type,
      });
      setShowQrPopup(true);
    },
    [findDocumentData, directorDocs, showNotification]
  );

  const closeQrPopup = useCallback(() => {
    setShowQrPopup(false);
    // setQrPopupData(null); // Clearing here might be too soon if QR section relies on it.
  }, []);

  const handleQrUploadComplete = useCallback(
    ({
      serverDocKey,
      filePath,
      docTitle,
      ownerType,
      dirId /*, apiDocType, docId: qrDocId */,
    }) => {
      // qrDocId is the UI docId like '123-doc-dir-pan'
      // serverDocKey is the API key like 'PAN_attested_full'
      // ownerType is 'company' or 'director'
      // dirId is the director's actual ID if ownerType is 'director'

      let docIdToUpdate = null; // This is the UI doc ID (e.g., 'comp-elec-bill' or 'dirId-doc-base-id')

      if (ownerType === "company") {
        const compDoc = companyDocs.find(
          (d) => d.serverDocKey === serverDocKey
        );
        if (compDoc) docIdToUpdate = compDoc.id;
      } else if (ownerType === "director" && dirId) {
        const director = directorDocs.find((d) => d.id === dirId);
        if (director) {
          const dirDoc = director.documents.find(
            (dd) => dd.serverDocKey === serverDocKey
          );
          if (dirDoc) docIdToUpdate = dirDoc.id;
        }
      }

      if (docIdToUpdate && filePath) {
        showNotification(
          `Document '${docTitle}' received via QR upload.`,
          "success"
        );

        if (ownerType === "company") {
          setCompanyDocs((prev) =>
            prev.map((doc) =>
              doc.id === docIdToUpdate
                ? { ...doc, checked: true, link: filePath, status: "uploaded" }
                : doc
            )
          );
          eventEmitter.emit("companyDocumentsUpdatedByChecklist", {
            orgId: ORG_ID,
          });
        } else {
          // director
          setDirectorDocs((prev) =>
            prev.map((dir) => {
              if (dir.id === dirId) {
                return {
                  ...dir,
                  documents: dir.documents.map((doc) =>
                    doc.id === docIdToUpdate
                      ? {
                          ...doc,
                          checked: true,
                          link: filePath,
                          status: "uploaded",
                        }
                      : doc
                  ),
                };
              }
              return dir;
            })
          );
          eventEmitter.emit("directorDocumentsUpdatedByChecklist", {
            orgId: ORG_ID,
            dirId: dirId,
          });
        }

        if (openInlineUploadDocId === docIdToUpdate) {
          closeInlineUpload(docIdToUpdate);
        }
        closeQrPopup();
      } else {
        console.warn(
          "QR Upload complete callback missing data or could not find document to update.",
          { serverDocKey, filePath, ownerType, dirId, docIdToUpdate }
        );
        showNotification("QR upload processing error.", "error");
      }
    },
    [
      companyDocs,
      directorDocs,
      showNotification,
      closeQrPopup,
      openInlineUploadDocId,
      closeInlineUpload, // Added missing dependency
      ORG_ID, // Added missing dependency
    ]
  );

  const { totalDocs, completedDocs } = useMemo(() => {
    let total = companyDocs.length;
    let completed = companyDocs.filter((doc) => doc.checked).length;
    directorDocs.forEach((dir) => {
      total += dir.documents.length;
      completed += dir.documents.filter((doc) => doc.checked).length;
    });
    return { totalDocs: total, completedDocs: completed };
  }, [companyDocs, directorDocs]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overlay-open");
    } else {
      document.body.classList.remove("overlay-open");
      setActiveTabId("company");
      setOpenInlineUploadDocId(null);
      setSelectedFileName({});
      setSelectedFiles({});
      // setError(null); // Keep error for a bit? Or clear.
      // setUploadError(null); // Keep upload error for a bit?
    }
    return () => document.body.classList.remove("overlay-open");
  }, [isOpen]);

  const renderDocument = (doc, index, ownerName = null) => {
    if (!doc || !doc.id) {
      console.error("Attempting to render invalid document:", doc);
      return (
        <div key={`error-${index}`} className="doc-checkbox-wrapper error">
          Invalid Document Data
        </div>
      );
    }
    const statusInfo = getStatusInfo(doc);
    const isInlineOpen = openInlineUploadDocId === doc.id;
    const docNameClean = doc.name?.split("<br>")[0] || "Unnamed Document";
    const currentUploadError = uploadError && isInlineOpen ? uploadError : null;

    return (
      <div
        key={doc.id}
        className={`doc-checkbox-wrapper ${doc.checked ? "checked" : ""} ${
          isInlineOpen ? "upload-active" : ""
        }`}
        data-doc-id={doc.id}
      >
        <div className="doc-main-content">
          <div className="doc-number">{index + 1}</div>
          <div className={`doc-checkbox ${doc.checked ? "disabled" : ""}`}>
            <input
              type="checkbox"
              id={`checkbox-${doc.id}`}
              checked={doc.checked}
              disabled={doc.checked}
              readOnly
              aria-label={`Status for ${docNameClean}`}
            />
          </div>
          <div className="doc-content">
            <span className="doc-name">{doc.name}</span>
            {ownerName && (
              <span className="doc-owner-tag text-muted small ms-1">
                ({ownerName})
              </span>
            )}
            <div className={`doc-status ${statusInfo.cssClass}`}>
              <i className={`${statusInfo.icon}`}></i> {statusInfo.text}
            </div>
          </div>
          <div className="doc-actions">
            {doc.link && doc.checked && (
              <a
                className="doc-preview-button"
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                title={`View uploaded ${docNameClean}`}
              >
                <i className="bi bi-eye-fill"></i> View
              </a>
            )}
            <button
              type="button"
              className="doc-upload-update-button"
              onClick={() => toggleInlineUpload(doc.id)}
              disabled={isUploading[doc.id]}
              title={
                doc.checked
                  ? `Update ${docNameClean}`
                  : `Upload ${docNameClean}`
              }
            >
              {isUploading[doc.id] ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <i
                  className={`bi ${
                    doc.checked ? "bi-arrow-repeat" : "bi-upload"
                  }`}
                ></i>
              )}{" "}
              {doc.checked ? "Update" : "Upload"}
            </button>
          </div>
        </div>

        <div
          className={`inline-upload-options ${isInlineOpen ? "active" : ""}`}
          id={`upload-options-${doc.id}`}
        >
          <button
            type="button"
            className="btn-close-inline"
            aria-label="Close upload options"
            onClick={() => closeInlineUpload(doc.id)}
          >
            {" "}
            ×{" "}
          </button>

          <div
            className="upload-options-container"
            style={{ display: isInlineOpen ? "flex" : "none" }} // This style might be redundant if CSS handles it
          >
            <div
              className="upload-option upload-option-device"
              onClick={() => handleInlineOptionClick(doc.id, "device")}
            >
              <div className="option-icon">
                <i className="bi bi-laptop"></i>
              </div>
              <div className="option-label">From this device</div>
            </div>
            <div
              className="upload-option upload-option-qr"
              onClick={() => handleInlineOptionClick(doc.id, "qr")}
            >
              <div className="option-icon">
                <i className="bi bi-qr-code-scan"></i>
              </div>
              <div className="option-label">Scan QR (Mobile)</div>
            </div>
          </div>

          {currentUploadError && (
            <div
              className="alert alert-danger alert-sm py-1 px-2 mt-2 mb-1"
              role="alert"
              style={{ fontSize: "0.8rem" }}
            >
              {currentUploadError}
            </div>
          )}

          <div className="custom-file-upload" style={{ display: "none" }}>
            <label className="file-label" htmlFor={`file-input-${doc.id}`}>
              <i className="bi bi-cloud-arrow-up-fill"></i> Choose File
            </label>
            <input
              className="file-input"
              id={`file-input-${doc.id}`}
              type="file"
              onChange={(e) => handleFileSelected(doc.id, e)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <div className="file-name">
              {selectedFileName[doc.id] || "No file selected"}
            </div>
            <button
              type="button"
              className="btn btn-primary-blue confirm-upload-btn mt-2"
              onClick={() => handleConfirmUpload(doc.id)}
              disabled={!selectedFiles[doc.id] || isUploading[doc.id]}
            >
              {isUploading[doc.id] ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload Selected File"
              )}
            </button>
          </div>

          <div className="qr-code-section" style={{ display: "none" }}>
            <p className="text-center my-3">
              Use the QR code popup to upload <strong>{docNameClean}</strong>{" "}
              from your mobile.
            </p>
            {showQrPopup && qrPopupData?.docId === doc.id && (
              <div className="waiting-indicator">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Waiting for upload via QR...
              </div>
            )}
            <button
              className="qr-back-button"
              onClick={() => handleQRBack(doc.id)}
              aria-label="Back to upload options"
            >
              <i className="bi bi-arrow-left me-1"></i> Choose another method
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabs = () => (
    <ul className="nav nav-tabs director-tabs" id="directorTabs" role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link ${activeTabId === "company" ? "active" : ""}`}
          id="company-tab"
          onClick={() => setActiveTabId("company")}
          type="button"
          role="tab"
          aria-controls="company"
          aria-selected={activeTabId === "company"}
          disabled={isLoading}
        >
          <i className="bi bi-building"></i> Company
        </button>
      </li>
      {directorDocs.map((director) => (
        <li key={director.id} className="nav-item" role="presentation">
          <button
            className={`nav-link ${
              activeTabId === director.id ? "active" : ""
            }`}
            id={`${director.id}-tab`}
            onClick={() => setActiveTabId(director.id)}
            type="button"
            role="tab"
            aria-controls={director.id}
            aria-selected={activeTabId === director.id}
            disabled={isLoading}
          >
            <i className="bi bi-person-badge"></i>{" "}
            {capitalizeFirst(director.firstname)}
          </button>
        </li>
      ))}
      <li className="nav-item" role="presentation">
        <button
          className={`nav-link ${activeTabId === "all-docs" ? "active" : ""}`}
          id="all-docs-tab"
          onClick={() => setActiveTabId("all-docs")}
          type="button"
          role="tab"
          aria-controls="all-docs"
          aria-selected={activeTabId === "all-docs"}
          disabled={isLoading}
        >
          <i className="bi bi-list-ul"></i> All
        </button>
      </li>
    </ul>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading documents...</span>
          </div>
          <p className="mt-2 text-muted">Loading documents...</p>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-danger m-3">{error}</div>;
    }

    let contentToRender;
    if (activeTabId === "company") {
      contentToRender =
        companyDocs.length > 0 ? (
          companyDocs.map((doc, index) => renderDocument(doc, index, null))
        ) : (
          <p className="text-muted p-3">
            No company documents found or required.
          </p>
        );
    } else if (activeTabId === "all-docs") {
      const allDocsList = [];
      let globalIndex = 0;
      companyDocs.forEach((doc) => {
        allDocsList.push({
          ...doc,
          ownerName: "Company",
          globalIndex: globalIndex++,
        });
      });
      directorDocs.forEach((director) => {
        director.documents.forEach((doc) => {
          allDocsList.push({
            ...doc,
            ownerName: director.name,
            globalIndex: globalIndex++,
          });
        });
      });
      contentToRender =
        allDocsList.length > 0 ? (
          allDocsList.map((doc) =>
            renderDocument(doc, doc.globalIndex, doc.ownerName)
          )
        ) : (
          <p className="text-muted p-3">No documents found.</p>
        );
    } else {
      const director = directorDocs.find((d) => d.id === activeTabId);
      if (director) {
        contentToRender =
          director.documents.length > 0 ? (
            director.documents.map((doc, index) =>
              renderDocument(doc, index, null)
            )
          ) : (
            <p className="text-muted p-3">
              No documents found for {director.name}.
            </p>
          );
      } else {
        contentToRender = (
          <p className="text-muted p-3">Select a valid director tab.</p>
        );
      }
    }
    // Removed redundant panes, Bootstrap handles visibility with active class on tab-pane
    return <div className="docs-container">{contentToRender}</div>;
  };

  if (!isOpen && !showQrPopup) return null;

  return (
    <>
      {isOpen && (
        <div className={`page-dim-overlay active`} onClick={onClose}></div>
      )}

      <div
        className={`checklist-overlay ${isOpen ? "active" : ""}`}
        id="checklistOverlay"
      >
        <div className="document-tracker">
          <div className="tracker-header">
            <button
              aria-label="Close Checklist"
              className="btn-close-overlay"
              type="button"
              onClick={onClose}
            >
              <i className="bi bi-arrow-left-short" aria-hidden="true"></i> Back
            </button>
            <div className="header-content">
              <h4>Required Documents</h4>
              {!isLoading && !error && (
                <span className="counter-badge">
                  {completedDocs}/{totalDocs} Complete
                </span>
              )}
            </div>
            <div></div>
          </div>

          <div className="tracker-body">
            {renderTabs()}
            <div className="tab-content" id="directorTabsContent">
              {/* Render only the active tab's content directly */}
              {renderTabContent()}
            </div>
          </div>

          <div className="tracker-footer">
            <button
              className="btn btn-primary-blue"
              id="checklistContinueBtn"
              onClick={onClose} // Simply closes, save happens on upload
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <QrCodePopup
        isOpen={showQrPopup}
        onClose={closeQrPopup}
        data={qrPopupData}
        onUploadComplete={handleQrUploadComplete}
      />
    </>
  );
};

// --- Main Sidebar Component ---
export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const handleToggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileSidebar = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };
  const toggleChecklistOverlay = (e) => {
    e.preventDefault();
    setIsChecklistOpen(!isChecklistOpen);
    closeMobileSidebar();
  };
  const closeChecklistOverlay = () => setIsChecklistOpen(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 992;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const toggleButton = document.querySelector(".sidebar-toggle-open");
      const checklist = document.getElementById("checklistOverlay");
      const qrPopup = document.querySelector(".qr-code-popup-modal");

      if (
        isMobileOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        toggleButton &&
        !toggleButton.contains(event.target) &&
        (!checklist || !checklist.contains(event.target)) &&
        (!qrPopup || !qrPopup.contains(event.target))
      ) {
        setIsMobileOpen(false);
      }
    };
    if (isMobileOpen)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  const handleNavLinkClick = () => closeMobileSidebar();

  const useSpecialButtonStyle = true;

  return (
    <>
      {isMobile && (
        <button
          className="sidebar-toggle-open"
          onClick={handleToggleMobileSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
      )}
      <aside className={`sidebar ${isMobileOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <Link to="/product" onClick={handleNavLinkClick}>
            <img src={logo} alt="CoForm Logo" className="logo" />
          </Link>
          {isMobile && (
            <button
              className="sidebar-toggle-close"
              onClick={handleToggleMobileSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </button>
          )}
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/fact.inc/NameReservation"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-card-heading sidebar-menu-icon"></i>{" "}
                <span>Name Reservation</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/directors"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-people sidebar-menu-icon"></i>{" "}
                <span>Directors</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/spice-partb"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-file-earmark-plus sidebar-menu-icon"></i>{" "}
                <span>SPICe+ PART B</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/e-MoA_e-AoA"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-file-earmark-text sidebar-menu-icon"></i>{" "}
                <span>e-MoA & e-AoA</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/inc-9"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-patch-check sidebar-menu-icon"></i>{" "}
                <span>INC-9</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/Agile_pro"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-shield-check sidebar-menu-icon"></i>{" "}
                <span>AGILE PRO-S</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fact.inc/coi"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-award sidebar-menu-icon"></i>{" "}
                <span>COI</span>
              </NavLink>
            </li>
            <li>  
            
              <NavLink
                to="/fact.inc/digital-creds"
                className={({ isActive }) =>
                  isActive ? "sidebar-menu-link active" : "sidebar-menu-link"
                }
                onClick={handleNavLinkClick}
              >
                <i className="bi bi-key sidebar-menu-icon"></i>{" "}
                <span>Digital Credentials</span>
              </NavLink>
            </li>
            <li className="sidebar-menu-item">
              <div className="upload-separator"></div>
            </li>
            <li className="sidebar-menu-item">
              <a
                href="#"
                onClick={toggleChecklistOverlay}
                className={`sidebar-menu-link document-upload-link ${
                  useSpecialButtonStyle ? "special-style" : ""
                }`}
              >
                <div className="upload-icon-wrapper">
                  <i className="bi bi-file-earmark-text"></i>{" "}
                  <span>
                    Required <br /> Documents
                  </span>
                </div>
                <i className="bi bi-chevron-double-right toggle-icon"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="logout-button">
            <i className="bi bi-box-arrow-right me-2"></i> <span>Logout</span>
          </button>
        </div>
      </aside>

      {isMobile && (
        <div
          className={`sidebar-backdrop ${isMobileOpen ? "show" : ""}`}
          onClick={handleToggleMobileSidebar}
        ></div>
      )}
      <ChecklistOverlay
        isOpen={isChecklistOpen}
        onClose={closeChecklistOverlay}
      />
    </>
  );
}
