/**
 * Air Quality Classification
 * Classifies eCO2 and TVOC levels with status and color
 */

export const classifyECO2 = (value) => {
  if (value < 800) {
    return {
      status: 'Good',
      color: '#10B981', // Green
      label: 'GOOD',
    };
  } else if (value <= 1500) {
    return {
      status: 'Moderate',
      color: '#F59E0B', // Yellow
      label: 'MODERATE',
    };
  } else {
    return {
      status: 'Bad',
      color: '#EF4444', // Red
      label: 'BAD',
    };
  }
};

export const classifyTVOC = (value) => {
  if (value < 220) {
    return {
      status: 'Good',
      color: '#10B981', // Green
      label: 'GOOD',
    };
  } else if (value <= 660) {
    return {
      status: 'Moderate',
      color: '#F59E0B', // Yellow
      label: 'MODERATE',
    };
  } else {
    return {
      status: 'Bad',
      color: '#EF4444', // Red
      label: 'BAD',
    };
  }
};

/**
 * Check if any reading is in BAD status
 * Used for triggering notifications
 */
export const isBadStatus = (eco2Classification, tvocClassification) => {
  return eco2Classification.status === 'Bad' || tvocClassification.status === 'Bad';
};
