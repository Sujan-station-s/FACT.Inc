import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import pic from '../../assets/images/fact-ops_logo_purple_white.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import the hook from AuthContext
import { useAuth } from '../../contexts/AuthContext'; // adjust path if needed

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Use the login function from AuthContext
  const { login } = useAuth();

  useEffect(() => {
    function normalizeZoom() {
      const zoom = window.devicePixelRatio;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const app = document.getElementById('app');
      const loginContainer = document.querySelector('.login-container');
      const logincard = document.querySelector('.login-card');
      if (!app) return;
      const isMobile = width <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

      if (loginContainer) loginContainer.classList.remove('zoom-150');
      if (isMobile) {
        app.style.transform = 'none';
        app.style.width = '100vw';
        app.style.height = 'auto';
        return;
      }

      if (zoom > 1) {
        const scale = 1 / zoom;
        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = 'top left';
        app.style.width = `${zoom * 100}vw`;
        app.style.height = `${zoom * 100}vh`;
        if (zoom >= 1.5 && loginContainer) {
          loginContainer.classList.add('zoom-150');
          logincard.classList.add('zoom-150');
        }
      } else if (width <= 1366 && height <= 768) {
        const scale = 0.8;
        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = 'top left';
        app.style.width = `${100 / scale}vw`;
        app.style.height = `${100 / scale}vh`;
      } else {
        app.style.transform = 'none';
        app.style.width = '100vw';
        app.style.height = '100vh';
      }
    }

    normalizeZoom();
    window.addEventListener('resize', normalizeZoom);
    window.addEventListener('orientationchange', normalizeZoom);

    return () => {
      window.removeEventListener('resize', normalizeZoom);
      window.removeEventListener('orientationchange', normalizeZoom);
    };
  }, [location.pathname]);
      
    const [showSignup, setShowSignup] = useState(false);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailMobile, setEmailMobile] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const API_BASE_URL = "http://3.111.226.182/factops";
    

    // useEffect(() => {
    //     // Check if user is already logged in
    //     const token = localStorage.getItem('access_token');
    //     if (token) {
    //         navigate('/', { replace: true });
    //     }
    // }, [navigate]);

    // Utility Functions
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidMobile = (mobile) => /^\+?[0-9]{6,15}$/.test(mobile);

    const clearErrors = () => {
        setErrors({});
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    };

    const showError = (field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
        const element = document.getElementById(field);
        if (element) element.classList.add('is-invalid');
    };

    const handleOtpInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const index = parseInt(e.target.getAttribute('data-index'));
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        if (value && index < 5) {
            const nextInput = document.querySelector(`[data-index="${index + 1}"]`);
            nextInput?.focus();
        }
    };

    const handleOtpKeydown = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prevInput = document.querySelector(`[data-index="${index - 1}"]`);
            prevInput?.focus();
            e.preventDefault();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/\D/g, '');
        if (!pastedData) return;

        const digits = pastedData.substring(0, 6).split('');
        const newOtpValues = [...otpValues];
        digits.forEach((digit, i) => {
            if (i < 6) newOtpValues[i] = digit;
        });
        setOtpValues(newOtpValues);
    };

    const getOTP = async (method) => {
        clearErrors();
        const identifier = emailMobile.trim();
        
        if (!identifier) {
            showError('email_mobile', 'Enter email or mobile');
            return;
        }
        
        if (!isValidEmail(identifier) && !isValidMobile(identifier)) {
            showError('email_mobile', 'Enter a valid email or mobile');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/send_otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    type: method
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success(data.message || "Key sent successfully!");
                document.querySelector('.otp-input')?.focus();
            } else {
                toast.error(data.message || "Failed to send key");
                showError('email_mobile', data.message);
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        clearErrors();

        const identifier = emailMobile.trim();
        const otp = otpValues.join('');
        const isOtpComplete = otp.length === 6;
        const isOtpEntered = otp.length > 0;
        const isPasswordEntered = password.length > 0;
        let hasError = false;

        // Validation
        if (!identifier) {
            showError('email_mobile', 'Email/mobile required');
            hasError = true;
        } else if (!isValidEmail(identifier) && !isValidMobile(identifier)) {
            showError('email_mobile', 'Valid email/mobile required');
            hasError = true;
        }

        if (!isOtpComplete && !isPasswordEntered) {
            if (isOtpEntered) {
                showError('otp', 'Complete 6-digit key');
            } else {
                showError('password', 'Enter Key or Password');
            }
            hasError = true;
        } else if (isOtpEntered && isPasswordEntered) {
            toast.warning('Use EITHER Key OR Password');
            showError('otp', 'Use Key or Password');
            showError('password', 'Use Key or Password');
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);
        try {
            const loginData = {
                identifier,
                login_method: isPasswordEntered ? "password" : "otp",
                ...(isPasswordEntered ? { password } : { otp })
            };

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            if (response.ok && data.status === "success") {
                toast.success(data.message || "Login successful!");
                if (data.tokens) {
                    const orgIdFromResponse = data.org_ids || data.user?.org_ids;

                    if (data.tokens && orgIdFromResponse) {
                    login(data.tokens.access, data.org_ids?.[0]); // ✅ persist properly
                      navigate('/product', { replace: true });
                    } else {
                      console.error("❌ Missing org_id in login response:", data);
                      toast.error("Login failed: missing organization ID.");
                    }
                    
                }
                // Navigate to product page after successful login
                navigate('/product', { replace: true });
            } else {
                toast.error(data.message || "Login failed");
                if (data.field === 'identifier') {
                    showError('email_mobile', data.message);
                } else if (data.field === 'otp') {
                    showError('otp', data.message);
                } else if (data.field === 'password') {
                    showError('password', data.message);
                }
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        // Implement signup logic here
    };

    const setValues = () => {
        setEmailMobile("naveen.v@station-s.org");
        setPassword("123456");
    };
    

    return (
        <div id="app" className="dashboard-layout d-flex">
        <div className="login-container">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="background-image"></div>

            <div className="left-section">
                <img src={pic} alt="FACTOps Logo" className="logo_login" onError={(e) => { e.target.style.display = 'none'; console.error('Logo image not found'); }} />
                <h2 className="quote-text-final">
                    <strong>Finance and accounting solutions for <br />companies in the AI era.</strong>
                </h2>
                <div className="card-container">
                <div className="quote-wrapper">
                    {/* FACT.Inc */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Inc"><i className="bi bi-buildings"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Inc</strong><br />
                            Launch your venture seamlessly with our guided digital registration process.
                        </div>
                    </div>
                    {/* FACT.Safe */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Safe"><i className="bi bi-safe"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Safe</strong><br />
                            Your secure vault for financial documents. Organize, access, and share critical files.
                        </div>
                    </div>

                    {/* FACT.Reg */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Reg"><i className="bi bi-person-check"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Reg</strong><br />
                            Streamline customer onboarding with secure, automated identity verification.
                        </div>
                    </div>
                    
                    
                    {/* FACT.Tax */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Tax"><i className="bi bi-file-earmark-ruled"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Tax</strong><br />
                            Simplify tax compliance with automated calculations and reporting.
                        </div>
                    </div>
                    {/* FACT.Pitch */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Picth"><i className="bi bi-calculator"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Pitch</strong><br />
                            Automate accounting tasks, track finances accurately, and gain real-time clarity.
                        </div>
                    </div>
                    {/* FACT.Eval */}
                    <div className="quote-container">
                        <div className="social-icons">
                            <button className="social-btn" aria-label="FACT.Eval"><i className="bi bi-calculator"></i></button>
                        </div>
                        <div className="quote-text">
                            <strong>FACT.Eval</strong><br />
                            Automate accounting tasks, track finances accurately, and gain real-time clarity.
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="login-card">
                    {!showSignup ? (
                        <div id="login-inner-container">
                            <div className="logo-container">
                                <h1 className="logo-text">Sign <span>In</span></h1>
                            </div>
                            <form id="login-form" onSubmit={handleLogin}>
                                <div className="mb-3 email-section">
                                    <label htmlFor="email_mobile" className="form-label_login">Mobile Number or Email ID</label>
                                    <input
                                        type="text"
                                        id="email_mobile"
                                        className={`form-control ${errors.email_mobile ? 'is-invalid' : ''}`}
                                        placeholder="Enter your mobile or email"
                                        value={emailMobile}
                                        onChange={(e) => setEmailMobile(e.target.value)}
                                        required
                                    />
                                    {errors.email_mobile && <div className="error-text">{errors.email_mobile}</div>}
                                </div>

                                <div className="get-key-section">
                                    <p className="get-key-text">Get key from:</p>
                                    <div className="key-buttons">
                                        <button 
                                            type="button" 
                                            className="key-button"
                                            onClick={() => getOTP('sms')}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-chat-dots-fill"></i>
                                        </button>
                                        <button 
                                            type="button" 
                                            className="key-button"
                                            onClick={() => getOTP('email')}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-envelope-fill"></i>
                                        </button>
                                        <button 
                                            type="button" 
                                            className="key-button"
                                            onClick={() => getOTP('whatsapp')}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-whatsapp"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3 otp-section">
                                    <label className="form-label_login">Enter 6-Digit Key</label>
                                    <div className="otp-container">
                                        {otpValues.map((value, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                className={`otp-input ${errors.otp ? 'is-invalid' : ''}`}
                                                maxLength="1"
                                                value={value}
                                                data-index={index}
                                                onChange={handleOtpInput}
                                                onKeyDown={handleOtpKeydown}
                                            />
                                        ))}
                                    </div>
                                    {errors.otp && <div className="error-text">{errors.otp}</div>}
                                </div>

                                <div className="divider">OR</div>

                                <div className="mb-3 password-section">
                                    <label htmlFor="password" className="form-label_login">Password</label>
                                    <div className="password-container">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi bi-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                    {errors.password && <div className="error-text">{errors.password}</div>}
                                </div>

                                <div className="button-section">
                                    <button 
                                        type="submit" 
                                        className="login-button"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : null}
                                        Sign In
                                    </button>
                                </div>

                                <div className="forgot-password mt-3">
                                    <a href="#">Forgot Password?</a>
                                </div>

                                <div className="signup-link mt-3">
                                    <p>Don't have an account? <a href="#" onClick={() => setShowSignup(true)}>Sign Up</a></p>
                                </div>

                                <div className="mb-2">
                                    <button type="button" className="login-button_se" onClick={setValues}>
                                        pre fill
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div id="signup-container">
                            <div className="logo-container">
                                <h1 className="logo-text">Sign <span>Up</span></h1>
                            </div>
                            <form id="signup-form" onSubmit={handleSignup}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label_login">First Name</label>
                                        <input type="text" className="form-control" id="firstName" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label_login">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="mobileNumber" className="form-label_login">Mobile Number</label>
                                    <input type="tel" className="form-control" id="mobileNumber" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="emailId" className="form-label_login">Email ID</label>
                                    <input type="email" className="form-control" id="emailId" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="organization" className="form-label_login">Organization</label>
                                    <input type="text" className="form-control" id="organization" required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="signupPassword" className="form-label_login">Password</label>
                                    <div className="password-container">
                                        <input
                                            type={showSignupPassword ? "text" : "password"}
                                            className="form-control"
                                            id="signupPassword"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        >
                                            <i className={`far fa-${showSignupPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label_login">Confirm Password</label>
                                    <div className="password-container">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="form-control"
                                            id="confirmPassword"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <i className={`far fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="button-section">
                                    <button type="submit" className="login-button">Sign Up</button>
                                </div>

                                <div className="login-link mt-3">
                                    <p>Already have an account? <a href="#" onClick={() => setShowSignup(false)}>Sign In</a></p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
