import { useRef } from "react";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserStats } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ShareableCardProps {
  stats: UserStats;
  completionPercentage: number;
}

export default function ShareableCard({ stats, completionPercentage }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      // Use html2canvas if available (loaded via CDN in later task)
      if (typeof (window as any).html2canvas === "function") {
        const canvas = await (window as any).html2canvas(cardRef.current);
        canvas.toBlob((blob: Blob) => {
          if (navigator.share && blob) {
            const file = new File([blob], "discipline-forge-stats.png", { type: "image/png" });
            navigator.share({
              title: "My Discipline Stats",
              text: `🔥 ${stats.currentStreak} day streak! Level ${stats.level} 💪`,
              files: [file],
            });
          } else {
            // Fallback: download the image
            const url = canvas.toDataURL();
            const link = document.createElement("a");
            link.download = "discipline-forge-stats.png";
            link.href = url;
            link.click();
          }
        });
      } else {
        toast({
          title: "Screenshot feature",
          description: "Screenshot sharing will be available soon!",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Unable to share at this time",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card
        ref={cardRef}
        className="p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary/30 space-y-6"
      >
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Discipline Forge</h3>
          <p className="text-sm text-muted-foreground">My Progress</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <div className="text-4xl font-bold text-primary">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak 🔥</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-bold text-primary">{stats.level}</div>
            <div className="text-sm text-muted-foreground">Level ⭐</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-bold text-foreground">{stats.totalTasksCompleted}</div>
            <div className="text-sm text-muted-foreground">Tasks Done ✓</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-4xl font-bold text-foreground">{completionPercentage}%</div>
            <div className="text-sm text-muted-foreground">Today 🎯</div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          disciplineforge.app
        </div>
      </Card>

      <Button
        onClick={handleShare}
        variant="outline"
        className="w-full"
        data-testid="button-share-stats"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share My Progress
      </Button>
    </div>
  );
}
