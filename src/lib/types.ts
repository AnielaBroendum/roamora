export type Tab = "tonight" | "plans" | "places";
export type PlaceFilter = "All" | "Bars" | "Cheap eats" | "Hostels";

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
}
