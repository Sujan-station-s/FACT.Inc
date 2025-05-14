const COMPANY_NAME_KEY = 'company_name';

// ✅ Set company name in localStorage
export const setCompanyName = (name) => {
  localStorage.setItem(COMPANY_NAME_KEY, name);
};

// ✅ Get company name from localStorage
export const getCompanyName = () => {
  return localStorage.getItem(COMPANY_NAME_KEY) || '';
};

// ✅ Clear company name from localStorage
export const clearCompanyName = () => {
  localStorage.removeItem(COMPANY_NAME_KEY);
};

