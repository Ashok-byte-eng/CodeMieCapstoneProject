# Implementation Plan: Advanced Filters (Amenities, Property Type, Review Score)

Below plan is based on Jira User Stories for the travel accommodation search application's advanced filters:
- **EPMCDMETST-57138** — Amenities filter (Wi‑Fi, Breakfast included)
  - **EPMCDMETST-57139** — Backend task: support filtering by amenities
  - **EPMCDMETST-57140** — QA task: verify Amenities filter scenarios
- **EPMCDMETST-57141** — Property Type filter (Hotel, Villa)
  - **EPMCDMETST-57142** — Backend task: support filtering by property type
  - **EPMCDMETST-57143** — UI task: add Property Type filter controls
  - **EPMCDMETST-57144** — QA task: verify Property Type filter scenarios
- **EPMCDMETST-57145** — Review Score filter (threshold: 9+, 8+, 7+)
  - **EPMCDMETST-57146** — Backend task: support filtering by review score
  - **EPMCDMETST-57147** — UI task: add Review Score filter controls
  - **EPMCDMETST-57148** — QA task: verify Review Score filter scenarios

Repo: https://github.com/Ashok-byte-eng/CodeMieCapstoneProject  
Branch: `feature/advanced-filters-implementation-plan`

Point scale: Fibonacci (1, 2, 3, 5, 8, 13).

Assumptions / Principles
- Existing search supports destination, dates, passengers, sorting, and pagination.
- Filters are combinable with clear logic:
  - **AND across categories**: amenities & propertyType & reviewScore all apply together.
  - **Amenities = AND within category** (property must match all selected amenities).
  - **Property Type = OR within category** (hotel OR villa).
  - **Review Score = single threshold** (e.g., 8+).
- When a review score threshold is applied, properties with `null`/no score are **excluded**.
- Filter state persists across pagination and sorting (preferably via URL query params).
- When filters yield no results, user sees an empty state with a clear-filters action.

---

## 1) Phase breakdown (Analysis, Design, Development, Testing, Deployment)

### Phase 1 — Analysis

**Milestone:** Requirements clarified + feasibility confirmed + test strategy outlined.

| Task ID | Task | Owner(s) | Est. (SP) | Outputs | Notes / Jira linkage |
|---|---|---|---:|---|---|
| A1 | Review current search flow: request/response, pagination, sorting, URL params, caching | Tech Lead (TL), FE, BE | 3 | “Current state” doc (params, endpoints, state mgmt) | Impacts persistence requirement (all stories) |
| A2 | Data audit: confirm `amenities[]`, `propertyType`, `reviewScore` (nullable) in API/DB; identify normalization needs | BE, Data/DB | 3 | Field mapping + gap list | Drives BE feasibility for 57139/57142/57146 |
| A3 | Confirm filtering semantics with PO/QA: AND/OR rules, null handling, multi-select limits, default state | PO, TL, QA | 2 | Updated AC checklist + examples | esp. “unrated excluded when threshold set” |
| A4 | Define test matrix (pairwise combinations) + automation split (unit/integration/e2e) | QA, TL | 2 | Test plan + matrix | Avoids combinatorial explosion |

**Definition of Done (Analysis)**
- Requirements clarified and written (including AND/OR/null rules).
- Current state documented, including how paging/sort is triggered.
- Data fields confirmed or follow-up tasks logged.
- Test matrix agreed.

---

### Phase 2 — Design

**Milestone:** Approved UX + API contract + backend query approach.

| Task ID | Task | Owner(s) | Est. (SP) | Outputs | Notes |
|---|---|---|---:|---|---|
| D1 | UX spec: filter panel sections + applied filter chips + clear-all + empty-state copy + accessibility | UX, FE | 5 | Wireframes/spec + a11y notes | Ensures consistent UX across 3 filters |
| D2 | API contract: query params, validation, examples; confirm backward compatibility | BE, TL | 3 | Updated OpenAPI / contract doc | e.g. `amenities=wifi,breakfast`, `propertyType=hotel,villa`, `reviewScoreGte=8` |
| D3 | BE query strategy + indexing: decide DB/ES filtering, cardinality, indexes, fallbacks | BE, Data/DB | 5 | Query plan + migration plan | Addresses performance risk |
| D4 | FE architecture: state mgmt + URL sync + persistence across pagination/sorting + clear-filters behavior | FE, TL | 3 | State diagram + implementation notes | Decide “apply” vs “live update” + debounce |

