import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import RewardedAdButton from "./RewardedAdButton";

interface ReviveTaskModalProps {
  taskName: string;
  isOpen: boolean;
  onClose: () => void;
  onRevive: () => void;
}

export default function ReviveTaskModal({
  taskName,
  isOpen,
  onClose,
  onRevive
}: ReviveTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl shadow-2xl animate-slide-up p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Revive Task?</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover-elevate active-elevate-2"
            data-testid="button-close-revive-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-base text-secondary">
            You missed <span className="font-semibold text-foreground">"{taskName}"</span>
          </p>
          <p className="text-sm text-tertiary">
            Watch a quick ad to revive this task and keep your streak alive!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            data-testid="button-cancel-revive"
          >
            Cancel
          </Button>
          <RewardedAdButton
            onReward={onRevive}
            label="Watch Ad"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
