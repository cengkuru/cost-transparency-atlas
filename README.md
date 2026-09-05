# CoST Infrastructure Transparency Atlas

A mobile-first research preview that helps funders, public institutions and oversight users see what published infrastructure records establish, where the evidence stops, and what a publisher could improve. Institutional adoption and editorial endorsement are not implied.

The guided story distinguishes retrieval from publication, examines the information needed to follow a project, and explains the institutional scope of publishers. The explorer supports publisher, sector and stage selection, descriptive field-availability comparisons, source-linked record details, CSV export and snapshot-specific share links. A map and publication trends were omitted because publisher jurisdictions are not national coverage and comparable historical publication observations were not established.

## Run and build

Use Node 22 and npm:

```sh
npm ci
npm test
npm run build
python3 -m http.server 4174 --directory dist
```

Only `dist` is deployed. Its initial snapshot index is approximately 16 KB; publisher records load on selection. Ecuador is the largest selected extract, approximately 14 MB before HTTP compression. The original source packages are never sent to visitors automatically or included in the published repository.

## Reproduce or refresh

```sh
# Full live refresh: fetch registry, download licensed packages sequentially,
# convert JSON with streaming parsing, then build a candidate analysis.
npm run refresh
npm test
npm run build
```

The refresh uses an isolated source-cache directory under `data/raw/refresh-*`. Each request has a timeout, a two-attempt ceiling and a 1.5 GB byte ceiling. Parsing honours stream backpressure. Any failed required source aborts before replacing the saved analysis. Publishing is a separate action: review the candidate, commit the named generated files, then push. A failed GitHub Actions build leaves the existing Pages release in place. This project creates no recurring job or paid service.

To recompute from a saved refresh cache, pass its exact paths and a fixed analysis timestamp:

```sh
ATLAS_RAW_DIR=/path/to/saved/cache ATLAS_REGISTRY_PATH=/path/to/saved/cache/registry.json ATLAS_OBSERVED_AT=2026-09-05T10:42:00.000Z npm run ingest
```

The output identity hashes source fingerprints, registry metadata, metric version and analysis time. Repeating those inputs produces identical results. The full analysis is archived in `data/generated/snapshots`. The build converts each full analysis into a small index and publisher files under the same snapshot identity. Keep previously published snapshots to preserve existing share links. Do not overwrite them. The analysis timestamp affects the nonfuture-date test; it does not establish source currentness.

The initial source cache used the source JSON for the smaller packages and streamed NDJSON for Ecuador. Ecuador's original source SHA-256 was retained by the streaming download; its derived NDJSON also has a separately calculated hash. Its package metadata was checked from the live source header. Future refreshes capture source metadata, headers and hashes automatically. Raw cache files are ignored by git.

## Measures and limitations

Every percentage uses all records in the selected publisher and current sector/stage filters as its denominator. Story chapters use the entire licensed saved analysis. Duplicate IDs are reported within each publisher; records are retained, not merged. Empty populations display “No records.” No legal eligibility or applicability is inferred from field absence.

| Question | Source field | Numerator |
|---|---|---|
| Is the record named? | `projects[].title` | Non-empty strings |
| Is a budget amount paired with a currency? | `budget.amount.amount`, `budget.amount.currency` | Finite numeric amount and non-empty currency string; zero included |
| Can an identified contracting process be pursued? | `contractingProcesses[].id` | Projects containing at least one non-empty string identifier |
| Is a project update timestamp usable? | `updated` | Valid calendar timestamps no later than the saved analysis time |
| Is a sector stated? | `sector[]` | Projects containing at least one non-empty string code |

One record is not a unique asset. One project can contain several process entries; processes are not contract counts. Budget, contract value and expenditure are never added together. Currencies are not converted or summed. Currency strings and sector codes are preserved, not independently certified against all codelists. Parent and child sectors can coexist, so the Atlas uses filters rather than a misleading 100% sector composition chart.

