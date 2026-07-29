import React, { useEffect, useMemo, useState } from 'react';
import { AmenitiesFilter } from '../ui/filters/AmenitiesFilter.jsx';
import { PropertyTypeFilter } from '../ui/filters/PropertyTypeFilter.jsx';
import { ReviewScoreFilter } from '../ui/filters/ReviewScoreFilter.jsx';
import { buildSearchUrl, readFiltersFromUrl, writeFiltersToUrl } from '../ui/urlState.js';

/**
 * Root page: search results with advanced filters.
 */
export default function App() {
  const [filters, setFilters] = useState(() => readFiltersFromUrl(window.location.search));
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasAnyAdvancedFilter = useMemo(() => {
    return (filters.amenities?.length ?? 0) > 0 || (filters.propertyTypes?.length ?? 0) > 0 || !!filters.reviewScoreGte;
  }, [filters]);

  /**
   * Fetch results whenever filters change, and persist filters to URL.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchResults() {
      setLoading(true);
      setError('');
      try {
        writeFiltersToUrl(filters);
        const url = buildSearchUrl('/api/search', filters);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
    return () => controller.abort();
  }, [filters]);

  /** Clear all filters and reset to first page. */
  function handleClearAll() {
    setFilters({
      destination: '',
      startDate: '',
      endDate: '',
      passengers: '',
      amenities: [],
      propertyTypes: [],
      reviewScoreGte: '',
      page: 1,
      pageSize: 10,
      sort: 'price_asc'
    });
  }

  /** Update pagination page while keeping filters intact. */
  function setPage(nextPage) {
    setFilters((prev) => ({ ...prev, page: nextPage }));
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Accommodation Search</h1>
      </header>

      <div className="layout">
        <aside className="filters">
          <div className="filtersHeader">
            <h2>Filters</h2>
            <button className="linkButton" type="button" onClick={handleClearAll}>
              Clear all
            </button>
          </div>

          <AmenitiesFilter
            value={filters.amenities}
            onChange={(amenities) => setFilters((p) => ({ ...p, amenities, page: 1 }))}
          />

          <PropertyTypeFilter
            value={filters.propertyTypes}
            onChange={(propertyTypes) => setFilters((p) => ({ ...p, propertyTypes, page: 1 }))}
          />

          <ReviewScoreFilter
            value={filters.reviewScoreGte}
            onChange={(reviewScoreGte) => setFilters((p) => ({ ...p, reviewScoreGte, page: 1 }))}
          />
        </aside>

        <main className="results">
          <div className="resultsHeader">
            <div className="meta">
              {loading ? 'Loading…' : `${data.total} stays found`}
              {error ? <span className="error"> — {error}</span> : null}
            </div>

            <label className="sort">
              Sort
              <select
                value={filters.sort}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))}
              >
                <option value="price_asc">Price (low → high)</option>
                <option value="price_desc">Price (high → low)</option>
                <option value="review_desc">Review score (high → low)</option>
              </select>
            </label>
          </div>

          {(!loading && data.items.length === 0) ? (
            <div className="empty">
              <h3>No results match your filters</h3>
              <p>Try clearing some filters to see more stays.</p>
              {hasAnyAdvancedFilter ? (
                <button className="primary" type="button" onClick={handleClearAll}>
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="cards">
              {data.items.map((item) => (
                <li key={item.id} className="card">
                  <div className="cardTitle">{item.name}</div>
                  <div className="cardBody">
                    <div>Destination: {item.destination}</div>
                    <div>Type: {item.propertyType}</div>
                    <div>Max passengers: {item.maxPassengers}</div>
                    <div>Price/night: ${item.pricePerNight}</div>
                    <div>Review: {item.reviewScore ?? 'Unrated'}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="pagination">
            <button
              type="button"
              disabled={filters.page <= 1 || loading}
              onClick={() => setPage(filters.page - 1)}
            >
              Prev
            </button>
            <span>
              Page {filters.page}
            </span>
            <button
              type="button"
              disabled={loading || (filters.page * filters.pageSize) >= data.total}
              onClick={() => setPage(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
