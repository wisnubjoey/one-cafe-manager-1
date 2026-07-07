CREATE TYPE "public"."tipe_menu" AS ENUM('final', 'semi-finished');--> statement-breakpoint
CREATE TABLE "tb_alat_menu" (
	"id_alat" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_alat_menu_id_alat_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id_menu" integer NOT NULL,
	"nama_alat" varchar(150) NOT NULL,
	"spesifikasi" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "tb_bahan_menu" (
	"id_bahan" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_bahan_menu_id_bahan_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id_menu" integer NOT NULL,
	"nama_bahan" varchar(150) NOT NULL,
	"jumlah" numeric(10, 2) NOT NULL,
	"satuan" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tb_kategori_menu" (
	"id_kategori" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_kategori_menu_id_kategori_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nama" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	CONSTRAINT "tb_kategori_menu_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tb_langkah_menu" (
	"id_langkah" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_langkah_menu_id_langkah_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id_menu" integer NOT NULL,
	"urutan" integer NOT NULL,
	"instruksi" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tb_menu" (
	"id_menu" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_menu_id_menu_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"id_kategori" integer,
	"judul" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"path_gambar" varchar(255),
	"catatan_teknis" text,
	"tipe" "tipe_menu" DEFAULT 'final' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tb_menu_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "tb_alat_menu" ADD CONSTRAINT "tb_alat_menu_id_menu_tb_menu_id_menu_fk" FOREIGN KEY ("id_menu") REFERENCES "public"."tb_menu"("id_menu") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_bahan_menu" ADD CONSTRAINT "tb_bahan_menu_id_menu_tb_menu_id_menu_fk" FOREIGN KEY ("id_menu") REFERENCES "public"."tb_menu"("id_menu") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_langkah_menu" ADD CONSTRAINT "tb_langkah_menu_id_menu_tb_menu_id_menu_fk" FOREIGN KEY ("id_menu") REFERENCES "public"."tb_menu"("id_menu") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_menu" ADD CONSTRAINT "tb_menu_id_kategori_tb_kategori_menu_id_kategori_fk" FOREIGN KEY ("id_kategori") REFERENCES "public"."tb_kategori_menu"("id_kategori") ON DELETE no action ON UPDATE no action;