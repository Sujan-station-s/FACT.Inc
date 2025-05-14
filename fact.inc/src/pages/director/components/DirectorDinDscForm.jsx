import React from "react";

const DirectorDinDscForm = ({ data, onInputChange, activeDirectorIndex }) => {
  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="row">
        <div className="col-md-6 mb-4">
          <h6 className="mb-3">
            Does Director {activeDirectorIndex + 1} have DIN?
          </h6>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`hasDIN-${activeDirectorIndex}`}
              id={`hasDIN_yes-${activeDirectorIndex}`}
              value="yes"
              checked={data.hasDIN === "yes"}
              onChange={() => onInputChange("hasDIN", "yes")}
            />
            <label
              className="form-check-label"
              htmlFor={`hasDIN_yes-${activeDirectorIndex}`}
            >
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`hasDIN-${activeDirectorIndex}`}
              id={`hasDIN_no-${activeDirectorIndex}`}
              value="no"
              checked={data.hasDIN === "no"}
              onChange={() => onInputChange("hasDIN", "no")}
            />
            <label
              className="form-check-label"
              htmlFor={`hasDIN_no-${activeDirectorIndex}`}
            >
              No
            </label>
          </div>
          {data.hasDIN === "yes" && (
            <div className="mt-3">
              <label
                htmlFor={`dinNumber-${activeDirectorIndex}`}
                className="form-label"
              >
                DIN Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id={`dinNumber-${activeDirectorIndex}`}
                maxLength={8}
                pattern="[0-9]{8}"
                required={data.hasDIN === "yes"}
                value={data.dinNumber}
                onChange={(e) => onInputChange("dinNumber", e.target.value)}
              />
              <small className="form-text text-muted">
                Enter the 8-digit DIN number
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
