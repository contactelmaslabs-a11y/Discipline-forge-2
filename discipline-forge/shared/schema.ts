import { z } from "zod";

// Task frequency types
export const frequencySchema = z.enum(["daily", "weekly", "custom"]);
export type Frequency = z.infer<typeof frequencySchema>;

// Days of week for custom frequency
export const daysOfWeekSchema = z.array(z.number().min(0).max(6)); // 0 = Sunday, 6 = Saturday

// Task schema
export const taskSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  frequency: frequencySchema,
  weeklyDay: z.number().min(0).max(6).optional(), // For weekly frequency: 0 = Sunday, 6 = Saturday
  customDays: daysOfWeekSchema.optional(), // For custom frequency
  timeReminder: z.string().optional(), // HH:MM format
  motivationalNote: z.string().optional(),
  streak: z.number().default(0),
  bestStreak: z.number().default(0),
  completedDates: z.array(z.string()), // ISO date strings
  createdAt: z.string(),
});

export const insertTaskSchema = taskSchema.omit({ id: true, streak: true, bestStreak: true, completedDates: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// User stats schema
export const userStatsSchema = z.object({
  level: z.number().default(1),
  xp: z.number().default(0),
  disciplinePoints: z.number().default(0),
  totalTasksCompleted: z.number().default(0),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
  isPremium: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
  hasCompletedOnboarding: z.boolean().default(false),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  requirement: z.number(),
  type: z.enum(["streak", "tasks", "level", "points"]),
  unlocked: z.boolean().default(false),
  unlockedAt: z.string().optional(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// Shop item schema
export const shopItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  cost: z.number(),
  category: z.enum(["trophy", "badge", "special"]),
  owned: z.boolean().default(false),
  purchasedAt: z.string().optional(),
});

export type ShopItem = z.infer<typeof shopItemSchema>;

// Completion record for heatmap
export const completionRecordSchema = z.object({
  date: z.string(), // YYYY-MM-DD format
  completedCount: z.number(),
  totalCount: z.number(),
  percentage: z.number(), // 0-100
});

export type CompletionRecord = z.infer<typeof completionRecordSchema>;
