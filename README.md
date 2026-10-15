# IKB Sumatera Utara

Website visualisasi **Indeks Kerentanan Bencana Sumatera Utara (IKB)** untuk menjelajahi data indeks, kategori, peringkat, dan peta interaktif kabupaten/kota di Sumatera Utara.

## Tentang aplikasi

Aplikasi menampilkan data untuk **33 kabupaten/kota di Sumatera Utara**, dengan cakupan:

- 4 dimensi dan 13 variabel.
- 18 pilihan layer peta.
- Tabel indeks, kategori, dan peringkat wilayah.
- Peta interaktif berbasis Leaflet dengan OpenStreetMap.

Website membaca data yang tersedia dalam berkas JSON dan GeoJSON. Nilai, indeks, kategori, dan peringkat ditampilkan berdasarkan dataset yang disertakan pada aplikasi.

## Teknologi

- HTML, CSS, dan JavaScript.
- Tailwind CSS untuk styling antarmuka.
- Leaflet untuk peta interaktif.
- OpenStreetMap sebagai sumber peta dasar.
- JSON dan GeoJSON untuk data visualisasi.
- Netlify untuk hosting dan deployment.

## Menjalankan secara lokal

Jalankan server HTTP lokal dari direktori root project. Pilih salah satu opsi berikut.

### Menggunakan PHP

```bash
php -S localhost:8080 -t .
```

### Menggunakan Python 3 (alternatif)

```bash
python3 -m http.server 8080
```

Setelah server berjalan, buka [http://localhost:8080](http://localhost:8080) di browser. PHP pada perintah di atas berfungsi sebagai server lokal untuk menyajikan file website; aplikasi tidak memerlukan backend PHP atau database saat dijalankan. Untuk menghentikan server, tekan `Ctrl+C` pada terminal.

## Deploy ke Netlify

Project ini dapat di-host sebagai website statis di Netlify.

Jika file `index.html` dan folder aset berada langsung di root repository, gunakan pengaturan berikut:

| Pengaturan | Nilai |
|---|---|
| Build command | Kosong / tidak digunakan |
| Publish directory | `.` |
| Production branch | `main` (atau branch production yang digunakan) |

Langkah deployment:

1. Push project ke GitHub.
2. Di Netlify, pilih opsi untuk mengimpor project dari Git dan hubungkan repository.
3. Atur Build command agar kosong dan Publish directory menjadi `.`.
4. Jalankan deployment.

Setelah repository terhubung, push baru ke branch production dapat memicu deployment ulang sesuai pengaturan Netlify.

## Struktur project

Contoh struktur berkas:

```text
.
├── README.md
├── index.html
├── assets/
└── data/
    └── ikbs-data.json
```

Struktur di atas merupakan ilustrasi. Pertahankan struktur direktori dan nama berkas yang benar-benar digunakan oleh project, termasuk berkas CSS/JavaScript, gambar, JSON, GeoJSON, dan aset lain yang dibutuhkan halaman.

## Data dan klasifikasi

Dataset mencakup 33 wilayah, 4 dimensi, 13 variabel, dan 18 layer peta. Kategori untuk 13 variabel menggunakan metode **Natural Breaks (Jenks)** dengan lima kelas untuk setiap variabel. Indeks dan kategori empat dimensi, indeks keseluruhan, serta peringkat mengikuti dataset indeks yang digunakan.

Website menampilkan nilai dan klasifikasi dari dataset yang tersedia. Pastikan konsistensi kode wilayah dan kelengkapan data ketika melakukan pembaruan.

## Memperbarui data

Untuk memperbarui dataset atau tampilan website:

1. Perbarui berkas JSON/GeoJSON yang digunakan aplikasi dengan tetap mempertahankan struktur datanya.
2. Pastikan kode wilayah konsisten dan seluruh layer memiliki data yang sesuai.
3. Jalankan website secara lokal dan periksa tabel, filter, peta, serta seluruh pilihan layer.
4. Commit dan push perubahan ke GitHub.
5. Pastikan deployment Netlify selesai, lalu periksa website yang dipublikasikan.