Comparisons describe field availability only. Publisher remits, project mix and update practices differ; national coverage and cross-publisher asset overlap are unestablished. The interface keeps denominators visible and does not rank members. The metadata identifies a registry country context, not the geographic extent of a complete programme.

The datastore reports schema-valid packages. The Atlas checks the types and relationships used by its measures and does not independently recertify OC4IDS compliance. Ecuador declares package version `1.0`; Mozambique declares `1.1`; the other included packages declare `0.9`. Common fields used here were inspected, but those declarations do not prove factual accuracy or equivalent scope. Future schema changes require a review of these definitions.

## Data readiness and provenance

On 5 September 2026 the inspected registry contained 11 publishers. Ten with stated open reuse licences were processed, yielding 39,443 raw records, including 34,520 from Ecuador. West Lombok's registry and package had no stated reuse licence; its project content is excluded. These are dated snapshot findings, not remembered portal totals or national statistics.

The published index carries per-source URLs, licences, registry retrieval dates, package publication dates, record counts, repeated/missing-ID diagnostics, invalid/missing/future-update counts, declared versions and source hashes. A source's availability does not prove freshness. The registry retains its latest valid file when a refresh fails. Snapshot age notices become explicit after seven days; this is a presentation reminder, not a judgment about a publisher's obligations.

Source data attribution: the named publishers in the [CoST Datastore registry](https://datastore.infrastructuretransparency.org/), under each linked CC BY 4.0 or PDDL licence. The Atlas is a transformation of those records, not an endorsement by their publishers. [Registry API](https://api.datastore.infrastructuretransparency.org/datasets). [OC4IDS schema reference](https://standard.open-contracting.org/infrastructure/latest/en/reference/schema/).

Public CoST sources used for editorial context, checked 5 September 2026: [Data Use Manual, 13 May 2026](https://infrastructuretransparency.org/resource/data-use-manual-26/); [2025 Impact Report introduction, 29 July 2026](https://infrastructuretransparency.org/news/costs-2025-impact-report-us-21-4-billion-of-infrastructure-investment-made-more-transparent/); [financial-value methodology discussion, 6 May 2026](https://infrastructuretransparency.org/2026/05/06/whats-the-price-tag-of-transparency-transparency-in-infrastructure-needs-a-business-case-and-this-is-how-to-make-it/). No external outcome is attributed to an individual datastore record. No savings, corruption, climate-finance or causal impact claim is calculated here.

Interaction reference: [VisQuill Demographic Profiles](https://visquill.com/gallery/world-demographics/), visually inspected and geographically interacted with on 5 September 2026. The Atlas borrows consistent selectable profiles and progressive explanation, not its code, three-arm geometry or assets. The reference's time control was observed but its temporal interaction was not successfully verified.

## Ownership, release and rollback

Proposed roles, not appointments: a datastore maintainer owns refresh and source checks; a CoST editorial/standards lead owns interpretation before institutional use; a website maintainer owns Pages and rollback. Michael is the commissioning reviewer. Before institutional adoption, assign those roles, validate the intended publisher populations and test comprehension with representative people. No member or funder has been contacted by this build.

The `Publish Atlas` workflow runs tests, builds an allowlisted static directory, then deploys GitHub Pages. To roll back, revert the relevant release commit and let the same workflow deploy it. The former source snapshots remain immutable. Hosting on Michael's GitHub account establishes a shareable research preview, not CoST production acceptance.

Tests include strict dates, numeric zero/boolean handling, empty identifiers, duplicate and multi-sector behavior, full snapshot reconciliation, licence exclusion, and independently calculated smaller-source budget pairs. The current snapshot baseline tests intentionally flag changes to the reviewed population. For a refresh that changes counts or publisher membership, independently recalculate and review the baseline before updating it. Browser checks and the independent review are recorded in `VERIFICATION.md`.
