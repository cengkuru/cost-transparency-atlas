# Verification record

Checked 5 September 2026. Snapshot `atlas-56e8378e871df657e298`.

## Data and processing

- Node 22 deterministic fixtures: 8/8 passed. These cover typed budget values, zero versus missing, currency strings, invalid/future dates, process IDs versus empty objects, duplicate IDs, multi-sector rows, title presence, licence exclusions, and source-count reconciliation.
- Full saved population: 39,443 records across ten licensed packages; Ecuador 34,520. All eleven registry entries remain visible. West Lombok contributes zero redistributed rows.
- Primary independently parsed the nine smaller raw JSON packages using Python before the final transformations and calculated record/budget-pair counts: Costa Rica 18/18, Zambia 107/81, Kaduna 200/200, Ghana 87/0, Malawi 694/691, Jalisco 800/798, Mozambique 100/100, Uganda 393/327, NTB 2,524/2,097. Tests retain those values as reconciliation fixtures.
- The streaming converter was checked against Costa Rica's original package: eighteen project rows and the correct package metadata. Ecuador's full source was streamed into 34,520 NDJSON rows; the final aggregation reads that intermediate line by line.
- Repeated ingestion with the same observation time, registry and source files exited successfully and produced byte-identical snapshot output.
- A missing-source injection exited with failure and left the previous snapshot byte-identical.
- Independent reviewer checked the small public index and reconciled all ten record shards to 39,443 rows. Initial index: 14,362 bytes before HTTP compression. Ecuador is loaded only on selection.

## Interface checks

- Observed 320 and 360 pixel layouts: no horizontal overflow, zero unlabelled select controls, and no rendered button/select/summary below 44 pixels in height.
- Observed 390 pixel Ecuador selection and 1440 pixel desktop layout.
- Publisher selection, comparison denominators, no-results filters, reset, expanding source-linked project details and copying a snapshot-specific URL worked in browser checks.
- Shared views use the immutable saved index. Missing snapshot URLs fail visibly rather than silently substituting the latest version.
- Main text contrast calculated from palette: charcoal/white 10.80:1, slate/white 5.23:1, slate/light 4.88:1, white/red 5.44:1. Native controls and visible focus styles are used. Chart numbers and descriptions are also rendered as text; colour is not the sole information channel.
- Reduced-motion and print styles are present. Physical-device, assistive-technology and observed human comprehension testing were not performed. No full WCAG certification is claimed.
- Palette drift check passed. Publication-hygiene check passed. Prose scanner reported zero violations, with advisory style warnings retained where dated supporting text supplies the needed context.

## Independent review

Sol reviewer found a stale prepared build. The primary rebuilt, proved source/build SHA equality, and reran Node 22 tests. Repair review returned PASS with no critical or major findings within the reviewed scope. Small subsequent presentation corrections prevent positive percentages rounding to a displayed zero and keep shared-view navigation aligned after asynchronous loading; these receive browser verification.

The reviewed refresh stages sources separately, bounds host/size/time, records metadata and hashes, and does not replace the last successful analysis on a source failure. A second full live refresh of all source downloads was not executed. Deployment is checked separately against the live content and GitHub workflow receipt.

Fixture outcome accuracy: 100% (8/8 explicit Node fixtures), not an estimate of factual project accuracy. Tokens used: not-measured. Test latency: 1,028.57 ms against a 10,000 ms check budget (10.3%); a separate reviewer run took 3,272.46 ms. Human adoption, national coverage, source factual accuracy and impact remain unverified.

Release dependency check: upgraded the offline streaming parser to stream-json 3.6.0; npm audit reports zero known vulnerabilities. Converted the Costa Rica source again (18 records, version 0.9 and publisher timestamp preserved). Node 22 tests passed 8/8. Independent dependency repair review passed.

## Map interaction correction, 5 September 2026

The original long-form opening did not meet Michael's intended interaction. This release replaces it with a map-first viewport and preserves the detailed record explorer at evidence.html.

