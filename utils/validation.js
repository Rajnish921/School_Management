/**
 * Simple validation functions
 */

// Validate school data (POST /addSchool)
function validateSchoolData(data) {
  const { name, address, latitude, longitude } = data;
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required");
  }

  if (!address || address.trim() === "") {
    errors.push("Address is required");
  }

  if (
    latitude === undefined ||
    isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.push("Latitude must be between -90 and 90");
  }

  if (
    longitude === undefined ||
    isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.push("Longitude must be between -180 and 180");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate coordinates (GET /listSchools)
function validateCoordinates(latitude, longitude) {
  const errors = [];

  if (
    latitude === undefined ||
    isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.push("Invalid latitude");
  }

  if (
    longitude === undefined ||
    isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.push("Invalid longitude");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateSchoolData,
  validateCoordinates,
};
