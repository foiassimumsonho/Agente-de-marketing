import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const businessProfiles = mysqlTable("business_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  segment: varchar("segment", { length: 160 }).notNull(),
  audience: text("audience").notNull(),
  voice: varchar("voice", { length: 100 }).notNull(),
  objectives: text("objectives").notNull(),
  activeChannels: text("activeChannels").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contentItems = mysqlTable("content_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  channel: mysqlEnum("channel", ["instagram", "tiktok", "pinterest"]).notNull(),
  format: varchar("format", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["draft", "approved", "revision", "archived"]).default("draft").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  body: text("body").notNull(),
  hashtags: text("hashtags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const metrics = mysqlTable("metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  channel: mysqlEnum("channel", ["instagram", "tiktok", "pinterest"]).notNull(),
  metricDate: timestamp("metricDate").notNull(),
  impressions: int("impressions").default(0).notNull(),
  engagements: int("engagements").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  spend: decimal("spend", { precision: 12, scale: 2 }).default("0").notNull(),
});

export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  company: varchar("company", { length: 160 }),
  source: varchar("source", { length: 100 }),
  lifecycle: mysqlEnum("lifecycle", ["lead", "qualified", "customer", "inactive"]).default("lead").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  contactId: int("contactId"),
  name: varchar("name", { length: 180 }).notNull(),
  stage: mysqlEnum("stage", ["new", "discovery", "proposal", "won", "lost"]).default("new").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).default("0").notNull(),
  sourceAction: varchar("sourceAction", { length: 180 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  period: varchar("period", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  status: mysqlEnum("status", ["scheduled", "ready", "viewed"]).default("ready").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type ContentItem = typeof contentItems.$inferSelect;
export type Metric = typeof metrics.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type Report = typeof reports.$inferSelect;