Observed in the browser: map pointer panning changed the saved map centre; the primary Move handle moved its panel from x=24 to x=174, then keyboard Right moved it to x=184; reset restored its default. The independent comparison panel moved by pointer and its reset cleared all four positioning overrides. Mobile comparison shows both publishers in paired rows. Costa Rica 18/18 and Zambia 81/107 budget-and-currency values agree with the snapshot. West Lombok displays an unavailable profile instead of zero bars.

390x844 and 320x740 viewport checks found no horizontal overflow. Mobile and desktop screenshots were inspected. Publisher selection, Freshness dates, repeated Records tab visits, original source links and evidence-page links worked. Reload restored snapshot, selected publisher, comparison and story. A missing named snapshot displayed 'Snapshot unavailable' rather than substituting the latest data. The three story views represent one saved snapshot, not a time series. Physical touch devices and assistive technology were not tested.

Independent review found immutable-link, keyboard, initialization and comparison defects. Two bounded repair cycles resolved them; final review returned PASS with no critical or major finding remaining in that scope. All 8 existing data tests passed; these are data fixtures, not an automated UI test suite. Interaction evidence above comes from browser operation. The source snapshot and ingestion code were not changed.


## Central visual revision, 5 September 2026

The map-card revision remained an ordinary dashboard experience. This revision replaces its cards with a single disclosure instrument and brings comparisons into that instrument.

Observed browser checks: direct budget-arm activation showed Costa Rica 18/18 and Zambia 81/107 with definitions and source links; Enter on the Ecuador budget endpoint opened its inspector; reloading restored that field inspection. Repeated removal/restoration of comparison and rapid publisher selection produced no invalid SVG coordinates. Ecuador's animated budget endpoint was observed at radius 193.9766 during transition and settled at 88.1402086, matching 80 + 125 * (2248/34520). Its sector label reads less than 0.1 percent rather than zero. West Lombok displays an unavailable profile.

Mobile 390x844 and 320x740 layouts were inspected. A narrow-header overflow was repaired; the final 320px document has no horizontal overflow. Endpoint hit targets measured at least 45.17px at 320px. Keyboard movement/reset, paired mobile labels, source dates and saved field inspection were checked. Reduced-motion handling is implemented and reviewed but was not exercised with an operating-system preference change. Physical-device touch and assistive-technology testing remain unverified.

The new geometry tests check 0/50/100 percent radii, invalid/missing counts, separate comparison denominators and excluded profiles. All 11 data/geometry fixtures passed. Independent review found comparison-animation and invalid-count defects plus missing explicit focus styling; the repair review passed. These checks establish implementation evidence, not Michael's aesthetic acceptance.

## Map drag regression, 2026-09-05

Observed before repair on the public site: a real pointer drag moved the map center from longitude -84 to 46.7578 while Costa Rica remained selected with 18 records. The move handler wrote the URL but never selected a publisher.

After repair, CUA pointer gestures against the built local site at 1280 x 720 changed Costa Rica (18 records) to Uganda (393 records), including budget 327/393 and process links 321/393. Further map gestures selected Ghana (87) and NTB (2,524) while Zambia remained the comparison. Heading, count, all five glyph labels, selector and settled URL agreed with the saved snapshot. Next selected West Lombok; the selector restored Costa Rica. At 390 x 844, a map gesture changed Costa Rica to NTB while preserving Zambia. No horizontal overflow was observed. World view preserved NTB; reload preserved the selected publisher and comparison. These are browser pointer tests at desktop and phone viewport sizes, not physical touchscreen certification.

The new adapter tests cover selection changes during dragging and inertia, programmatic movement exclusion, explicit cancellation and wrapped geographic distance. The complete 14-test suite and static build passed using Node 22; diff whitespace check passed. Independent Sol diff review passed. Public deployment and live gesture verification are recorded in the release receipt after deployment.

## Procurement story chapter, 2026-09-05