**Definition of Done (Design)**
- UX approved.
- API contract reviewed by FE/BE/QA.
- Query/index plan documented with performance assumptions.
- FE state approach agreed (URL as source of truth).

---

### Phase 3 — Development

**Milestone:** Filters implemented end-to-end behind feature flag.

| Task ID | Task | Owner(s) | Est. (SP) | Outputs | Related Jira |
|---|---|---|---:|---|---|
| DEV1 | BE: implement param parsing + validation for `amenities`, `propertyType`, `reviewScoreGte` | BE | 5 | Controller/service updates; validation errors | 57139, 57142, 57146 |
| DEV2 | BE: implement filtering logic in query layer (AND amenities; OR propertyType; score >= threshold; exclude null scores when threshold set) | BE, Data/DB | 8 | Search query updated + predicates | 57139, 57142, 57146 |
| DEV3 | BE: performance work (indexes / query optimization / caching tweaks if needed) | BE, Data/DB | 5 | Migration(s) + perf notes | From D3 |
| DEV4 | FE: create filter UI components (Amenities + Property Type + Review Score) | FE | 8 | Filter panel + controls | 57143, 57147 (+ UI part of 57138) |
| DEV5 | FE: URL query param sync + persistence across pagination/sort; back/forward support | FE | 5 | Router/state integration | Required by all stories |
| DEV6 | FE: applied-filter chips + Clear filters + no-results empty-state handling | FE | 3 | Chips + empty state CTA | Required by all stories |
| DEV7 | Feature flag wiring (FE + BE) + config documentation | TL, FE, BE | 3 | Flags + README notes | Safe rollout |

**Definition of Done (Development)**
- All three filters function end-to-end in dev.
- Filter state persists across pagination/sort.
- Empty state shown with Clear filters.
- Feature flags exist and default OFF in prod config.
- Code review completed; lint/build passes.

---

### Phase 4 — Testing

**Milestone:** Automated coverage + QA sign-off on staging.

| Task ID | Task | Owner(s) | Est. (SP) | Outputs |
|---|---|---|---:|---|
| T1 | BE unit tests: validation + filter predicate logic; null score exclusion rules | BE | 3 | Unit test suite |
| T2 | BE integration tests: search endpoint with filters + combinations + empty-state response | BE, QA | 3 | Integration tests in CI |
| T3 | FE component tests: select/clear multi-select, threshold select, clear-all | FE | 3 | Component tests |
| T4 | E2E tests: each filter + persistence across pagination/sort + back/forward + no-results | QA, FE | 8 | E2E suite + CI job |
| T5 | Non-functional: perf smoke (filtered vs unfiltered), a11y checks for controls | QA, TL | 3 | Perf/a11y report |

**Definition of Done (Testing)**
- CI green (unit + integration + UI tests).
- E2E smoke passes on staging.
- All acceptance criteria validated; no open P1/P2 defects.
- Perf and a11y checks complete with no critical regressions.

---

### Phase 5 — Deployment

**Milestone:** Controlled rollout to production with monitoring and rollback.

| Task ID | Task | Owner(s) | Est. (SP) | Outputs |
|---|---|---|---:|---|
| DEP1 | Staging deployment + smoke verification; validate migrations (if any) | Ops/DevOps, QA | 3 | Staging release notes + smoke results |
| DEP2 | Production rollout via feature flag (canary % → full); monitor errors/latency | Ops/DevOps, TL | 3 | Rollout checklist + dashboards |
| DEP3 | Post-release verification + cleanup backlog (flag removal plan) | TL, FE, BE | 2 | Post-release report + follow-ups |

**Definition of Done (Deployment)**
- Staging verified; production released behind flag.
- Monitoring confirms acceptable error rate and latency.
- Rollback plan documented and validated.
- Release notes published.

---

## 2) Sprint plan covering all 3 User Stories across 2 sprints

### Sprint 1 (2 weeks) — “Amenities + shared filter foundation”
**Sprint Goal:** Deliver Amenities filter end-to-end and implement shared filter framework (URL persistence + combined logic scaffolding).

**Scope**
- Complete EPMCDMETST-57138 (Amenities)
- Implement URL/state persistence mechanism reused by other filters

