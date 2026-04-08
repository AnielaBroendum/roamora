import type { Plan, EventItem, PlaceItem } from "./types";

export const memberColors = [
  "bg-primary/20 text-primary",
  "bg-destructive/20 text-destructive",
  "bg-accent/10 text-accent",
  "bg-secondary text-secondary-foreground",
  "bg-primary/30 text-primary",
];

export const events: EventItem[] = [
  { id: "e1", name: "Pub Crawl Poblado", desc: "Hit 5 bars with fellow backpackers — shots included!", time: "8:00 PM", venue: "Envy Rooftop", venueId: "p1", tag: "Pub Crawl", emoji: "🍻", going: 34, label: "🔥 Popular tonight", featured: true, recentJoiners: ["Alex", "Mia", "Carlos"] },
  { id: "e2", name: "Reggaeton Night", desc: "The biggest reggaeton party in Medellín. Dress to impress.", time: "10:00 PM", venue: "Salon Amador", venueId: "p3", tag: "Party", emoji: "🎶", going: 52, label: "Filling up fast", featured: true, recentJoiners: ["Tom", "Lena"] },
  { id: "e3", name: "Live Jazz at Calle 10", desc: "Intimate jazz session with local musicians & craft cocktails.", time: "7:30 PM", venue: "La Octava Bar", venueId: "p2", tag: "Live Music", emoji: "🎷", going: 8, recentJoiners: ["Nina"] },
  { id: "e4", name: "Rooftop Sunset Session", desc: "Golden hour drinks with panoramic city views.", time: "5:00 PM", venue: "Envy Rooftop", venueId: "p1", tag: "Social", emoji: "🌅", going: 15, label: "Starts in 20 min", recentJoiners: ["Sophie", "Max"] },
  { id: "e5", name: "Latin Dance Party", desc: "Salsa, bachata & merengue — beginners welcome!", time: "9:00 PM", venue: "Salsa Club Centro", tag: "Party", emoji: "💃", going: 22, label: "Trending now", recentJoiners: ["João", "Emma", "Ava"] },
];

export const initialPlans: Plan[] = [
  { id: "1", organizer: "Alex", title: "Rooftop drinks in Poblado", description: "Chill vibes at Envy Rooftop, first round on me!", time: "Tonight, 7 PM", avatar: "A", tag: "party", distance: "0.8 km", venueId: "p1", label: "🔥 Popular tonight", members: [
    { name: "Alex", avatar: "A", color: memberColors[0] },
    { name: "Lena", avatar: "L", color: memberColors[1] },
    { name: "Carlos", avatar: "C", color: memberColors[2] },
    { name: "Yuki", avatar: "Y", color: memberColors[3] },
  ]},
  { id: "2", organizer: "Mia", title: "Salsa night crew", description: "Beginners welcome! We'll hit Salsa Club Centro.", time: "Tonight, 9 PM", avatar: "M", tag: "party", distance: "1.2 km", eventId: "e5", label: "Filling up fast", members: [
    { name: "Mia", avatar: "M", color: memberColors[1] },
    { name: "Tom", avatar: "T", color: memberColors[0] },
    { name: "Nina", avatar: "N", color: memberColors[4] },
    { name: "Raj", avatar: "R", color: memberColors[2] },
    { name: "Ava", avatar: "A", color: memberColors[3] },
    { name: "Leo", avatar: "L", color: memberColors[0] },
    { name: "Zoe", avatar: "Z", color: memberColors[1] },
  ]},
  { id: "3", organizer: "João", title: "Street food tour Laureles", description: "Exploring the best local eats in the neighborhood.", time: "Tomorrow, 6 PM", avatar: "J", tag: "food", distance: "2.1 km", members: [
    { name: "João", avatar: "J", color: memberColors[2] },
    { name: "Emma", avatar: "E", color: memberColors[0] },
    { name: "Dan", avatar: "D", color: memberColors[4] },
  ]},
  { id: "4", organizer: "Sophie", title: "Sunrise hike to Piedra del Peñol", description: "Early start but worth it! Transport included.", time: "Saturday, 5 AM", avatar: "S", tag: "adventure", distance: "58 km", members: [
    { name: "Sophie", avatar: "S", color: memberColors[3] },
    { name: "Max", avatar: "M", color: memberColors[0] },
    { name: "Isla", avatar: "I", color: memberColors[1] },
    { name: "Finn", avatar: "F", color: memberColors[2] },
    { name: "Chloe", avatar: "C", color: memberColors[4] },
  ]},
];

export const places: PlaceItem[] = [
  { id: "p1", name: "Envy Rooftop", category: "Bars", desc: "Stunning views & cocktails in Poblado", tag: "party", emoji: "🍸", going: 18, linkedEventIds: ["e1", "e4"] },
  { id: "p2", name: "La Octava Bar", category: "Bars", desc: "Craft beer & live music nightly", tag: "chill", emoji: "🍺", going: 9, linkedEventIds: ["e3"] },
  { id: "p3", name: "Salon Amador", category: "Bars", desc: "Underground cocktail bar with DJ sets", tag: "party", emoji: "🎵", going: 24, linkedEventIds: ["e2"] },
  { id: "p4", name: "Mondongo's", category: "Cheap eats", desc: "Traditional bandeja paisa & local flavors", tag: "cheap", emoji: "🍲", going: 6 },
  { id: "p5", name: "El Corral Gourmet", category: "Cheap eats", desc: "Best street burgers in Laureles", tag: "cheap", emoji: "🍔", going: 11 },
  { id: "p6", name: "Arepa Lady", category: "Cheap eats", desc: "Stuffed arepas for under $2", tag: "cheap", emoji: "🫓", going: 14 },
  { id: "p7", name: "Los Patios Hostel", category: "Hostels", desc: "Social hostel with pool & events", tag: "party", emoji: "🏠", going: 32 },
  { id: "p8", name: "Happy Buddha Hostel", category: "Hostels", desc: "Chill vibes in Laureles neighborhood", tag: "chill", emoji: "🧘", going: 15 },
  { id: "p9", name: "Viajero Hostel", category: "Hostels", desc: "Rooftop bar & city tours included", tag: "party", emoji: "🎒", going: 21 },
];

export const datePills = ["Today", "Fri", "Sat", "Sun", "Mon"];
