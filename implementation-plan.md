# Implementation Plan: Advanced Filters for Travel Accommodation Search

Repo: https://github.com/Ashok-byte-eng/CodeMieCapstoneProject
Branch: `feature/advanced-filters-implementation-plan`

Scope (Jira User Stories):
- **EPMCDMETST-57128** — Amenities filter (Wi‑Fi, Breakfast included)
- **EPMCDMETST-57129** — Property Type filter (Hotel, Villa)
- **EPMCDMETST-57130** — Review Score threshold filter (9+, 8+, 7+)

Point scale: Fibonacci (1, 2, 3, 5, 8).

Assumptions:
- Current search already supports destination, travel dates, passengers, sorting and pagination.
- Filters are combinable: **AND across categories**; within category: **Amenities = AND**, **Property Type = OR**, **Review Score = single threshold**.
- When Review Score threshold is set, **unrated (null score) properties are excluded**.

---

## 1) Phase breakdown

### Phase A — Analysis

| ID | Task | Owner | SP | Dependencies / Risks | Deliverables |
|---|---|---|---:|---|---|
| A1 | Review current search API + FE flow (query params, pagination/sort, state persistence) | TL, FE, BE | 3 | Risk: URL/state handling is inconsistent | Current-state tech note + param inventory |
| A2 | Data audit: confirm data model contains amenities, propertyType, reviewScore (nullable) and their sources | BE, Data Eng | 2 | Risk: missing/inconsistent supplier data | Field mapping doc + gap list |
| A3 | Agree filter behavior: multi-select logic, unrated exclusion, empty state copy, clear-all behavior | PO, UX, TL | 3 | Dep: A1/A2 | Refined AC checklist |
| A4 | Testing approach: define minimal combination matrix and what is automated (unit/integration/e2e) | QA, TL | 2 | Risk: combinatorial explosion | Test matrix + automation scope |

**Definition of Done (Analysis)**
- Current search behavior documented (including sorting/pagination and state persistence).
- Data availability confirmed or gaps captured with follow-ups.

---

### Phase B — Design

| ID | Task | Owner | SP | Dependencies / Risks | Deliverables |
|---|---|------:|---|---|
| B1 | UX/UI design for filter panel sections, chips, clear-all, empty state, a11y requirements | UX, FE | 5 | Risk: component library constraints | Wireframes/spec |
| B2 | API contract design for filters (query params + validation rules) | BE, TL | 3 | Dep: A3 | OpenAPI/Postman spec + examples |
| B3 | BE query/index design for applying filters efficiently | BE, Data Eng | 3 | Risk: slow queries without indexes | Index/query plan |
| B4 | FE architecture: filter state management and URL sync approach (apply vs live, debounce) | FE, TL | 3 | Dep: A1 | State diagram + implementation approach |

**Definition of Done (Design)**
- UX spec approved.
- API contract reviewed and version/backward compatibility plan agreed.
- Query/index approach documented.

---

### Phase C — Development

| ID | Task | Owner | SP | Dependencies / Risks | Deliverables |
|---|---|---:|---|---|
| C1 | BE: parse/validate new filter params (amenities, propertyType, reviewScoreGte) | BE | 5 | Dep: B2 | Updated controller/service param parsing |
| C2 | BE: extend search query builder + add/adjust DB indexes if needed | BE, Data Eng | 8 | Dep: B3/C1 | Filtered queries + migrations (if any) |
| C3 | FE: implement filter UI (Amenities multi-select, Property Type multi-select, Review Score threshold, Clear All) | FE | 8 | Dep: B1 | Filter panel components |
| C4 | FE: wire filters to API + URL sync and persistence across sorting/pagination | FE | 5 | Dep: B4/C3/C1 | URL state + refetch logic |
| C5 | FE: results behavior (empty state with clear-filters action, chips for applied filters) | FE | 3 | Dep: B1/C3 | Empty state + chips |

**Definition of Done (Development)**
- All 3 filters work end-to-end in dev environment.
- Filters persist across sorting/pagination via URL or equivalent state mechanism.
- Empty state and clear-all behavior implemented.

---

### Phase D — Testing

