import React, { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import './product.css';

const Product = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
            function normalizeZoom() {
                const zoom = window.devicePixelRatio;
                const width = window.innerWidth;
                const height = window.innerHeight;
              
                const app = document.getElementById('app');
                const loginContainer = document.querySelector('.container');
               
              
                if (!app) return;
              
                const isMobile = width <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
              
                // 🧹 Reset any previous zoom class
                if (loginContainer) loginContainer.classList.remove('zoom-150');

              
                // 📱 Skip zoom adjustments on mobile
                if (isMobile) {
                  app.style.transform = 'none';
                  app.style.width = '100vw';
                  app.style.height = '100vh';
                  return;
                }
              
                // 💻 Zoom handling for desktop
                if (zoom > 1) {
                  const scale = 1 / zoom;
                  app.style.transform = `scale(${scale})`;
                  app.style.transformOrigin = 'top left';
                  app.style.width = `${zoom * 100}vw`;
                  app.style.height = `${zoom * 100}vh`;
                  if (zoom >= 1.5 && loginContainer) {
                    loginContainer.classList.add('zoom-150');
                    
                  }
                  
                }
              
                // 🖥️ Fallback for small screen resolutions
                else if (width <= 1366 && height <= 768) {
                  const scale = 0.8;
                  app.style.transform = `scale(${scale})`;
                  app.style.transformOrigin = 'top left';
                  app.style.width = `${100 / scale}vw`;
                  app.style.height = `${100 / scale}vh`;
                }
              
                // 🧩 Default: reset to normal
                else {
                  app.style.transform = 'none';
                  app.style.width = '100vw';
                  app.style.height = '100vh';
                }
              }
              
          
            normalizeZoom(); // Run once on mount
            window.addEventListener('resize', normalizeZoom);
            window.addEventListener('orientationchange', normalizeZoom);
          
            return () => {
              window.removeEventListener('resize', normalizeZoom);
              window.removeEventListener('orientationchange', normalizeZoom);
            };
          }, [location.pathname]);
          


    const handleFinDockAccess = () => {
        navigate('/fact.inc/CompanyType');
    };

    return (
        <div id="app" className="dashboard-layout d-flex">
        <section className="product-section">
            <div className="container">
                <div className="section-header">
                    <h1>Financial Solutions Suite</h1>
                    <p>Smart, AI-driven solutions for seamless, compliant financial management from day one to growth stage.
                    </p>
                </div>
                <div className="featured-card">
                    <div className="featured-card-content">
                        <div className="coform-left">
                            <div className="coform-icon-wrapper">
                                <i className="bi bi-buildings"></i>
                            </div>
                            <h3>FACT.Inc</h3>
                            <span className="badge text-primary-600">COMPANY INCORPORATION</span>
                        </div>
                        <div className="featured-card-details">
                            <h3>Smoothest & Fastest Business Incorporation</h3>
                            <p>Launch your venture seamlessly with our guided digital registration process. We handle the complexities, so you can focus on your business.</p>
                            <div className="featured-benefits">
                                <div className="benefit-item"><i className="bi bi-check-circle"></i><span>Guided digital setup </span></div>
                                <div className="benefit-item"><i className="bi bi-shield-check"></i><span>Ensured compliance with regulations</span></div>
                                <div className="benefit-item"><i className="bi bi-clock-history"></i><span>Track progress in a real-time</span></div>
                            </div>
                            <div className="featured-cta">
                            <button onClick={handleFinDockAccess} className="btn-primary">
                                <i className="bi bi-rocket"></i> Form Your Company Now
                            </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-grid">
                    {/* FinDock Card */}
                    <div className="product-col" data-product-id="findock">
                        <div className="product-card active h-99">
                            <span className="product-badge active"><i className="bi bi-check-circle"></i> Active</span>
                            <div className="icon-wrapper"><i className="bi bi-safe"></i></div>
                            <h3 className="product-title">FACT.Safe</h3>
                            <p className="product-description">Your secure vault for financial documents. Organize, access, and share critical files with confidence.</p>
                            <div className="product-features">
                                <div className="product-feature"><i className="bi bi-check-circle"></i><span>Bank-grade encryption</span></div>
                                <div className="product-feature"><i className="bi bi-check-circle"></i><span>Audit trails & versioning</span></div>
                                <div className="product-feature"><i className="bi bi-check-circle"></i><span>Secure sharing controls</span></div>
                            </div>
                            <button  className="btn-product">
                                <i className="bi bi-box-arrow-in-right"></i> Access FACT.Safe
                            </button>
                        </div>
                    </div>

                    {/* FinAct Card */}


                    {/* VeriDay Card */}
                    <div className="product-col" data-product-id="veriday">
                        <div className="product-card upcoming h-100">
                            <span className="product-badge coming-soon"><i className="bi bi-clock-history"></i>Subscribe Now </span>
                            <div className="icon-wrapper"><i className="bi bi-person-check"></i></div>
                            <h3 className="product-title">FACT.Reg</h3>
                            <p className="product-description">Streamline customer onboarding with secure, automated identity verification</p>
                            <div className="product-features">
                                <div className="product-feature"><i className="bi bi-circle"></i><span>AI Verify</span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Liveness</span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Global</span></div>
                            </div>
                            <a href="#" className="btn-product upcoming"><i className="bi bi-bell"></i> Subscribe Now</a>
                        </div>
                    </div>

                    {/* TaxEtra Card */}
                    <div className="product-col" data-product-id="taxetra">
                        <div className="product-card upcoming h-100">
                            <span className="product-badge coming-soon"><i className="bi bi-clock-history"></i>Subscribe Now</span>
                            <div className="icon-wrapper"><i className="bi bi-file-earmark-ruled"></i></div>
                            <h3 className="product-title">FACT.Tax</h3>
                            <p className="product-description">Simplify tax compliance with automated calculations and reporting.</p>
                            <div className="product-features">
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Calculations</span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Reporting</span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Filing assistance</span></div>
                            </div>
                            <a href="#" className="btn-product upcoming"><i className="bi bi-bell"></i> Subscribe Now</a>
                        </div>
                    </div>

                    {/* FinVision Card */}
                    <div className="product-col" data-product-id="finvision">
                        <div className="product-card upcoming h-100">
                            <span className="product-badge coming-soon"><i className="bi bi-clock-history"></i>Subscribe Now</span>
                            <div className="icon-wrapper"><i className="bi bi-graph-up-arrow"></i></div>
                            <h3 className="product-title">FACT.Pitch</h3>
                            <p className="product-description">Fuel your fundraising journey with structured pitches, real-time insights, and investor engagement.
                            </p>
                            <div className="product-features">
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Pitch Builder
                                </span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Smart Match
                                </span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Deal Ready
                                </span></div>
                            </div>
                            <a href="#" className="btn-product upcoming"><i className="bi bi-bell"></i> Subscribe Now</a>
                        </div>
                    </div>
                    <div className="product-col" data-product-id="finact">
                        <div className="product-card upcoming h-100">
                            <span className="product-badge coming-soon"><i className="bi bi-clock-history"></i>Subscribe Now</span>
                            <div className="icon-wrapper"><i className="bi bi-calculator"></i></div>
                            <h3 className="product-title">FACT.Eval</h3>
                            <p className="product-description">Streamline evaluations, benchmark startup stages, and accelerate investability.
                            </p>
                            <div className="product-features">
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Score Pitches
                                </span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Find Gaps</span></div>
                                <div className="product-feature"><i className="bi bi-circle"></i><span>Give Advice</span></div>
                            </div>
                            <a href="#" className="btn-product upcoming"><i className="bi bi-bell"></i> Subscribe Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
};

export default Product;
