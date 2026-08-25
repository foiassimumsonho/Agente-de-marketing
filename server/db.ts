import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./_core/env";
import { InsertUser, users, businessProfiles, campaigns, contentItems, metrics, contacts, opportunities, reports } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  values.lastSignedIn ??= new Date(); updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return rows[0]; }
export async function getDashboardData(userId: number) {
  const db = await getDb(); if (!db) return { profiles: [], pending: [], metrics: [], contacts: [], opportunities: [], reports: [] };
  const [profiles, pending, metricRows, contactRows, opportunityRows, reportRows] = await Promise.all([
    db.select().from(businessProfiles).where(eq(businessProfiles.userId, userId)).orderBy(desc(businessProfiles.updatedAt)),
    db.select().from(contentItems).where(and(eq(contentItems.userId, userId), eq(contentItems.status, "draft"))).orderBy(desc(contentItems.updatedAt)).limit(6),
    db.select({ channel: metrics.channel, impressions: sql<number>`sum(${metrics.impressions})`, engagements: sql<number>`sum(${metrics.engagements})`, clicks: sql<number>`sum(${metrics.clicks})`, conversions: sql<number>`sum(${metrics.conversions})` }).from(metrics).where(eq(metrics.userId, userId)).groupBy(metrics.channel),
    db.select().from(contacts).where(eq(contacts.userId, userId)).orderBy(desc(contacts.createdAt)).limit(8),
    db.select().from(opportunities).where(eq(opportunities.userId, userId)).orderBy(desc(opportunities.updatedAt)).limit(8),
    db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt)).limit(4),
  ]);
  return { profiles, pending, metrics: metricRows, contacts: contactRows, opportunities: opportunityRows, reports: reportRows };
}
export { businessProfiles, campaigns, contentItems, metrics, contacts, opportunities, reports };
