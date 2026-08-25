import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { getDashboardData, getDb, businessProfiles, campaigns, contentItems, contacts, opportunities, reports } from "./db";
import { eq, and } from "drizzle-orm";
import { canTransitionContentStatus } from "./content-workflow";

const channelSchema = z.enum(["instagram", "tiktok", "pinterest"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  marketing: router({
    dashboard: protectedProcedure.query(({ ctx }) => getDashboardData(ctx.user.id)),
    profiles: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(businessProfiles).where(eq(businessProfiles.userId, ctx.user.id)) : []; }),
    campaigns: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(campaigns).where(eq(campaigns.userId, ctx.user.id)) : []; }),
    createCampaign: protectedProcedure.input(z.object({ profileId: z.number().int().positive(), name: z.string().min(2), objective: z.string().min(2), audience: z.string().min(2), channels: z.array(channelSchema).min(1), budget: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(campaigns).values({ ...input, userId: ctx.user.id, channels: input.channels.join(","), budget: String(input.budget) }); return { id: result[0].insertId }; }),
    contacts: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(contacts).where(eq(contacts.userId, ctx.user.id)) : []; }),
    opportunities: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(opportunities).where(eq(opportunities.userId, ctx.user.id)) : []; }),
    reports: protectedProcedure.query(async ({ ctx }) => { const db = await getDb(); return db ? db.select().from(reports).where(eq(reports.userId, ctx.user.id)) : []; }),
    createProfile: protectedProcedure.input(z.object({ name: z.string().min(2), segment: z.string().min(2), audience: z.string().min(2), voice: z.string().min(2), objectives: z.string().min(2), activeChannels: z.array(channelSchema).min(1) })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(businessProfiles).values({ ...input, userId: ctx.user.id, activeChannels: input.activeChannels.join(",") }); return { id: result[0].insertId }; }),
    generateContent: protectedProcedure.input(z.object({ profileId: z.number().int().positive(), objective: z.string().min(3), topic: z.string().min(3), channels: z.array(channelSchema).min(1), quantity: z.number().int().min(1).max(6).default(3) })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Você é um estrategista de conteúdo multicanal. Gere propostas claras, originais e adaptadas ao canal. Não publique nada. Retorne apenas JSON válido." },
          { role: "user", content: `Crie ${input.quantity} ideias para ${input.channels.join(", ")}. Objetivo: ${input.objective}. Tema: ${input.topic}. Para cada item inclua title, channel, format, hook, body, hashtags, cta e rationale.` },
        ],
        response_format: { type: "json_schema", json_schema: { name: "content_ideas", strict: true, schema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { title: { type: "string" }, channel: { type: "string" }, format: { type: "string" }, hook: { type: "string" }, body: { type: "string" }, hashtags: { type: "array", items: { type: "string" } }, cta: { type: "string" }, rationale: { type: "string" } }, required: ["title", "channel", "format", "hook", "body", "hashtags", "cta", "rationale"], additionalProperties: false } } }, required: ["items"], additionalProperties: false } } },
      });
      const content = response.choices?.[0]?.message?.content;
      if (typeof content !== "string") return { items: [] };
      try { return JSON.parse(content); } catch { throw new Error("A IA retornou um formato inválido. Tente novamente."); }
    }),
    saveGeneratedContent: protectedProcedure.input(z.object({ profileId: z.number().int().positive(), title: z.string().min(2), channel: channelSchema, format: z.string().min(2), body: z.string().min(2), hashtags: z.array(z.string()).default([]) })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(contentItems).values({ ...input, userId: ctx.user.id, hashtags: input.hashtags.join(" "), status: "draft" }); return { id: result[0].insertId, status: "draft" as const }; }),
    updateContentStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["approved", "revision", "archived"]) })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const current = await db.select({ status: contentItems.status }).from(contentItems).where(and(eq(contentItems.id, input.id), eq(contentItems.userId, ctx.user.id))).limit(1); if (!current[0] || !canTransitionContentStatus(current[0].status, input.status)) throw new Error("Transição de revisão não permitida"); const result = await db.update(contentItems).set({ status: input.status }).where(and(eq(contentItems.id, input.id), eq(contentItems.userId, ctx.user.id))); return { updated: result[0].affectedRows > 0 }; }),
  }),
});
export type AppRouter = typeof appRouter;
