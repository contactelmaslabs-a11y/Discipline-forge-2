import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getUserStats, saveUserStats } from "@/lib/localStorage";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to Discipline Forge! 🔥",
    description: "Build unstoppable discipline with streaks, achievements, and gamification. Let's take a quick tour!",
  },
  {
    title: "Create Your Habits 🎯",
    description: "Tap the + button to create custom tasks with frequency settings, time reminders, and motivational notes.",
  },
  {
    title: "Track Your Streaks 📈",
    description: "Complete tasks daily to build your streak! The longer your streak, the more discipline points you earn.",
  },
  {
    title: "Earn Rewards 🏆",
    description: "Use discipline points to purchase trophies and badges in the shop. Show off your achievements!",
  },
  {
    title: "Monitor Progress 📊",
    description: "Check your stats to see completion rates, total XP, and unlock achievements as you level up.",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    const stats = getUserStats();
    saveUserStats({ ...stats, hasCompletedOnboarding: true });
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Onboarding card */}
      <div className="relative w-full max-w-md mx-6 bg-background rounded-3xl shadow-2xl p-8 space-y-6 animate-bounce-in">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover-elevate active-elevate-2"
          data-testid="button-skip-onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">{step.title}</h2>
          <p className="text-muted-foreground text-lg">{step.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full text-lg"
          data-testid="button-onboarding-next"
        >
          {currentStep < ONBOARDING_STEPS.length - 1 ? "Next" : "Get Started"}
        </Button>
      </div>
    </div>
  );
}
