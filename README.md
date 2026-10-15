# IKB Sumut

## Identitas Proyek

| Keterangan | Identitas |
| --- | --- |
| Nama aplikasi | IKB Sumut |
| Nama lengkap | Indeks Kerentanan Bencana Sumatera Utara |
| Nama repository | `ikb-sumut-netlify` |
| Cakupan wilayah | 33 kabupaten/kota di Sumatera Utara |
| Jenis aplikasi | Website statis hasil ekspor aplikasi PHP/MySQL |
| Teknologi | HTML, CSS hasil kompilasi Tailwind, JavaScript, Leaflet, dan GeoJSON |
| Hosting | Netlify |
| Alamat website | https://ikb-ditact.netlify.app/ |

IKB Sumut merupakan website penelitian yang menyajikan kerentanan wilayah melalui peta interaktif dan tabel data. Informasi mencakup 13 indikator, empat aspek—lingkungan, ekonomi, fisik, dan sosial—serta kerentanan keseluruhan.

Website menyediakan halaman Peta, Data, Metodologi, dan Tentang; light/dark mode; serta unduhan CSV dan XLSX untuk seluruh data atau aspek yang sedang ditampilkan.


## Struktur File

Repository ini menyimpan **seluruh isi folder hasil ekspor `dist` langsung di root repository**. File `index.html` berada sejajar dengan `README.md`.

| Lokasi | Isi dan fungsi |
| --- | --- |
| `README.md` | Identitas proyek dan dokumentasi struktur file |
| `index.html` | Halaman awal yang menampilkan peta kerentanan |
| `map/index.html` | Halaman utama peta pada jalur `/map/` |
| `map/<kode-layer>/index.html` | Halaman peta untuk masing-masing indikator, aspek, atau kerentanan keseluruhan |
| `data/index.html` | Halaman awal tabel data |
| `data/<kode-aspek>/index.html` | Tabel data berdasarkan aspek yang dipilih |
| `data/ikbs-data.json` | Snapshot data hasil ekspor aplikasi |
| `data/sumut-kabkota.geojson` | Geometri batas administrasi kabupaten/kota Sumatera Utara |
| `data/sumut-kabkota.meta.json` | Metadata sumber batas administrasi, jika disertakan hasil ekspor |
| `methodology/index.html` | Penjelasan metodologi, indikator, aspek, dan kategori |
| `about/index.html` | Informasi website, peneliti, dan dosen pembimbing |
| `assets/css/app.css` | CSS siap pakai hasil kompilasi Tailwind |
| `assets/js/app.js` | Interaksi umum website, termasuk pengaturan tema dan navigasi filter statis |
| `assets/js/map.js` | Inisialisasi peta, pemuatan GeoJSON, pewarnaan wilayah, legenda, dan popup |
| `assets/js/data-download.js` | Pembuatan unduhan CSV/XLSX dengan cakupan Semua Data atau Sesuai Filter |
| `assets/images/` | Gambar pendukung website |
| `assets/images/team/peneliti.png` | Foto peneliti |
| `assets/images/team/pembimbing.png` | Foto dosen pembimbing |
| `vendor/leaflet/dist/leaflet.js` | Library JavaScript Leaflet |
| `vendor/leaflet/dist/leaflet.css` | Stylesheet Leaflet |
| `vendor/leaflet/dist/images/` | Gambar pendukung kontrol dan marker Leaflet |
| `404.html` | Halaman untuk alamat yang tidak ditemukan |
| `_headers` | Pengaturan HTTP headers pada Netlify, jika disertakan hasil ekspor |
| `_redirects` | Aturan redirect pada Netlify, jika disertakan hasil ekspor |
| `.gitignore` | Daftar file lokal yang tidak disimpan dalam Git, jika tersedia |

`<kode-layer>` dan `<kode-aspek>` adalah penanda pola folder, bukan nama folder literal. Contoh: `map/variable_fdi/index.html` dan `data/environmental/index.html`.

File favicon dan aset tambahan mengikuti hasil ekspor proyek. Pertahankan lokasi serta nama file sesuai referensi di HTML. Struktur ini mengacu pada susunan exporter proyek; sesuaikan dokumentasi apabila file dipindahkan atau ditambahkan secara manual.

### Hubungan Antarfile

- HTML menyimpan tampilan halaman serta data yang telah diekspor dari aplikasi utama.
- `app.css` mengatur tampilan seluruh halaman.
- `app.js` menangani interaksi umum, sedangkan `map.js` menangani peta dengan library Leaflet.
- GeoJSON menyediakan geometri wilayah; tile OpenStreetMap menyediakan peta dasar melalui internet.
- `data-download.js` membaca payload data dalam halaman Data untuk menghasilkan CSV atau XLSX di browser.
- `_headers` dan `_redirects`, bila tersedia, digunakan Netlify saat menyajikan website.

Nama internal seperti `variable_fdi` dan `environmental` dipertahankan sebagai kode teknis. Istilah yang terlihat pada antarmuka menggunakan **Indikator** dan **Aspek**.

## Menjalankan di Lokal

Dari folder repository, jalankan:

```bash
cd "$HOME/Developer/ikb-sumut-netlify"
php -S localhost:8080 -t .
```

Buka http://localhost:8080. Hentikan server dengan **Ctrl + C**.

PHP hanya digunakan sebagai server file statis; **MySQL dan proses build tidak diperlukan**. Jangan membuka `index.html` melalui `file://`, karena website menggunakan URL aset dari root dan pemuatan GeoJSON melalui HTTP. Peta dasar OpenStreetMap memerlukan koneksi internet.

## Pembaruan dan Deployment

Untuk pembaruan data, lakukan impor dan ekspor ulang pada repository PHP utama, kemudian salin hasil `dist` terbaru ke repository ini. Mengganti JSON saja tidak cukup karena sebagian data juga tertanam di HTML. Perubahan manual pada halaman statis perlu diselaraskan dengan template sumber sebelum ekspor ulang agar tidak tertimpa.

Deployment dilakukan dengan mengunggah seluruh folder website siap pakai ke proyek Netlify yang sama. Pastikan `index.html` berada di root folder upload dan semua aset ikut disertakan. Push GitHub dan upload manual Netlify merupakan dua langkah terpisah.
