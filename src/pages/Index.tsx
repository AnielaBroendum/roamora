import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tab, Plan } from "@/lib/types";
import { memberColors, events, initialPlans } from "@/lib/data";
import { BottomNav } from "@/components/BottomNav";
import { TonightTab } from "@/components/TonightTab";
import { PlansTab } from "@/components/PlansTab";
import { ActivityTab } from "@/components/ActivityTab";

export default function Index() {
  const navigate = useNavigate();
  const { profile, session } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("tonight");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [joinedPlans, setJoinedPlans] = useState<Set<string>>(new Set());
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const [eventGoingCounts, setEventGoingCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(events.map(e => [e.id, e.going]))
  );

  const requireAuth = () => {
    if (!session) {
      toast({ title: "Sign up to join", description: "Create an account to join events and plans.", variant: "default" });
      navigate("/auth");
      return false;
    }
    return true;
  };

  const handleJoinEvent = (id: string) => {
    if (!requireAuth()) return;
    if (joinedEvents.has(id)) return;
    setJoinedEvents(prev => new Set(prev).add(id));
    setEventGoingCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleJoin = (id: string) => {
    if (!requireAuth()) return;
    if (joinedPlans.has(id)) return;
    setJoinedPlans(prev => new Set(prev).add(id));
    setPlans(prev => prev.map(p => p.id === id ? {
      ...p,
      members: [...p.members, { name: "You", avatar: "Y", color: memberColors[p.members.length % memberColors.length] }],
    } : p));
  };

  const handleCreatePlan = (plan: Omit<Plan, "id" | "organizer" | "avatar" | "members">) => {
    if (!requireAuth()) return;
    const newPlan: Plan = {
      ...plan,
      id: Date.now().toString(),
      organizer: "You",
      avatar: "Y",
      members: [{ name: "You", avatar: "Y", color: memberColors[0] }],
    };
    setPlans(prev => [newPlan, ...prev]);
    setJoinedPlans(prev => new Set(prev).add(newPlan.id));
  };

  const handleEventSimBump = useCallback((id: string) => {
    setEventGoingCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col max-w-md mx-auto relative">
      <header className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-3 sticky top-0 bg-background/80 backdrop-blur-xl z-40">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight uppercase" style={{ fontFamily: "'Fredoka', sans-serif" }}>Roamora</h1>
          <button className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5 hover:text-foreground/70 transition-colors">
            <MapPin className="w-3.5 h-3.5" /> Medellín <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <Avatar className="h-9 w-9 ring-2 ring-border cursor-pointer" onClick={() => navigate("/profile")}>
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} />
          ) : null}
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
            {profile?.display_name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
      </header>

      <main className="flex-1 px-5 pb-24 pt-1">
        {tab === "tonight" && (
          <TonightTab
            joinedEvents={joinedEvents}
            goingCounts={eventGoingCounts}
            onJoin={handleJoinEvent}
            onSimBump={handleEventSimBump}
          />
        )}
        {tab === "plans" && (
          <PlansTab plans={plans} joinedPlans={joinedPlans} onJoin={handleJoin} onCreate={handleCreatePlan} />
        )}
        {tab === "activity" && (
          <ActivityTab
            joinedEvents={joinedEvents}
            joinedPlans={joinedPlans}
            plans={plans}
            eventGoingCounts={eventGoingCounts}
          />
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
