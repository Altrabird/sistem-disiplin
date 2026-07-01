# Architecture & Upgrade Guide

Technical reference for maintaining, extending and scaling **Sistem Pengurusan Disiplin**. Read this before adding features.

---

## 1. Design principles

- **Single file, zero build.** The entire app is `index.html` (HTML + CSS + JS). No npm, no bundler — so a teacher can open it locally or host it on GitHub Pages with no toolchain. Keep it that way unless there's a strong reason.
- **Offline-first, cloud-optional.** Everything works against `localStorage`. The cloud (Google Apps Script) is an opt-in layer that mirrors the same data shape. Never make a feature *require* the cloud unless it's inherently cloud-only (e.g. roster).
- **Dependency-free.** Charts, icons, tooltips are hand-rolled SVG/CSS. No CDN libraries → works offline and never breaks from a dead CDN.
- **Malay UI.** All user-facing strings are Bahasa Melayu. Code identifiers are English.

## 2. Data model

A **case** object (one discipline record):

```js
{
  id,            // unique string (uid())
  tarikh,        // 'YYYY-MM-DD'
  nama, kelas,   // student name + class
  jantina,       // 'Lelaki' | 'Perempuan'
  kategori,      // 1..20 (see KATEGORI)
  tahap,         // 'Ringan' | 'Sederhana' | 'Berat'
  butiran,       // incident description
  tindakan,      // action taken
  guru,          // reporting teacher
  status,        // 'Dilaporkan' | 'Dalam Tindakan' | 'Selesai'
  foto, fotoId,  // Drive thumbnail URL + file id (cloud) OR dataURL (offline)
  kesId,         // groups multiple pelaku (perpetrators) of the SAME incident
  dicipta, dikemaskini  // ISO timestamps (cloud sets dikemaskini)
}
```

**One row per pelaku.** A single incident with multiple perpetrators is stored as N case records sharing a `kesId` and identical incident fields (date/category/severity/description/action/photo), differing only in `nama`/`kelas`/`jantina`. This keeps all per-student stats (dashboard, risk, reports) correct without special-casing. The "Rekod Kes Baharu" form adds pelaku rows; **edit** operates on a single record.

In-memory source of truth = `CASES` array. `SETTINGS` holds school info + `api` (GAS URL) + `pin`.

Reference data (edit these to reconfigure the system):
- `KATEGORI` — 20 misconduct categories `{id, nama, def (default severity), desc, mandat[]}`.
- `LADDER` — graduated actions per `severity → frequency(1|2|3)`.
- `RISK_REC` / `riskLevel()` — at-risk scoring + intervention text.
- `SENARAI_KELAS` — fallback class list used **only offline** (cloud uses live roster).

## 3. Storage layer (the key abstraction)

`CLOUD()` returns the configured GAS URL or `''`.

- `save()` always writes `localStorage` (the cache).
- **Writes** (`saveCase`, `delCase`): if `CLOUD()`, POST to GAS and merge the returned record into `CASES`; else mutate `CASES` + `save()`.
- **Reads** (`cloudLoad`): if `CLOUD()`, fetch `action=list` → replace `CASES`; else render from cache.
- All renders are synchronous off `CASES`. Only load/save touch the network.

To add a persisted field: add it to the case object in `saveCase`, to `HEADERS` in `Code.gs`, and (if shown) to render functions + the modal form. The merge logic in `saveKes_` preserves unknown/older columns.

## 4. Backend API (`Code.gs`)

Web App deployed *Execute as Me, Access Anyone*. CORS-safe via `text/plain` POST.

| Method | action | Auth | Returns |
|--------|--------|------|---------|
| GET | `ping` | open | `{ok, pin, roster}` reachability |
| GET | `list` | PIN | all cases |
| GET | `students` | PIN | roster `[{nama,kelas}]` from Hadir@SKBT |
| GET | `info` | PIN | `{sheetUrl, folderUrl}` |
| POST | `save` | PIN | upsert case (+ photo to Drive) |
| POST | `delete` | PIN | delete case (+ trash photo) |

Storage auto-created on first use: spreadsheet **"Data Disiplin SKBT"** (tab `Kes`), Drive folder **"Bukti Disiplin SKBT"** (or `PHOTO_FOLDER_ID`). IDs cached in Script Properties.

