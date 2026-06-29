# Sistem Pengurusan Disiplin — SK Bandar Tawau

Aplikasi web untuk **merekod, memantau, menganalisis dan melaporkan** kes salah laku & disiplin murid sekolah. Satu fail HTML tunggal (tanpa pelayan, tanpa binaan) yang berfungsi **luar talian** atau disambungkan ke **awan peribadi** (Google Sheet + Drive) anda.

🔗 **Aplikasi langsung:** https://altrabird.github.io/sistem-disiplin/
📦 **Repositori:** https://github.com/Altrabird/sistem-disiplin

---

## Ciri-ciri

| Modul | Fungsi |
|-------|--------|
| 📊 **Papan Pemuka** | KPI (jumlah, selesai, dalam tindakan, murid berulang) + 5 carta **interaktif** (kategori, tahap, status, kelas, tren bulanan). Hover = butiran, klik = drill-down ke senarai/laporan. |
| 📝 **Rekod Kes** | Daftar / cari / tapis / kemaskini / padam. Borang **kelas → nama** (auto-tapis dari roster). Foto bukti (kamera/upload, dimampatkan). Pengesanan murid berulang automatik. |
| 🚨 **Murid Berisiko** | Murid 2+ kes dikumpul, diberi **skor risiko** (Rendah→Kritikal) berwajaran keseriusan + cadangan intervensi + garis masa kes. |
| ⚖️ **Panduan Tindakan** | 20 kategori MOEIS/IDME + enjin cadangan tindakan berperingkat (tahap × kekerapan), rujukan SPI/KPM. |
| 📄 **Laporan** | Laporan ditapis (bulan/kelas/kategori), cetak/PDF berkop & tandatangan, eksport CSV. |
| ⚙️ **Tetapan & Data** | Maklumat sekolah, mode penyimpanan (luar talian/awan), PIN, sandaran/import JSON, pautan terus ke Sheet/folder Drive. |

## Dua mod penyimpanan

1. **Luar talian (lalai mudah)** — data dalam `localStorage` peranti. Sesuai untuk satu PC. Sandaran melalui eksport JSON.
2. **Awan** — backend **Google Apps Script** (`Code.gs`): Google Sheet = pangkalan data, Drive = foto bukti, dikunci **PIN**. Turut menyambung ke **roster murid Hadir@SKBT** supaya nama & kelas sentiasa terkini. Boleh dikongsi antara peranti.

> Setup awan: lihat **[PANDUAN-SETUP.md](PANDUAN-SETUP.md)**.

## Teknologi

- HTML / CSS / JavaScript tulen — **tiada pakej, tiada langkah binaan**
- Font: Fira Sans + Fira Code · Ikon: sprite SVG terbina dalam (tiada emoji)
- Backend pilihan: Google Apps Script (Sheets + Drive)
- Hos: GitHub Pages (auto-deploy dari `main`)

## Struktur projek

```
index.html              Seluruh aplikasi (UI + logik + gaya)
Code.gs                 Backend Google Apps Script (mod awan)
README.md               Dokumen ini
PANDUAN-SETUP.md        Panduan setup awan (Bahasa Melayu)
ARCHITECTURE.md         Reka bentuk teknikal + panduan menaik taraf
CHANGELOG.md            Sejarah versi
slaid-rumusan-lama.html Arkib slaid asal (rujukan)
```

## Pembangunan

Edit `index.html`, kemudian `git add` → `git commit` → `git push`. GitHub Pages deploy semula dalam ~1 minit. Untuk menambah ciri atau menskala, baca **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

Guru Disiplin: **Harsidi bin Junick** · Unit HEM · SK Bandar Tawau (XBA3051) · 2026
