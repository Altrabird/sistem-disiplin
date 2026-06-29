# Changelog

Format based on [Keep a Changelog](https://keepachangelog.com/). Dates are absolute.

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
