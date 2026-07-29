# CodeMieCapstoneProject

Travel accommodation search app with advanced filters (Amenities, Property Type, Review Score).

## Prerequisites
- Node.js 18+
- npm 9+

## Project structure
- `frontend/` React UI
- `backend/` Node.js/Express API
- `database/` SQLite scripts

## Quick start

### 1) Setup database
```bash
cd database
sqlite3 ./accommodations.db < ./schema.sql
sqlite3 ./accommodations.db < ./seed.sql
```

### 2) Run backend
```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run dev
```
Backend runs on `http://localhost:4000`.

### 3) Run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## API

### GET /api/search
Query params:
- `destination` (string, optional)
- `startDate` (YYYY-MM-DD, optional)
- `endDate` (YYYY-MM-DD, optional)
- `passengers` (number, optional)
- `amenities` (comma-separated: `wifi,breakfast`)
- `propertyTypes` (comma-separated: `hotel,villa`)
- `reviewScoreGte` (number: `7|8|9`)
- `page` (number, default 1)
- `pageSize` (number, default 10)
- `sort` (string, default `price_asc`; supported: `price_asc,price_desc,review_desc`)

Examples:
```bash
curl "http://localhost:4000/api/search?destination=Goa&amenities=wifi,breakfast&propertyTypes=hotel&reviewScoreGte=8"
```

## Advanced Filters feature
Implemented per Jira Epic **EPMCDMETST-56740**.

### Filter logic
- AND across categories.
- Amenities are ANDed (property must include all selected).
- Property types are ORed.
- Review score is a single threshold; unrated properties are excluded when set.

## Scripts
- Backend: `npm run dev` (nodemon), `npm test`
- Frontend: `npm run dev`

