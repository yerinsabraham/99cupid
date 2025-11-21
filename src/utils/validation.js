/**
 * Email Validation
 * Validates email format and presence
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
};

/**
 * Password Validation
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number'
    };
  }
  return { valid: true };
};

/**
 * Display Name Validation
 * Requires: 2-50 characters
 */
export const validateDisplayName = (name) => {
  if (!name) return { valid: false, message: 'Name is required' };
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  if (name.length > 50) {
    return { valid: false, message: 'Name must be less than 50 characters' };
  }
  if (!/^[a-zA-Z\s'-]*$/.test(name)) {
    return {
      valid: false,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    };
  }
  return { valid: true };
};

/**
 * Password match validation
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true };
};

/**
 * Validate all form fields
 */
export const validateForm = (fields, validators) => {
  const errors = {};
  
  for (const [field, validator] of Object.entries(validators)) {
    const result = validator(fields[field]);
    if (!result.valid) {
      errors[field] = result.message;
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
