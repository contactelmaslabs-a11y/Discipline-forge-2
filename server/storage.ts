import { type Task, type UserStats, type Achievement, type ShopItem } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  getUserStats(): Promise<UserStats>;
  updateUserStats(stats: Partial<UserStats>): Promise<UserStats>;
  
  getAchievements(): Promise<Achievement[]>;
  updateAchievement(id: string, achievement: Partial<Achievement>): Promise<Achievement | undefined>;
  
  getShopItems(): Promise<ShopItem[]>;
  updateShopItem(id: string, item: Partial<ShopItem>): Promise<ShopItem | undefined>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task> = new Map();
  private userStats: UserStats = {
    level: 1,
    xp: 0,
    disciplinePoints: 0,
    totalTasksCompleted: 0,
    currentStreak: 0,
    bestStreak: 0,
    isPremium: false,
    soundEnabled: true,
    hasCompletedOnboarding: false,
  };
  private achievements: Map<string, Achievement> = new Map();
  private shopItems: Map<string, ShopItem> = new Map();

  constructor() {}

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    // Prevent mutation of server-managed immutable fields
    const immutableFields = ['id', 'createdAt', 'streak', 'bestStreak', 'completedDates'] as const;
    for (const field of immutableFields) {
      if (field in updates) {
        throw new Error(`Cannot update immutable field: ${field}`);
      }
    }
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getUserStats(): Promise<UserStats> {
    return this.userStats;
  }

  async updateUserStats(updates: Partial<UserStats>): Promise<UserStats> {
    this.userStats = { ...this.userStats, ...updates };
    return this.userStats;
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    
    // Prevent mutation of server-managed immutable fields
    if ('id' in updates) {
      throw new Error('Cannot update immutable field: id');
    }
    
    const updated = { ...achievement, ...updates };
    this.achievements.set(id, updated);
    return updated;
  }

  async getShopItems(): Promise<ShopItem[]> {
    return Array.from(this.shopItems.values());
  }

  async updateShopItem(id: string, updates: Partial<ShopItem>): Promise<ShopItem | undefined> {
    const item = this.shopItems.get(id);
    if (!item) return undefined;
    
    // Prevent mutation of server-managed immutable fields
    if ('id' in updates) {
      throw new Error('Cannot update immutable field: id');
    }
    
    const updated = { ...item, ...updates };
    this.shopItems.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
