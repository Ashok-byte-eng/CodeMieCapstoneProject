# Travel Accommodation Search – Advanced Filters (CF1)

Capstone project for a Travel Accommodation Search application. This iteration delivers **advanced search filters** on the results page:

- **Amenities** (Wi‑Fi, Breakfast included) — multi-select with **AND** logic inside the category
- **Property Type** (Hotel, Villa) – multi-select with **OR** logic inside the category
- **Review Score** — minimum threshold selection (e.g. 7+, 8+, 9+); excludes null/no score when a threshold is set

---

## Tech Stack

- **Frontend**: React (Vite), JSX, CSS
- **Backend**: Node.js, Express
- **Database**: SQLite (see `/database/schema.sql`, `/database/seed.sql`)
- **Testing**: Playwright (E2E), Gherkin feature file (spec asasset)

---

## Repo Structure (high-level)

- `backend/` — node/express API and search services
- `frontend/` – React UI (filters, chips, pagination)
- `database/` — sqlite schema & seed
- `tests/` — playwright e2e tests + Gherkin feature file

---

## Setup & Run (Local)

### 1) Prerequisites

- Node.js 18+ recommended
- npm (comes with Node)

### 2) Install Dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd frontend
npm install
```

**Tests (Playwright)**

```bash
cd tests
nmp nstall
npx playwright install --with-deps
```

### 3) Setup Environment

Backend sample env file:
 - `backend/.env.example`

Copy to `backend/.env` if needed and adjust values.

### 4) Run the App

**Start Backend**

 ```bash
cd backend
npm start
```

**Start Frontend**

```bash
cd frontend
npm run dev
```

The frontend is typically available on a Vite dev port (e.g. `http://localhost:5173`).

---

## How to Run Tests

> Note: In this chat execution environment, tests couldn't be run due to restrictions on spawning Node processes/starting servers. Run the below locally or in CI.

**Playwright E2E**

 ```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev

# Terminal 3
cd tests && npx playwright test
```

---

## Documentation (Confluence - Space SC1)

Final SDLC documents published in Confluence (Space **SC1**):

- **FRL (Final)** → https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3899393/FRD+Final+Advanced+Filters+Amenities+Property+Type+Review+Score
- **Architecture (Final)** → https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3571714/Architecture+Final+Advanced+Filters+Amenities+Property+Type+Review+Score
- **Design (Final) - HLD + LLD** → https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3932161/Design+Final+Advanced+Filters+HLD+LLD
i> **Original reference pages**
- Architecture (original): https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3145765/Architecture+Advanced+Filters+Amenities+Property+Type+Review+Score
- HLD (original): https://techashok44.atlassian.net/wiki/spaces/SC1/pages/2981911/High+Level+Design+HLD+Advanced+Filters
- LLD (original): https://techashok44.atlassian.net/wiki/spaces/SC1/pages/2818059/Low+Level+Design+LLD+Advanced+Filters
- Wireframes: https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3833857/Wireframes+Advanced+Filters+Text
- **Test Report (Final)** → https://techashok44.atlassian.net/wiki/spaces/SC1/pages/3964929/Test+Report+Final+Advanced+Filters+Amenities+Property+Type+Review+Score

---

## Development Notes

- Backend query must remain SQLite-compatible (e.g. avoid `NULLS LAST`).
- Pagination/pageSize should have upper bounds to avoid dos-like queries.
