import React from 'react';

const OPTIONS = [
  { value: '', label: 'Any' },
  { value: '9', label: '9+ (Wonderful)' },
  { value: '8', label: '8+ (Very good)' },
  { value: '7', label: '7+ (Good)' }
];

/**
 * Review score threshold filter.
 * @param {{value: string, onChange: (next: string) => void}} props Component props.
 */
export function ReviewScoreFilter({ value, onChange }) {
  /** Clear review score threshold. */
  function clear() {
    onChange('');
  }

  return (
    <section className="filterSection" aria-label="Review score filter">
      <div className="filterHeader">
        <h3>Review score</h3>
        <button className="linkButton" type="button" onClick={clear} disabled={!value}>
          Clear
        </button>
      </div>

      <div className="filterOptions">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="hint">Unrated stays are excluded when a threshold is selected.</p>
      </div>
    </section>
  );
}
