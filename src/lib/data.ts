import type { Plan } from "./types";

export const memberColors = [
  "bg-primary/20 text-primary",
  "bg-destructive/20 text-destructive",
  "bg-accent text-accent-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-primary/30 text-primary",
];

export const events = [
  { id: "e1", name: "Pub Crawl Poblado", desc: "Hit 5 bars with fellow backpackers — shots included!", time: "8:00 PM", venue: "Meeting at Parque Lleras", tag: "Pub Crawl", emoji: "🍻", going: 12 },
  { id: "e2", name: "Reggaeton Night", desc: "The biggest reggaeton party in Medellín. Dress to impress.", time: "10:00 PM", venue: "Club Babylon", tag: "Party", emoji: "🎶", going: 28 },
  { id: "e3", name: "Live Jazz at Calle 10", desc: "Intimate jazz session with local musicians & craft cocktails.", time: "7:30 PM", venue: "El Jazz Bar", tag: "Live Music", emoji: "🎷", going: 8 },
  { id: "e4", name: "Rooftop Sunset Session", desc: "Golden hour drinks with panoramic city views.", time: "5:00 PM", venue: "Sky Lounge Laureles", tag: "Social", emoji: "🌅", going: 15 },
  { id: "e5", name: "Latin Dance Party", desc: "Salsa, bachata & merengue — beginners welcome!", time: "9:00 PM", venue: "Salsa Club Centro", tag: "Party", emoji: "💃", going: 22 },
];

export const initialPlans: Plan[] = [
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

export const places = [
  { name: "Envy Rooftop", category: "Bars" as const, desc: "Stunning views & cocktails in Poblado", tag: "party", emoji: "🍸", going: 18 },
  { name: "La Octava Bar", category: "Bars" as const, desc: "Craft beer & live music nightly", tag: "chill", emoji: "🍺", going: 9 },
  { name: "Salon Amador", category: "Bars" as const, desc: "Underground cocktail bar with DJ sets", tag: "party", emoji: "🎵", going: 24 },
  { name: "Mondongo's", category: "Cheap eats" as const, desc: "Traditional bandeja paisa & local flavors", tag: "cheap", emoji: "🍲", going: 6 },
  { name: "El Corral Gourmet", category: "Cheap eats" as const, desc: "Best street burgers in Laureles", tag: "cheap", emoji: "🍔", going: 11 },
  { name: "Arepa Lady", category: "Cheap eats" as const, desc: "Stuffed arepas for under $2", tag: "cheap", emoji: "🫓", going: 14 },
  { name: "Los Patios Hostel", category: "Hostels" as const, desc: "Social hostel with pool & events", tag: "party", emoji: "🏠", going: 32 },
  { name: "Happy Buddha Hostel", category: "Hostels" as const, desc: "Chill vibes in Laureles neighborhood", tag: "chill", emoji: "🧘", going: 15 },
  { name: "Viajero Hostel", category: "Hostels" as const, desc: "Rooftop bar & city tours included", tag: "party", emoji: "🎒", going: 21 },
];

export const datePills = ["Today", "Fri", "Sat", "Sun", "Mon"];
