import { useState } from "react";
import { Calendar, Users, MapPin, Clock, ChevronDown, User, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Tab = "tonight" | "plans" | "places";
type PlaceFilter = "All" | "Bars" | "Food" | "Hostels";

interface PlanMember {
  name: string;
  avatar: string;
  color: string;
}

interface Plan {
  id: string;
  organizer: string;
  title: string;
  description: string;
  time: string;
  members: PlanMember[];
  avatar: string;
}

const memberColors = [
  "bg-primary/20 text-primary",
  "bg-destructive/20 text-destructive",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-primary/30 text-primary",
];

const events = [
  { name: "Pub Crawl Poblado", time: "8:00 PM", venue: "Meeting at Parque Lleras", tag: "Pub Crawl", emoji: "🍻" },
  { name: "Reggaeton Night", time: "10:00 PM", venue: "Club Babylon", tag: "Party", emoji: "🎶" },
  { name: "Live Jazz at Calle 10", time: "7:30 PM", venue: "El Jazz Bar", tag: "Live Music", emoji: "🎷" },
  { name: "Rooftop Sunset Session", time: "5:00 PM", venue: "Sky Lounge Laureles", tag: "Social", emoji: "🌅" },
  { name: "Latin Dance Party", time: "9:00 PM", venue: "Salsa Club Centro", tag: "Party", emoji: "💃" },
];

const initialPlans: Plan[] = [
  { id: "1", organizer: "Alex", title: "Rooftop drinks in Poblado", description: "Chill vibes at Envy Rooftop, first round on me!", time: "Tonight, 7 PM", avatar: "A", members: [
    { name: "Alex", avatar: "A", color: memberColors[0] },
    { name: "Lena", avatar: "L", color: memberColors[1] },
    { name: "Carlos", avatar: "C", color: memberColors[2] },
    { name: "Yuki", avatar: "Y", color: memberColors[3] },
  ]},
  { id: "2", organizer: "Mia", title: "Salsa night crew", description: "Beginners welcome! We'll hit Salsa Club Centro.", time: "Tonight, 9 PM", avatar: "M", members: [
    { name: "Mia", avatar: "M", color: memberColors[1] },
    { name: "Tom", avatar: "T", color: memberColors[0] },
    { name: "Nina", avatar: "N", color: memberColors[4] },
    { name: "Raj", avatar: "R", color: memberColors[2] },
    { name: "Ava", avatar: "A", color: memberColors[3] },
    { name: "Leo", avatar: "L", color: memberColors[0] },
    { name: "Zoe", avatar: "Z", color: memberColors[1] },
  ]},
  { id: "3", organizer: "João", title: "Street food tour Laureles", description: "Exploring the best local eats in the neighborhood.", time: "Tomorrow, 6 PM", avatar: "J", members: [
    { name: "João", avatar: "J", color: memberColors[2] },
    { name: "Emma", avatar: "E", color: memberColors[0] },
    { name: "Dan", avatar: "D", color: memberColors[4] },
  ]},
  { id: "4", organizer: "Sophie", title: "Sunrise hike to Piedra del Peñol", description: "Early start but worth it! Transport included.", time: "Saturday, 5 AM", avatar: "S", members: [
    { name: "Sophie", avatar: "S", color: memberColors[3] },
    { name: "Max", avatar: "M", color: memberColors[0] },
    { name: "Isla", avatar: "I", color: memberColors[1] },
    { name: "Finn", avatar: "F", color: memberColors[2] },
    { name: "Chloe", avatar: "C", color: memberColors[4] },
  ]},
];

const places = [
  { name: "Envy Rooftop", category: "Bars", desc: "Stunning views & cocktails in Poblado", distance: "0.8 km", emoji: "🍸" },
  { name: "Mondongo's", category: "Food", desc: "Traditional bandeja paisa & local flavors", distance: "1.2 km", emoji: "🍲" },
  { name: "Los Patios Hostel", category: "Hostels", desc: "Social hostel with pool & events", distance: "0.3 km", emoji: "🏠" },
  { name: "La Octava Bar", category: "Bars", desc: "Craft beer & live music nightly", distance: "0.5 km", emoji: "🍺" },
  { name: "Happy Buddha Hostel", category: "Hostels", desc: "Chill vibes in Laureles neighborhood", distance: "2.1 km", emoji: "🧘" },
];

const datePills = ["Today", "Fri", "Sat", "Sun", "Mon"];

export default function Index() {
  const [tab, setTab] = useState<Tab>("tonight");
  const [placeFilter, setPlaceFilter] = useState<PlaceFilter>("All");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [joinedPlans, setJoinedPlans] = useState<Set<string>>(new Set());

  const filteredPlaces = placeFilter === "All" ? places : places.filter(p => p.category === placeFilter);

  const handleJoin = (id: string) => {
    if (joinedPlans.has(id)) return;
    setJoinedPlans(prev => new Set(prev).add(id));
    setPlans(prev => prev.map(p => p.id === id ? {
      ...p,
      members: [...p.members, { name: "You", avatar: "Y", color: memberColors[p.members.length % memberColors.length] }],
    } : p));
  };

  const handleCreatePlan = (plan: Omit<Plan, "id" | "organizer" | "avatar" | "members">) => {
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

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <header className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Roamora</h1>
          <button className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
            <MapPin className="w-3.5 h-3.5" /> Medellín <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <Avatar className="h-9 w-9 bg-secondary">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm"><User className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {tab === "tonight" && <TonightTab />}
        {tab === "plans" && (
          <PlansTab
            plans={plans}
            joinedPlans={joinedPlans}
            onJoin={handleJoin}
            onCreate={handleCreatePlan}
          />
        )}
        {tab === "places" && <PlacesTab filter={placeFilter} setFilter={setPlaceFilter} places={filteredPlaces} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur border-t border-border">
        <div className="flex justify-around py-2">
          {([
            { id: "tonight" as Tab, icon: Calendar, label: "Tonight" },
            { id: "plans" as Tab, icon: Users, label: "Plans" },
            { id: "places" as Tab, icon: MapPin, label: "Places" },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function TonightTab() {
  const [activeDate, setActiveDate] = useState(0);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {datePills.map((d, i) => (
          <button
            key={d}
            onClick={() => setActiveDate(i)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === activeDate ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {events.map(e => (
          <div key={e.name} className="bg-card rounded-xl p-4 flex gap-4 items-start">
            <div className="text-3xl mt-0.5">{e.emoji}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{e.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" />{e.time}</p>
              <p className="text-sm text-muted-foreground truncate">{e.venue}</p>
            </div>
            <Badge className="shrink-0 bg-primary/15 text-primary border-0 hover:bg-primary/20">{e.tag}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlansTab({
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

  const handleSubmit = () => {
    if (!title.trim() || !time.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), time: time.trim() });
    setTitle("");
    setDescription("");
    setTime("");
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Join other travelers or start your own plan ✌️</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full h-8 px-3 text-xs font-semibold gap-1">
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
      {plans.map(p => {
        const hasJoined = joinedPlans.has(p.id);
        return (
          <div key={p.id} className="bg-card rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{p.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.organizer} · {p.time}</p>
              </div>
            </div>
            {p.description && (
              <p className="text-sm text-muted-foreground">{p.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-muted-foreground">{p.members.length} joined</span>
              </div>
              <Button
                size="sm"
                variant={hasJoined ? "secondary" : "default"}
                className="rounded-full px-5 h-8 text-xs font-semibold"
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
  );
}

function PlacesTab({ filter, setFilter, places: filteredPlaces }: { filter: PlaceFilter; setFilter: (f: PlaceFilter) => void; places: typeof places }) {
  const filters: PlaceFilter[] = ["All", "Bars", "Food", "Hostels"];
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${f === filter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filteredPlaces.map(p => (
          <div key={p.name} className="bg-card rounded-xl p-4 flex gap-4 items-start">
            <div className="text-3xl">{p.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                <Badge variant="outline" className="shrink-0 text-xs border-border text-muted-foreground">{p.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{p.desc}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.distance}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
