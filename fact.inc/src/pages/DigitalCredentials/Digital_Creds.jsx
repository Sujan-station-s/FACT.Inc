import React, { useState } from 'react';
import CardLayout from '../../components/PageCard/PageCard';
import './Digital_Creds.css';

export default function DigitalCredentials() {
  const totalCards = 1;
  const [currentCard, setCurrentCard] = useState(1);
  const [domainName, setDomainName] = useState('');
  const [domainExtension, setDomainExtension] = useState('.com');
  const [domains, setDomains] = useState([]);
  const [options, setOptions] = useState({
    googleWorkspace: false,
    mobileNumber: false,
    website: false,
  });

  const handleNext = () => {
    if (currentCard < totalCards) setCurrentCard(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentCard > 1) setCurrentCard(prev => prev - 1);
  };

  const handleAddDomain = () => {
    const trimmedName = domainName.trim();
    if (!trimmedName) return;
    const fullDomain = `${trimmedName}${domainExtension}`;
    if (domains.includes(fullDomain)) {
      alert('Domain already added.');
      return;
    }
    setDomains(prev => [...prev, fullDomain]);
    setDomainName('');
  };

  const handleRemoveDomain = (domainToRemove) => {
    setDomains(prev => prev.filter(d => d !== domainToRemove));
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setOptions(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', { domains, options });
  };

  const renderCardContent = () => {
    switch (currentCard) {
      case 1:
        return (
          <form onSubmit={handleSubmit}>
  <div className="domain-container-entire">
    {/* Header */}
    {/* <div className="text-center mb-4 domain-header">
      <h4 className="form-title">Digital Credentials</h4>
    </div> */}

    {/* START BOXED SECTION */}
    <div className="bordered-block">

      {/* Domain Input Section */}
      <label className="form-label" style={{ fontSize: '1.2rem', fontWeight: '600' }}>Enter Domain Name</label>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="e.g., example"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={domainExtension}
            onChange={(e) => setDomainExtension(e.target.value)}
          >
            {[".com", ".in", ".org", ".co", ".net", ".biz", ".tech", ".io", ".ai", ".xyz"].map(ext => (
              <option key={ext} value={ext}>{ext}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button type="button" className="btn btn-theme w-100" onClick={handleAddDomain}>
            Add
          </button>
        </div>
      </div>

      {/* Added Domain Pills */}
      {domains.length > 0 && (
        <div className="form-section_dc mb-4">
          <label className="form-label fw-semibold">Added Domains</label>
          <div id="domainList" className="d-flex flex-wrap gap-2">
            {domains.map(domain => (
              <span className="domain-pill" key={domain}>
                {domain}
                <span className="remove" onClick={() => handleRemoveDomain(domain)}>&times;</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Checkboxes Section */}
      <div className="form-section_dc">
        {/* Google Workspace Full Width */}
        <div className="row">
          <div className="col-md-12">
            <div className="form-check_DC mb-3">
              <label className="form-check_DC-label" htmlFor="googleWorkspace">
                Google Workspace
                <div className="sub-note">
                  Email IDs fc@yourdomain & cs@yourdomain will be created
                </div>
              </label>
              <input
                className="form-check_DC-input"
                type="checkbox"
                id="googleWorkspace"
                checked={options.googleWorkspace}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>

        {/* Mobile and Website Side by Side */}
        <div className="row g-3">
          <div className="col-md-6">
            <div className="form-check_DC">
              <label className="form-check_DC-label" htmlFor="mobileNumber">Mobile Number</label>
              <input
                className="form-check_DC-input"
                type="checkbox"
                id="mobileNumber"
                checked={options.mobileNumber}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check_DC">
              <label className="form-check_DC-label" htmlFor="website">Website</label>
              <input
                className="form-check_DC-input"
                type="checkbox"
                id="website"
                checked={options.website}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

        
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <CardLayout
      title="Digital Credentials"
      currentCard={currentCard}
      totalCards={totalCards}
      onNext={handleNext}
      onPrev={handlePrev}
    >
      {renderCardContent()}
    </CardLayout>
  );
}