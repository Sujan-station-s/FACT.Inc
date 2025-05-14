import React, { useState, useEffect } from 'react';
import CardLayout from '../../components/PageCard/PageCard';
import './NameReservation.css';
import { useCompanyType } from "../../contexts/CompanyTypeContext";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // ✅ Import auth
// import { setCompanyName } from '../../utils/GlobalStore';
export default function NameReservation() {
  const totalCards = 1;
  const [currentCard, setCurrentCard] = useState(1);
  const navigate = useNavigate();

  const { token, orgId } = useAuth();
   // ✅ Access token and orgId from context
   const { setAvailableName } = useCompanyType();
  const [formData, setFormData] = useState({
    preferences: ['', '', '', ''],
    sector: '',
    availableName: '',
    companyDescription: '',
    productsAndServices: '',
    customerBase: '',
    geography: ''
  });

  useEffect(() => {
    if (!token || !orgId) return; // 🛡️ Wait for token/orgId to load
  
    const fetchReservation = async () => {
      try {
        const response = await fetch('http://3.111.226.182/factops/coform/getNameReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ org_id: orgId })
        });
  
        if (response.ok) {
          const json = await response.json();
          if (json.status === 'success' && json.data) {
            const data = json.data;
            setFormData(prev => ({
              ...prev,
              preferences: [
                data.entity_name1 || '',
                data.entity_name2 || '',
                data.entity_name3 || '',
                data.entity_name4 || ''
              ],
              sector: data.business_sector || '',
              availableName: data.available_names || ''
            }));
            setAvailableName(data.available_names || '');
          }
        } else {
          console.error('Reservation fetch failed:', response.status);
        }
      } catch (err) {
        console.error('Fetch reservation error:', err);
      }
    };
  
    const fetchDescription = async () => {
      try {
        const response = await fetch('http://3.111.226.182/factops/coform/getDescription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ org_id: orgId })
        });
  
        if (response.ok) {
          const json = await response.json();
          if (json.status === 'success' && json.data) {
            const data = json.data;
            setFormData(prev => ({
              ...prev,
              companyDescription: data.description || '',
              productsAndServices: data.product_or_services || '',
              customerBase: data.targeted_customers || '',
              geography: data.geography_focus_of_company || ''
            }));
          }
        } else {
          console.error('Description fetch failed:', response.status);
        }
      } catch (err) {
        console.error('Fetch description error:', err);
      }
    };
  
    fetchReservation();
    fetchDescription();
  }, [token, orgId]);
  

  const handlePreferenceChange = (index, value) => {
    const updatedPreferences = [...formData.preferences];
    updatedPreferences[index] = value;
    setFormData(prev => ({ ...prev, preferences: updatedPreferences }));
  };

 const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'availableName') {
    setCompanyName(value); // using localStorage-backed function
  }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const descriptionPayload = {
      org_id: orgId,
      description: formData.companyDescription,
      product_or_services: formData.productsAndServices,
      targeted_customers: formData.customerBase,
      geography_focus_of_company: formData.geography
    };

    const nameReservationPayload = {
      name1: formData.preferences[0],
      name2: formData.preferences[1],
      name3: formData.preferences[2] || null,
      name4: formData.preferences[3] || null,
      sector: formData.sector,
      available_names: formData.availableName,
      org_id: orgId
    };

    try {
      const [descRes, nameRes] = await Promise.all([
        fetch('http://3.111.226.182/factops/coform/updateDescription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(descriptionPayload)
        }),
        fetch('http://3.111.226.182/factops/coform/nameReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(nameReservationPayload)
        })
      ]);

      const descJson = await descRes.json();
      const nameJson = await nameRes.json();

      console.log('📄 Description update result:', descJson);
      console.log('📛 Name reservation result:', nameJson);
    } catch (err) {
      console.error('❌ Error during submission:', err);
    }

    navigate('/fact.inc/directors');
  };

  const renderCardContent = () => {
    if (currentCard !== 1) return null;

    return (
      <form onSubmit={handleSubmit}>
        <div className="container-fluid px-1">
          <div className="row gx-4 gy-3">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header_name text-white fw-semibold py-2">
                  Proposed Name
                </div>
                <div className="card-body_name">
                  {["First preference", "Second preference", "Third preference", "Fourth preference"].map((label, idx) => (
                    <div className="mb-2 d-flex form-row-responsive align-items-start gap-3" key={idx}>
                      <label className="form-label_name text-nowrap" style={{ minWidth: '160px' }}>
                        {idx + 1}. {label} {idx < 2 && <span className="text-danger">*</span>}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Example: ${formData.preferences[idx] || ''}`}
                        required={idx < 2}
                        value={formData.preferences[idx]}
                        onChange={(e) => handlePreferenceChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <div className="mb-2 row align-items-center">
                  <label htmlFor="sector" className="col-sm-5 col form-label_name">
                    Business Sector <span className="text-danger">*</span>
                  </label>
                  <div className="col-sm-7">
                    <select
                      className="form-select_name"
                      id="sector"
                      required
                      value={formData.sector}
                      onChange={(e) => handleChange('sector', e.target.value)}
                    >
                      <option value="" disabled selected>Choose your business sector</option>
                  <option value="technology">Technology & Software Development</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="manufacturing">Manufacturing & Production</option>
                  <option value="financial">Financial Services</option>
                  <option value="healthcare">Healthcare Services</option>
                  <option value="education">Education & Training</option>
                  <option value="food">Food Industry</option>
                  <option value="consulting">Business Consulting</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="other">Other Industry</option>
                    </select>
                  </div>
                </div>

                <div className="card shadow-sm mt-3">
                  <div className="card-header_name text-white fw-semibold py-2">
                    Available Name
                  </div>
                  <div className="card-body_name py-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Available/Finalized Name"
                      value={formData.availableName}
                      onChange={(e) => handleChange('availableName', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <div className="info-note-box mb-3">
                <i className="bi bi-lightbulb-fill text-primary fs-4"></i>
                <div>
                  <label>Please provide a brief description on nature of business for this company.</label>
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label_name">
                  Describe your company <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="e.g: Innovative tech solutions empowering businesses"
                  required
                  value={formData.companyDescription}
                  onChange={(e) => handleChange('companyDescription', e.target.value)}
                ></textarea>
              </div>

              <div className="mb-2">
                <label className="form-label_name d-flex align-items-center gap-2">
                  <i className="bi bi-box text-primary"></i>
                  What type of products and services will your company provide?
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter details about your products and services"
                  value={formData.productsAndServices}
                  onChange={(e) => handleChange('productsAndServices', e.target.value)}
                ></textarea>
              </div>

              <div className="mb-2">
                <label className="form-label_name d-flex align-items-center gap-2">
                  <i className="bi bi-people text-primary"></i>
                  Who are your typical customers?
                </label>
                <textarea
                  className="form-control"
                  placeholder="Describe your target customer base"
                  value={formData.customerBase}
                  onChange={(e) => handleChange('customerBase', e.target.value)}
                ></textarea>
              </div>

              <div className="mb-2">
                <label className="form-label_name d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt text-primary"></i>
                  Which geography will this company focus on?
                </label>
                <textarea
                  className="form-control"
                  placeholder="Specify your geographic target areas"
                  value={formData.geography}
                  onChange={(e) => handleChange('geography', e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <CardLayout
    title="Let's start with the name of the company and overview"
    currentCard={currentCard}
    totalCards={totalCards}
    onNext={() => setCurrentCard(prev => prev + 1)}
    onPrev={() => setCurrentCard(prev => prev - 1)}
    onPageChange={(page) => setCurrentCard(page)}
    onFinalSubmit={handleSubmit}
    setFormData={setFormData}
  >
    {renderCardContent()}
  </CardLayout>
);
}