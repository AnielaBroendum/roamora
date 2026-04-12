export type Tab = "tonight" | "plans" | "activity";
export type PlaceFilter = "All" | "Bars" | "Cheap eats" | "Hostels";
export type PlanTag = "party" | "chill" | "food" | "adventure";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface ChatThread {
  id: string;
  type: "plan" | "event";
  name: string;
  emoji?: string;
  lastMessage: string;
  lastMessageTime: string;
  participants: number;
  unread: number;
  messages: ChatMessage[];
}

export interface PlanMember {
  name: string;
  avatar: string;
  color: string;
}

export interface Plan {
  id: string;
  organizer: string;
  title: string;
  description: string;
  time: string;
  members: PlanMember[];
  avatar: string;
  tag?: PlanTag;
  distance?: string;
  venueId?: string;
  eventId?: string;
  label?: string;
}

export interface EventItem {
  id: string;
  name: string;
  desc: string;
  time: string;
  venue: string;
  venueId?: string;
  tag: string;
  emoji: string;
  going: number;
  label?: string;
  featured?: boolean;
  recentJoiners?: string[];
  image?: string;
  address?: string;
  lat?: number;
  lng?: number;
  hosts?: string[];
}

export interface PlaceItem {
  id: string;
  name: string;
  category: "Bars" | "Cheap eats" | "Hostels";
  desc: string;
  tag: string;
  emoji: string;
  going: number;
  linkedEventIds?: string[];
}
