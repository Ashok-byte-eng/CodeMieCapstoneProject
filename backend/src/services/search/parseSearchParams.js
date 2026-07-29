/**
 * Parse comma-separated list from query param.
 * @param {unknown} value Raw query string.
 * @returns {string[]} List of trimmed values.
 */
function parseCsv(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((v) => String(v).split(',').map((x) => x.trim()).filter(Boolean));
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Parse optional integer query parameter.
 * @param {unknown} value Raw query value.
 * @param {number|undefined} defaultValue Default.
 * @returns {number|undefined} Parsed integer.
 */
function parseIntParam(value, defaultValue) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`Invalid integer: ${value}`);
  return n;
}

/**
 * Parse search params from the request query object.
 * @param {Record<string, unknown>} query Express query object.
 * @returns {object} Normalized parameters.
 */
export function parseSearchParams(query) {
  const amenities = parseCsv(query.amenities);
  const propertyTypes = parseCsv(query.propertyTypes);

  const reviewScoreGteRaw = query.reviewScoreGte;
  const reviewScoreGte = reviewScoreGteRaw === undefined || reviewScoreGteRaw === null || reviewScoreGteRaw === ''
    ? undefined
    : Number(reviewScoreGteRaw);

  if (reviewScoreGte !== undefined && ![7, 8, 9].includes(reviewScoreGte)) {
    throw new Error('reviewScoreGte must be one of 7, 8, 9');
  }

  const page = parseIntParam(query.page, 1);
  const pageSize = parseIntParam(query.pageSize, 10);

  const sort = query.sort ? String(query.sort) : 'price_asc';
  const allowedSort = ['price_asc', 'price_desc', 'review_desc'];
  if (!allowedSort.includes(sort)) throw new Error(`sort must be one of ${allowedSort.join(', ')}`);

  return {
    destination: query.destination ? String(query.destination) : undefined,
    startDate: query.startDate ? String(query.startDate) : undefined,
    endDate: query.endDate ? String(query.endDate) : undefined,
    passengers: query.passengers ? Number(query.passengers) : undefined,
    amenities,
    propertyTypes,
    reviewScoreGte,
    page,
    pageSize,
    sort
  };
}
