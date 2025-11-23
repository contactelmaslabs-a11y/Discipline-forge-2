import { useState, useEffect } from "react";
import { TrendingUp, Target, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import AdBanner from "@/components/AdBanner";
import ProgressRing from "@/components/ProgressRing";
import ShareableCard from "@/components/ShareableCard";
import { Task, UserStats, Achievement } from "@shared/schema";
import { getTasks, getUserStats, getAchievements } from "@/lib/localStorage";
import { isTaskDueToday, isTaskCompletedToday } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function Stats() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(getTasks());
    setStats(getUserStats());
    setAchievements(getAchievements());
  };

  const todayTasks = tasks.filter(isTaskDueToday);
  const completedToday = todayTasks.filter(isTaskCompletedToday).length;
  const completionPercentage = todayTasks.length > 0
    ? Math.round((completedToday / todayTasks.length) * 100)
    : 0;

  const totalTasksCreated = tasks.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 pt-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Your Stats</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>

        {/* Today's Progress Ring */}
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Today's Progress</h2>
            <ProgressRing percentage={completionPercentage} size={150} strokeWidth={12}>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary" data-testid="text-completion-percentage">
                  {completionPercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedToday}/{todayTasks.length}
                </div>
              </div>
            </ProgressRing>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 space-y-3 hover-elevate">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Total XP</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-xp">
              {stats.xp}
            </div>
            <div className="text-xs text-muted-foreground">Level {stats.level}</div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Completed</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-total-completed">
              {stats.totalTasksCompleted}
            </div>
            <div className="text-xs text-muted-foreground">tasks</div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Best Streak</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-best-streak">
              {stats.bestStreak}
            </div>
            <div className="text-xs text-muted-foreground">days</div>
          </Card>

          <Card className="p-6 space-y-3 hover-elevate">
            <div className="flex items-center gap-2 text-primary">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium text-muted-foreground">Tasks Created</span>
            </div>
            <div className="text-3xl font-bold text-foreground" data-testid="text-tasks-created">
              {totalTasksCreated}
            </div>
            <div className="text-xs text-muted-foreground">habits</div>
          </Card>
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Achievements</h2>
            <p className="text-sm text-muted-foreground">
              {unlockedAchievements}/{totalAchievements} unlocked
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  "p-4 text-center space-y-2 hover-elevate",
                  !achievement.unlocked && "opacity-50 grayscale"
                )}
                data-testid={`card-achievement-${achievement.id}`}
              >
                <div className="text-4xl">{achievement.icon}</div>
                <h3 className="text-xs font-bold text-foreground">{achievement.name}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {!achievement.unlocked && (
                  <div className="text-xs text-primary font-semibold">
                    {achievement.requirement} {achievement.type}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Personal Records */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Personal Records</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Streak</span>
              <span className="text-lg font-bold text-foreground">
                {stats.bestStreak} days
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Discipline Points</span>
              <span className="text-lg font-bold text-primary">
                {stats.disciplinePoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tasks Completed</span>
              <span className="text-lg font-bold text-foreground">
                {stats.totalTasksCompleted}
              </span>
            </div>
          </div>
        </Card>

        {/* Shareable Stats */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Share Your Progress</h2>
          <ShareableCard stats={stats} completionPercentage={completionPercentage} />
        </div>

        {/* Advertisement */}
        <div className="py-4">
          <AdBanner dataAdSlot="1234567890" className="text-center" />
        </div>
      </div>
    </div>
  );
}
