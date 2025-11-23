import { Task, UserStats, Achievement, ShopItem } from "@shared/schema";

const STORAGE_KEYS = {
  TASKS: "disciplineforge_tasks",
  USER_STATS: "disciplineforge_user_stats",
  ACHIEVEMENTS: "disciplineforge_achievements",
  SHOP_ITEMS: "disciplineforge_shop_items",
  ONBOARDING_COMPLETE: "disciplineforge_onboarding_complete",
} as const;

// Tasks
export function getTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// User Stats
export function getUserStats(): UserStats {
  const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  if (!data) {
    const defaultStats: UserStats = {
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
    saveUserStats(defaultStats);
    return defaultStats;
  }
  return JSON.parse(data);
}

export function saveUserStats(stats: UserStats): void {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

// Achievements
export function getAchievements(): Achievement[] {
  const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  if (!data) {
    const defaultAchievements = initializeAchievements();
    saveAchievements(defaultAchievements);
    return defaultAchievements;
  }
  return JSON.parse(data);
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

// Shop Items
export function getShopItems(): ShopItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.SHOP_ITEMS);
  if (!data) {
    const defaultItems = initializeShopItems();
    saveShopItems(defaultItems);
    return defaultItems;
  }
  return JSON.parse(data);
}

export function saveShopItems(items: ShopItem[]): void {
  localStorage.setItem(STORAGE_KEYS.SHOP_ITEMS, JSON.stringify(items));
}

// Initialize default achievements
function initializeAchievements(): Achievement[] {
  return [
    {
      id: "first_task",
      name: "First Steps",
      description: "Complete your first task",
      icon: "🎯",
      requirement: 1,
      type: "tasks",
      unlocked: false,
    },
    {
      id: "week_warrior",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      requirement: 7,
      type: "streak",
      unlocked: false,
    },
    {
      id: "century_club",
      name: "Century Club",
      description: "Complete 100 tasks",
      icon: "💯",
      requirement: 100,
      type: "tasks",
      unlocked: false,
    },
    {
      id: "level_master",
      name: "Level Master",
      description: "Reach level 10",
      icon: "⭐",
      requirement: 10,
      type: "level",
      unlocked: false,
    },
    {
      id: "unstoppable",
      name: "Unstoppable",
      description: "Maintain a 30-day streak",
      icon: "🏆",
      requirement: 30,
      type: "streak",
      unlocked: false,
    },
    {
      id: "point_hoarder",
      name: "Point Hoarder",
      description: "Earn 1,000 discipline points",
      icon: "💎",
      requirement: 1000,
      type: "points",
      unlocked: false,
    },
  ];
}

// Initialize default shop items
function initializeShopItems(): ShopItem[] {
  return [
    {
      id: "bronze_trophy",
      name: "Bronze Trophy",
      description: "Your first trophy",
      icon: "🥉",
      cost: 50,
      category: "trophy",
      owned: false,
    },
    {
      id: "silver_trophy",
      name: "Silver Trophy",
      description: "For the dedicated",
      icon: "🥈",
      cost: 150,
      category: "trophy",
      owned: false,
    },
    {
      id: "gold_trophy",
      name: "Gold Trophy",
      description: "Champion's reward",
      icon: "🥇",
      cost: 300,
      category: "trophy",
      owned: false,
    },
    {
      id: "diamond_crown",
      name: "Diamond Crown",
      description: "Ultimate achievement",
      icon: "👑",
      cost: 500,
      category: "trophy",
      owned: false,
    },
    {
      id: "fire_badge",
      name: "Fire Badge",
      description: "Burning motivation",
      icon: "🔥",
      cost: 100,
      category: "badge",
      owned: false,
    },
    {
      id: "lightning_badge",
      name: "Lightning Badge",
      description: "Swift and powerful",
      icon: "⚡",
      cost: 100,
      category: "badge",
      owned: false,
    },
    {
      id: "star_badge",
      name: "Star Badge",
      description: "Shine bright",
      icon: "✨",
      cost: 120,
      category: "badge",
      owned: false,
    },
    {
      id: "rocket_badge",
      name: "Rocket Badge",
      description: "To the moon",
      icon: "🚀",
      cost: 150,
      category: "badge",
      owned: false,
    },
  ];
}
