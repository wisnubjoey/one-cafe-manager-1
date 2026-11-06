CREATE TYPE "public"."status_kehadiran" AS ENUM('Belum Hadir', 'Hadir', 'Sakit', 'Izin', 'Alfa');--> statement-breakpoint
CREATE TABLE "tb_jadwal" (
	"id_jadwal" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_jadwal_id_jadwal_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tanggal" date NOT NULL,
	"id_karyawan" integer NOT NULL,
	"id_shift" integer NOT NULL,
	"status_kehadiran" "status_kehadiran" DEFAULT 'Belum Hadir' NOT NULL,
	"catatan" text
);
--> statement-breakpoint
CREATE TABLE "tb_karyawan" (
	"id_karyawan" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_karyawan_id_karyawan_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"contact" varchar(255) NOT NULL,
	"id_role" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tb_role" (
	"id_role" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_role_id_role_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nama_role" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tb_shift" (
	"id_shift" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tb_shift_id_shift_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nama_shift" varchar(255) NOT NULL,
	"jam_mulai" time,
	"jam_selesai" time
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "tb_jadwal" ADD CONSTRAINT "tb_jadwal_id_karyawan_tb_karyawan_id_karyawan_fk" FOREIGN KEY ("id_karyawan") REFERENCES "public"."tb_karyawan"("id_karyawan") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_jadwal" ADD CONSTRAINT "tb_jadwal_id_shift_tb_shift_id_shift_fk" FOREIGN KEY ("id_shift") REFERENCES "public"."tb_shift"("id_shift") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_karyawan" ADD CONSTRAINT "tb_karyawan_id_role_tb_role_id_role_fk" FOREIGN KEY ("id_role") REFERENCES "public"."tb_role"("id_role") ON DELETE no action ON UPDATE no action;