The root page now presents one ordinary-scroll story using NCC Zambia's saved package; the former map remains at explorer.html. Legacy root URLs containing explorer state redirect with their search and hash. This is one purposively selected publisher and record, not a country ranking or representative portfolio sample.

Independent calculation: Python read the raw Zambia package after matching its SHA-256 to the immutable snapshot. All 107 IDs are distinct. Four mutually exclusive cells reconcile to 107: 11 budget-and-ID, 2 ID-only, 70 budget-only, 24 neither. New JavaScript tests independently verify the same calculation and reject source checks associated with a different snapshot or raw package. Red was observed before each implementation seam; the complete Node 22 suite passes 16 tests.

Selected source check: the linked GET FiT Zambia Solar page was retrieved and read on 5 September 2026. It names the Bulemu awards and joint venture. This verifies readable award context, not contract execution, payments, delivery, or value for money. Ministry and AfDB example link retrievals were inconclusive (timeout and tool-facing 403); the drawer does not label them broken. Source-check metadata and selection rationale are saved in data/story/source-checks.json; the build carries only the compact chapter evidence, not raw caches.

CUA browser checks against the static build: desktop 1280 x 720 and phone viewport 390 x 844. Real PageDown input advances the document and updates the highlighted records without hover. Identifier and intersection states expose 13 and 11 highlighted dots; the split preserves 107 dots. Phone layout has no horizontal overflow; the complete graphic fits. Mobile record deep-link alignment initially failed because scroll padding and margin accumulated; the fix was retested and now aligns record content at the sticky stage boundary. The selected record shows readable award context and an explicit unestablished-delivery step. Evidence dialog opens, closes by button and Escape, and restores focus. Legacy root query restores Uganda with Zambia comparison, sector/status parameters, and map center within Leaflet pixel rounding; its scope message states that filters apply only to the record explorer.

Limits: no physical touch-device, actual trackpad, disabled-JavaScript browser session, OS reduced-motion run, or prospective-reader comprehension test was performed. Semantic chapter content and source links are present without JS, and reduced-motion CSS removes transitions, but those paths were source-inspected only. The stale record-fetch catch is guarded by publisher and story state; forced delayed-failure browser injection was not performed. The independent final reviewer could not run: two review dispatch attempts were rejected by the agent task limit. No independent review pass is claimed. Local browser checks and deterministic raw-data verification are the acceptance evidence for this release; live release receipt is saved separately after deployment.

## Geographic lens repair, 2026-09-06

Observed regression: dragging the former Move hub changed its screen position while Costa Rica's 18-record profile remained unchanged. The previous map-centre selection did not follow that hub.

The hub now contains a noninteractive magnified map using the same geographic source at one zoom level above the background. The nearest publisher anchor inside the visible lens determines the profile. Background movement, hub pointer movement, keyboard movement and explicit publisher navigation use that same focus. An empty lens clears the prior metrics. Geographic anchors remain context, not project locations. This replaces the earlier map-centre selection behavior described above.

CUA pointer checks on the built page: at 1280 x 720, lens movement changed Costa Rica 18 to Ghana 87, including budget 0/87 and process links 87/87; moving over empty ocean cleared the profile and disabled inspector actions. A separate background drag changed Costa Rica to Ghana while the lens stayed fixed. At 390 x 844, navigation displayed excluded West Lombok as unavailable, then Ecuador 34,520; lens movement selected Jalisco 800 and its own ratios. A desktop Jalisco shared URL restored Jalisco 800 at the phone viewport. Geographic focus is saved separately from normalized lens screen position, preventing screen size from selecting a different region. Leaflet projection introduces pixel rounding. ArrowRight on the focused lens changed its position and geographic focus. Desktop and phone screenshots were inspected for the final heading, count, lens and controls.

The 17-test Node 22 suite and static build passed. Independent Sol diff review and the subsequent focus-restoration delta review passed. No physical touchscreen, OS reduced-motion, or prospective-reader comprehension test was performed. Publication receipt is verified separately after deployment.