**Config constants** (set in the deployed copy, never commit secrets): `PIN`, `ROSTER_ID`, `ROSTER_TAB`, `PHOTO_FOLDER_ID`.

**Redeploy after editing `Code.gs`:** Deploy → Manage deployments → ✏️ → New version. URL stays the same.

## 5. UI building blocks

- **Views**: `<section class="view" id="view-X">` toggled by `go('X')`; add an entry to `TITLES` + a `.nav-item[data-view]`.
- **Icons**: add a `<symbol id="i-NAME">` to the SVG sprite, use `ico('NAME')` (JS) or `<svg class="ic"><use href="#i-NAME"/></svg>` (HTML). No emojis.
- **Charts**: pure SVG/CSS. `donut()` and `lineChart()` return markup; bar lists are inline. Interactivity via `data-tt`/`data-ts` (tooltip) + `data-drill` (JSON `{t:'rec'|'rep', ...}`) handled by two delegated listeners.
- **Modals**: `.overlay > .modal` (flex column: fixed header, scrolling `.modal-b`, fixed footer). Close on backdrop click / Esc.
- **Theme**: CSS variables in `:root` (`--brand`, `--accent`, severity colours, etc.). Change palette there.

## 6. How to extend (recipes)

- **Add/rename a category** → edit `KATEGORI` (keep ids stable; existing cases store the id). Add `mandat[]` for mandatory steps.
- **Tune actions** → edit `LADDER` / category `mandat`. Tune risk thresholds in `riskLevel()`.
- **Add a case field** → §3 above.
- **Add a view** → §5; render function called from `go()`.
- **Add a chart** → build SVG/bars, add `data-tt`/`data-drill` for consistency.
- **Merit/demerit system** → add `markah` to the model + a points ledger; aggregate per student alongside `riskProfiles()`.

## 7. Security model

The `/exec` URL is **public** (hardcoded `DEFAULT_API` so every device auto-connects), so the backend is **PIN-gated on every data endpoint** (reads + writes). The PIN lives only in the deployed `Code.gs` and each device's localStorage — **never commit the real PIN**. To rotate/revoke access: change `PIN` and redeploy, or create a new deployment (new URL) and update `DEFAULT_API`.

Student data is PDPA-sensitive. Keep the Sheet/folder private; the public surface is only the PIN-locked API.

## 8. Scaling notes & limits

- **Volume**: fine for one school (hundreds of cases/year). The whole `CASES` array loads into memory and renders client-side. Beyond a few thousand cases, add server-side pagination/filtering to the GAS `list` action.
- **GAS quotas**: Apps Script has daily URL-fetch/execution quotas; the 10-min roster cache (`CacheService`) limits sheet reads. Photos compressed client-side (~1280px JPEG) to stay within Drive/POST limits.
- **Concurrency**: `saveKes_` does read-modify-write on the sheet; simultaneous writers could race. For multi-teacher heavy use, add `LockService` around writes.
- **Offline photos**: stored as base64 dataURLs in `localStorage` (~5 MB cap). Cloud mode is the path for many photos.

## 9. Roadmap (candidate upgrades)

- [ ] Merit/demerit points tracking + per-student balance
- [ ] Class-level dashboard filter (now that classes come from the live roster)
- [ ] Parent-notification export (letter / WhatsApp / Telegram message)
- [ ] Multi-teacher login + per-user audit trail (who recorded/edited)
- [ ] `LockService` on writes; server-side pagination for large datasets
- [ ] PWA install + offline service worker
- [ ] Trend analytics: recidivism rate, category trends YoY
- [x] ~~Presentation mode (fullscreen slideshow)~~ — done v1.3.0
- [x] ~~Auto-generated narrative report text (on-device)~~ — done v1.3.0
- [ ] Optional AI-enhanced report text (only with an anonymising step — do NOT send raw student data to external APIs)
- [ ] Roster sync for jantina (auto-fill gender from Hadir@SKBT if available)

## 10. Deploy

- **Frontend**: push to `main` → GitHub Pages rebuilds (~1 min).
- **Backend**: edit `Code.gs` in the script project → Deploy new version (same URL).
