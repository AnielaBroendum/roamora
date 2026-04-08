import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Plan } from "@/lib/types";
import { CardSkeleton } from "./CardSkeleton";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = () => {
    if (!title.trim() || !time.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), time: time.trim() });
    setTitle("");
    setDescription("");
    setTime("");
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
            return (
              <div
                key={p.id}
                className="bg-card rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: "backwards" }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{p.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate leading-tight">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.organizer} · {p.time}</p>
                  </div>
                </div>
                {p.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{p.description}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2.5">
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
                      <span className="font-medium text-foreground/70">{p.members.length}</span> joined
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={hasJoined ? "secondary" : "default"}
                    className={`rounded-full px-5 h-8 text-xs font-semibold transition-all duration-200 ${
                      hasJoined ? "" : "shadow-md shadow-primary/20"
                    }`}
                    onClick={() => onJoin(p.id)}
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
    </div>
  );
}
