import { all, get } from '../../db/sqlite.js';

/**
 * Build WHERE clauses and params for search filters.
 * @param {object} params Normalized search params.
 * @returns {{ whereSql: string, sqlParams: any[] }} SQL fragments.
 */
function buildWhere(params) {
  const clauses = [];
  const sqlParams = [];

  if (params.destination) {
    clauses.push('a.destination LIKE ?');
    sqlParams.push(`%${params.destination}%`);
  }

  if (params.passengers !== undefined && !Number.isNaN(params.passengers)) {
    clauses.push('a.maxPassengers >= ?');
    sqlParams.push(params.passengers);
  }

  // Property type OR logic
  if (params.propertyTypes && params.propertyTypes.length > 0) {
    clauses.push(`a.propertyType IN (${params.propertyTypes.map(() => '?').join(',')})`);
    sqlParams.push(...params.propertyTypes);
  }

  // Review score threshold; exclude unrated (NULL) when threshold is set
  if (params.reviewScoreGte !== undefined) {
    clauses.push('a.reviewScore IS NOT NULL AND a.reviewScore >= ?');
    sqlParams.push(params.reviewScoreGte);
  }

  // Amenities AND logic using EXISTS subqueries
  if (params.amenities && params.amenities.length > 0) {
    for (const amenity of params.amenities) {
      clauses.push(
        'EXISTS (SELECT 1 FROM accommodation_amenities aa WHERE aa.accommodationId = a.id AND aa.amenity = ?)' 
      );
      sqlParams.push(amenity);
    }
  }

  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  return { whereSql, sqlParams };
}

/**
 * Build ORDER BY clause.
 * @param {string} sort Sort key.
 * @returns {string} ORDER BY clause.
 */
function buildOrderBy(sort) {
  if (sort === 'price_desc') return 'ORDER BY a.pricePerNight DESC';
  if (sort === 'review_desc') return 'ORDER BY a.reviewScore DESC NULLS LAST';
  return 'ORDER BY a.pricePerNight ASC';
}

/**
 * Search accommodations in SQLite with pagination and advanced filters.
 * @param {import('sqlite3').Database} db sqlite3 instance.
 * @param {object} params Normalized search params.
 * @returns {Promise<{items:any[], page:number, pageSize:number, total:number}>} Search response.
 */
export async function searchAccommodations(db, params) {
  const { whereSql, sqlParams } = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const offset = (params.page - 1) * params.pageSize;

  const totalRow = await get(
    db,
    `SELECT COUNT(*) as total FROM accommodations a ${whereSql}`,
    sqlParams
  );

  const rows = await all(
    db,
    `SELECT a.*
     FROM accommodations a
     ${whereSql}
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [...sqlParams, params.pageSize, offset]
  );

  return {
    items: rows,
    page: params.page,
    pageSize: params.pageSize,
    total: totalRow?.total ?? 0
  };
}
