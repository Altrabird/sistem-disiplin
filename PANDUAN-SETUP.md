# Panduan Setup — Mode Awan (Google Sheet + Drive)

Ikut langkah ini **sekali sahaja** untuk menyambungkan app kepada akaun Google anda. Selepas siap, semua kes & foto bukti akan disimpan dalam **Google Sheet** dan **Google Drive** anda sendiri — boleh diakses dari mana-mana peranti.

> Gunakan akaun Google sekolah anda (`...@moe-dl.edu.my`) supaya data murid kekal dalam akaun rasmi.

---

## Langkah 1 — Cipta skrip

1. Layari **https://script.google.com** → klik **New project / Projek Baharu**.
2. Padamkan kod contoh yang ada.
3. Buka fail **`Code.gs`** (dalam folder ini), salin **SEMUA** isinya, dan tampal ke dalam editor.
4. Klik ikon **Simpan** (💾). Namakan projek, cth: *Disiplin SKBT*.

## Langkah 2 — Deploy sebagai Web App

1. Klik butang biru **Deploy** (kanan atas) → **New deployment**.
2. Klik ikon gear ⚙️ → pilih **Web app**.
3. Tetapan:
   - **Description**: Disiplin SKBT
   - **Execute as**: `Me` (akaun anda)
   - **Who has access**: `Anyone`
4. Klik **Deploy**.
5. Skrin kebenaran muncul → **Authorize access** → pilih akaun anda → *(jika ada amaran "Google hasn't verified")* klik **Advanced** → **Go to … (unsafe)** → **Allow**. Ini normal untuk skrip sendiri.
6. Salin **Web app URL** (berakhir dengan `/exec`).

## Langkah 3 — Sambung dalam app

1. Buka app → **Tetapan & Data** → kad **Mode Penyimpanan Data**.
2. Tampal URL `/exec` tadi ke dalam medan **URL Web App**.
3. (Jika anda set PIN dalam skrip) masukkan PIN yang sama. Jika tidak, biar kosong.
4. Klik **Uji Sambungan** — sepatutnya papar *"Sambungan berjaya"*.
5. Klik **Simpan & Sambung**.

Lencana di atas kanan akan bertukar kepada **🟢 Awan · Tersambung**. Siap!

---

## Apa yang berlaku automatik

- Kali pertama anda simpan kes, skrip akan **mencipta** sebuah Google Sheet bernama **"Data Disiplin SKBT"** dan satu folder Drive **"Bukti Disiplin SKBT"** dalam akaun anda.
- Setiap kes ditulis sebagai satu baris dalam Sheet.
- Setiap foto bukti dimuat naik ke folder Drive; pautannya disimpan dalam Sheet.

## Guna pada peranti / telefon lain

Buka app (cth dari GitHub Pages), pergi **Tetapan & Data**, tampal **URL Web App yang sama** + PIN. Semua data akan muncul. Di telefon, butang **Foto Bukti** akan terus membuka kamera.

---

## Nota privasi (penting)

- Data & foto disimpan dalam **akaun Google anda**, bukan pihak ketiga.
- Foto ditetapkan "sesiapa dengan pautan boleh lihat" supaya dapat dipaparkan dalam app. Pautannya rawak & sukar diteka, tetapi **jangan kongsi URL foto secara terbuka**.
- Untuk keselamatan tambahan, set **PIN** dalam `Code.gs` (baris `const PIN = ''`) — hanya orang yang tahu PIN boleh menyimpan/memadam.
- Untuk mematikan mode awan, kosongkan medan URL dalam Tetapan & klik Simpan — app kembali ke simpanan pelayar (luar talian).

## Kemas kini skrip kemudian

Jika `Code.gs` dikemas kini: tampal kod baharu → **Deploy** → **Manage deployments** → pilih deployment sedia ada → ikon pensel ✏️ → **Version: New version** → **Deploy**. URL kekal sama.
