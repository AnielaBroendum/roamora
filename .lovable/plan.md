

# Add Interactive Plans Feature

Since there's no backend connected yet, this will use local state (React state) for creating and joining plans. The existing mock plans will be replaced with a dynamic system.

## Changes

### `src/pages/Index.tsx`

1. **Add state for plans** — Replace the static `plans` array with `useState` initialized with the same mock data. Add a `joinedPlans` state (Set of plan IDs) to track which plans the user has joined.

2. **Create Plan dialog** — Add a "Create Plan" button at the top of the Plans tab. Clicking it opens a Dialog/Sheet with a form containing:
   - Title (text input)
   - Description (textarea)
   - Time (text input, e.g. "Tonight, 9 PM")
   - A "Create" button that adds the new plan to state

3. **Update PlansTab** — Accept plans state + setter as props. Each plan card now shows:
   - Title, organizer, time, description (new field)
   - Number of people joined (dynamic)
   - "Join" button that increments the joined count and toggles to "Joined" (disabled state)

4. **Update plan data model** — Add `id` and `description` fields to plans. Generate IDs for new plans.

### UI Components Used
- `Dialog` / `DialogContent` for the create plan form
- Existing `Input`, `Textarea`, `Button` components
- Everything stays within the single `Index.tsx` page, matching current architecture

No new files needed. No backend required — state resets on refresh. Ready to persist to Supabase later.

