import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  varchar,
} from "drizzle-orm/pg-core";

export const statusKehadiranEnum = pgEnum("status_kehadiran", [
  "Belum Hadir",
  "Hadir",
  "Sakit",
  "Izin",
  "Alfa",
]);

export const roleTable = pgTable("tb_role", {
  idRole: integer("id_role").primaryKey().generatedAlwaysAsIdentity(),
  namaRole: varchar("nama_role", { length: 255 }).notNull(),
});

export const karyawanTable = pgTable("tb_karyawan", {
  idKaryawan: integer("id_karyawan").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 255 }).notNull(),
  idRole: integer("id_role")
    .notNull()
    .references(() => roleTable.idRole),
  status: boolean("status").default(true).notNull(),
});

export const shiftTable = pgTable("tb_shift", {
  idShift: integer("id_shift").primaryKey().generatedAlwaysAsIdentity(),
  namaShift: varchar("nama_shift", { length: 255 }).notNull(),
  jamMulai: time("jam_mulai"),
  jamSelesai: time("jam_selesai"),
});

export const jadwalTable = pgTable("tb_jadwal", {
  idJadwal: integer("id_jadwal").primaryKey().generatedAlwaysAsIdentity(),
  tanggal: date("tanggal").notNull(),
  idKaryawan: integer("id_karyawan")
    .notNull()
    .references(() => karyawanTable.idKaryawan),
  idShift: integer("id_shift")
    .notNull()
    .references(() => shiftTable.idShift),
  statusKehadiran: statusKehadiranEnum("status_kehadiran")
    .default("Belum Hadir")
    .notNull(),
  catatan: text("catatan"),
});
