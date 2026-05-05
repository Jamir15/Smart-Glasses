/**
 * In-memory Data Store
 * Stores latest sensor readings with timestamp
 * In production, this would use a database (MongoDB, PostgreSQL, etc.)
 */

let latestData = {
  eco2: null,
  tvoc: null,
  timestamp: null,
  eco2Classification: null,
  tvocClassification: null,
};

export const setLatestData = (data) => {
  latestData = data;
};

export const getLatestData = () => latestData;

export const isDataEmpty = () => latestData.eco2 === null || latestData.tvoc === null;
