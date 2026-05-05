/**
 * Utility functions for the application
 */

/**
 * Get color based on status
 */
export const getStatusColor = (status) => {
  const colors = {
    Good: '#10B981',
    Moderate: '#F59E0B',
    Bad: '#EF4444',
  };
  return colors[status] || '#6B7280';
};

/**
 * Get Tailwind color class based on status
 */
export const getStatusColorClass = (status) => {
  const classes = {
    Good: 'text-green-500 bg-green-50',
    Moderate: 'text-yellow-500 bg-yellow-50',
    Bad: 'text-red-500 bg-red-50',
  };
  return classes[status] || 'text-gray-500 bg-gray-50';
};

/**
 * Get glow effect class based on status
 */
export const getGlowClass = (status) => {
  const glows = {
    Good: 'shadow-lg shadow-green-500/50',
    Moderate: 'shadow-lg shadow-yellow-500/50',
    Bad: 'shadow-lg shadow-red-500/50',
  };
  return glows[status] || 'shadow-lg shadow-gray-500/50';
};

/**
 * Format timestamp to readable time
 */
export const formatTime = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Format timestamp to readable date and time
 */
export const formatDateTime = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'N/A';
  }
};
