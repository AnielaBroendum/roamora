import { useState, useEffect } from "react";
import { Plus, MapPin, TrendingUp, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Plan, PlanTag } from "@/lib/types";
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
  const [tag, setTag] = useState<PlanTag | "">("");
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);

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

  const handleSubmit = () => {
    if (!title.trim() || !time.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      time: time.trim(),
      tag: (tag as PlanTag) || undefined,
    });
    setTitle("");
    setDescription("");
    setTime("");
    setTag("");
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
              <DialogTitle>Create a Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input placeholder="Title (e.g. Going out tonight)" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[60px]" />
              <Input placeholder="Time (e.g. Tonight, 9 PM)" value={time} onChange={e => setTime(e.target.value)} />
              <Select value={tag} onValueChange={v => setTag(v as PlanTag)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tag (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tagConfig).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} className="w-full" disabled={!title.trim() || !time.trim()}>
                Create Plan
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
                {/* Labels */}
                {p.label && (
                  <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                    {!p.label.startsWith("🔥") && <TrendingUp className="w-3 h-3" />}
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
                      <p className="text-xs text-muted-foreground">{p.organizer} · {p.time}</p>
                      {p.distance && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                          <Navigation className="w-3 h-3" /> {p.distance}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {p.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{p.description}</p>
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
                    {hasJoined ? "Joined ✓" : "Join"}
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
          title={`Joined: ${modalPlan.title}`}
          participants={modalPlan.members}
        />
      )}
    </div>
  );
}
