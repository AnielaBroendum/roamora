import { useState, useEffect, useCallback } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { events, memberColors, eventCategories } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";
import { ParticipantModal } from "./ParticipantModal";
import { EventDetail } from "./EventDetail";
import { useSimulatedActivity } from "@/hooks/useSimulatedActivity";
import type { PlanMember, EventItem } from "@/lib/types";

export function TonightTab({
  joinedEvents,
  goingCounts,
  onJoin,
  onSimBump,
}: {
  joinedEvents: Set<string>;
  goingCounts: Record<string, number>;
  onJoin: (id: string) => void;
  onSimBump?: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<{ title: string; participants: PlanMember[] } | null>(null);
  const [recentBumpId, setRecentBumpId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const handleSimBump = useCallback((id: string) => {
    onSimBump?.(id);
    setRecentBumpId(id);
    setTimeout(() => setRecentBumpId(null), 3000);
  }, [onSimBump]);

  useSimulatedActivity(
    events.map(e => e.id),
    handleSimBump,
    { minDelay: 10000, maxDelay: 25000, enabled: !loading }
  );

  const handleJoin = (id: string) => {
    if (joinedEvents.has(id)) return;
    setAnimatingId(id);
    setCelebratingId(id);
    onJoin(id);
    setTimeout(() => setAnimatingId(null), 600);
    setTimeout(() => setCelebratingId(null), 800);
  };

  const showParticipants = (eventName: string, recentJoiners: string[], count: number) => {
    const participants: PlanMember[] = (recentJoiners || []).map((name, i) => ({
      name,
      avatar: name[0],
      color: memberColors[i % memberColors.length],
    }));
    for (let i = participants.length; i < Math.min(count, 12); i++) {
      participants.push({ name: `Traveler ${i + 1}`, avatar: "T", color: memberColors[i % memberColors.length] });
    }
    setModalEvent({ title: eventName, participants });
    setModalOpen(true);
  };

  const filteredEvents = activeFilter === "All"
    ? events
    : events.filter(e => e.tag === activeFilter);

  return (
    <div className="space-y-4 tab-content">
      <p className="text-muted-foreground text-sm">What's happening tonight ✨</p>

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {eventCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 btn-press ${
              activeFilter === cat
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((e, idx) => {
            const hasJoined = joinedEvents.has(e.id);
            const count = goingCounts[e.id] || e.going;
            const isCelebrating = celebratingId === e.id;
            const isAnimating = animatingId === e.id;
            const wasRecentlyBumped = recentBumpId === e.id;

            return (
              <div
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className={`bg-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 transition-all cursor-pointer active:scale-[0.98] shadow-sm ${
                  isCelebrating ? "animate-join-celebrate" : ""
                }`}
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
              >
                {/* Event image */}
                {e.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={e.image}
                      alt={e.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={800}
                      height={512}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    {e.label && (
                      <span className="absolute top-3 left-3 text-[11px] font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/80 animate-pulse-dot" />
                        {e.label}
                      </span>
                    )}
                    <Badge className="absolute top-3 right-3 bg-card/70 backdrop-blur-md text-foreground border-0 text-[10px] font-medium">
                      {e.tag}
                    </Badge>
                  </div>
                )}

                {/* Card content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-[15px] leading-tight">{e.name}</h3>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{e.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary/70" />
                      {e.time}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      <span className="truncate">{e.venue}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button
                      onClick={(ev) => { ev.stopPropagation(); showParticipants(e.name, e.recentJoiners || [], count); }}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex -space-x-1.5">
                        {(e.recentJoiners || []).slice(0, 3).map((name, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-card">
                            <AvatarFallback className={`${memberColors[i % memberColors.length]} text-[9px] font-semibold`}>
                              {name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        <span className={`font-medium text-foreground/70 transition-all duration-300 ${isAnimating || wasRecentlyBumped ? "animate-count-up" : ""}`}>{count}</span> going
                      </span>
                    </button>
                    <Button
                      size="sm"
                      variant={hasJoined ? "secondary" : "default"}
                      className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 btn-press ${
                        hasJoined ? "" : "shadow-md shadow-primary/20"
                      } ${isAnimating ? "scale-95" : ""}`}
                      onClick={(ev) => { ev.stopPropagation(); handleJoin(e.id); }}
                      disabled={hasJoined}
                    >
                      {hasJoined ? "Going ✓" : "Join"}
                    </Button>
                  </div>

                  {wasRecentlyBumped && !hasJoined && (
                    <div className="text-[11px] text-primary/70 animate-fade-in-subtle">
                      Someone just joined
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredEvents.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No events in this category tonight</p>
          )}
        </div>
      )}

      {modalEvent && (
        <ParticipantModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={`Going to ${modalEvent.title}`}
          participants={modalEvent.participants}
        />
      )}

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          goingCount={goingCounts[selectedEvent.id] || selectedEvent.going}
          hasJoined={joinedEvents.has(selectedEvent.id)}
          onJoin={(id) => { handleJoin(id); }}
          onBack={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