| ID | Task | Owner | SP | Dependencies / Risks | Deliverables |
|---|---|---:|---|---|
| D1 | BE unit tests: parsing + filter logic (AND amenities, OR property types, reviewScoreGte excludes null) | BE, TL | 3 | Dep: C1/C2 | CI unit coverage |
| D2 | BE integration tests for search endpoint incl. empty results | BE, QA | 3 | Dep: C2 | Integration suite |
| D3 | FE component tests for filter UI (select/clear/clear-all) | FE, QA | 3 | Dep: C3 | Component tests |
| D4 | E2E tests (Cypress/Playwright): each filter + combinations + persistence + empty state | QA, FE | 8 | Dep: C4/C5 | E2E suite in CI (smoke + full) |
| D5 | Non-functional checks: perf smoke (API latency with filters), a11y pass (form controls) | QA, TL | 3 | Risk: perf regressions | Perf notes + a11y report |

**Definition of Done (Testing)**
- Unit/integration tests green in CI.
- E2E smoke passes on staging.
- Perf and a11y checks completed with no P1 issues.

---

### Phase E — Deployment

| ID | Task | Owner | SP | Dependencies / Risks | Deliverables |
|---|---|---:|---|---|
| E1 | Add feature flags for filter UI + backend param handling (safe rollout) | TL, BE, FE | 3 | Dep: C1–C5 | Flag config + docs |
| E2 | Staging deploy + smoke verification (including migrations if any) | Ops, QA | 3 | Risk: migration downtime | Staging release notes + smoke results |
| E3 | Prod deploy with gradual rollout (canary) + monitoring + rollback plan | Ops, TL | 3 | Dep: E2 | Release plan + monitoring checklist |

**Definition of Done (Deployment)**
- Feature flags verified on staging.
- Prod rollout completed (canary → full) with monitoring green and rollback documented.

---

## 2) Two-sprint plan (covers all 3 stories)

Recommended cadence: 2 sprints × 2 weeks.

### Sprint 1 — Foundation + Amenities (EPMCDMETST-57128)
**Sprint goal:** deliver Amenities filter end-to-end and establish shared filter architecture.

Planned scope:
- Analysis/Design: A1–A3, B2–B4 (B1 can start in parallel)
- Development: C1 (partial), C2 (amenities logic), C3 (amenities UI), C4 (URL sync baseline)
- Testing: D1/D3 for amenities + light E2E smoke for persistence (subset of D4)

Exit criteria:
- Amenities filter shipped behind feature flag to staging; QA sign-off for story 57128.

### Sprint 2 — Property Type + Review Score + hardening/release (EPMCDMETST-57129, EPMCDMETST-57130)
**Sprint goal:** deliver remaining filters, full regression automation, and production-ready rollout.

Planned scope:
- Design: finalize B1 (if not done)
- Development: extend C2 for propertyType + reviewScore; complete C3/C5 for remaining UI/UX
- Testing: complete D2–D5 and full D4 suite
- Deployment: E1–E3

Exit criteria:
- Stories 57129 and 57130 accepted; prod rollout completed or ready per release window.

---

## 3) Effort estimates (story points)

Story roll-up (approx.):
- **EPMCDMETST-57128 (Amenities):** ~20 SP
- **EPMCDMETST-57129 (Property Type):** ~13 SP
- **EPMCDMETST-57130 (Review Score):** ~15 SP

Total (plan-level, incl. deployment/testing hardening): ~55 SP across FE/BE/QA/Ops.

---

## 4) Dependencies & risks

### Key dependencies
- Data availability and consistency for amenities/reviewScore (A2).
- API contract alignment between FE and BE (B2).
- URL state mechanism must not break existing links/SEO or sorting/pagination (A1/B4).

### Major risks & mitigations
- **Search performance regressions** with new filters → mitigate with indexes/query plan (B3) and perf smoke tests (D5).
- **Combinatorial testing explosion** → mitigate with prioritized test matrix (A4) + E2E smoke/full split (D4).
- **Supplier data quality gaps** → mitigate via whitelisting/normalization and clear behavior for missing values (A2/A3).

---

## 5) Definition of Done (per phase)

- **Analysis DoD:** current behavior documented; data audit completed; filter logic agreed.
- **Design DoD:** UX spec approved; API spec approved; query/index plan documented.
- **Development DoD:** all 3 filters functional end-to-end; persistence works; empty state + clear-all present.
- **Testing DoD:** CI green; E2E smoke on staging; perf/a11y checks done; no P1 defects open.
- **Deployment DoD:** feature-flagged rollout completed; monitoring/rollback documented; release notes published.
