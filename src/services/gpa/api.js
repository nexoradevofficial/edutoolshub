/**
 * Future REST API contract for GPA service.
 * Frontend uses calculator.js directly today; swap to fetch() when backend ships.
 */

export const GPA_API_ROUTES = {
  listCountries: "/api/v1/gpa/countries",
  getSettings: "/api/v1/gpa/settings/:countryCode",
  calculate: "/api/v1/gpa/calculate",
};

/**
 * Expected request body for POST /api/v1/gpa/calculate
 * @typedef {Object} GpaCalculateRequest
 * @property {string} countryCode
 * @property {'weighted'|'unweighted'} gpaType
 * @property {number} [customScaleMax] - School scale maximum (e.g. 4, 4.33, 5, 7)
 * @property {Array<{ name: string, grade: string, credits: number, isAdvanced?: boolean }>} courses
 */

/**
 * Expected response shape from POST /api/v1/gpa/calculate
 * @typedef {Object} GpaCalculateResponse
 * @property {boolean} success
 * @property {string|null} gpa
 * @property {number} scaleMax
 * @property {string} countryCode
 * @property {string} gpaType
 * @property {number} totalCredits
 * @property {number} courseCount
 * @property {string} [error]
 * @property {string} [message]
 */

export async function fetchGpaCalculate(payload) {
  const res = await fetch(GPA_API_ROUTES.calculate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("GPA calculation failed");
  return res.json();
}

export async function fetchGpaCountries() {
  const res = await fetch(GPA_API_ROUTES.listCountries);
  if (!res.ok) throw new Error("Failed to load countries");
  return res.json();
}
