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
 * Check if alert should be sent
 * Triggers when:
 * - TVOC is Moderate or Bad AND eCO2 is Good, OR
 * - eCO2 is Moderate or Bad AND TVOC is Good
 * This covers mismatched air quality readings
 */
export const isBadStatus = (eco2Classification, tvocClassification) => {
  const eco2IsGood = eco2Classification.status === 'Good';
  const tvocIsGood = tvocClassification.status === 'Good';
  const eco2IsBadOrModerate = eco2Classification.status === 'Bad' || eco2Classification.status === 'Moderate';
  const tvocIsBadOrModerate = tvocClassification.status === 'Bad' || tvocClassification.status === 'Moderate';

  // Send alert if TVOC is bad/moderate and eCO2 is good, OR if eCO2 is bad/moderate and TVOC is good
  return (tvocIsBadOrModerate && eco2IsGood) || (eco2IsBadOrModerate && tvocIsGood);
};
