# Gajian

Web app (PWA) buat ngatur duit gajian: dompet/rekening, kantong, kategori, catat suara, kalender aktivitas, dan laporan.

Semua data disimpan di perangkat (localStorage), nggak dikirim ke server.

**Pasang di iPhone:** buka link GitHub Pages-nya di Safari → Share → Add to Home Screen.

## Sinkron (Supabase)

1. Jalankan `supabase.sql` di Supabase → SQL Editor.
2. Isi `config.js` dengan Project URL + anon/publishable key (bukan service_role).
3. Supabase → Authentication → URL Configuration: set Site URL ke alamat app.

Data tetap disimpan lokal (bisa offline) dan disinkron per-record ke tabel `gajian_data` (dilindungi RLS: tiap user cuma bisa baca/tulis datanya sendiri).
