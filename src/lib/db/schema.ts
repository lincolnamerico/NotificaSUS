import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const grauDanoEnum = pgEnum("grau_dano", ["leve", "moderado", "grave", "obito"]);

export const papelEnum = pgEnum("papel", ["admin", "gestor", "visualizador"]);

export const usf = pgTable("usf", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 50 }).unique().notNull(),
  nome: varchar("nome", { length: 200 }).notNull(),
  endereco: text("endereco"),
  ativo: boolean("ativo").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notificacao = pgTable("notificacao", {
  id: uuid("id").primaryKey().defaultRandom(),
  protocolo: varchar("protocolo", { length: 20 }).unique().notNull(),
  usfId: uuid("usf_id").notNull().references(() => usf.id),
  tipoIncidente: varchar("tipo_incidente", { length: 100 }).notNull(),
  dataHora: timestamp("data_hora", { withTimezone: true }).notNull(),
  descricao: text("descricao").notNull(),
  grauDano: grauDanoEnum("grau_dano").notNull(),
  acoesTomadas: text("acoes_tomadas"),
  anonimo: boolean("anonimo").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usuario = pgTable("usuario", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  nome: varchar("nome", { length: 200 }).notNull(),
  papel: papelEnum("papel").default("gestor"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
