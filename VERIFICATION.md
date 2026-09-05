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
