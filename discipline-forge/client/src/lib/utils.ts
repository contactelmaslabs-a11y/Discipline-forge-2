import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task, UserStats, Achievement } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

export function getDaysInWeek(weekOffset: number = 0): string[] {
  const dates: string[] = [];
  const today = new Date();
  const currentDay = today.getDay();
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - currentDay + (weekOffset * 7));
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + i);
    dates.push(getDateString(date));
  }
  
  return dates;
}

export function getLast28Days(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getDateString(date));
  }
  
  return dates;
}

// Task utilities
export function isTaskDueToday(task: Task): boolean {
  const today = new Date().getDay();
  
  if (task.frequency === "daily") {
    return true;
  }
  
  if (task.frequency === "weekly" && task.weeklyDay !== undefined) {
    return task.weeklyDay === today;
  }
  
  if (task.frequency === "custom" && task.customDays) {
    return task.customDays.includes(today);
  }
  
  return false;
}

export function isTaskCompletedToday(task: Task): boolean {
  const today = getTodayDateString();
  return task.completedDates.includes(today);
}

export function calculateStreak(task: Task): number {
  if (task.completedDates.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  
  // Start from yesterday and go backwards
  for (let i = 1; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = getDateString(date);
    
    // Check if task was due on this day
    const dayOfWeek = date.getDay();
    const wasDue = task.frequency === "daily" || 
      (task.frequency === "weekly" && task.weeklyDay === dayOfWeek) ||
      (task.frequency === "custom" && task.customDays?.includes(dayOfWeek));
    
    if (wasDue) {
      if (task.completedDates.includes(dateString)) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  // Check if completed today
  if (isTaskCompletedToday(task)) {
    streak++;
  }
  
  return streak;
}

export function calculateOverallStreak(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = getDateString(date);
    
    // Get tasks that were due on this day
    const dayOfWeek = date.getDay();
    const dueTasks = tasks.filter(task => 
      task.frequency === "daily" || 
      (task.frequency === "weekly" && task.weeklyDay === dayOfWeek) ||
      (task.frequency === "custom" && task.customDays?.includes(dayOfWeek))
    );
    
    if (dueTasks.length === 0) continue;
    
    // Check if all due tasks were completed
    const allCompleted = dueTasks.every(task => 
      task.completedDates.includes(dateString)
    );
    
    if (allCompleted) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// XP and Level calculations
export function calculateXPForLevel(level: number): number {
  return level * 100; // 100 XP per level
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPProgress(stats: UserStats): { current: number; needed: number; percentage: number } {
  const currentLevelXP = (stats.level - 1) * 100;
  const current = stats.xp - currentLevelXP;
  const needed = 100;
  const percentage = (current / needed) * 100;
  
  return { current, needed, percentage };
}

// Achievement checking
export function checkAchievements(stats: UserStats, tasks: Task[], achievements: Achievement[]): Achievement[] {
  const updatedAchievements = achievements.map(achievement => {
    if (achievement.unlocked) return achievement;
    
    let currentValue = 0;
    
    switch (achievement.type) {
      case "tasks":
        currentValue = stats.totalTasksCompleted;
        break;
      case "streak":
        currentValue = stats.currentStreak;
        break;
      case "level":
        currentValue = stats.level;
        break;
      case "points":
        currentValue = stats.disciplinePoints;
        break;
    }
    
    if (currentValue >= achievement.requirement) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
    }
    
    return achievement;
  });
  
  return updatedAchievements;
}

// Motivational quotes
export const motivationalQuotes = [
  "Discipline is the bridge between goals and accomplishment.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The only way to do great work is to love what you do.",
  "Discipline is choosing between what you want now and what you want most.",
  "You are what you do, not what you say you'll do.",
  "The difference between who you are and who you want to be is what you do.",
  "Discipline is the soul of an army.",
  "Self-discipline begins with the mastery of your thoughts.",
  "Motivation gets you started. Discipline keeps you going.",
  "The pain of discipline is far less than the pain of regret.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

// Sound effects
export function playSound(soundEnabled: boolean, type: "complete" | "levelup" | "achievement" | "purchase") {
  if (!soundEnabled) return;
  
  // Use Web Audio API for simple sound effects
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case "complete":
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
    case "levelup":
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case "achievement":
      oscillator.frequency.value = 500;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.stop(audioContext.currentTime + 0.4);
      break;
    case "purchase":
      oscillator.frequency.value = 700;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
  }
}

// Confetti celebration
export function triggerConfetti() {
  if (typeof (window as any).confetti === "function") {
    (window as any).confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#EA580C", "#FB923C", "#FDBA74", "#FED7AA"],
    });
  }
}
