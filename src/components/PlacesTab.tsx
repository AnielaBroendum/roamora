import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PlaceFilter } from "@/lib/types";
import { places } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";

const filters: PlaceFilter[] = ["All", "Bars", "Cheap eats", "Hostels"];

const tagColors: Record<string, string> = {
  party: "bg-primary/10 text-primary border-0",
  chill: "bg-accent/10 text-accent border-0",
  cheap: "bg-secondary text-secondary-foreground border-0",
};

export function PlacesTab() {
  const [filter, setFilter] = useState<PlaceFilter>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filteredPlaces = filter === "All" ? places : places.filter(p => p.category === filter);

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
          {filteredPlaces.map((p, idx) => (
            <div
              key={p.name}
              className="bg-card rounded-2xl p-4 flex gap-3.5 items-start animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
            >
              <div className="text-2xl w-11 h-11 flex items-center justify-center bg-primary/10 rounded-xl shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                  <Badge className={`shrink-0 text-[10px] font-medium ${tagColors[p.tag] || ""}`}>{p.tag}</Badge>
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{p.desc}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span><span className="font-medium text-foreground/70">{p.going}</span> people going</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
