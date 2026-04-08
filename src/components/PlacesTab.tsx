import { useState, useEffect } from "react";
import { Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlaceFilter } from "@/lib/types";
import { places, events } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";

const filters: PlaceFilter[] = ["All", "Bars", "Cheap eats", "Hostels"];

const tagColors: Record<string, string> = {
  party: "bg-primary/10 text-primary border-0",
  chill: "bg-accent/10 text-accent border-0",
  cheap: "bg-secondary text-secondary-foreground border-0",
};

export function PlacesTab({
  joinedPlaces,
  placeCounts,
  onJoinPlace,
  onNavigateToEvent,
}: {
  joinedPlaces: Set<string>;
  placeCounts: Record<string, number>;
  onJoinPlace: (id: string) => void;
  onNavigateToEvent?: (eventId: string) => void;
}) {
  const [filter, setFilter] = useState<PlaceFilter>("All");
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredPlaces = filter === "All" ? places : places.filter(p => p.category === filter);

  const handleJoin = (id: string) => {
    if (joinedPlaces.has(id)) return;
    setAnimatingId(id);
    onJoinPlace(id);
    setTimeout(() => setAnimatingId(null), 600);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              f === filter
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="space-y-3">
          {filteredPlaces.map((p, idx) => {
            const hasJoined = joinedPlaces.has(p.id);
            const count = placeCounts[p.id] || p.going;
            const isAnimating = animatingId === p.id;
            const linkedEvents = (p.linkedEventIds || [])
              .map(eid => events.find(e => e.id === eid))
              .filter(Boolean);

            return (
              <div
                key={p.id}
                className="bg-card rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex gap-3.5 items-start">
                  <div className="text-2xl w-11 h-11 flex items-center justify-center bg-primary/10 rounded-xl shrink-0">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                      <Badge className={`shrink-0 text-[10px] font-medium ${tagColors[p.tag] || ""}`}>{p.tag}</Badge>
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                {linkedEvents.length > 0 && (
                  <div className="space-y-1.5">
                    {linkedEvents.map(ev => ev && (
                      <button
                        key={ev.id}
                        onClick={() => onNavigateToEvent?.(ev.id)}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-medium text-foreground/80 truncate">{ev.emoji} {ev.name}</span>
                        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">{ev.time}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span className={`font-medium text-foreground/70 ${isAnimating ? "animate-bounce-count" : ""}`}>{count}</span> going tonight
                  </span>
                  <Button
                    size="sm"
                    variant={hasJoined ? "secondary" : "default"}
                    className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 ${
                      hasJoined ? "" : "shadow-md shadow-primary/20"
                    } ${isAnimating ? "scale-95" : ""}`}
                    onClick={() => handleJoin(p.id)}
                    disabled={hasJoined}
                  >
                    {hasJoined ? "Going ✓" : "I'm going"}
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
