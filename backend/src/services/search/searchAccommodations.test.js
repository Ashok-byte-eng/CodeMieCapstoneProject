import test from 'node:test';
import assert from 'node:assert/strict';
import { openDb, exec } from '../../db/sqlite.js';
import { searchAccommodations } from './searchAccommodations.js';

/**
 * Create an in-memory test database with minimal schema + data.
 * @returns {import('sqlite3').Database} db
 */
function createTestDb() {
  const db = openDb(':memory:');
  const schema = `
    CREATE TABLE accommodations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      destination TEXT NOT NULL,
      propertyType TEXT NOT NULL,
      pricePerNight INTEGER NOT NULL,
      maxPassengers INTEGER NOT NULL,
      reviewScore REAL
    );
    CREATE TABLE accommodation_amenities (
      accommodationId INTEGER NOT NULL,
      amenity TEXT NOT NULL
    );
  `;
  return { db, schema };
}

test('searchAccommodations applies amenities AND logic', async () => {
  const { db, schema } = createTestDb();
  await exec(db, schema);
  await exec(
    db,
    `
    INSERT INTO accommodations(id,name,destination,propertyType,pricePerNight,maxPassengers,reviewScore)
    VALUES (1,'A','Goa','hotel',100,2,8.5),(2,'B','Goa','hotel',120,2,9.2);
    INSERT INTO accommodation_amenities(accommodationId,amenity) VALUES
      (1,'wifi'),(1,'breakfast'),(2,'wifi');
    `
  );

  const res = await searchAccommodations(db, {
    destination: 'Goa',
    passengers: 2,
    amenities: ['wifi', 'breakfast'],
    propertyTypes: [],
    reviewScoreGte: undefined,
    page: 1,
    pageSize: 10,
    sort: 'price_asc'
  });

  assert.equal(res.total, 1);
  assert.equal(res.items[0].id, 1);
  db.close();
});

test('searchAccommodations excludes unrated when reviewScoreGte is set', async () => {
  const { db, schema } = createTestDb();
  await exec(db, schema);
  await exec(
    db,
    `
    INSERT INTO accommodations(id,name,destination,propertyType,pricePerNight,maxPassengers,reviewScore)
    VALUES (1,'A','Goa','hotel',100,2,NULL),(2,'B','Goa','hotel',120,2,7.0);
    `
  );

  const res = await searchAccommodations(db, {
    destination: 'Goa',
    passengers: 2,
    amenities: [],
    propertyTypes: [],
    reviewScoreGte: 7,
    page: 1,
    pageSize: 10,
    sort: 'price_asc'
  });

  assert.equal(res.total, 1);
  assert.equal(res.items[0].id, 2);
  db.close();
});
