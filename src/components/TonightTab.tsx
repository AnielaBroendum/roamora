import { useState, useEffect, useCallback } from "react";
import { Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { events, memberColors } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";
import { ParticipantModal } from "./ParticipantModal";
import { EventDetail } from "./EventDetail";
import { useSimulatedActivity } from "@/hooks/useSimulatedActivity";
import type { PlanMember, EventItem } from "@/lib/types";

export function TonightTab({
  joinedEvents,
  goingCounts,
  onJoin,
  onNavigateToPlace,
  onSimBump,
}: {
  joinedEvents: Set<string>;
  goingCounts: Record<string, number>;
  onJoin: (id: string) => void;
  onNavigateToPlace?: (venueId: string) => void;
  onSimBump?: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<{ title: string; participants: PlanMember[] } | null>(null);
  const [recentBumpId, setRecentBumpId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Simulated activity
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

  return (
    <div className="space-y-5 tab-content">
      <p className="text-muted-foreground text-sm">What's happening tonight ✨</p>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="space-y-3">
          {events.map((e, idx) => {
            const hasJoined = joinedEvents.has(e.id);
            const count = goingCounts[e.id] || e.going;
            const isFeatured = e.featured;
            const isAnimating = animatingId === e.id;
            const isCelebrating = celebratingId === e.id;
            const wasRecentlyBumped = recentBumpId === e.id;

            return (
              <div
                key={e.id}
                className={`bg-card rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 transition-all relative overflow-hidden ${
                  isFeatured ? "ring-1 ring-primary/20 shadow-lg shadow-primary/5 animate-glow-pulse" : ""
                } ${isCelebrating ? "animate-join-celebrate" : ""}`}
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
              >
                {/* Shimmer overlay for featured */}
                {isFeatured && <div className="absolute inset-0 shimmer-overlay pointer-events-none" />}

                <div className="relative z-10 space-y-3">
                  {e.label && (
                    <span className="text-[11px] font-semibold text-primary inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
                      {e.label}
                    </span>
                  )}

                  <div className="flex gap-3.5 items-start">
                    <div className={`text-3xl flex items-center justify-center bg-primary/10 rounded-xl shrink-0 transition-transform duration-200 ${isFeatured ? "w-13 h-13" : "w-11 h-11"}`}>
                      {e.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-foreground leading-tight ${isFeatured ? "text-[15px]" : ""}`}>{e.name}</h3>
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
                        <button
                          onClick={() => e.venueId && onNavigateToPlace?.(e.venueId)}
                          className={`flex items-center gap-1 truncate ${e.venueId ? "hover:text-primary transition-colors cursor-pointer" : ""}`}
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{e.venue}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <button
                      onClick={() => showParticipants(e.name, e.recentJoiners || [], count)}
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
                        {e.recentJoiners && e.recentJoiners.length > 0 ? (
                          <>
                            <span className="font-medium text-foreground/70">{e.recentJoiners.slice(0, 2).join(", ")}</span>
                            {count > 2 && <> + <span className={`font-medium text-foreground/70 transition-all duration-300 ${isAnimating || wasRecentlyBumped ? "animate-count-up" : ""}`}>{count - 2}</span> others</>}
                          </>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span className={`font-medium text-foreground/70 transition-all duration-300 ${isAnimating || wasRecentlyBumped ? "animate-count-up" : ""}`}>{count}</span> going tonight
                          </span>
                        )}
                      </span>
                    </button>
                    <Button
                      size="sm"
                      variant={hasJoined ? "secondary" : "default"}
                      className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 btn-press ${
                        hasJoined ? "" : "shadow-md shadow-primary/20"
                      } ${isAnimating ? "scale-95" : ""}`}
                      onClick={() => handleJoin(e.id)}
                      disabled={hasJoined}
                    >
                      {hasJoined ? "Going ✓" : "Join them"}
                    </Button>
                  </div>

                  {/* Subtle "someone joined" indicator */}
                  {wasRecentlyBumped && !hasJoined && (
                    <div className="text-[11px] text-primary/70 animate-fade-in-subtle">
                      Someone just joined
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
