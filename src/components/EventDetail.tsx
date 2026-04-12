import { ArrowLeft, Share2, Clock, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { memberColors } from "@/lib/data";
import type { EventItem } from "@/lib/types";

const eventGradients: Record<string, string> = {
  "🍻": "from-amber-900/80 to-amber-950/90",
  "🎶": "from-purple-900/80 to-purple-950/90",
  "🎷": "from-blue-900/80 to-blue-950/90",
  "🌅": "from-orange-800/70 to-rose-950/90",
  "💃": "from-pink-900/80 to-pink-950/90",
};

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
  const gradient = eventGradients[event.emoji] || "from-card to-card";

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col max-w-md mx-auto animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
            width={800}
            height={512}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${gradient} flex items-center justify-center`}>
            <span className="text-8xl opacity-30 select-none">{event.emoji}</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back + Share buttons */}
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
      <div className="flex-1 overflow-y-auto px-5 -mt-8 relative z-10 pb-28">
        <h1 className="text-2xl font-bold text-foreground leading-tight">{event.name}</h1>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Today
          </span>
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {event.time}
          </span>
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {event.venue}
          </span>
        </div>

        {/* Address */}
        {event.address && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Location</h3>
            <p className="text-sm text-foreground/80">{event.address}</p>
          </div>
        )}

        {/* Description */}
        <div className="mt-5 bg-card rounded-xl p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
        </div>

        {/* Going section */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {goingCount} Going
          </h3>
          <div className="flex -space-x-2 mb-2">
            {(event.recentJoiners || []).slice(0, 5).map((name, i) => (
              <Avatar key={i} className="h-9 w-9 border-2 border-background">
                <AvatarFallback className={`${memberColors[i % memberColors.length]} text-xs font-semibold`}>
                  {name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {goingCount > 5 && (
              <Avatar className="h-9 w-9 border-2 border-background">
                <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                  +{goingCount - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          {event.recentJoiners && event.recentJoiners.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {event.recentJoiners.slice(0, 3).join(", ")}
              {goingCount > 3 && ` and ${goingCount - 3} more`}
            </p>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background to-transparent">
        <Button
          className={`w-full h-14 rounded-2xl text-base font-semibold btn-press transition-all duration-200 ${
            hasJoined ? "" : "shadow-lg shadow-primary/20"
          }`}
          variant={hasJoined ? "secondary" : "default"}
          onClick={() => onJoin(event.id)}
          disabled={hasJoined}
        >
          {hasJoined ? "Going ✓" : "Join them"}
        </Button>
      </div>
    </div>
  );
}
