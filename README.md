# IKB Sumut — Website Statis

Website penelitian **Indeks Kerentanan Bencana Sumatera Utara**, dengan cakupan 33 kabupaten/kota. Repository ini menyimpan hasil ekspor statis dari aplikasi PHP/MySQL untuk presentasi dan deployment ke Netlify.

Website: [ikb-ditact.netlify.app](https://ikb-ditact.netlify.app/)

## Isi repository

**Letakkan seluruh isi folder `dist` di root repository ini.** Dengan susunan tersebut, `index.html` berada sejajar dengan `README.md`, bukan di dalam subfolder `dist` lagi.

| File atau folder | Fungsi |
| --- | --- |
| `index.html` | Halaman awal peta |
| `map/` | Halaman peta untuk pilihan layer |
| `data/` | Halaman tabel per aspek, snapshot JSON, dan GeoJSON batas wilayah |
| `methodology/` | Halaman metodologi |
| `about/` | Halaman tentang penelitian dan profil tim |
| `assets/css/` | CSS Tailwind yang sudah dikompilasi |
| `assets/js/` | Interaksi tema, peta, filter, dan unduhan |
| `assets/images/` | Gambar dan foto profil |
| `vendor/leaflet/` | Library Leaflet beserta CSS dan gambar pendukung |
| `404.html` | Halaman tidak ditemukan |
| `_headers` | Pengaturan HTTP headers untuk Netlify, jika dihasilkan exporter |
| `_redirects` | Aturan redirect untuk Netlify, jika dihasilkan exporter |
| `README.md` | Dokumentasi repository |

Pertahankan seluruh file tambahan dari hasil ekspor, termasuk favicon dan konfigurasi hosting. Jangan memindahkan aset tanpa memperbarui URL yang merujuk kepadanya.

## Teknologi dan arsitektur

Versi ini menggunakan HTML, CSS, JavaScript, Leaflet, dan GeoJSON. CSS sudah dikompilasi sehingga menjalankan website tidak memerlukan Node.js, npm, atau Tailwind CLI.

PHP/MySQL digunakan pada repository pengembangan untuk membaca data dan menghasilkan halaman statis. Hasil ekspornya disalin ke repository ini. Di Netlify, browser menerima HTML dan aset yang sudah jadi; tidak ada proses PHP atau koneksi MySQL.

Nilai data tertanam dalam halaman HTML dan payload JavaScript/JSON. Pilihan layer atau aspek membuka halaman statis yang sesuai. JavaScript menangani peta, tema, dan pembuatan file unduhan.

## Fitur

- Peta interaktif untuk 33 kabupaten/kota Sumatera Utara.
- 18 pilihan layer: 13 indikator, empat aspek, dan kerentanan keseluruhan.
- Aspek lingkungan, ekonomi, fisik, dan sosial.
- Popup wilayah, legenda kategori, dan tabel data.
- Halaman Metodologi dan Tentang.
- Light mode dan dark mode.
- Unduhan CSV dan XLSX dengan cakupan **Sesuai Filter** atau **Semua Data**.

## Menjalankan di lokal

### Persyaratan

- Browser modern.
- PHP CLI untuk server lokal. PHP 8.3 dapat digunakan.
- Alternatif: Python 3 jika PHP tidak tersedia.

MySQL tidak diperlukan. PHP pada langkah berikut hanya berfungsi sebagai server file statis.

### Menggunakan PHP

Buka terminal pada folder repository. Contoh lokasi di Mac:

```bash
cd "$HOME/Developer/ikb-sumut-netlify"
php -S localhost:8080 -t .
```

Buka [http://localhost:8080](http://localhost:8080).

Biarkan terminal berjalan selama website digunakan. Untuk menghentikan server, tekan **Ctrl + C**.

Jika port 8080 sudah digunakan:

```bash
php -S localhost:8081 -t .
```

Kemudian buka [http://localhost:8081](http://localhost:8081).

### Alternatif menggunakan Python

Dari root repository:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Buka [http://127.0.0.1:8080](http://127.0.0.1:8080).

### Mengapa perlu server lokal?

Jangan menjalankan website dengan klik dua kali `index.html` melalui alamat `file://`. Website menggunakan URL aset dari root, misalnya `/assets/`, serta pembacaan GeoJSON melalui HTTP. Server lokal memastikan alamat dan pemuatan data tersebut bekerja.

Aturan `_headers` dan `_redirects` Netlify tidak diterapkan oleh server bawaan PHP/Python. Pengujian lokal memeriksa halaman dan fitur; perilaku khusus hosting perlu diperiksa kembali setelah deployment.

### Koneksi internet

HTML, data, Leaflet, dan aset website tersedia dari repository. Tile peta dasar OpenStreetMap tetap memerlukan internet. Jika sedang offline, peta dasar dapat kosong meskipun data dan batas wilayah lokal masih tersedia.

## Menggunakan website

### Peta

1. Buka tab **Peta**.
2. Pilih layer kerentanan keseluruhan, aspek, atau indikator.
3. Klik **Terapkan**.
4. Gunakan legenda untuk membaca kategori dan klik wilayah untuk melihat rinciannya.

### Data dan unduhan

1. Buka tab **Data**.
2. Pilih aspek, lalu klik **Tampilkan**.
3. Pilih cakupan unduhan.
4. Klik **Unduh CSV** atau **Unduh XLSX**.

| Cakupan | Isi |
| --- | --- |
| Sesuai Filter | Seluruh wilayah beserta indikator aspek yang sedang ditampilkan, indeks/kategori aspek, indeks/kategori keseluruhan, dan peringkat |
| Semua Data | Seluruh wilayah, 13 indikator, empat indeks aspek dan kategorinya, indeks/kategori keseluruhan, serta peringkat |

Kedua opsi menyertakan nama, tipe, dan luas wilayah. **Semua Data** berisi 33 baris wilayah dan 27 kolom, di luar baris judul kolom. KDPKAB digunakan sebagai kunci internal dan tidak ditampilkan sebagai indikator.

Jika baru mengubah pilihan aspek, klik **Tampilkan** dahulu agar cakupan **Sesuai Filter** mengikuti halaman yang terbaru.

### Format dan presisi unduhan

- CSV memakai encoding UTF-8 dengan BOM, delimiter titik koma (`;`), dan tanda desimal titik (`.`).
- Jika CSV terbuka dalam satu kolom, gunakan fitur impor teks/CSV Excel dan pilih delimiter titik koma.
- XLSX merupakan workbook Excel berformat OOXML. Angka disimpan sebagai teks untuk mempertahankan presisi desimal sumber yang dapat melebihi batas 15 digit signifikan Excel.
- Angka yang diunduh mengikuti nilai sumber pada hasil ekspor. Tampilan website dapat membulatkan angka untuk keterbacaan.
- Nilai kosong tetap kosong; angka nol tetap disertakan.
- Untuk perhitungan di Excel, konversikan salinan sel teks menjadi angka dengan memperhatikan batas presisi Excel.

Unduhan dibuat langsung di browser dan tidak memerlukan API atau layanan konversi eksternal.

## Data dan kategori

Sumber data penelitian mencakup **Official Statistics, Penginderaan Jauh, dan Point of Interest (POI)**.

Snapshot pembaruan Oktober 2026 bersumber dari `HASIL_IKB_FINAL2.xlsx`:

| Data | Sumber |
| --- | --- |
| Identitas wilayah, luas, dan 13 indikator | Sheet `01_Data_Awal` |
| Empat indeks aspek dan kategorinya | Sheet `13_IKB_Final` |
| Indeks keseluruhan yang ditampilkan | Kolom `IKB_100`, skala 0–100 |
| Kategori keseluruhan dan peringkat | Kolom hasil penelitian pada `13_IKB_Final` |

Kategori indikator menggunakan **Natural Breaks (Jenks), lima kelas**. Kategori aspek dan keseluruhan mengikuti hasil penelitian dalam Excel. Indeks penelitian tidak dihitung ulang oleh versi statis.

Label **Belum tersedia** menunjukkan data/kategori yang tidak tersedia, bukan kelas kerentanan tambahan.

Nama dataset yang digunakan aplikasi adalah **IKBS Sumatera Utara 2025**. Tahun observasi tidak tercantum pada workbook final; nama dataset tersebut mengikuti konfigurasi yang telah ada, bukan hasil penetapan tahun dari nama file atau tanggal deployment.

Batas administrasi menggunakan GeoJSON sumber **Badan Informasi Geospasial (BIG), edisi 2022 revisi Desember 2022**, yang telah digeneralisasi untuk tampilan web. Peta dasar menggunakan OpenStreetMap. Pertahankan atribusi sumber pada peta.

## Memperbarui data atau halaman

Repository pengembangan PHP/MySQL menjadi sumber perubahan utama. Urutan pembaruan:

1. Perbarui dan verifikasi data pada repository pengembangan.
2. Lakukan perubahan template atau JavaScript di repository pengembangan.
3. Kompilasi CSS dan jalankan exporter.
4. Uji `dist` baru secara lokal.
5. Sinkronkan seluruh isi `dist` baru ke root repository statis ini.
6. Periksa perubahan, commit, push, lalu deploy manual ke Netlify.

Perintah build berikut dijalankan **di repository PHP utama**, bukan di repository statis:

```bash
cd "$HOME/Developer/ikbs-sumut"
tailwindcss -i ./tailwind/input.css -o ./public/assets/css/app.css --minify
php tools/export-netlify.php
```

Jangan hanya mengganti `data/ikbs-data.json`: sebagian nilai dan payload unduhan tertanam di HTML. Ekspor ulang seluruh website agar peta, tabel, dan unduhan konsisten.

Perubahan langsung pada HTML statis dapat dipakai untuk koreksi sementara, tetapi perlu diterapkan juga pada template sumber agar tidak hilang pada ekspor berikutnya.

### Menyalin hasil ekspor ke repo statis

Contoh berikut mengasumsikan repo statis hanya berisi hasil ekspor, README, konfigurasi Git, dan file dokumentasi yang disebut dalam pengecualian. `rsync --delete` menghapus file tujuan yang tidak ada pada sumber; periksa dry-run terlebih dahulu dan tambahkan pengecualian jika ada file lain yang harus dipertahankan.

Pratinjau perubahan:

```bash
rsync -avn --delete \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='README.md' \
  --exclude='docs/' \
  --exclude='netlify.toml' \
  "$HOME/Developer/ikbs-sumut/dist/" \
  "$HOME/Developer/ikb-sumut-netlify/"
```

Setelah daftar perubahan sesuai, jalankan salinan sebenarnya:

```bash
rsync -av --delete \
  --exclude='.git/' \
  --exclude='.gitignore' \
  --exclude='README.md' \
  --exclude='docs/' \
  --exclude='netlify.toml' \
  "$HOME/Developer/ikbs-sumut/dist/" \
  "$HOME/Developer/ikb-sumut-netlify/"
```

Jika `netlify.toml` dipelihara di repo statis, periksa kesesuaiannya dengan hasil ekspor terbaru. Jangan menyalin `.git` dari repository utama.

## Menyimpan perubahan ke GitHub

Jalankan dari repository statis setelah pengujian:

```bash
cd "$HOME/Developer/ikb-sumut-netlify"
git status --short
git diff --check
git add .
git diff --cached --stat
git diff --cached --check
git commit -m "chore: update IKB Sumut static release"
git push origin main
```

Perintah tersebut mengasumsikan repository Git sudah dibuat, remote `origin` sudah dikonfigurasi, dan branch yang digunakan adalah `main`.

Repository ini hanya memuat file website yang siap disajikan beserta dokumentasinya. Jangan menyertakan konfigurasi kredensial PHP, dump MySQL, atau backup lokal.

## Deployment manual ke Netlify

Alur proyek ini menggunakan upload manual. Push GitHub sendiri tidak memperbarui Netlify kecuali integrasi deployment Git sudah dikonfigurasi secara terpisah.

1. Pastikan hasil ekspor dan pengujian lokal sudah berhasil.
2. Buka proyek Netlify yang digunakan oleh `ikb-ditact.netlify.app`.
3. Upload folder **`dist` terbaru dari repository PHP utama**, yang isinya sudah disinkronkan ke repository ini.
4. Pastikan `index.html` berada langsung di root folder upload. Sertakan seluruh aset, GeoJSON, halaman subfolder, dan aturan hosting hasil ekspor.
5. Setelah deployment selesai, uji website publik dan fitur unduhannya.

Jika mengunggah dari salinan repo statis, buat folder deployment yang hanya berisi file website. Jangan menyertakan direktori `.git`. Jangan membuat folder bersarang yang menyebabkan `index.html` berada satu tingkat terlalu dalam.

Jika di kemudian hari repository ini dihubungkan ke deployment Git Netlify, gunakan root repository sebagai publish directory (`.`) dan kosongkan build command, karena semua file sudah dibangun sebelumnya. Integrasi tersebut belum otomatis aktif hanya karena repository tersedia di GitHub.

## Checklist sebelum presentasi atau deployment

- [ ] Semua tab terbuka: Peta, Data, Metodologi, Tentang.
- [ ] Seluruh pilihan layer dan aspek menampilkan data yang sesuai.
- [ ] Peta, batas wilayah, legenda, dan popup berfungsi.
- [ ] Nama aplikasi tampil sebagai IKB Sumut.
- [ ] Istilah tampilan menggunakan Aspek dan Indikator.
- [ ] Light/dark mode berfungsi.
- [ ] CSV dan XLSX berhasil diunduh untuk Sesuai Filter dan Semua Data.
- [ ] XLSX dapat dibuka di Excel; isi cocok dengan cakupan yang dipilih.
- [ ] Foto, CSS, favicon, dan Leaflet berhasil dimuat.
- [ ] Website publik diperiksa kembali setelah deployment.

Pembanding untuk snapshot `HASIL_IKB_FINAL2.xlsx`:

| Wilayah | IKB skala 0–100, dibulatkan 5 desimal | Kategori |
| --- | ---: | --- |
| Kota Sibolga | 66,47879 | Tinggi |
| Kota Tanjungbalai | 60,53947 | Tinggi |
| Kota Medan | 57,52051 | Tinggi |

Distribusi kategori keseluruhan: **11 Rendah, 12 Sedang, 10 Tinggi**. Perbarui pembanding ini jika sumber penelitian berubah.

## Troubleshooting

| Kendala | Pemeriksaan |
| --- | --- |
| `Address already in use` | Gunakan server yang sudah berjalan atau pilih port lain, misalnya 8081. |
| CSS atau JavaScript gagal dimuat | Pastikan server dijalankan dari folder yang memiliki `index.html`, `assets`, dan `vendor`. |
| Leaflet gagal dimuat | Periksa `/vendor/leaflet/dist/leaflet.js` dan `/vendor/leaflet/dist/leaflet.css`; keduanya harus tersedia. |
| Peta dasar kosong | Periksa koneksi internet dan akses ke tile OpenStreetMap. |
| Batas wilayah hilang | Periksa `/data/sumut-kabkota.geojson` dan error pada Console/Network browser. |
| Tab lain 404 | Pastikan folder halaman ikut disalin dan diunggah, bukan hanya `index.html`. |
| Tampilan masih versi lama | Lakukan hard refresh atau buka incognito; pastikan deployment menggunakan hasil ekspor terbaru. |
| Tombol unduh tidak bereaksi | Aktifkan JavaScript dan periksa pemuatan `/assets/js/data-download.js`. |
| CSV menjadi satu kolom | Impor dengan delimiter titik koma dan encoding UTF-8. |
| Angka XLSX dianggap teks | Ini disengaja untuk menjaga presisi sumber. Konversikan salinan jika diperlukan untuk perhitungan. |
| Mengubah JSON tidak memperbarui tabel | Bangun ulang seluruh `dist` dari repository utama karena data juga tertanam di HTML. |

## Batas penggunaan

Versi statis tidak menyediakan login admin, penyuntingan data melalui browser, atau sinkronisasi langsung dengan MySQL. Data hanya berubah setelah hasil ekspor baru dipasang. Untuk presentasi, jalankan server lokal sebelum sesi dan pastikan internet tersedia jika peta dasar diperlukan.
