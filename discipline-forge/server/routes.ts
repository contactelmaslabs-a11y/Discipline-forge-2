import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  taskSchema, 
  insertTaskSchema, 
  userStatsSchema, 
  achievementSchema, 
  shopItemSchema,
  type Task 
} from "@shared/schema";
import { nanoid } from "nanoid";

// Update schemas that exclude server-managed fields and reject extra keys
const updateTaskSchema = taskSchema.omit({ 
  id: true, 
  createdAt: true, 
  streak: true, 
  bestStreak: true, 
  completedDates: true 
}).partial().strict();
const updateAchievementSchema = achievementSchema.omit({ id: true }).partial().strict();
const updateShopItemSchema = shopItemSchema.omit({ id: true }).partial().strict();

export async function registerRoutes(app: Express): Promise<Server> {
  // Tasks endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const insertTask = insertTaskSchema.parse(req.body);
      const task: Task = {
        ...insertTask,
        id: nanoid(),
        streak: 0,
        bestStreak: 0,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      const created = await storage.createTask(task);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateTaskSchema.parse(req.body);
      const updated = await storage.updateTask(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // User stats endpoints
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.patch("/api/stats", async (req, res) => {
    try {
      const updates = userStatsSchema.partial().parse(req.body);
      const stats = await storage.updateUserStats(updates);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid stats data" });
    }
  });

  // Achievements endpoints
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  app.patch("/api/achievements/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateAchievementSchema.parse(req.body);
      const updated = await storage.updateAchievement(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Achievement not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update achievement" });
    }
  });

  // Shop endpoints
  app.get("/api/shop", async (req, res) => {
    try {
      const items = await storage.getShopItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shop items" });
    }
  });

  app.patch("/api/shop/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = updateShopItemSchema.parse(req.body);
      const updated = await storage.updateShopItem(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Shop item not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update shop item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
