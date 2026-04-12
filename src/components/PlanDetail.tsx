import { ArrowLeft, Clock, Users, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Plan, PlanTag } from "@/lib/types";

const tagConfig: Record<PlanTag, { emoji: string; label: string; color: string }> = {
  party: { emoji: "🎉", label: "Party", color: "bg-primary/10 text-primary" },
  chill: { emoji: "😌", label: "Chill", color: "bg-accent/10 text-accent" },
  food: { emoji: "🍜", label: "Food", color: "bg-secondary text-secondary-foreground" },
  adventure: { emoji: "🏔️", label: "Adventure", color: "bg-destructive/10 text-destructive" },
};

const vibeEmoji: Record<PlanTag, string> = {
  party: "🎉",
  chill: "🌴",
  food: "🍽️",
  adventure: "⛰️",
};

export function PlanDetail({
  plan,
  hasJoined,
  onJoin,
  onBack,
}: {
  plan: Plan;
  hasJoined: boolean;
  onJoin: (id: string) => void;
  onBack: () => void;
}) {
  const heroEmoji = plan.tag ? vibeEmoji[plan.tag] : "✨";

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col max-w-md mx-auto animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-20 select-none">{heroEmoji}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <button
          onClick={onBack}
          className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center btn-press"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 -mt-10 relative z-10 pb-6">
        {/* Organizer avatar + name */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-14 w-14 ring-4 ring-background shadow-lg">
            <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
              {plan.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Organized by</p>
            <p className="font-semibold text-foreground">{plan.organizer}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground leading-tight">{plan.title}</h1>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            {plan.time}
          </span>
          {plan.tag && (
            <Badge className={`rounded-full px-3.5 py-2 text-sm font-medium ${tagConfig[plan.tag].color} border-0`}>
              {tagConfig[plan.tag].emoji} {tagConfig[plan.tag].label}
            </Badge>
          )}
          <span className="inline-flex items-center gap-1.5 bg-card rounded-full px-3.5 py-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            {plan.members.length} going
          </span>
        </div>

        {/* Personal note */}
        {plan.description && (
          <div className="mt-6 bg-card rounded-2xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Note from {plan.organizer.split(" ")[0]}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed italic">
              "{plan.description}"
            </p>
          </div>
        )}

        {/* Vibe section */}
        {plan.tag && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">The vibe</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {plan.tag === "party" && "Expect good music, new friends, and late-night energy. Come as you are! 🕺"}
              {plan.tag === "chill" && "Low-key hangs, good conversation, zero pressure. Just vibes. 😌"}
              {plan.tag === "food" && "Explore local flavors together. Sharing plates, sharing stories. 🍜"}
              {plan.tag === "adventure" && "Get out there, explore, and make memories. Bring your sense of wonder! 🌄"}
            </p>
          </div>
        )}

        {/* Who's going */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Who's going ({plan.members.length})
          </h3>
          <Separator className="mb-3" />
          <div className="space-y-3">
            {plan.members.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${m.color} text-sm font-semibold`}>
                    {m.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  {i === 0 && (
                    <p className="text-xs text-muted-foreground">Organizer</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="shrink-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-background border-t border-border/30">
        <Button
          className={`w-full h-14 rounded-2xl text-base font-semibold btn-press transition-all duration-200 ${
            hasJoined ? "" : "shadow-lg shadow-primary/20"
          }`}
          variant={hasJoined ? "secondary" : "default"}
          onClick={() => onJoin(plan.id)}
          disabled={hasJoined}
        >
          {hasJoined ? "You're in ✓" : "I'm in! 🤙"}
        </Button>
      </div>
    </div>
  );
}
