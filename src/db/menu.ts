import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const tipeMenuEnum = pgEnum("tipe_menu", ["final", "semi-finished"]);

export const kategoriMenuTable = pgTable("tb_kategori_menu", {
  idKategori: integer("id_kategori").primaryKey().generatedAlwaysAsIdentity(),
  nama: varchar("nama", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const menuTable = pgTable("tb_menu", {
  idMenu: integer("id_menu").primaryKey().generatedAlwaysAsIdentity(),
  idKategori: integer("id_kategori").references(
    () => kategoriMenuTable.idKategori,
  ),
  judul: varchar("judul", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  pathGambar: varchar("path_gambar", { length: 255 }),
  catatanTeknis: text("catatan_teknis"),
  tipe: tipeMenuEnum("tipe").notNull().default("final"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const bahanMenuTable = pgTable("tb_bahan_menu", {
  idBahan: integer("id_bahan").primaryKey().generatedAlwaysAsIdentity(),
  idMenu: integer("id_menu")
    .notNull()
    .references(() => menuTable.idMenu, { onDelete: "cascade" }),
  namaBahan: varchar("nama_bahan", { length: 150 }).notNull(),
  jumlah: numeric("jumlah", { precision: 10, scale: 2 }).notNull(),
  satuan: varchar("satuan", { length: 20 }).notNull(),
});

export const langkahMenuTable = pgTable("tb_langkah_menu", {
  idLangkah: integer("id_langkah").primaryKey().generatedAlwaysAsIdentity(),
  idMenu: integer("id_menu")
    .notNull()
    .references(() => menuTable.idMenu, { onDelete: "cascade" }),
  urutan: integer("urutan").notNull(),
  instruksi: text("instruksi").notNull(),
});

export const alatMenuTable = pgTable("tb_alat_menu", {
  idAlat: integer("id_alat").primaryKey().generatedAlwaysAsIdentity(),
  idMenu: integer("id_menu")
    .notNull()
    .references(() => menuTable.idMenu, { onDelete: "cascade" }),
  namaAlat: varchar("nama_alat", { length: 150 }).notNull(),
  spesifikasi: varchar("spesifikasi", { length: 255 }),
});
