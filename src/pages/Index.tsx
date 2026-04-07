import { useState } from "react";
import { Calendar, Users, MapPin, Clock, ChevronDown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Tab = "tonight" | "plans" | "places";
type PlaceFilter = "All" | "Bars" | "Food" | "Hostels";

const events = [
  { name: "Pub Crawl Poblado", time: "8:00 PM", venue: "Meeting at Parque Lleras", tag: "Pub Crawl", emoji: "🍻" },
  { name: "Reggaeton Night", time: "10:00 PM", venue: "Club Babylon", tag: "Party", emoji: "🎶" },
  { name: "Live Jazz at Calle 10", time: "7:30 PM", venue: "El Jazz Bar", tag: "Live Music", emoji: "🎷" },
  { name: "Rooftop Sunset Session", time: "5:00 PM", venue: "Sky Lounge Laureles", tag: "Social", emoji: "🌅" },
  { name: "Latin Dance Party", time: "9:00 PM", venue: "Salsa Club Centro", tag: "Party", emoji: "💃" },
];

const plans = [
  { organizer: "Alex", title: "Rooftop drinks in Poblado", time: "Tonight, 7 PM", joined: 4, avatar: "A" },
  { organizer: "Mia", title: "Salsa night crew", time: "Tonight, 9 PM", joined: 7, avatar: "M" },
  { organizer: "João", title: "Street food tour Laureles", time: "Tomorrow, 6 PM", joined: 3, avatar: "J" },
  { organizer: "Sophie", title: "Sunrise hike to Piedra del Peñol", time: "Saturday, 5 AM", joined: 5, avatar: "S" },
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

  const filteredPlaces = placeFilter === "All" ? places : places.filter(p => p.category === placeFilter);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      {/* Header */}
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

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {tab === "tonight" && <TonightTab />}
        {tab === "plans" && <PlansTab />}
        {tab === "places" && <PlacesTab filter={placeFilter} setFilter={setPlaceFilter} places={filteredPlaces} />}
      </main>

      {/* Bottom Nav */}
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

function PlansTab() {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">Join other travelers or start your own plan ✌️</p>
      {plans.map(p => (
        <div key={p.title} className="bg-card rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">{p.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.organizer} · {p.time}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{p.joined} joined</span>
            <Button size="sm" className="rounded-full px-5 h-8 text-xs font-semibold">Join</Button>
          </div>
        </div>
      ))}
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
