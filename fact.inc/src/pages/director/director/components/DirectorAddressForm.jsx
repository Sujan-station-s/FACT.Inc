import React from "react";
import { indianStates } from "../constants";

const DirectorAddressForm = ({ data, onInputChange, activeDirectorIndex }) => {
  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="mb-4">
        <h6 className="mb-3 fw-semibold">Current Address</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label
              htmlFor={`currentAddress1-${activeDirectorIndex}`}
              className="form-label"
            >
              Address Line 1 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id={`currentAddress1-${activeDirectorIndex}`}
              className="form-control"
              value={data.currentAddress1}
              onChange={(e) => onInputChange("currentAddress1", e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label
              htmlFor={`currentAddress2-${activeDirectorIndex}`}
              className="form-label"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id={`currentAddress2-${activeDirectorIndex}`}
              className="form-control"
              value={data.currentAddress2}
              onChange={(e) => onInputChange("currentAddress2", e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label
              htmlFor={`currentCity-${activeDirectorIndex}`}
              className="form-label"
            >
              City <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id={`currentCity-${activeDirectorIndex}`}
              className="form-control"
              value={data.currentCity}
              onChange={(e) => onInputChange("currentCity", e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label
              htmlFor={`currentState-${activeDirectorIndex}`}
              className="form-label"
            >
              State <span className="text-danger">*</span>
            </label>
            <select
              id={`currentState-${activeDirectorIndex}`}
              className="form-select"
              value={data.currentState}
              onChange={(e) => onInputChange("currentState", e.target.value)}
              required
            >
              {indianStates.map((state) => (
                <option
                  key={state.value}
                  value={state.value}
                  disabled={state.disabled}
                >
                  {state.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label
              htmlFor={`currentPin-${activeDirectorIndex}`}
              className="form-label"
            >
              PIN Code <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id={`currentPin-${activeDirectorIndex}`}
              className="form-control"
              pattern="[0-9]{6}"
              maxLength="6"
              value={data.currentPin}
              onChange={(e) => onInputChange("currentPin", e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label
              htmlFor={`currentCountry-${activeDirectorIndex}`}
              className="form-label"
            >
              Country <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id={`currentCountry-${activeDirectorIndex}`}
              className="form-control"
              value={data.currentCountry}
              onChange={(e) => onInputChange("currentCountry", e.target.value)}
              required
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id={`sameAsCurrent-${activeDirectorIndex}`}
          checked={!data.showPermanentAddress}
          onChange={(e) =>
            onInputChange("permanentSameAsCurrent", e.target.checked)
          }
        />
        <label
          className="form-check-label"
          htmlFor={`sameAsCurrent-${activeDirectorIndex}`}
        >
          Permanent address is same as current address
        </label>
      </div>
      {data.showPermanentAddress && (
        <div className="permanent-address-section">
          <h6 className="mb-3 fw-semibold">Permanent Address</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label
                htmlFor={`permAddress1-${activeDirectorIndex}`}
                className="form-label"
              >
                Address Line 1 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id={`permAddress1-${activeDirectorIndex}`}
                className="form-control"
                value={data.permanentAddress1}
                onChange={(e) =>
                  onInputChange("permanentAddress1", e.target.value)
                }
                required={data.showPermanentAddress}
              />
            </div>
            <div className="col-md-6">
              <label
                htmlFor={`permAddress2-${activeDirectorIndex}`}
                className="form-label"
              >
                Address Line 2
              </label>
              <input
                type="text"
                id={`permAddress2-${activeDirectorIndex}`}
                className="form-control"
                value={data.permanentAddress2}
                onChange={(e) =>
                  onInputChange("permanentAddress2", e.target.value)
                }
              />
            </div>
            <div className="col-md-3">
              <label
                htmlFor={`permCity-${activeDirectorIndex}`}
                className="form-label"
              >
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id={`permCity-${activeDirectorIndex}`}
                className="form-control"
                value={data.permanentCity}
                onChange={(e) => onInputChange("permanentCity", e.target.value)}
                required={data.showPermanentAddress}
              />
            </div>
            <div className="col-md-3">
              <label
                htmlFor={`permState-${activeDirectorIndex}`}
                className="form-label"
              >
                State <span className="text-danger">*</span>
              </label>
              <select
                id={`permState-${activeDirectorIndex}`}
                className="form-select"
                value={data.permanentState}
                onChange={(e) =>
                  onInputChange("permanentState", e.target.value)
                }
                required={data.showPermanentAddress}
              >
                {indianStates.map((state) => (
                  <option
                    key={state.value}
                    value={state.value}
                    disabled={state.disabled}
                  >
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label
                htmlFor={`permPin-${activeDirectorIndex}`}
                className="form-label"
              >
                PIN Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id={`permPin-${activeDirectorIndex}`}
                className="form-control"
                pattern="[0-9]{6}"
                maxLength="6"
                value={data.permanentPin}
                onChange={(e) => onInputChange("permanentPin", e.target.value)}
                required={data.showPermanentAddress}
              />
            </div>
            <div className="col-md-3">
              <label
                htmlFor={`permCountry-${activeDirectorIndex}`}
                className="form-label"
              >
                Country <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id={`permCountry-${activeDirectorIndex}`}
                className="form-control"
                value={data.permanentCountry}
                onChange={(e) =>
                  onInputChange("permanentCountry", e.target.value)
                }
                required={data.showPermanentAddress}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DirectorAddressForm;
