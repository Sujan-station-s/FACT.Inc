import React, { useEffect } from 'react';
import './ProgressBar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useCompanyType } from '../../contexts/CompanyTypeContext';

function ProgressBar({ currentStep = 1, orgType = 'Company' }) {
  const totalSteps = 8;
  const { companyType } = useCompanyType();
  const isMobile = window.innerWidth <= 768;
  let progressPercentage;

  if (currentStep === 1) {
    progressPercentage = 3;
  } else {
    const stepWidths = isMobile
      ? [0, 21, 44, 64, 78, 88, 95, 100]
      : [0, 16, 29, 41, 54, 67, 80, 100];
    progressPercentage = stepWidths[currentStep - 1];
  }

  const steps = [
    { label: 'Name Reservation', icon: 'bi-card-heading' },
    { label: 'Directors', icon: 'bi-people' },
    { label: 'SPICe+<br/>PART B', icon: 'bi-file-earmark-plus' },
    { label: 'e-MoA<br/>& e-AoA', icon: 'bi-file-earmark-text' },
    { label: 'INC-9', icon: 'bi-patch-check' },
    { label: 'AGILE PRO-S', icon: 'bi-shield-check' },
    { label: 'COI', icon: 'bi-award' },
    { label: 'Digital Credentials', icon: 'bi-key' },
  ];

  useEffect(() => {
    const activeStep = document.querySelector('.step.active');
    if (activeStep && window.innerWidth <= 768) {
      activeStep.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentStep]);

  return (
    <div className="progress-container animate-fade-up mb-4 flex-shrink-0">
      <div className="progress-inner m-3">
        <div className="progress-header">
          <div className="progress-header-row">
            <h4 className="progress-title">
              Registration for{' '}
              <span className="gradient-text fw-bold">
                {companyType?.name ?? 'Private Limited Company'}
              </span>
            </h4>
            <div className="progress-status">
              <span className="gradient-text">
                Step <span>{currentStep}</span> of <span>{totalSteps}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="pipeline-container">
          <div className="pipeline-progress">
            <div className="progress-line">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="progress-steps">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;
                const stepClass = `step${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}`;

                return (
                  <div key={index} className={stepClass}>
                    <div className="step-icon">
                      <i className={`bi ${step.icon}`}></i>
                    </div>
                    <div
                      className="step-label"
                      dangerouslySetInnerHTML={{ __html: step.label }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
