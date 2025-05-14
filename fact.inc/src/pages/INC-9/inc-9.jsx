import React, { useState, useEffect } from 'react';
import CardLayout from '../../components/PageCard/PageCard';
import './inc-9.css';
import { useNavigate } from 'react-router-dom';


export default function NameReservation() {
  const totalCards = 10;
  const [currentCard, setCurrentCard] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
  
    dinCount: {
      totalSubscribers: { withDIN: '', withoutDIN: '' },
      nonIndividuals: { withDIN: '', withoutDIN: '' },
      individualsCumDirectors: { withDIN: '', withoutDIN: '' },
      totalDirectors: { withDIN: '', withoutDIN: '' },
    },
  
    dinDetails: '',           // For case 2
    panDetails: '',           // For case 3
    subscriberName: '',       // Common for both cases
  
    declarations: {
      dec1: false,
      dec2: false,
      dec3: false,
      dec4: false,
      dec5: false,
      dec6: false,
      dec7: false,
      dec8: false,
      dec9: false,
      dec10: false,
    },
  });
  const exampleData = {
    companyName: 'GreenTech Innovators Pvt Ltd',
  
    dinCount: {
      totalSubscribers: { withDIN: '3', withoutDIN: '1' },
      nonIndividuals: { withDIN: '1', withoutDIN: '0' },
      individualsCumDirectors: { withDIN: '2', withoutDIN: '1' },
      totalDirectors: { withDIN: '4', withoutDIN: '0' },
    },
  
    dinDetails: '12345678',
    panDetails: 'ABCDE1234F',
    subscriberName: 'Rohit Mehra',
  
    declarations: {
      dec1: true,
      dec2: true,
      dec3: false,
      dec4: true,
      dec5: true,
      dec6: true,
      dec7: false,
      dec8: true,
      dec9: true,
      dec10: true,
    },
  };
    

  const handleNext = () => {
    if (currentCard < totalCards) {
      setCurrentCard(prev => prev + 1);
    } else {
      console.log('Reached last step or form submitted');
    }
  };

  const handlePrev = () => {
    if (currentCard > 1) {
      setCurrentCard(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    handleNext(); // Optionally go to next page after submit
  };
  const handlePageChange = (pageNumber) => {
    // Optional: Add checks if direct navigation is allowed
    // e.g., maybe prevent jumping ahead if previous steps aren't "complete"
    if (pageNumber >= 1 && pageNumber <= totalCards) {
      setCurrentCard(pageNumber);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCard]);

  const renderCardContent = () => {
    switch (currentCard) {
      case 1:
        return (
          <form onSubmit={handleSubmit}>
            <div id="page1Content" className="active-page">
              <div className="form-instructions">
                All fields marked in <span className="asterisk">*</span> are mandatory
              </div>
      
              <div className="form-rule mb-3">
                [Pursuant to Sections 7(1)(c) to the Companies Act, 2013 and rule 15 of the Companies (Incorporation) Rules, 2014]
              </div>
      
              <div className="form-row">
                <label htmlFor="companyNameP1" className="main-label">
                  1. Name of the Company<span className="asterisk">*</span>
                </label>
                <div className="input-area">
                  <input
                    type="text"
                    id="companyNameP1"
                    className="form-control"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, companyName: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
      
              <div className="section-heading">2(a) This declaration is in respect of:</div>
      
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Having valid DIN</th>
                    <th>Not having valid DIN</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'totalSubscribers', label: 'Total number of first subscribers (non-individual + individual)' },
                    { key: 'nonIndividuals', label: 'Number of non-individual first subscriber(s)' },
                    { key: 'individualsCumDirectors', label: 'Number of individual first subscriber(s) cum director(s)' },
                    { key: 'totalDirectors', label: 'Total number of directors (director(s) who are not subscriber(s) + subscriber(s) cum director(s))' },
                  ].map((item) => (
                    <tr key={item.key}>
                      <td>{item.label}<span className="asterisk">*</span></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.dinCount[item.key]?.withDIN || ''}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              dinCount: {
                                ...prev.dinCount,
                                [item.key]: {
                                  ...prev.dinCount[item.key],
                                  withDIN: e.target.value
                                }
                              }
                            }))
                          }
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.dinCount[item.key]?.withoutDIN || ''}
                          onChange={(e) =>
                            setFormData(prev => ({
                              ...prev,
                              dinCount: {
                                ...prev.dinCount,
                                [item.key]: {
                                  ...prev.dinCount[item.key],
                                  withoutDIN: e.target.value
                                }
                              }
                            }))
                          }
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        );
      
        
        case 2:
            return (
              <div id="page2Content">
                <div className="section-heading">2(b) Authorized persons of non-individual first subscriber(s) - DIN</div>
          
                <div className="form-row">
                  <label htmlFor="dinP2" className="main-label">
                    2(b)(I) Director Identification Number (DIN)
                    <span className="asterisk">*</span>
                  </label>
                  <div className="input-area">
                    <input
                      type="text"
                      id="dinP2"
                      name="dinP2"
                      className="form-control"
                      placeholder="Enter DIN if applicable"
                      required
                    />
                  </div>
                </div>
          
                <div className="sub-heading">Declaration</div>
          
                <div className="declaration-block">
                  <div className="declaration-text">
                    I <span className="asterisk">*</span>{' '}
                    <input
                      type="text"
                      id="nameP2"
                      name="nameP2"
                      className="form-control"
                      placeholder="Enter Name"
                      required
                    />{' '}
                    being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                  </div>
          
                  {[
                    {
                      id: 'dec1P2',
                      label:
                        'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years;',
                      required: true,
                    },
                    {
                      id: 'dec2P2',
                      label:
                        'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                      required: true,
                    },
                    {
                      id: 'dec3P2',
                      label:
                        'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                    },
                    {
                      id: 'dec4P2',
                      label:
                        'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                    },
                    {
                      id: 'dec5P2',
                      label:
                        'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                      required: true,
                    },
                    {
                      id: 'dec6P2',
                      label:
                        'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                    },
                    {
                      id: 'dec7P2',
                      label:
                        'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                    },
                    {
                      id: 'dec8P2',
                      label:
                        'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                    },
                    {
                      id: 'dec9P2',
                      label:
                        'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                    },
                    {
                      id: 'dec10P2',
                      label:
                        'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                    },
                  ].map((item) => (
                    <div className="declaration-text" key={item.id}>
                      <input type="checkbox" id={item.id} name={item.id} required={item.required} />
                      <label htmlFor={item.id}>
                        {item.required && <span className="asterisk">*</span>} {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          

            case 3:
              return (
                <div id="page3Content">
                  <div className="section-heading">
                    2(b) Authorized persons of non-individual first subscriber(s) - PAN
                  </div>
            
                  <div className="form-row">
                    <label htmlFor="panP3" className="main-label">
                      2(b)(II) Income-tax PAN<span className="asterisk">*</span>
                    </label>
                    <div className="input-area">
                      <input
                        type="text"
                        id="panP3"
                        name="panP3"
                        className="form-control"
                        placeholder="Enter PAN if applicable"
                        required
                      />
                    </div>
                  </div>
            
                  <div className="sub-heading">Declaration</div>
            
                  <div className="declaration-block">
                    <div className="declaration-text">
                      I <span className="asterisk">*</span>{' '}
                      <input
                        type="text"
                        id="nameP3"
                        name="nameP3"
                        className="form-control"
                        placeholder="Enter Name"
                        required
                      />{' '}
                      being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                    </div>
            
                    {[
                      {
                        id: 'dec1P3',
                        label:
                          'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                        required: true,
                      },
                      {
                        id: 'dec2P3',
                        label:
                          'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                        required: true,
                      },
                      {
                        id: 'dec3P3',
                        label:
                          'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                      },
                      {
                        id: 'dec4P3',
                        label:
                          'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                      },
                      {
                        id: 'dec5P3',
                        label:
                          'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                        required: true,
                      },
                      {
                        id: 'dec6P3',
                        label:
                          'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                      },
                      {
                        id: 'dec7P3',
                        label:
                          'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                      },
                      {
                        id: 'dec8P3',
                        label:
                          'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                      },
                      {
                        id: 'dec9P3',
                        label:
                          'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                      },
                      {
                        id: 'dec10P3',
                        label:
                          'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                      },
                    ].map((item) => (
                      <div className="declaration-text" key={item.id}>
                        <input
                          type="checkbox"
                          id={item.id}
                          name={item.id}
                          required={item.required}
                        />
                        <label htmlFor={item.id}>
                          {item.required && <span className="asterisk">*</span>} {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            

              case 4:
                return (
                  <div id="page4Content">
                    <div className="section-heading">
                      2(c) Individual first subscriber(s) (not director) - DIN
                    </div>
              
                    <div className="form-row">
                      <label htmlFor="dinP4" className="main-label">
                        2(c)(I) Director Identification Number (DIN)
                        <span className="asterisk">*</span>
                      </label>
                      <div className="input-area">
                        <input
                          type="text"
                          id="dinP4"
                          name="dinP4"
                          className="form-control"
                          placeholder="Enter DIN if applicable"
                          required
                        />
                      </div>
                    </div>
              
                    <div className="sub-heading">Declaration</div>
              
                    <div className="declaration-block">
                      <div className="declaration-text">
                        I <span className="asterisk">*</span>{' '}
                        <input
                          type="text"
                          id="nameP4"
                          name="nameP4"
                          className="form-control"
                          placeholder="Enter Name"
                          required
                        />{' '}
                        being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                      </div>
              
                      {[
                        {
                          id: 'dec1P4',
                          label:
                            'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                          required: true,
                        },
                        {
                          id: 'dec2P4',
                          label:
                            'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                          required: true,
                        },
                        {
                          id: 'dec3P4',
                          label:
                            'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                        },
                        {
                          id: 'dec4P4',
                          label:
                            'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                        },
                        {
                          id: 'dec5P4',
                          label:
                            'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                          required: true,
                        },
                        {
                          id: 'dec6P4',
                          label:
                            'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                        },
                        {
                          id: 'dec7P4',
                          label:
                            'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                        },
                        {
                          id: 'dec8P4',
                          label:
                            'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                        },
                        {
                          id: 'dec9P4',
                          label:
                            'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                        },
                        {
                          id: 'dec10P4',
                          label:
                            'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                        },
                      ].map((item) => (
                        <div className="declaration-text" key={item.id}>
                          <input
                            type="checkbox"
                            id={item.id}
                            name={item.id}
                            required={item.required}
                          />
                          <label htmlFor={item.id}>
                            {item.required && <span className="asterisk">*</span>} {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              

                case 5:
                  return (
                    <div id="page5Content">
                      <div className="section-heading">
                        2(c) Individual first subscriber(s) (not director) - PAN
                      </div>
                
                      <div className="form-row">
                        <label htmlFor="panP5" className="main-label">
                          2(c)(II) Income-tax PAN <span className="asterisk">*</span>
                        </label>
                        <div className="input-area">
                          <input
                            type="text"
                            id="panP5"
                            name="panP5"
                            className="form-control"
                            placeholder="Enter PAN if applicable"
                            required
                          />
                        </div>
                      </div>
                
                      <div className="sub-heading">Declaration</div>
                
                      <div className="declaration-block">
                        <div className="declaration-text">
                          I <span className="asterisk">*</span>{' '}
                          <input
                            type="text"
                            id="nameP5"
                            name="nameP5"
                            className="form-control"
                            placeholder="Enter Name"
                            required
                          />{' '}
                          being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                        </div>
                
                        {[
                          {
                            id: 'dec1P5',
                            label:
                              'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                            required: true,
                          },
                          {
                            id: 'dec2P5',
                            label:
                              'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                            required: true,
                          },
                          {
                            id: 'dec3P5',
                            label:
                              'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                          },
                          {
                            id: 'dec4P5',
                            label:
                              'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                          },
                          {
                            id: 'dec5P5',
                            label:
                              'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                            required: true,
                          },
                          {
                            id: 'dec6P5',
                            label:
                              'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                          },
                          {
                            id: 'dec7P5',
                            label:
                              'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                          },
                          {
                            id: 'dec8P5',
                            label:
                              'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                          },
                          {
                            id: 'dec9P5',
                            label:
                              'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                          },
                          {
                            id: 'dec10P5',
                            label:
                              'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                          },
                        ].map((item) => (
                          <div className="declaration-text" key={item.id}>
                            <input
                              type="checkbox"
                              id={item.id}
                              name={item.id}
                              required={item.required}
                            />
                            <label htmlFor={item.id}>
                              {item.required && <span className="asterisk">*</span>} {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                
                  case 6:
                    return (
                      <div id="page6Content">
                        <div className="section-heading">
                          2(d) Individual first subscriber(s) cum director(s) - DIN
                        </div>
                  
                        <div className="form-row">
                          <label htmlFor="dinP6" className="main-label">
                            2(d)(I) Director Identification Number (DIN)
                            <span className="asterisk">*</span>
                          </label>
                          <div className="input-area">
                            <input
                              type="text"
                              id="dinP6"
                              name="dinP6"
                              className="form-control"
                              placeholder="Enter DIN if applicable"
                              required
                            />
                          </div>
                        </div>
                  
                        <div className="sub-heading">Declaration</div>
                  
                        <div className="declaration-block">
                          <div className="declaration-text">
                            I <span className="asterisk">*</span>{' '}
                            <input
                              type="text"
                              id="nameP6"
                              name="nameP6"
                              className="form-control"
                              placeholder="Enter Name"
                              required
                            />{' '}
                            being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                          </div>
                  
                          {[
                            {
                              id: 'dec1P6',
                              label:
                                'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                              required: true,
                            },
                            {
                              id: 'dec2P6',
                              label:
                                'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                              required: true,
                            },
                            {
                              id: 'dec3P6',
                              label:
                                'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                            },
                            {
                              id: 'dec4P6',
                              label:
                                'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                            },
                            {
                              id: 'dec5P6',
                              label:
                                'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                              required: true,
                            },
                            {
                              id: 'dec6P6',
                              label:
                                'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                            },
                            {
                              id: 'dec7P6',
                              label:
                                'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                            },
                            {
                              id: 'dec8P6',
                              label:
                                'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                            },
                            {
                              id: 'dec9P6',
                              label:
                                'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                            },
                            {
                              id: 'dec10P6',
                              label:
                                'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                            },
                          ].map((item) => (
                            <div className="declaration-text" key={item.id}>
                              <input
                                type="checkbox"
                                id={item.id}
                                name={item.id}
                                required={item.required}
                              />
                              <label htmlFor={item.id}>
                                {item.required && <span className="asterisk">*</span>} {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  

                    case 7:
                      return (
                        <div id="page7Content">
                          <div className="section-heading">
                            2(d) Individual first subscriber(s) cum director(s) - PAN 1
                          </div>
                    
                          <div className="form-row">
                            <label htmlFor="panP7" className="main-label">
                              2(d)(II) Income-tax PAN <span className="asterisk">*</span>
                            </label>
                            <div className="input-area">
                              <input
                                type="text"
                                id="panP7"
                                name="panP7"
                                className="form-control"
                                value="AB******7K"
                                readOnly
                              />
                            </div>
                          </div>
                    
                          <div className="sub-heading">Declaration</div>
                    
                          <div className="declaration-block">
                            <div className="declaration-text">
                              I <span className="asterisk">*</span>{' '}
                              <input
                                type="text"
                                id="nameP7_pan"
                                name="nameP7_pan"
                                className="form-control"
                                placeholder="Enter Name"
                                required
                              />{' '}
                              being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                            </div>
                    
                            {[
                              {
                                id: 'dec1P7',
                                label:
                                  'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                                required: true,
                                defaultChecked: true,
                              },
                              {
                                id: 'dec2P7',
                                label:
                                  'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                                required: true,
                                defaultChecked: true,
                              },
                              {
                                id: 'dec3P7',
                                label:
                                  'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                              },
                              {
                                id: 'dec4P7',
                                label:
                                  'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                                defaultChecked: true,
                              },
                              {
                                id: 'dec5P7',
                                label:
                                  'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                                required: true,
                                defaultChecked: true,
                              },
                              {
                                id: 'dec6P7',
                                label:
                                  'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                              },
                              {
                                id: 'dec7P7',
                                label:
                                  'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                              },
                              {
                                id: 'dec8P7',
                                label:
                                  'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                              },
                              {
                                id: 'dec9P7',
                                label:
                                  'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                              },
                              {
                                id: 'dec10P7',
                                label:
                                  'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                              },
                            ].map((item) => (
                              <div className="declaration-text" key={item.id}>
                                <input
                                  type="checkbox"
                                  id={item.id}
                                  name={item.id}
                                  defaultChecked={item.defaultChecked || false}
                                  required={item.required}
                                />
                                <label htmlFor={item.id}>
                                  {item.required && <span className="asterisk">*</span>} {item.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                      case 8:
                        return (
                          <div id="page8Content">
                            <div className="section-heading">
                              2(d) Individual first subscriber(s) cum director(s) - PAN 2
                            </div>
                      
                            <div className="form-row">
                              <label htmlFor="panP8" className="main-label">
                                2(d)(II) Income-tax PAN <span className="asterisk">*</span>
                              </label>
                              <div className="input-area">
                                <input
                                  type="text"
                                  id="panP8"
                                  name="panP8"
                                  className="form-control"
                                  value="FY******3G"
                                  readOnly
                                />
                              </div>
                            </div>
                      
                            <div className="sub-heading">Declaration</div>
                      
                            <div className="declaration-block">
                              <div className="declaration-text">
                                I <span className="asterisk">*</span>{' '}
                                <input
                                  type="text"
                                  id="nameP8_pan"
                                  name="nameP8_pan"
                                  className="form-control"
                                  placeholder="Enter Name"
                                  required
                                />{' '}
                                being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                              </div>
                      
                              {[
                                {
                                  id: 'dec1P8',
                                  label:
                                    'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                                  required: true,
                                  defaultChecked: true,
                                },
                                {
                                  id: 'dec2P8',
                                  label:
                                    'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                                  required: true,
                                  defaultChecked: true,
                                },
                                {
                                  id: 'dec3P8',
                                  label:
                                    'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                                },
                                {
                                  id: 'dec4P8',
                                  label:
                                    'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                                  defaultChecked: true,
                                },
                                {
                                  id: 'dec5P8',
                                  label:
                                    'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                                  required: true,
                                  defaultChecked: true,
                                },
                                {
                                  id: 'dec6P8',
                                  label:
                                    'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                                },
                                {
                                  id: 'dec7P8',
                                  label:
                                    'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                                },
                                {
                                  id: 'dec8P8',
                                  label:
                                    'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                                },
                                {
                                  id: 'dec9P8',
                                  label:
                                    'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                                },
                                {
                                  id: 'dec10P8',
                                  label:
                                    'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                                },
                              ].map((item) => (
                                <div className="declaration-text" key={item.id}>
                                  <input
                                    type="checkbox"
                                    id={item.id}
                                    name={item.id}
                                    required={item.required}
                                    defaultChecked={item.defaultChecked || false}
                                  />
                                  <label htmlFor={item.id}>
                                    {item.required && <span className="asterisk">*</span>} {item.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      
                        case 9:
                          return (
                            <div id="page9Content">
                              <div className="section-heading">
                                2(e) Directors (other than first subscribers) - DIN
                              </div>
                        
                              <div className="form-row">
                                <label htmlFor="dinP9" className="main-label">
                                  2(e)(I) Director Identification Number (DIN) <span className="asterisk">*</span>
                                </label>
                                <div className="input-area">
                                  <input
                                    type="text"
                                    id="dinP9"
                                    name="dinP9"
                                    className="form-control"
                                    placeholder="Enter DIN if applicable"
                                    required
                                  />
                                </div>
                              </div>
                        
                              <div className="sub-heading">Declaration</div>
                        
                              <div className="declaration-block">
                                <div className="declaration-text">
                                  I <span className="asterisk">*</span>{' '}
                                  <input
                                    type="text"
                                    id="nameP9"
                                    name="nameP9"
                                    className="form-control"
                                    placeholder="Enter Name"
                                    required
                                  />{' '}
                                  being named as first director in the articles, of the above-named proposed company,
                                  hereby solemnly declare and affirm that:
                                </div>
                        
                                {[
                                  {
                                    id: 'dec1P9',
                                    label:
                                      'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                                    required: true,
                                  },
                                  {
                                    id: 'dec2P9',
                                    label:
                                      'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years; and',
                                    required: true,
                                  },
                                  {
                                    id: 'dec3P9',
                                    label:
                                      'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                                    required: true,
                                  },
                                  {
                                    id: 'dec4P9',
                                    label:
                                      'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                                  },
                                  {
                                    id: 'dec5P9',
                                    label:
                                      'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                                  },
                                ].map((item) => (
                                  <div className="declaration-text" key={item.id}>
                                    <input
                                      type="checkbox"
                                      id={item.id}
                                      name={item.id}
                                      required={item.required}
                                    />
                                    <label htmlFor={item.id}>
                                      {item.required && <span className="asterisk">*</span>} {item.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                          case 10:
                            return (
                              <div id="page10Content">
                                <div className="section-heading">
                                  2(e) Directors (other than first subscribers) - PAN
                                </div>
                          
                                <div className="form-row">
                                  <label htmlFor="panP10" className="main-label">
                                    2(e)(II) Income-tax PAN <span className="asterisk">*</span>
                                  </label>
                                  <div className="input-area">
                                    <input
                                      type="text"
                                      id="panP10"
                                      name="panP10"
                                      className="form-control"
                                      placeholder="Enter PAN if applicable"
                                      required
                                    />
                                  </div>
                                </div>
                          
                                <div className="sub-heading">Declaration</div>
                          
                                <div className="declaration-block">
                                  <div className="declaration-text">
                                    I <span className="asterisk">*</span>{' '}
                                    <input
                                      type="text"
                                      id="nameP10"
                                      name="nameP10"
                                      className="form-control"
                                      placeholder="Enter Name"
                                      required
                                    />{' '}
                                    being the subscriber to the memorandum, of the above-named proposed company, hereby solemnly declare and affirm that:
                                  </div>
                          
                                  {[
                                    {
                                      id: 'dec1P10',
                                      label:
                                        'I have not been convicted of any offence in connection with the promotion, formation or management of any company during the preceding five years; and',
                                      required: true,
                                    },
                                    {
                                      id: 'dec2P10',
                                      label:
                                        'I have not been found guilty of any fraud or misfeasance or of any breach of duty to any company under this Act or any previous company law during the preceding five years;',
                                      required: true,
                                    },
                                    {
                                      id: 'dec3P10',
                                      label:
                                        'I am required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares and the same has been obtained, and is enclosed herewith; or',
                                    },
                                    {
                                      id: 'dec4P10',
                                      label:
                                        'I am not required to obtain the Government approval under the Foreign Exchange Management (Non-debt Instruments) Rules, 2019 prior to subscription of shares; and',
                                    },
                                    {
                                      id: 'dec5P10',
                                      label:
                                        'All the documents filed with the Registrar for registration of the company contain information that is correct and complete and true to the best of my knowledge and belief.',
                                      required: true,
                                    },
                                    {
                                      id: 'dec6P10',
                                      label:
                                        'I provide my consent to the proposed conversion of the entity and have no objection to the same.',
                                    },
                                    {
                                      id: 'dec7P10',
                                      label:
                                        'I am a member of the company applying for registration under Part I of Chapter XXI of the Companies Act, 2013 and hereby undertake as per Rule 3(4) and Rule 5(i) of Companies (Authorised to Register) Rules that in the event of registration under this Part, necessary documents or papers shall be submitted to the registering or other authority with which the company was earlier registered, within 15 days, for its dissolution, as the case may be. I further undertake that no activity / business shall be carried out in the name and style of the previous / converted entity; and',
                                    },
                                    {
                                      id: 'dec8P10',
                                      label:
                                        'I declare that the proposed company has its objects in accordance with clause (a) of subsection (1) of section 8 of the Act and it intends to comply with the restrictions and prohibitions as mentioned respectively in clause (b) and clause (c) of that sub-section',
                                    },
                                    {
                                      id: 'dec9P10',
                                      label:
                                        'The memorandum and articles of association have been drawn up in conformity with the provisions of section 8 and rules made thereunder; and',
                                    },
                                    {
                                      id: 'dec10P10',
                                      label:
                                        'All the requirements of Companies Act, 2013 and the rules made thereunder relating to registration of the company under section 8 of the Act and matters precedent or incidental thereto have been complied with',
                                    },
                                  ].map((item) => (
                                    <div className="declaration-text" key={item.id}>
                                      <input
                                        type="checkbox"
                                        id={item.id}
                                        name={item.id}
                                        required={item.required}
                                      />
                                      <label htmlFor={item.id}>
                                        {item.required && <span className="asterisk">*</span>} {item.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          
                    

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <CardLayout
      title="INC-9: Declaration"
      currentCard={currentCard}
      totalCards={totalCards}
      onNext={handleNext}
      onPrev={handlePrev}
      onPageChange={handlePageChange} // Pass the handler
      onFinalSubmit={() => navigate('/fact.inc/Agile_pro')}
      setFormData={setFormData}
      exampleData={exampleData}
    >
      {renderCardContent()}
    </CardLayout>
  );
}
