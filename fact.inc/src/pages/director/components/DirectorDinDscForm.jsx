import React from "react";

const DirectorDinDscForm = ({ data, onInputChange, activeDirectorIndex }) => {
  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="row">
        <div className="col-md-6 mb-4">
          {/* Step 1: Individual / Non-Individual */}
          <h6 className="mb-3">Type of Applicant</h6>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`applicantType-${activeDirectorIndex}`}
              id={`individual-${activeDirectorIndex}`}
              value="individual"
              checked={data.applicantType === "individual"}
              onChange={() => {
                onInputChange("applicantType", "individual");
                // Reset subsequent fields when switching to Individual
                onInputChange("roleType", "");
                onInputChange("hasDIN", "");
                onInputChange("dinNumber", "");
              }}
            />
            <label
              className="form-check-label"
              htmlFor={`individual-${activeDirectorIndex}`}
            >
              Individual
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`applicantType-${activeDirectorIndex}`}
              id={`nonIndividual-${activeDirectorIndex}`}
              value="non-individual"
              checked={data.applicantType === "non-individual"}
              onChange={() => {
                onInputChange("applicantType", "non-individual");
                onInputChange("roleType", "subscriber"); // Auto-set role
                onInputChange("hasDIN", "yes"); // Auto-set hasDIN
                onInputChange("PAN_number", ""); // Clear PAN as it's not applicable
                // Optionally clear dinNumber if you want it re-entered, or leave it
                // onInputChange("dinNumber", "");
              }}
            />
            <label
              className="form-check-label"
              htmlFor={`nonIndividual-${activeDirectorIndex}`}
            >
              Non-Individual
            </label>
          </div>

          {/* Step 2: Role selection (Only for Individual) */}
          {data.applicantType === "individual" && (
            <div className="mt-4">
              <h6 className="mb-3">Select Role</h6>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`roleType-${activeDirectorIndex}`}
                  id={`role-director-${activeDirectorIndex}`}
                  value="director"
                  checked={data.roleType === "director"}
                  onChange={() => onInputChange("roleType", "director")}
                />
                <label
                  className="form-check-label"
                  htmlFor={`role-director-${activeDirectorIndex}`}
                >
                  Director
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`roleType-${activeDirectorIndex}`}
                  id={`role-subscriber-${activeDirectorIndex}`}
                  value="subscriber"
                  checked={data.roleType === "subscriber"}
                  onChange={() => onInputChange("roleType", "subscriber")}
                />
                <label
                  className="form-check-label"
                  htmlFor={`role-subscriber-${activeDirectorIndex}`}
                >
                  Subscriber
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`roleType-${activeDirectorIndex}`}
                  id={`role-both-${activeDirectorIndex}`}
                  value="director_subscriber"
                  checked={data.roleType === "director_subscriber"}
                  onChange={() =>
                    onInputChange("roleType", "director_subscriber")
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor={`role-both-${activeDirectorIndex}`}
                >
                  Director cum Subscriber
                </label>
              </div>
            </div>
          )}

          {/* Step 3: DIN question (Only for Individual if role is selected) */}
          {data.applicantType === "individual" && data.roleType && (
            <div className="mt-4">
              <h6 className="mb-3">Do you have a DIN?</h6>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`hasDIN-${activeDirectorIndex}`}
                  id={`hasDIN-yes-${activeDirectorIndex}`}
                  value="yes"
                  checked={data.hasDIN === "yes"}
                  onChange={() => {
                    onInputChange("hasDIN", "yes");
                    onInputChange("PAN_number", ""); // Clear PAN if switching to DIN
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`hasDIN-yes-${activeDirectorIndex}`}
                >
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`hasDIN-${activeDirectorIndex}`}
                  id={`hasDIN-no-${activeDirectorIndex}`}
                  value="no"
                  checked={data.hasDIN === "no"}
                  onChange={() => {
                    onInputChange("hasDIN", "no");
                    onInputChange("dinNumber", ""); // Clear DIN if switching to PAN
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`hasDIN-no-${activeDirectorIndex}`}
                >
                  No
                </label>
              </div>
            </div>
          )}

          {/* Step 4: DIN Number Input */}
          {/* Show if:
      1. Applicant is Non-Individual (roleType is 'subscriber' and hasDIN is 'yes' by default)
      2. Applicant is Individual, has selected a role, AND hasDIN is 'yes'
  */}
          {(data.applicantType === "non-individual" ||
            (data.applicantType === "individual" &&
              data.roleType &&
              data.hasDIN === "yes")) && (
            <div className="mt-3">
              <label
                htmlFor={`dinNumber-${activeDirectorIndex}`}
                className="form-label"
              >
                {data.applicantType === "non-individual"
                  ? "DIN of the person authorised by the company"
                  : "DIN Number"}{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id={`dinNumber-${activeDirectorIndex}`}
                maxLength={8}
                pattern="[0-9]{8}"
                title="Enter valid 8-digit DIN number"
                required
                value={data.dinNumber || ""} // Use || "" to ensure controlled component
                onChange={(e) => onInputChange("dinNumber", e.target.value)}
              />
              <small className="form-text text-muted">
                Enter the 8-digit DIN number
              </small>
            </div>
          )}

          {/* Step 5: PAN Number Input (Only for Individual, role selected, and hasDIN is 'no') */}
          {data.applicantType === "individual" &&
            data.roleType &&
            data.hasDIN === "no" && (
              <div className="mt-3">
                <label
                  htmlFor={`PAN_number-${activeDirectorIndex}`}
                  className="form-label"
                >
                  PAN Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`PAN_number-${activeDirectorIndex}`}
                  maxLength={10}
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  title="Enter valid 10-character PAN (e.g. ABCDE1234F)"
                  required
                  value={data.PAN_number || ""} // Use || "" to ensure controlled component
                  onChange={(e) =>
                    onInputChange("PAN_number", e.target.value.toUpperCase())
                  }
                />
                <small className="form-text text-muted">
                  Enter the 10-character PAN in uppercase.
                </small>
              </div>
            )}
        </div>

        <div className="col-md-6 mb-4">
          <h6 className="mb-3">
            Does Director {activeDirectorIndex + 1} have DSC?
          </h6>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`hasDSC-${activeDirectorIndex}`}
              id={`hasDSC_yes-${activeDirectorIndex}`}
              value="yes"
              checked={data.hasDSC === "yes"}
              onChange={() => onInputChange("hasDSC", "yes")}
            />
            <label
              className="form-check-label"
              htmlFor={`hasDSC_yes-${activeDirectorIndex}`}
            >
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`hasDSC-${activeDirectorIndex}`}
              id={`hasDSC_no-${activeDirectorIndex}`}
              value="no"
              checked={data.hasDSC === "no"}
              onChange={() => onInputChange("hasDSC", "no")}
            />
            <label
              className="form-check-label"
              htmlFor={`hasDSC_no-${activeDirectorIndex}`}
            >
              No
            </label>
          </div>
          {data.hasDSC === "yes" && (
            <div className="mt-3">
              <label className="form-label d-block">
                Is the DSC registered with MCA?{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`isDSCRegistered-${activeDirectorIndex}`}
                  id={`isDSCRegistered_yes-${activeDirectorIndex}`}
                  value="yes"
                  checked={data.isDSCRegistered === "yes"}
                  onChange={() => onInputChange("isDSCRegistered", "yes")}
                  required={data.hasDSC === "yes"}
                />
                <label
                  className="form-check-label"
                  htmlFor={`isDSCRegistered_yes-${activeDirectorIndex}`}
                >
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`isDSCRegistered-${activeDirectorIndex}`}
                  id={`isDSCRegistered_no-${activeDirectorIndex}`}
                  value="no"
                  checked={data.isDSCRegistered === "no"}
                  onChange={() => onInputChange("isDSCRegistered", "no")}
                  required={data.hasDSC === "yes"}
                />
                <label
                  className="form-check-label"
                  htmlFor={`isDSCRegistered_no-${activeDirectorIndex}`}
                >
                  No
                </label>
              </div>
              <small className="form-text text-muted mt-1">
                Select 'Yes' if the DSC is associated with DIN/PAN on MCA
                portal.
              </small>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default DirectorDinDscForm;
