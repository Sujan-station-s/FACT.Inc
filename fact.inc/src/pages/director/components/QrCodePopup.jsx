import React from "react";

const QrCodePopup = ({ isOpen, onClose, data, onUploadComplete }) => {
  if (!isOpen || !data) return null;

  const { docTitle, docId } = data; // docId is the unique QR identifier string

  // Safely determine the mobileUploadBaseUrl
  // Fallback to a default if the environment variable is not accessible.
  // Note: For this to work with environment variables (e.g., REACT_APP_MOBILE_UPLOAD_URL),
  // your build process (like Create React App, Vite, etc.) must be configured
  // to inject these variables into your client-side code.
  // If `process` is not defined, it means the build environment isn't providing it.
  let mobileUploadBaseUrl;
  const defaultMobileUploadUrl = "https://yourapp.com/mobile-upload"; // Replace with your actual default

  try {
    // Check if 'process', 'process.env', and the specific variable exist
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_MOBILE_UPLOAD_URL
    ) {
      mobileUploadBaseUrl = process.env.REACT_APP_MOBILE_UPLOAD_URL;
    } else {
      mobileUploadBaseUrl = defaultMobileUploadUrl;
      if (typeof process === "undefined") {
        console.warn(
          "QrCodePopup: 'process' is not defined. Ensure your build setup correctly handles environment variables. Falling back to default mobile upload URL."
        );
      } else if (!process.env || !process.env.REACT_APP_MOBILE_UPLOAD_URL) {
        console.warn(
          `QrCodePopup: REACT_APP_MOBILE_UPLOAD_URL is not set in environment variables. Falling back to default: ${defaultMobileUploadUrl}`
        );
      }
    }
  } catch (error) {
    // This catch is a fallback for any unexpected error during access, though
    // the typeof checks should prevent the common ReferenceError.
    console.error(
      "QrCodePopup: Error accessing environment variable. Falling back to default.",
      error
    );
    mobileUploadBaseUrl = defaultMobileUploadUrl;
  }

  const qrDataUrl = `${mobileUploadBaseUrl}/${encodeURIComponent(
    data.dirId || "unknown_dir"
  )}/${encodeURIComponent(
    data.apiDocType || "unknown_doctype"
  )}?qr_ref=${encodeURIComponent(docId)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    qrDataUrl
  )}`;

  return (
    <>
      <div
        className={`qr-popup-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close popup"
      ></div>
      <div
        className={`qr-popup-modal ${isOpen ? "active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qrPopupTitle"
        aria-describedby="qrPopupInstructions"
      >
        <div className="qr-popup-header">
          <h5 id="qrPopupTitle">
            Scan QR for: <strong>{docTitle}</strong>{" "}
          </h5>
        </div>
        <div className="qr-popup-content">
          <img
            src={qrCodeUrl}
            alt={`QR Code for ${docTitle}`}
            className="qr-popup-image"
          />
          <p id="qrPopupInstructions" className="qr-popup-instructions">
            Scan this QR code with your mobile device's camera or a QR scanner
            app to securely upload the <strong>{docTitle}</strong> document.
          </p>
          <div className="qr-popup-waiting-indicator">
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Waiting for upload...
          </div>
        </div>
        <div className="qr-popup-footer">
          <button
            type="button"
            className="btn"
            onClick={onClose}
            style={{
              background: "#7353f6",
              color: "#fff",
              border: "none",
              borderRadius: "25px",
              padding: "0.5rem 1.25rem",
              fontWeight: "500",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default QrCodePopup;
