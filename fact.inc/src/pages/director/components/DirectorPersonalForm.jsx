import React from "react";

const DirectorPersonalForm = ({ data, onInputChange, activeDirectorIndex }) => {
  return (
    <form className="form-container" onSubmit={(e) => e.preventDefault()}>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor={`dob-${activeDirectorIndex}`}>
            Date of Birth <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id={`dob-${activeDirectorIndex}`}
            className="form-control"
            value={data.dob}
            onChange={(e) => onInputChange("dob", e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`gender-${activeDirectorIndex}`}>
            Gender <span className="text-danger">*</span>
          </label>
          <select
            id={`gender-${activeDirectorIndex}`}
            className="form-select"
            value={data.gender}
            onChange={(e) => onInputChange("gender", e.target.value)}
            required
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor={`nationality-${activeDirectorIndex}`}>
            Nationality <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`nationality-${activeDirectorIndex}`}
            className="form-control"
            value={data.nationality}
            onChange={(e) => onInputChange("nationality", e.target.value)}
            required
            readOnly={data.directorType === "indian"}
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor={`email-${activeDirectorIndex}`}>
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id={`email-${activeDirectorIndex}`}
            className="form-control"
            value={data.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`phone-${activeDirectorIndex}`}>
            Phone <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            id={`phone-${activeDirectorIndex}`}
            className="form-control"
            pattern="[0-9]{10}"
            value={data.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`education-${activeDirectorIndex}`}>
            Educational Qualification <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`education-${activeDirectorIndex}`}
            className="form-control"
            placeholder="e.g., B.Com, MBA"
            value={data.education}
            onChange={(e) => onInputChange("education", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label htmlFor={`occupationType-${activeDirectorIndex}`}>
            Occupation Type <span className="text-danger">*</span>
          </label>
          <select
            id={`occupationType-${activeDirectorIndex}`}
            className="form-select"
            value={data.occupationType}
            onChange={(e) => onInputChange("occupationType", e.target.value)}
            required
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="business">Business</option>
            <option value="professional">Professional</option>
            <option value="service">Service</option>
            <option value="self-employed">Self Employed</option>
            <option value="homemaker">Homemaker</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor={`occupationArea-${activeDirectorIndex}`}>
            Area Of Occupation <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id={`occupationArea-${activeDirectorIndex}`}
            className="form-control"
            placeholder="e.g., IT, Finance"
            value={data.occupationArea}
            onChange={(e) => onInputChange("occupationArea", e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor={`experience-${activeDirectorIndex}`}>
            Years of Experience
          </label>
          <input
            type="number"
            id={`experience-${activeDirectorIndex}`}
            className="form-control"
            min="0"
            max="99"
            placeholder="e.g., 5"
            value={data.experience}
            onChange={(e) => onInputChange("experience", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default DirectorPersonalForm;
