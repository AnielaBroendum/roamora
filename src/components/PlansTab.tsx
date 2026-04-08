import { useState, useEffect } from "react";
import { Plus, Navigation, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Plan, PlanTag } from "@/lib/types";
import { places } from "@/lib/data";
import { CardSkeleton } from "./CardSkeleton";
import { ParticipantModal } from "./ParticipantModal";

const tagConfig: Record<PlanTag, { emoji: string; label: string; color: string }> = {
  party: { emoji: "🎉", label: "Party", color: "bg-primary/10 text-primary border-0" },
  chill: { emoji: "😌", label: "Chill", color: "bg-accent/10 text-accent border-0" },
  food: { emoji: "🍜", label: "Food", color: "bg-secondary text-secondary-foreground border-0" },
  adventure: { emoji: "🏔️", label: "Adventure", color: "bg-destructive/10 text-destructive border-0" },
};

export function PlansTab({
  plans,
  joinedPlans,
  onJoin,
  onCreate,
}: {
  plans: Plan[];
  joinedPlans: Set<string>;
  onJoin: (id: string) => void;
  onCreate: (plan: Omit<Plan, "id" | "organizer" | "avatar" | "members">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [tag, setTag] = useState<PlanTag | "">("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);

  const titlePlaceholders = [
    "Drinks in Poblado",
    "Dinner tonight?",
    "Salsa night crew",
    "Anyone up for tacos?",
  ];
  const [placeholderIdx] = useState(() => Math.floor(Math.random() * titlePlaceholders.length));

  const timeOptions = ["Tonight", "Tomorrow", "Custom"];
  const tagOptions: { key: PlanTag; emoji: string; label: string }[] = [
    { key: "party", emoji: "🎉", label: "Party" },
    { key: "food", emoji: "🍜", label: "Food" },
    { key: "chill", emoji: "😌", label: "Chill" },
    { key: "adventure", emoji: "🏔️", label: "Adventure" },
  ];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleJoin = (id: string) => {
    if (joinedPlans.has(id)) return;
    setAnimatingId(id);
    onJoin(id);
    setTimeout(() => setAnimatingId(null), 600);
  };

  const resolvedTime = time === "Custom" ? customTime.trim() : time;

  const handleSubmit = () => {
    if (!title.trim() || !resolvedTime) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      time: resolvedTime,
      tag: (tag as PlanTag) || undefined,
    });
    setTitle("");
    setDescription("");
    setTime("");
    setCustomTime("");
    setTag("");
    setLocation("");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Join travelers or start your own ✌️</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full h-8 px-3.5 text-xs font-semibold gap-1.5 shadow-md shadow-primary/20">
              <Plus className="w-3.5 h-3.5" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">What's the plan? 🤙</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">What are you doing?</label>
                <Input
                  placeholder={titlePlaceholders[placeholderIdx]}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="text-sm"
                  autoFocus
                />
              </div>

              {/* Time quick picks */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">When?</label>
                <div className="flex gap-2">
                  {timeOptions.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        time === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {t === "Custom" ? "Pick time" : t}
                    </button>
                  ))}
                </div>
                {time === "Custom" && (
                  <Input
                    placeholder="e.g. Saturday 8 PM"
                    value={customTime}
                    onChange={e => setCustomTime(e.target.value)}
                    className="text-sm mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
                  />
                )}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Vibe <span className="text-muted-foreground/60">(optional)</span></label>
                <div className="flex gap-2 flex-wrap">
                  {tagOptions.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTag(tag === t.key ? "" : t.key)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        tag === t.key
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Where? <span className="text-muted-foreground/60">(optional)</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Add a spot or leave open"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="text-sm pl-8"
                    list="places-list"
                  />
                  <datalist id="places-list">
                    {places.map(p => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Add a note <span className="text-muted-foreground/60">(optional)</span></label>
                <Textarea
                  placeholder="First round on me! 🍻"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[56px] text-sm resize-none"
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full rounded-full h-10 font-semibold shadow-md shadow-primary/20"
                disabled={!title.trim() || !resolvedTime}
              >
                Start plan 🚀
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
        <div className="space-y-3">
          {plans.map((p, idx) => {
            const hasJoined = joinedPlans.has(p.id);
            const isAnimating = animatingId === p.id;
            return (
              <div
                key={p.id}
                className="bg-card rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                {p.label && (
                  <span className="text-[11px] font-semibold text-primary">
                    {p.label}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{p.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate leading-tight">{p.title}</h3>
                      {p.tag && (
                        <Badge className={`shrink-0 text-[10px] font-medium ${tagConfig[p.tag]?.color || ""}`}>
                          {tagConfig[p.tag]?.emoji} {tagConfig[p.tag]?.label}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/70">{p.organizer}</span> is going · {p.time}
                      </p>
                      {p.distance && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <Navigation className="w-3 h-3" /> {p.distance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {p.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">"{p.description}"</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <button
                    onClick={() => { setModalPlan(p); setModalOpen(true); }}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex -space-x-2">
                      {p.members.slice(0, 5).map((m, i) => (
                        <Avatar key={i} className="h-7 w-7 border-2 border-card">
                          <AvatarFallback className={`${m.color} text-[10px] font-semibold`}>{m.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                      {p.members.length > 5 && (
                        <Avatar className="h-7 w-7 border-2 border-card">
                          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">+{p.members.length - 5}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">{p.members.slice(0, 2).map(m => m.name).join(", ")}</span>
                      {p.members.length > 2 && <> + <span className={`font-medium text-foreground/70 ${isAnimating ? "animate-bounce-count" : ""}`}>{p.members.length - 2}</span> others</>}
                    </span>
                  </button>
                  <Button
                    size="sm"
                    variant={hasJoined ? "secondary" : "default"}
                    className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 ${
                      hasJoined ? "" : "shadow-md shadow-primary/20"
                    } ${isAnimating ? "scale-95" : ""}`}
                    onClick={() => handleJoin(p.id)}
                    disabled={hasJoined}
                  >
                    {hasJoined ? "Joined ✓" : "I'm in"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalPlan && (
        <ParticipantModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={`Going: ${modalPlan.title}`}
          participants={modalPlan.members}
        />
      )}
    </div>
  );
}
