/**
 * Read current filters from the URL query string.
 * @param {string} search window.location.search
 * @returns {object} Filters.
 */
export function readFiltersFromUrl(search) {
  const params = new URLSearchParams(search);

  /** Parse comma separated param to array. */
  function csvToArray(key) {
    const v = params.get(key);
    if (!v) return [];
    return v.split(',').map((x) => x.trim()).filter(Boolean);
  }

  return {
    destination: params.get('destination') || '',
    startDate: params.get('startDate') || '',
    endDate: params.get('endDate') || '',
    passengers: params.get('passengers') || '',
    amenities: csvToArray('amenities'),
    propertyTypes: csvToArray('propertyTypes'),
    reviewScoreGte: params.get('reviewScoreGte') || '',
    page: Number(params.get('page') || 1),
    pageSize: Number(params.get('pageSize') || 10),
    sort: params.get('sort') || 'price_asc'
  };
}

/**
 * Write current filters into the URL without reloading the page.
 * @param {object} filters Filters state.
 */
export function writeFiltersToUrl(filters) {
  const params = new URLSearchParams();

  /** Set param only if it has value. */
  function setIf(key, val) {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val));
  }

  setIf('destination', filters.destination);
  setIf('startDate', filters.startDate);
  setIf('endDate', filters.endDate);
  setIf('passengers', filters.passengers);

  if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
  if (filters.propertyTypes?.length) params.set('propertyTypes', filters.propertyTypes.join(','));
  setIf('reviewScoreGte', filters.reviewScoreGte);

  setIf('page', filters.page);
  setIf('pageSize', filters.pageSize);
  setIf('sort', filters.sort);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', nextUrl);
}

/**
 * Build fetch URL including query string.
 * @param {string} base Base path.
 * @param {object} filters Filters state.
 * @returns {string} URL.
 */
export function buildSearchUrl(base, filters) {
  const params = new URLSearchParams();

  /** Helper to set only non-empty params. */
  function setIf(key, val) {
    if (val !== undefined && val !== null && val !== '') params.set(key, String(val));
  }

  setIf('destination', filters.destination);
  setIf('startDate', filters.startDate);
  setIf('endDate', filters.endDate);
  setIf('passengers', filters.passengers);

  if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
  if (filters.propertyTypes?.length) params.set('propertyTypes', filters.propertyTypes.join(','));
  setIf('reviewScoreGte', filters.reviewScoreGte);

  setIf('page', filters.page);
  setIf('pageSize', filters.pageSize);
  setIf('sort', filters.sort);

  return `${base}?${params.toString()}`;
}
