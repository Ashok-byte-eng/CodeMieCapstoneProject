import React from 'react';

const OPTIONS = [
  { value: 'wifi', label: 'Wi‑Fi' },
  { value: 'breakfast', label: 'Breakfast included' }
];

/**
 * Amenities multi-select filter.
 * @param {{value: string[], onChange: (next: string[]) => void}} props Component props.
 */
export function AmenitiesFilter({ value, onChange }) {
  /** Toggle selected amenity. */
  function toggle(amenity) {
    if (value.includes(amenity)) {
      onChange(value.filter((a) => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  }

  /** Clear amenities selection. */
  function clear() {
    onChange([]);
  }

  return (
    <section className="filterSection" aria-label="Amenities filter">
      <div className="filterHeader">
        <h3>Amenities</h3>
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
