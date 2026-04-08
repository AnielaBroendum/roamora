import { useState, useEffect } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { events, datePills } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";

export function TonightTab({
  joinedEvents,
  goingCounts,
  onJoin,
}: {
  joinedEvents: Set<string>;
  goingCounts: Record<string, number>;
  onJoin: (id: string) => void;
}) {
  const [activeDate, setActiveDate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {datePills.map((d, i) => (
          <button
            key={d}
            onClick={() => setActiveDate(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              i === activeDate
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="space-y-3">
          {events.map((e, idx) => {
            const hasJoined = joinedEvents.has(e.id);
            const count = goingCounts[e.id] || e.going;
            return (
              <div
                key={e.id}
                className="bg-card rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex gap-3.5 items-start">
                  <div className="text-3xl w-11 h-11 flex items-center justify-center bg-primary/10 rounded-xl shrink-0">
                    {e.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground leading-tight">{e.name}</h3>
                      <Badge className="shrink-0 bg-primary/10 text-primary border-0 text-[10px] font-medium">
                        {e.tag}
                      </Badge>
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{e.desc}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {e.time}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{e.venue}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium text-foreground/70">{count}</span> going
                  </span>
                  <Button
                    size="sm"
                    variant={hasJoined ? "secondary" : "default"}
                    className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 ${
                      hasJoined ? "" : "shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                    }`}
                    onClick={() => onJoin(e.id)}
                    disabled={hasJoined}
                  >
                    {hasJoined ? "Going ✓" : "Join Event"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
