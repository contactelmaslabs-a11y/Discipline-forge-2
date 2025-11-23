import { useState, useEffect } from "react";
import { Volume2, VolumeX, Crown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import AdBanner from "@/components/AdBanner";
import { UserStats } from "@shared/schema";
import { getUserStats, saveUserStats } from "@/lib/localStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const [stats, setStats] = useState<UserStats>(getUserStats());

  useEffect(() => {
    const currentStats = getUserStats();
    setStats(currentStats);
  }, []);

  const toggleSound = () => {
    const updatedStats = {
      ...stats,
      soundEnabled: !stats.soundEnabled,
    };
    setStats(updatedStats);
    saveUserStats(updatedStats);
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 pt-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl font-bold text-primary-foreground">
            {stats.level}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Level {stats.level}</h1>
            <p className="text-muted-foreground">Discipline Warrior</p>
          </div>
          {stats.isPremium && (
            <Badge variant="default" className="gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </Badge>
          )}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Settings</h2>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {stats.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-semibold text-foreground">Sound Effects</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.soundEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={stats.soundEnabled}
                onCheckedChange={toggleSound}
                data-testid="switch-sound"
              />
            </div>
          </Card>
        </div>

        {/* Premium Upgrade */}
        {!stats.isPremium && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Go Premium</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-foreground">Remove all ads</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-foreground">Custom themes</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-foreground">Cloud sync across devices</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-foreground">Unlimited tasks</p>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-primary">$3.99</p>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>
              <Button className="w-full" size="lg" data-testid="button-upgrade-premium">
                Upgrade Now
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Coming soon to production
              </p>
            </div>
          </Card>
        )}

        {/* App Info */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-foreground">About</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Discipline Forge ®</p>
            <p>Version 1.0.0</p>
            <p className="pt-2 text-xs">
              Build unstoppable discipline with streaks, achievements, and gamification.
            </p>
          </div>
        </Card>

        {/* Advertisement */}
        <div className="py-4">
          <AdBanner dataAdSlot="1234567890" className="text-center" />
        </div>

        {/* Danger Zone */}
        <Card className="p-6 space-y-4 border-destructive/50">
          <h2 className="text-xl font-bold text-destructive">Danger Zone</h2>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                data-testid="button-reset-data"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your tasks,
                  progress, achievements, and stats.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-testid="button-confirm-reset"
                >
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </div>
  );
}
