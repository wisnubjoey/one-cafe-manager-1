

--- tb_role ---
Kolom	Tipe Data	Keterangan
id_role	INT (PK)	ID unik jabatan (Auto Increment).
nama_role	VARCHAR	Nama peran (misal: Kasir, Koki, Pelayan).

--- tb_karyawan ---
Kolom	Tipe Data	Keterangan
id_karyawan	INT (PK)	ID unik karyawan.
name	VARCHAR	Nama karyawan.
contact	VARCHAR	Nomor telepon/WhatsApp.
id_role	INT (FK)	Relasi ke tb_role.
status	BOOLEAN/ENUM	Menandakan karyawan masih bekerja (1) atau sudah keluar (0).

--- tb_shift ---
Kolom	Tipe Data	Keterangan
id_shift	INT (PK)	ID unik shift.
nama_shift	VARCHAR	Nama shift (misal: Pagi, Malam, Middle, Libur, Lembur).
jam_mulai	TIME	Waktu mulai (misal: 08:00:00). Kosongkan jika shift "Libur".
jam_selesai	TIME	Waktu selesai (misal: 16:00:00).

--- tb_jadwal ---
Kolom	Tipe Data	Keterangan
id_jadwal	INT (PK)	ID unik record jadwal.
tanggal	DATE	Tanggal jadwal kerja.
id_karyawan	INT (FK)	Karyawan yang ditugaskan.
id_shift	INT (FK)	Shift kerja yang ditugaskan di tanggal tersebut.
status_kehadiran	ENUM	(Hadir, Sakit, Izin, Alfa) -> Diisi owner saat hari H sebagai rekap. Default: 'Belum Hadir'.
catatan	TEXT	Catatan tambahan dari owner (misal: "Ganti shift").