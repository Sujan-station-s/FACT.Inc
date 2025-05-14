import React from "react";

function capitalizeFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

const DirectorNameForm = ({ data, onInputChange, activeDirectorIndex }) => {
  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group mb-3">
        <label htmlFor={`fullName-${activeDirectorIndex}`}>
          Full Name (Exactly as per Aadhaar){" "}
          <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id={`fullName-${activeDirectorIndex}`}
          className="form-control"
          value={capitalizeFirst(data.fullName)}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          required
        />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor={`prefFirstName-${activeDirectorIndex}`}>
            Preferred First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`prefFirstName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.preferredFirstName)}
            onChange={(e) =>
              onInputChange("preferredFirstName", e.target.value)
            }
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`prefMiddleName-${activeDirectorIndex}`}>
            Preferred Middle Name
          </label>
          <input
            type="text"
            id={`prefMiddleName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.preferredMiddleName)}
            onChange={(e) =>
              onInputChange("preferredMiddleName", e.target.value)
            }
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`prefLastName-${activeDirectorIndex}`}>
            Preferred Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`prefLastName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.preferredLastName)}
            onChange={(e) => onInputChange("preferredLastName", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor={`fatherFirstName-${activeDirectorIndex}`}>
            Father's First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`fatherFirstName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.fatherFirstName)}
            onChange={(e) => onInputChange("fatherFirstName", e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`fatherMiddleName-${activeDirectorIndex}`}>
            Father's Middle Name
          </label>
          <input
            type="text"
            id={`fatherMiddleName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.fatherMiddleName)}
            onChange={(e) => onInputChange("fatherMiddleName", e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`fatherLastName-${activeDirectorIndex}`}>
            Father's Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`fatherLastName-${activeDirectorIndex}`}
            className="form-control"
            value={capitalizeFirst(data.fatherLastName)}
            onChange={(e) => onInputChange("fatherLastName", e.target.value)}
            required
          />
        </div>
      </div>
      <small className="text-danger fst-italic">
        (Note: Married women must provide father’s name)
      </small>
    </form>
  );
};

export default DirectorNameForm;
