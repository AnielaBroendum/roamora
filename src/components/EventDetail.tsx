import { ArrowLeft, Share2, Clock, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { memberColors } from "@/lib/data";
import type { EventItem } from "@/lib/types";

export function EventDetail({
  event,
  goingCount,
  hasJoined,
  onJoin,
  onBack,
}: {
  event: EventItem;
  goingCount: number;
  hasJoined: boolean;
  onJoin: (id: string) => void;
  onBack: () => void;
}) {
  const mapBbox = event.lat && event.lng
    ? `${event.lng - 0.008},${event.lat - 0.005},${event.lng + 0.008},${event.lat + 0.005}`
    : "-75.58,6.19,-75.55,6.22";
  const mapMarker = event.lat && event.lng
    ? `${event.lat},${event.lng}`
    : "6.208,-75.567";

  // Build full participant list
  const allParticipants = (event.recentJoiners || []).map((name, i) => ({
    name,
    initials: name[0],
    color: memberColors[i % memberColors.length],
  }));
  // Fill remaining up to goingCount
  for (let i = allParticipants.length; i < Math.min(goingCount, 12); i++) {
    allParticipants.push({
      name: `Traveler ${i + 1}`,
      initials: "T",
      color: memberColors[i % memberColors.length],
    });
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col max-w-md mx-auto animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden shrink-0">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
            width={800}
            height={512}
          />
        ) : (
          <div className="w-full h-full bg-card flex items-center justify-center">
            <span className="text-8xl opacity-30 select-none">{event.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <button
          onClick={onBack}
          className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-md flex items-center justify-center btn-press"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
        <button className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-md flex items-center justify-center btn-press">
          <Share2 className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 -mt-6 relative z-10 pb-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground leading-tight">{event.name}</h1>

        {/* Date / Time / Venue pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Today
          </span>
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {event.venue}
          </span>
        </div>

        {/* About */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
        </div>

        {/* Location — styled like the reference */}
        {event.address && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Location</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-foreground">{event.venue}</p>
                <p className="text-xs text-muted-foreground">{event.address}</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-border/40 h-44">
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(mapBbox)}&layer=mapnik&marker=${encodeURIComponent(mapMarker)}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hosts */}
        {event.hosts && event.hosts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Hosts</h3>
            <Separator className="mb-3" />
            <div className="space-y-3">
              {event.hosts.map((host, i) => (
                <div key={host} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${memberColors[i % memberColors.length]} text-sm font-semibold`}>
                      {host.split(" ").map(w => w[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{host}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Going */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">{goingCount} Going</h3>
          <Separator className="mb-3" />
          <div className="flex -space-x-2 mb-3">
            {allParticipants.slice(0, 6).map((p, i) => (
              <Avatar key={i} className="h-10 w-10 border-2 border-background">
                <AvatarFallback className={`${p.color} text-xs font-semibold`}>
                  {p.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {goingCount > 6 && (
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                  +{goingCount - 6}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {allParticipants.slice(0, 4).map(p => p.name).join(", ")}
            {goingCount > 4 && ` and ${goingCount - 4} more`}
          </p>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="shrink-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-background border-t border-border/30">
        <Button
          className={`w-full h-14 rounded-2xl text-base font-semibold btn-press transition-all duration-200 ${
            hasJoined ? "" : "shadow-lg shadow-primary/20"
          }`}
          variant={hasJoined ? "secondary" : "default"}
          onClick={() => onJoin(event.id)}
          disabled={hasJoined}
        >
          {hasJoined ? "Going ✓" : "Join"}
        </Button>
      </div>
    </div>
  );
}
