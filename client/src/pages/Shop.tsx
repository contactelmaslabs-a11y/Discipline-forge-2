import { useState, useEffect } from "react";
import { ShoppingCart, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShopItem, UserStats } from "@shared/schema";
import { getShopItems, saveShopItems, getUserStats, saveUserStats } from "@/lib/localStorage";
import { playSound } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());

  useEffect(() => {
    loadShopItems();
  }, []);

  const loadShopItems = () => {
    const items = getShopItems();
    setShopItems(items);
  };

  const purchaseItem = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || item.owned) return;

    if (stats.disciplinePoints >= item.cost) {
      const updatedStats = {
        ...stats,
        disciplinePoints: stats.disciplinePoints - item.cost,
      };

      const updatedItems = shopItems.map((i) =>
        i.id === itemId
          ? { ...i, owned: true, purchasedAt: new Date().toISOString() }
          : i
      );

      setStats(updatedStats);
      saveUserStats(updatedStats);
      setShopItems(updatedItems);
      saveShopItems(updatedItems);
      playSound(updatedStats.soundEnabled, "purchase");
    }
  };

  const trophies = shopItems.filter((item) => item.category === "trophy");
  const badges = shopItems.filter((item) => item.category === "badge");

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-6 pt-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">Discipline Shop</h1>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-card rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💎</div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Points</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-discipline-points">
                    {stats.disciplinePoints}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trophies */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Trophies</h2>
          <div className="grid grid-cols-2 gap-4">
            {trophies.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-6 space-y-3 relative overflow-hidden hover-elevate",
                  item.owned && "bg-primary/5"
                )}
                data-testid={`card-shop-item-${item.id}`}
              >
                <div className="text-center space-y-2">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>

                {item.owned ? (
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">Owned</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => purchaseItem(item.id)}
                    disabled={stats.disciplinePoints < item.cost}
                    className="w-full"
                    variant={stats.disciplinePoints >= item.cost ? "default" : "secondary"}
                    data-testid={`button-purchase-${item.id}`}
                  >
                    {stats.disciplinePoints >= item.cost ? (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.cost} pts
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {item.cost} pts
                      </>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Badges</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-6 space-y-3 relative overflow-hidden hover-elevate",
                  item.owned && "bg-primary/5"
                )}
                data-testid={`card-shop-item-${item.id}`}
              >
                <div className="text-center space-y-2">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>

                {item.owned ? (
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-semibold">Owned</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => purchaseItem(item.id)}
                    disabled={stats.disciplinePoints < item.cost}
                    className="w-full"
                    variant={stats.disciplinePoints >= item.cost ? "default" : "secondary"}
                    data-testid={`button-purchase-${item.id}`}
                  >
                    {stats.disciplinePoints >= item.cost ? (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {item.cost} pts
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {item.cost} pts
                      </>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="space-y-2 text-center">
            <h3 className="font-bold text-foreground">Earn More Points!</h3>
            <p className="text-sm text-muted-foreground">
              Complete tasks to earn 5 discipline points each. Level up your collection!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
