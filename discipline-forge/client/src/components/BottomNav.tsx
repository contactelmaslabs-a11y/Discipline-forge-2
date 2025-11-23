import { Home, ShoppingBag, BarChart3, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const tabs = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Shop", icon: ShoppingBag, path: "/shop" },
    { name: "Stats", icon: BarChart3, path: "/stats" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border backdrop-blur-lg bg-card/95 z-50">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.path;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              data-testid={`link-nav-${tab.name.toLowerCase()}`}
            >
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-md transition-all relative hover-elevate active-elevate-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                data-testid={`button-nav-${tab.name.toLowerCase()}`}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-bounce-in")} />
                <span className="text-xs font-medium">{tab.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
