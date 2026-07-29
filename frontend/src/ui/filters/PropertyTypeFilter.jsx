import React from 'react';

const OPTIONS = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'villa', label: 'Villa' }
];

/**
 * Property type multi-select filter.
 * @param {{value: string[], onChange: (next: string[]) => void}} props Component props.
 */
export function PropertyTypeFilter({ value, onChange }) {
  /** Toggle selected property type. */
  function toggle(type) {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  }

  /** Clear property type selection. */
  function clear() {
    onChange([]);
  }

  return (
    <section className="filterSection" aria-label="Property type filter">
      <div className="filterHeader">
        <h3>Property type</h3>
        <button className="linkButton" type="button" onClick={clear} disabled={value.length === 0}>
          Clear
        </button>
      </div>

      <div className="filterOptions">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="checkbox">
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
