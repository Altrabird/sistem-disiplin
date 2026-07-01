# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/). Dates are absolute.

## [1.4.0] — 2026-07-01

### Added
- **Export presentation to PowerPoint (.pptx)** — "Muat Turun PPT" in Mode Persembahan (and the report modal) generates a real, editable deck via PptxGenJS: cover with crest, KPIs, native doughnut/bar/line charts, at-risk table, recommendations, closing. The matching report narrative is attached as **speaker notes** on each slide so visuals and text tally (recommendations share one source).
- **School crest** used in sidebar, header, presentation slides, report letterheads, and favicon.

> PptxGenJS is loaded **on-demand from CDN** only when exporting — needs internet at that moment; the rest of the app stays offline-capable.

---

## [1.3.0] — 2026-07-01

### Added
- **Mode Persembahan** — one-click fullscreen PPT-style slideshow generated live from the dashboard data (cover, KPIs, severity donut, category bars, status/class, monthly trend, at-risk students, closing). Arrow/keyboard/dot navigation.
- **Jana Teks Laporan** — auto-generates a formal Bahasa Melayu narrative report from the data (intro → summary → top categories → classes → at-risk → trend → recommendations → closing) in an editable modal with copy and .txt download. Generated **on-device** — no student data sent to any external API (PDPA-safe).
- **Guru Pelapor** dropdown with preset names (Harsidi bin Junick, Abbas Osman) + manual add (persisted; managed in Settings).

---

## [1.2.0] — 2026-07-01

### Added
- **Multiple photo evidence per case** — pick several images at once, add more anytime, remove individually. Records/report show the first thumbnail with a "+N" badge; clicking opens a navigable lightbox (arrows, counter, keyboard ←/→). Stored as newline-delimited lists in `foto`/`fotoId`.

> Cloud mode requires **redeploying `Code.gs`** (new version) for multi-photo upload/delete; offline mode works immediately.

---

## [1.1.0] — 2026-07-01

### Added
- **Multiple pelaku per case** — record several perpetrators for one incident; shared incident details, each pelaku (kelas → nama → jantina) saved as a linked record sharing a `kesId`.

### Fixed
- **Photo orientation** — phone photos no longer appear sideways (EXIF respected via `createImageBitmap`).
- **Photo upload layout** — full-width centered dropzone (icon over label); preview shows the full upright image (`object-fit:contain`), centered.

---

## [1.0.0] — 2026-06-29 — 🎉 Milestone: production-ready

First complete, deployed release. Live at https://altrabird.github.io/sistem-disiplin/

### Added
- **Dashboard** with KPIs and 5 charts (category, severity donut, status, class, monthly trend).
- **Interactive charts** — hover tooltips + click-to-drill into the filtered records (or month report).
- **Case records** — create/search/filter/edit/delete; automatic repeat-offender detection.
- **Photo evidence** — camera/upload with client-side compression, thumbnails + lightbox.
- **Murid Berisiko** — repeat-offender risk scoring (Rendah→Kritikal) + intervention recommendations + per-student timeline.
- **Action guide** — 20 MOEIS/IDME categories with graduated, regulation-aligned action recommendations (severity × frequency).
- **Reports** — filtered, printable (letterhead + signatures), CSV export.
- **Cloud mode** — Google Apps Script backend (`Code.gs`): Sheet = DB, Drive = photos.
- **Live roster** — pulls students/classes from the Hadir@SKBT sheet; case form is class-first → name dropdown filtered by class.
- **Security** — default GAS URL locked behind a PIN gating all read/write endpoints.
- **Settings & data** — storage-mode config, JSON backup/import, one-click links to the cloud Sheet/Drive folder.

### Design
- Rebuilt from a slide deck into a professional "Data-Dense Dashboard" (UI/UX Pro Max): Fira Sans + Fira Code, enterprise blue + amber, all-SVG icons (no emojis).

### Fixed
- Donut chart clipping (ring overflowed the SVG viewBox).
- Edit-modal header overlapping the first fields on short viewports (now fixed header + scrolling body).
- Offline name-field placeholder getting stuck.

### Notes
- The Apps Script backend is deployed manually by the user; the real PIN is set only in their deployment and never committed.

---

## Unreleased / planned

See **[ARCHITECTURE.md](ARCHITECTURE.md) §9 Roadmap** — merit/demerit tracking, class-level dashboard filter, parent-notification export, multi-teacher login + audit trail, PWA offline, write-locking & pagination for scale.
