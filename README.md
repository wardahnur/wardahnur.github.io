# Zahirah — Klinik Keperawatan Spesialis Anak

Website statis modern (HTML + CSS + JS) dengan tema **pink** & **sky blue**, dibuat untuk klinik milik **Wardah Nur Zahirah**.

## Fitur
- Slider foto responsif dengan navigasi & auto-play
- Animasi halus (reveal, floating decor, confetti saat checkout)
- Katalog paket layanan + **keranjang (cart)** dan **checkout modal**
- Form **janji temu** dengan notifikasi (toast)
- **Mode Tenang** (Calm Mode) untuk menurunkan intensitas warna
- Galeri masonry, navigasi mobile, dan aksesibilitas dasar (Escape menutup modal/keranjang)

> *Catatan:* Checkout bersifat demo (tanpa pembayaran). Data order dicetak ke `console` browser.

## Struktur
```
/
├─ index.html
└─ assets/
   ├─ style.css
   └─ app.js
```

## Cara Pakai (GitHub Pages)
1. Download ZIP ini dan ekstrak.
2. Buat repository GitHub baru (mis. `zahirah-clinic`).
3. Upload semua file/folder ke repo (drag & drop).
4. Buka **Settings → Pages** → pilih branch `main` dan root `/` → Save.
5. Tunggu beberapa saat, situs akan tampil di URL GitHub Pages repo tersebut.

## Kustomisasi Cepat
- Ganti nomor WhatsApp di bagian **Kontak** (`index.html`).
- Ubah daftar produk/layanan di konstanta `PRODUCTS` (`assets/app.js`).
- Ganti gambar dengan URL Anda sendiri (Unsplash saat ini sebagai placeholder).
