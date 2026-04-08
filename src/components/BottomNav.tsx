import { Calendar, Users, MapPin, User } from "lucide-react";
import type { Tab } from "@/lib/types";

const tabs = [
  { id: "tonight" as Tab, icon: Calendar, label: "Tonight" },
  { id: "plans" as Tab, icon: Users, label: "Plans" },
  { id: "places" as Tab, icon: MapPin, label: "Places" },
] as const;

export function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/80 backdrop-blur-xl border-t border-border/50 z-50">
      <div className="flex justify-around items-end pb-[env(safe-area-inset-bottom)] px-2">
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex flex-col items-center gap-0.5 pt-2 pb-2 px-5 relative group"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <t.icon className={`w-5 h-5 transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground/70"}`} />
              <span className={`text-[11px] font-medium transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground/70"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
