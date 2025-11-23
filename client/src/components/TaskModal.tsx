import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InsertTask } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: InsertTask) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [weeklyDay, setWeeklyDay] = useState<number>(1); // Monday default
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [timeReminder, setTimeReminder] = useState("");
  const [motivationalNote, setMotivationalNote] = useState("");

  if (!isOpen) return null;

  const handleDayToggle = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const handleSave = () => {
    if (!taskName.trim()) return;

    const task: InsertTask = {
      name: taskName.trim(),
      frequency,
      weeklyDay: frequency === "weekly" ? weeklyDay : undefined,
      customDays: frequency === "custom" ? selectedDays : undefined,
      timeReminder: timeReminder || undefined,
      motivationalNote: motivationalNote.trim() || undefined,
    };

    onSave(task);
    handleClose();
  };

  const handleClose = () => {
    setTaskName("");
    setFrequency("daily");
    setWeeklyDay(1);
    setSelectedDays([]);
    setTimeReminder("");
    setMotivationalNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-foreground">Create New Task</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover-elevate active-elevate-2"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-base font-semibold">
              Task Name
            </Label>
            <Input
              id="task-name"
              placeholder="e.g., Morning Workout, Read 30 mins"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="text-lg h-12"
              maxLength={100}
              data-testid="input-task-name"
            />
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Frequency</Label>
            <div className="flex gap-2">
              {["daily", "weekly", "custom"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq as any)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg font-medium transition-all capitalize hover-elevate active-elevate-2",
                    frequency === freq
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  data-testid={`button-frequency-${freq}`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Day Selection */}
          {frequency === "weekly" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Day</Label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setWeeklyDay(index)}
                    className={cn(
                      "aspect-square rounded-lg font-semibold text-sm transition-all hover-elevate active-elevate-2",
                      weeklyDay === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                    data-testid={`button-weekly-day-${index}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Days */}
          {frequency === "custom" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(index)}
                    className={cn(
                      "aspect-square rounded-lg font-semibold text-sm transition-all hover-elevate active-elevate-2",
                      selectedDays.includes(index)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                    data-testid={`button-day-${index}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Reminder */}
          <div className="space-y-2">
            <Label htmlFor="time-reminder" className="text-base font-semibold">
              Time Reminder (Optional)
            </Label>
            <Input
              id="time-reminder"
              type="time"
              value={timeReminder}
              onChange={(e) => setTimeReminder(e.target.value)}
              className="h-12"
              data-testid="input-time-reminder"
            />
          </div>

          {/* Motivational Note */}
          <div className="space-y-2">
            <Label htmlFor="motivational-note" className="text-base font-semibold">
              Motivational Note (Optional)
            </Label>
            <Textarea
              id="motivational-note"
              placeholder="Why is this important to you?"
              value={motivationalNote}
              onChange={(e) => setMotivationalNote(e.target.value)}
              rows={3}
              maxLength={200}
              data-testid="input-motivational-note"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6 rounded-b-3xl">
          <Button
            onClick={handleSave}
            disabled={!taskName.trim()}
            size="lg"
            className="w-full text-lg"
            data-testid="button-save-task"
          >
            Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}
