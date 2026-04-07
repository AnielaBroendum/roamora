
# Roamora — Backpacker Discovery App for Medellín

## Overview
A mobile-first web app helping backpackers discover events, join plans, and find places in Medellín. This phase focuses on layout, structure, and sample content — no backend yet.

## Design Direction
- Dark-ish warm theme with accent color (coral/orange) for energy and nightlife vibes
- Card-based UI, large touch targets, bottom tab navigation
- Rounded corners, subtle shadows, modern social app feel (think Instagram meets Eventbrite)
- Mobile-first (max-width container centered on desktop)

## Pages & Components

### Header
- "Roamora" logo/wordmark
- City selector showing "Medellín" (static for now)
- Small avatar/profile icon placeholder

### Bottom Tab Bar
- Three tabs: **Tonight** (calendar icon), **Plans** (users icon), **Places** (map-pin icon)
- Sticky at bottom, highlighted active tab

### Tab 1: Tonight (Events)
- Horizontal date pills (Today highlighted)
- Vertical list of event cards with: image placeholder, event name, time, venue, category tag (e.g. "Live Music", "Party", "Pub Crawl")
- ~4-5 sample events with mock data

### Tab 2: Plans (Traveler Activities)
- Cards showing: organizer avatar + name, activity title, time, number of people joined, "Join" button
- Examples: "Rooftop drinks in Poblado", "Salsa night crew", "Street food tour"
- ~4 sample plans

### Tab 3: Places
- Filter chips: All, Bars, Food, Hostels
- Place cards with: image placeholder, name, category badge, short description, distance placeholder
- ~5 sample places

All content is hardcoded mock data. No routing between pages — tabs switch content inline via state.
