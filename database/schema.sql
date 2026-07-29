PRAGMA foreign_keys = ON;

-- Accommodations table stores core searchable fields.
CREATE TABLE IF NOT EXISTS accommodations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  propertyType TEXT NOT NULL CHECK (propertyType IN ('hotel','villa')),
  pricePerNight INTEGER NOT NULL,
  maxPassengers INTEGER NOT NULL,
  reviewScore REAL NULL
);

-- Many-to-many relation: each accommodation can have multiple amenities.
CREATE TABLE IF NOT EXISTS accommodation_amenities (
  accommodationId INTEGER NOT NULL,
  amenity TEXT NOT NULL CHECK (amenity IN ('wifi','breakfast')),
  PRIMARY KEY (accommodationId, amenity),
  FOREIGN KEY (accommodationId) REFERENCES accommodations(id) ON DELETE CASCADE
);

-- Indexes to support filtering and sorting efficiently.
CREATE INDEX IF NOT EXISTS idx_accommodations_destination ON accommodations(destination);
CREATE INDEX IF NOT EXISTS idx_accommodations_propertyType ON accommodations(propertyType);
CREATE INDEX IF NOT EXISTS idx_accommodations_reviewScore ON accommodations(reviewScore);
CREATE INDEX IF NOT EXISTS idx_accommodations_price ON accommodations(pricePerNight);
CREATE INDEX IF NOT EXISTS idx_amenities_amenity ON accommodation_amenities(amenity);
