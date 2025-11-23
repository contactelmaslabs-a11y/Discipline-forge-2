import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { displayRewardedAd } from "@/lib/admob";

interface RewardedAdButtonProps {
  onReward: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function RewardedAdButton({
  onReward,
  label = "Watch Ad to Revive",
  disabled = false,
  className = ""
}: RewardedAdButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleShowAd = () => {
    setIsLoading(true);

    displayRewardedAd({
      onRewardEarned: () => {
        setIsLoading(false);
        onReward();
      },
      onAdClosed: () => {
        setIsLoading(false);
      },
      onAdError: (error) => {
        console.error("Ad error:", error);
        setIsLoading(false);
      }
    });
  };

  return (
    <Button
      onClick={handleShowAd}
      disabled={disabled || isLoading}
      className={className}
      data-testid="button-reward-ad"
    >
      <Gift className="w-4 h-4 mr-2" />
      {isLoading ? "Loading Ad..." : label}
    </Button>
  );
}
