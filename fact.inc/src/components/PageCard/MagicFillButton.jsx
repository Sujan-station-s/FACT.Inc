// src/components/PageCard/MagicFillButton.jsx
import React from "react";

export default function MagicFillButton({ setFormData, data }) {
  const handleMagicFill = () => {
    if (setFormData && data) {
      setFormData(data);
    }
  };

  return (
    <button
      type="button"
      className="magic-fill-button"
      onClick={handleMagicFill}
    >
      Fill Example Data
    </button>
  );
}
