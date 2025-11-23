import { useState, useEffect } from "react";
import { Plus, Check, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WeeklyHeatmap from "@/components/WeeklyHeatmap";
import ReviveTaskModal from "@/components/ReviveTaskModal";
import { Task, UserStats } from "@shared/schema";
import { getTasks, saveTasks, getUserStats, saveUserStats, getAchievements, saveAchievements } from "@/lib/localStorage";
import {
  isTaskDueToday,
  isTaskCompletedToday,
  calculateStreak,
  calculateOverallStreak,
  getRandomQuote,
  playSound,
  triggerConfetti,
  getTodayDateString,
  checkAchievements,
  getXPProgress,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onCreateTask: () => void;
}

export default function Dashboard({ onCreateTask }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [quote] = useState(getRandomQuote());
  const [greeting, setGreeting] = useState("");
  const [reviveModal, setReviveModal] = useState<{ isOpen: boolean; taskId?: string; taskName?: string }>({ isOpen: false });

  useEffect(() => {
    loadTasks();
    updateGreeting();
    
    // Listen for storage events to refresh when tasks are created
    const handleStorageChange = () => {
      loadTasks();
      setStats(getUserStats());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const today = getTodayDateString();
    const isCompleted = isTaskCompletedToday(task);
    
    let updatedTask: Task;
    let updatedStats = { ...stats };
    
    if (isCompleted) {
      // Uncomplete the task
      updatedTask = {
        ...task,
        completedDates: task.completedDates.filter((d) => d !== today),
      };
      updatedStats.totalTasksCompleted = Math.max(0, updatedStats.totalTasksCompleted - 1);
      updatedStats.xp = Math.max(0, updatedStats.xp - 10);
      updatedStats.disciplinePoints = Math.max(0, updatedStats.disciplinePoints - 5);
    } else {
      // Complete the task
      updatedTask = {
        ...task,
        completedDates: [...task.completedDates, today],
      };
      
      // Update stats
      updatedStats.totalTasksCompleted += 1;
      updatedStats.xp += 10;
      updatedStats.disciplinePoints += 5;
      
      // Check for level up
      const newLevel = Math.floor(updatedStats.xp / 100) + 1;
      if (newLevel > updatedStats.level) {
        updatedStats.level = newLevel;
        playSound(updatedStats.soundEnabled, "levelup");
        triggerConfetti();
      } else {
        playSound(updatedStats.soundEnabled, "complete");
      }
      
      // Celebration confetti for task completion
      if (Math.random() > 0.7) {
        triggerConfetti();
      }
    }
    
    // Calculate streaks
    const taskStreak = calculateStreak(updatedTask);
    updatedTask.streak = taskStreak;
    updatedTask.bestStreak = Math.max(updatedTask.bestStreak, taskStreak);
    
    // Update tasks
    const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Calculate overall streak
    updatedStats.currentStreak = calculateOverallStreak(updatedTasks);
    updatedStats.bestStreak = Math.max(updatedStats.bestStreak, updatedStats.currentStreak);
    
    // Check achievements
    const achievements = getAchievements();
    const updatedAchievements = checkAchievements(updatedStats, updatedTasks, achievements);
    const newlyUnlocked = updatedAchievements.filter(
      (a, i) => a.unlocked && !achievements[i].unlocked
    );
    
    if (newlyUnlocked.length > 0) {
      playSound(updatedStats.soundEnabled, "achievement");
      triggerConfetti();
    }
    
    saveAchievements(updatedAchievements);
    setStats(updatedStats);
    saveUserStats(updatedStats);
  };

  const handleReviveTask = () => {
    if (!reviveModal.taskId) return;
    
    const task = tasks.find((t) => t.id === reviveModal.taskId);
    if (!task) return;
    
    const today = getTodayDateString();
    const updatedTask = {
      ...task,
      completedDates: [...task.completedDates, today],
    };
    
    let updatedStats = { ...stats };
    updatedStats.totalTasksCompleted += 1;
    updatedStats.xp += 10;
    updatedStats.disciplinePoints += 10; // Bonus points for revive
    
    // Update tasks
    const updatedTasks = tasks.map((t) => (t.id === reviveModal.taskId ? updatedTask : t));
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    // Calculate overall streak
    updatedStats.currentStreak = calculateOverallStreak(updatedTasks);
    updatedStats.bestStreak = Math.max(updatedStats.bestStreak, updatedStats.currentStreak);
    
    setStats(updatedStats);
    saveUserStats(updatedStats);
    
    playSound(updatedStats.soundEnabled, "complete");
    triggerConfetti();
    
    setReviveModal({ isOpen: false });
  };

  const todayTasks = tasks.filter(isTaskDueToday);
  const completedToday = todayTasks.filter(isTaskCompletedToday).length;
  const totalToday = todayTasks.length;
  const completionPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const xpProgress = getXPProgress(stats);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 pt-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-greeting">
            {greeting}! 👋
          </h1>
          <p className="text-sm text-muted-foreground italic max-w-sm mx-auto" data-testid="text-quote">
            "{quote}"
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 space-y-2 hover-elevate">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Streak</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-current-streak">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Best: {stats.bestStreak}
            </div>
          </Card>

          <Card className="p-4 space-y-2 hover-elevate">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {stats.level}
              </div>
              <span className="text-sm font-medium text-muted-foreground">Level</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-level">
              {stats.level}
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Today's Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Today's Discipline</h2>
              <p className="text-sm text-muted-foreground">
                {completedToday}/{totalToday} completed ({completionPercentage}%)
              </p>
            </div>
            <Button
              onClick={onCreateTask}
              size="icon"
              className="rounded-full"
              data-testid="button-create-task"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {todayTasks.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <div className="text-4xl">🎯</div>
              <p className="text-muted-foreground">No tasks for today</p>
              <Button onClick={onCreateTask} variant="outline" data-testid="button-create-first-task">
                Create Your First Task
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => {
                const isCompleted = isTaskCompletedToday(task);
                
                return (
                  <Card
                    key={task.id}
                    className={cn(
                      "p-4 transition-all hover-elevate active-elevate-2",
                      !isCompleted && "cursor-pointer"
                    )}
                    onClick={() => isCompleted ? null : toggleTaskCompletion(task.id)}
                    data-testid={`card-task-${task.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        className={cn(
                          "w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input hover:border-primary"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        data-testid={`button-toggle-task-${task.id}`}
                      >
                        {isCompleted && <Check className="w-6 h-6" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={cn(
                            "text-xl font-semibold truncate",
                            isCompleted && "line-through text-muted-foreground"
                          )}
                        >
                          {task.name}
                        </h3>
                        {task.timeReminder && (
                          <p className="text-sm text-muted-foreground">
                            ⏰ {task.timeReminder}
                          </p>
                        )}
                        {task.motivationalNote && !isCompleted && (
                          <p className="text-sm text-muted-foreground italic mt-1">
                            {task.motivationalNote}
                          </p>
                        )}
                      </div>

                      {task.streak > 0 && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                          <Flame className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            {task.streak}
                          </span>
                        </div>
                      )}
                    </div>

                    {isCompleted && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        ✓ Completed today
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Heatmap */}
        {tasks.length > 0 && (
          <Card className="p-6">
            <WeeklyHeatmap tasks={tasks} />
          </Card>
        )}
      </div>

      {/* Revive Task Modal */}
      <ReviveTaskModal
        isOpen={reviveModal.isOpen}
        taskName={reviveModal.taskName || ""}
        onClose={() => setReviveModal({ isOpen: false })}
        onRevive={handleReviveTask}
      />
    </div>
  );
}
