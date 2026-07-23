/**
 * Authentication Configuration and Validation Service for Dashboard App
 */

// Load access codes from environment variables if present, or fallback to configured array
const ENV_ACCESS_CODES = process.env.REACT_APP_ACCESS_CODES
  ? process.env.REACT_APP_ACCESS_CODES.split(",").map(c => c.trim())
  : ["9703660750", "8639481969"];

/**
 * Validates whether the given code matches valid access codes.
 * @param {string} code 
 * @returns {boolean}
 */
export const validateAccessCode = (code) => {
  if (!code || typeof code !== "string") return false;
  const trimmed = code.trim();
  return ENV_ACCESS_CODES.includes(trimmed);
};

export const DEFAULT_ACCESS_CODES = ENV_ACCESS_CODES;
