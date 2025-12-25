/**
 * Profile Completion Utility
 * Calculates the percentage of profile completion based on filled fields
 */

/**
 * Calculate profile completion percentage
 * @param {Object} profile - User profile data
 * @returns {number} - Percentage (0-100)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  // Define fields that count towards profile completion
  const fields = [
    { key: 'name', weight: 1 },
    { key: 'bio', weight: 1 },
    { key: 'age', weight: 1 },
    { key: 'gender', weight: 1 },
    { key: 'location', weight: 1 },
    { key: 'dateOfBirth', weight: 1 },
    { key: 'lookingFor', weight: 1 },
    { key: 'interests', weight: 1, isArray: true, minLength: 3 }, // At least 3 interests
    { key: 'photos', weight: 1, isArray: true, minLength: 2 }, // At least 2 photos
    { key: 'occupation', weight: 0.5 }, // Optional but contributes
    { key: 'education', weight: 0.5 }, // Optional but contributes
    { key: 'relationshipGoals', weight: 0.5 }, // Optional but contributes
  ];

  let totalWeight = 0;
  let completedWeight = 0;

  fields.forEach(field => {
    totalWeight += field.weight;

    const value = profile[field.key];

    // Check if field is completed
    if (field.isArray) {
      // For arrays, check if it meets minimum length requirement
      if (Array.isArray(value) && value.length >= (field.minLength || 1)) {
        completedWeight += field.weight;
      }
    } else {
      // For regular fields, check if value exists and is not empty
      if (value !== null && value !== undefined && value !== '') {
        completedWeight += field.weight;
      }
    }
  });

  // Calculate percentage
  const percentage = Math.round((completedWeight / totalWeight) * 100);
  return Math.min(100, Math.max(0, percentage)); // Clamp between 0-100
};

/**
 * Get missing profile fields
 * @param {Object} profile - User profile data
 * @returns {Array} - Array of missing field names
 */
export const getMissingFields = (profile) => {
  if (!profile) return [];

  const missingFields = [];
  const fieldLabels = {
    name: 'Name',
    bio: 'Bio',
    age: 'Age',
    gender: 'Gender',
    location: 'Location',
    dateOfBirth: 'Date of Birth',
    lookingFor: 'Looking For',
    interests: 'Interests (at least 3)',
    photos: 'Photos (at least 2)',
    occupation: 'Occupation',
    education: 'Education',
    relationshipGoals: 'Relationship Goals',
  };

  // Required fields
  const requiredFields = [
    { key: 'name' },
    { key: 'bio' },
    { key: 'age' },
    { key: 'gender' },
    { key: 'location' },
    { key: 'dateOfBirth' },
    { key: 'lookingFor' },
    { key: 'interests', isArray: true, minLength: 3 },
    { key: 'photos', isArray: true, minLength: 2 },
  ];

  // Optional fields
  const optionalFields = [
    { key: 'occupation' },
    { key: 'education' },
    { key: 'relationshipGoals' },
  ];

  // Check required fields
  requiredFields.forEach(field => {
    const value = profile[field.key];
    if (field.isArray) {
      if (!Array.isArray(value) || value.length < (field.minLength || 1)) {
        missingFields.push(fieldLabels[field.key]);
      }
    } else {
      if (!value || value === '') {
        missingFields.push(fieldLabels[field.key]);
      }
    }
  });

  // Check optional fields
  optionalFields.forEach(field => {
    const value = profile[field.key];
    if (!value || value === '') {
      missingFields.push(`${fieldLabels[field.key]} (optional)`);
    }
  });

  return missingFields;
};

/**
 * Get profile completion color based on percentage
 * @param {number} percentage - Completion percentage
 * @returns {string} - Tailwind color class
 */
export const getCompletionColor = (percentage) => {
  if (percentage >= 100) return 'green';
  if (percentage >= 75) return 'blue';
  if (percentage >= 50) return 'yellow';
  return 'red';
};
