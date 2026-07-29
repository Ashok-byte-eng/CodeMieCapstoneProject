import sqlite3 from 'sqlite3';

/**
 * Create and return a SQLite database connection.
 * @param {string} dbPath Path to the SQLite database file.
 * @returns {sqlite3.Database} sqlite3 database instance.
 */
export function openDb(dbPath) {
  sqlite3.verbose();
  return new sqlite3.Database(dbPath);
}

/**
 * Promisified wrapper for db.all.
 * @param {sqlite3.Database} db sqlite3 instance.
 * @param {string} sql SQL query.
 * @param {any[]} params Query parameters.
 * @returns {Promise<any[]>} Rows.
 */
export function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Promisified wrapper for db.get.
 * @param {sqlite3.Database} db sqlite3 instance.
 * @param {string} sql SQL query.
 * @param {any[]} params Query parameters.
 * @returns {Promise<any>} Single row.
 */
export function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/**
 * Promisified wrapper for db.exec.
 * @param {sqlite3.Database} db sqlite3 instance.
 * @param {string} sql SQL statements.
 * @returns {Promise<void>} Resolves when statements execute.
 */
export function exec(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
