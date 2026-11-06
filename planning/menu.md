
--- menu_item ---
Nama Kolom (Field)	Tipe Data	Atribut / Constraint	Keterangan
id	INT	Primary Key, Auto Increment	ID unik menu
category_id	INT	Foreign Key (categories.id), Nullable	Menghubungkan menu ke tabel kategori
title	VARCHAR(150)	Not Null	Nama menu (cth: Espresso, Nasi Goreng)
slug	VARCHAR(150)	Unique, Not Null	URL unik untuk halaman detail menu
image_path	VARCHAR(255)	Nullable	Lokasi penyimpanan file foto menu
technical_notes	TEXT	Nullable	Catatan teknis khusus (suhu, alat, dll)
type	ENUM('final', 'semi-finished')	Not Null, Default 'final'	final: Menu langsung konsumsi
semi-finished: Bahan jadi/setengah jadi
created_at	TIMESTAMP	Default CURRENT_TIMESTAMP	Waktu menu ditambahkan
updated_at	TIMESTAMP	On Update CURRENT_TIMESTAMP	Waktu terakhir menu diubah

--- menu_ingredients ---
Nama Kolom (Field)	Tipe Data	Atribut / Constraint	Keterangan
id	INT	Primary Key, Auto Increment	ID unik detail bahan
menu_id	INT	Foreign Key (menus.id) ON DELETE CASCADE	Menghubungkan bahan ke menu spesifik
ingredient_name	VARCHAR(150)	Not Null	Nama bahan baku (cth: Tepung Terigu)
quantity	DECIMAL(10,2)	Not Null	Jumlah/takaran angka (cth: 250, 1.5)
unit	VARCHAR(20)	Not Null	Satuan ukuran (cth: gram, ml, sdm, pcs)

--- menu_categories ---
Nama Kolom (Field)	Tipe Data	Atribut / Constraint	Keterangan
id	INT	Primary Key, Auto Increment	ID unik kategori
name	VARCHAR(100)	Not Null	Nama kategori (cth: Makanan Utama, Dessert)
slug	VARCHAR(100)	Unique, Not Null	URL ramah lingkungan (cth: makanan-utama)

--- menu_steps ---
Nama Kolom (Field)	Tipe Data	Atribut / Constraint	Keterangan
id	INT	Primary Key, Auto Increment	ID unik langkah
menu_id	INT	Foreign Key (menus.id) ON DELETE CASCADE	Menghubungkan langkah ke menu spesifik
step_number	INT	Not Null	Urutan langkah (cth: 1, 2, 3)
instruction	TEXT	Not Null	Detail instruksi cara pembuatan

--- menu_tools ---
Nama Kolom (Field)	Tipe Data	Atribut / Constraint	Keterangan
id	INT	Primary Key, Auto Increment	ID unik peralatan
menu_id	INT	Foreign Key (menus.id) ON DELETE CASCADE	Menghubungkan alat ke menu spesifik
tool_name	VARCHAR(150)	Not Null	Nama alat (cth: Wajan Teflon, Timbangan Digital)
specification	VARCHAR(255)	Nullable	Detail alat (cth: Ukuran 24cm, Akurasi 0.1 gram)