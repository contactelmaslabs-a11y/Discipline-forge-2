import { Task } from "@shared/schema";
import { getLast28Days, isTaskDueToday } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WeeklyHeatmapProps {
  tasks: Task[];
}

export default function WeeklyHeatmap({ tasks }: WeeklyHeatmapProps) {
  const last28Days = getLast28Days();
  
  const getCompletionIntensity = (dateString: string): number => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    
    // Get tasks due on this day
    const dueTasks = tasks.filter(task => {
      if (task.frequency === "daily") return true;
      if (task.frequency === "weekly" && task.weeklyDay !== undefined) {
        return task.weeklyDay === dayOfWeek;
      }
      if (task.frequency === "custom" && task.customDays) {
        return task.customDays.includes(dayOfWeek);
      }
      return false;
    });
    
    if (dueTasks.length === 0) return 0;
    
    // Calculate completion percentage
    const completedCount = dueTasks.filter(task =>
      task.completedDates.includes(dateString)
    ).length;
    
    return Math.round((completedCount / dueTasks.length) * 100);
  };

  const getColorClass = (intensity: number): string => {
    if (intensity === 0) return "bg-muted";
    if (intensity <= 30) return "bg-primary/30";
    if (intensity <= 70) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-foreground mb-3">Last 28 Days</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {last28Days.map((dateString, index) => {
          const intensity = getCompletionIntensity(dateString);
          const date = new Date(dateString);
          const isToday = dateString === new Date().toISOString().split("T")[0];
          
          return (
            <div
              key={dateString}
              className={cn(
                "aspect-square rounded-md transition-all duration-300",
                getColorClass(intensity),
                isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
              title={`${date.toLocaleDateString()}: ${intensity}% complete`}
              data-testid={`heatmap-cell-${index}`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
