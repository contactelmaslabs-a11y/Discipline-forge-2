import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Shop from "@/pages/Shop";
import Stats from "@/pages/Stats";
import Profile from "@/pages/Profile";
import TaskModal from "@/components/TaskModal";
import OnboardingTour from "@/components/OnboardingTour";
import { InsertTask, Task } from "@shared/schema";
import { getTasks, saveTasks, getUserStats } from "@/lib/localStorage";
import { nanoid } from "nanoid";

function Router() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const stats = getUserStats();
    if (!stats.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCreateTask = (insertTask: InsertTask) => {
    const tasks = getTasks();
    const newTask: Task = {
      ...insertTask,
      id: nanoid(),
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    
    saveTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
    
    // Trigger a re-render by dispatching a storage event
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      <Switch>
        <Route path="/">
          <Dashboard onCreateTask={() => setIsTaskModalOpen(true)} />
        </Route>
        <Route path="/shop">
          <Shop />
        </Route>
        <Route path="/stats">
          <Stats />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route>
          <Dashboard onCreateTask={() => setIsTaskModalOpen(true)} />
        </Route>
      </Switch>

      <BottomNav />
      
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
      />

      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