**Sprint 1 backlog (suggested)**
- Analysis: A1 (3), A2 (3), A3 (2), A4 (2) = **10 SP**
- Design: D2 (3), D4 (3), start D1 (3/5) = **9 SP**
- Dev: DEV1 (5) [amenities params], DEV2 (5/8 partial amenities query), DEV4 (5/8 amenities UI), DEV5 (3/5 baseline URL sync) = **18 SP**
- Test: T1 (2/3 amenities), T3 (2/3 amenities UI), partial T4 smoke subset (3/8) = **7 SP**

**Sprint 1 total (approx): 44 SP**

**Exit criteria**
- Amenities filter meets AC including persistence and clear-filters empty state.
- Available on staging behind feature flag for PO/QA review.

### Sprint 2 (2 weeks) — “Property Type + Review Score + release hardening”
**Sprint Goal:** Deliver Property Type and Review Score filters, finalize automation, and ship with controlled rollout.

**Scope**
- Complete EPMCDMETST-57141 (Property Type)
- Complete EPMCDMETST-57145 (Review Score)
- Full regression automation and deployment tasks

**Sprint 2 backlog (suggested)**
- Design: finish D1 (2/5), D3 (5) = **7 SP**
- Dev: finish DEV2 (3), DEV3 (5), finish DEV4 (3), finish DEV5 (2), DEV6 (3), DEV7 (3) = **19 SP**
- Test: finish T1 (1), T2 (3), finish T3 (1), finish T4 (5), T5 (3) = **13 SP**
- Deploy: DEP1 (3), DEP2 (3), DEP3 (2) = **8 SP**

**Sprint 2 total (approx): 47 SP**

**Exit criteria**
- All three stories accepted on staging.
- E2E suite stable in CI.
- Production rollout completed (flagged) or ready pending release window.

---

## 3) Effort estimates per task (story points)

**By phase totals (planned):**
- Analysis: 10 SP
- Design: 14 SP
- Development: 37 SP
- Testing: 20 SP
- Deployment: 8 SP

**Overall total:** **~89 SP** (cross-functional, plan-level).

---

## 4) Dependencies and risks

### Dependencies
1. **Data completeness**: amenities/type/score must be present and consistent (A2).
2. **API contract alignment** between FE and BE (D2).
3. **URL-based persistence** must be compatible with existing sort/pagination (A1/D4).
4. **Environments & observability**: staging dataset + dashboards/logs available for rollout.

### Risks & mitigations
| Risk | Impact | Likelihood | Mitigation |
|---|---|---:|---|
| Data quality gaps (missing amenities/score) | Incorrect filtering and user confusion | Medium | Normalize/whitelist values; define null-handling; log missing fields |
| Performance regression from added predicates | Slow search results; timeouts | Medium | Index plan (D3/DEV3), perf smoke tests (T5), canary rollout (DEP2) |
| E2E flakiness due to non-deterministic data | CI instability | Medium | Seed data/fixtures; stable selectors; smoke vs full suite |
| UX complexity (AND vs OR) causes confusion | Usability issues | Low–Med | Clear labels/help text; chips summary; user testing if possible |
| URL param bloat/encoding issues | Broken share links/routing | Low | Compact encoding; validate params; cap selections |

---

## 5) Definition of Done per phase

### Analysis DoD
- Documented current search behavior and constraints.
- Data fields confirmed and sample payloads captured.
- Filter semantics agreed and recorded.
- Test matrix and automation scope approved.

### Design DoD
- UX spec approved (including a11y).
- API contract finalized with examples/validation.
- Query/index plan documented and reviewed.
- FE URL/state approach agreed.

### Development DoD
- Filters implemented end-to-end in dev.
- Logic matches rules (AND across categories; amenities AND; property type OR; score threshold excludes null).
- Pagination/sorting preserve filter state.
- Empty state + clear-filters UX present.
- Feature flags implemented and documented.
- Code review complete; build/lint pass.

### Testing DoD
- Unit/integration/UI tests pass in CI.
- E2E tests cover AC + persistence + no-results.
- No open P1/P2 defects.
- Perf + a11y checks complete with no critical issues.

### Deployment DoD
- Staging deployed and validated.
- Production canary rollout behind flag; monitoring OK.
- Rollback plan verified.
- Release notes + post-release verification completed.
