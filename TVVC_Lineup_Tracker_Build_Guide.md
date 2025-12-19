# TVVC Mobile-First Lineup Tracker (GitHub Pages) — Build Guide

This document is a **build-ready blueprint** for a modern, mobile-first web app that lets TVVC coaches:
- Pick their team (10 teams) from a dropdown (rosters baked into code)
- Drag/drop players into a **3×2 court grid** to set a starting lineup
- Drag a bench player onto the grid to **sub**
- Track a **running score** with two tap buttons
- Tap **Rotate** to rotate the team clockwise
- Always see **who is serving** (Position 1) and who is **front row / back row**
- Persist state per-team using `localStorage`

---

## 1) Tech Stack (Simple + GitHub Pages Friendly)

- **React** + **Vite** (fast dev + static build)
- **TypeScript** (recommended for fewer bugs)
- **dnd-kit** (mobile-friendly drag & drop)
- **localStorage** for persistence (no backend required)
- Hosted on **GitHub Pages**

---

## 2) User Flow (Exactly As Requested)

### A) Team Select
- Dropdown lists all 10 TVVC teams (data lives in code).
- Selecting a team loads:
  - Team roster (from `src/data/teams.ts`)
  - Last saved match state (from `localStorage`) if available
  - Otherwise: empty lineup + full bench

### B) Lineup + Match Screen (Single “Game Day” Screen)
- **Top bar:** Score controls
  - `TVVC +1`
  - `Opponent +1`
  - Optional: `Undo` (highly recommended)
- **Court:** 3×2 grid
  - Top row = **Front row** (Positions **4, 3, 2**)
  - Bottom row = **Back row** (Positions **5, 6, 1**)
  - **Serving indicator** appears on Position **1**
- **Bench:** Scrollable list of remaining roster players
  - Drag a bench player to any court cell = substitution
- **Rotate button:** Tap when your team rotates
  - Rotation always updates the server indicator and front/back row.

---

## 3) Court Grid Mapping (3×2 Layout)

Use standard indoor volleyball positional numbers:

**Front row (top):**
- Left = **4**
- Middle = **3**
- Right = **2**

**Back row (bottom):**
- Left = **5**
- Middle = **6**
- Right = **1** *(server)*

Visually label cells with a small corner label (`4/3/2/5/6/1`) so coaches never wonder.

---

## 4) Rotation Logic (Clockwise)

On **Rotate** button click, perform this clockwise mapping:

- 1 → 6  
- 6 → 5  
- 5 → 4  
- 4 → 3  
- 3 → 2  
- 2 → 1  

In code, with positions keyed as `{1,2,3,4,5,6}`:

```ts
const rotated = {
  1: positions[2],
  2: positions[3],
  3: positions[4],
  4: positions[5],
  5: positions[6],
  6: positions[1],
};
```

### Serving Indicator
- The **player in Position 1** is the server.
- Display an icon (🏐 or ⚡) on the Position 1 cell.
- No extra “server selection” needed.

---

## 5) Substitution Logic (Drag = Truth)

### Behavior
- Drag a player from **Bench** onto a **Court cell**.
- The player currently in that cell is replaced:
  - **New player goes onto the court cell**
  - **Old player returns to bench**

### Rules to enforce
- A player can appear **only once** (either on court OR on bench).
- Dropping a player onto the same cell they are already in does nothing.
- Bench order can be preserved or auto-sorted (your choice).

### Suggested Implementation
When a bench player `inId` is dropped on position `pos`:
1. `outId = positions[pos]`
2. `positions[pos] = inId`
3. Remove `inId` from bench
4. If `outId` exists, add `outId` to bench

---

## 6) Data Model (Minimal + Future-Proof)

### Player
```ts
type Player = {
  id: string;
  number: string;
  name: string;
  tags?: string[]; // optional: ["S", "OH", "MB", "OPP", "L"]
};
```

### Team
```ts
type Team = {
  id: string;
  name: string;
  roster: Player[];
};
```

### Court Positions
Use positional numbering:
```ts
type PositionKey = 1 | 2 | 3 | 4 | 5 | 6;

type CourtState = Record<PositionKey, string | null>; 
// maps position -> playerId or null
```

### Match State (Stored in localStorage)
```ts
type MatchState = {
  teamId: string;
  usScore: number;
  oppScore: number;
  positions: CourtState;
  bench: string[]; // playerIds
  updatedAt: number; // Date.now()
  history?: MatchEvent[]; // optional, for later
};
```

---

## 7) Roster Data “Baked Into Code”

Create:
- `src/data/teams.ts`

Example:
```ts
import type { Team } from "../types";

export const TEAMS: Team[] = [
  {
    id: "u12-1",
    name: "12U Teal",
    roster: [
      { id: "p12t01", number: "1", name: "Player One" },
      { id: "p12t02", number: "2", name: "Player Two" },
      // ...
    ],
  },
  // ... 9 more teams
];
```

### Why this approach works
- Coaches don’t enter rosters
- No login, no backend
- Updates are just a new app deploy when rosters change

---

## 8) Persistence Strategy (Per Team)

Key localStorage by team id:

- `tvvc_lineup_state__<TEAM_ID>`

Example:
```ts
const storageKey = (teamId: string) => `tvvc_lineup_state__${teamId}`;
```

On any change (score, rotate, sub):
- Save state immediately

On team select:
- Load saved state if present, else initialize from roster

---

## 9) Component Structure (Clean + Simple)

### Screens
- **GameDayScreen** (primary)
  - TeamSelect
  - ScoreBar
  - CourtGrid
  - BenchList
  - Controls (Rotate, Undo)

### Recommended file tree
```
tvvc-lineup-tracker/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  README.md
  src/
    main.tsx
    App.tsx
    styles.css
    data/
      teams.ts
    types/
      index.ts
    utils/
      rotation.ts
      storage.ts
      lineup.ts
    components/
      TeamSelect.tsx
      ScoreBar.tsx
      CourtGrid.tsx
      CourtCell.tsx
      BenchList.tsx
      BenchPlayerCard.tsx
      ControlsBar.tsx
      UndoButton.tsx
```

---

## 10) Drag & Drop (dnd-kit plan)

Use droppable zones:
- Court cells (droppable id: `court-<pos>`)
- Bench list (droppable id: `bench`) *(optional, if you support dragging court → bench)*

### Draggable item types
- Player cards (id = playerId)
- Track origin: `"bench"` or `"court:<pos>"`

On drop:
- If dropped onto court cell: apply substitution logic
- If dropped onto bench: (optional) remove from court

---

## 11) UI Details (Mobile-First)

### Court cells
Each cell shows:
- Player number + name (big)
- Small corner: `Pos 4/3/2/5/6/1`
- If `pos === 1`, show **🏐 Serving**
- Row implies:
  - top row = **Front**
  - bottom row = **Back**

### Bench
- Horizontal scroll strip
- Player chips/cards large enough for thumbs
- Show number prominently

### Controls
- “Rotate” as a big, primary button
- “Undo” as a secondary button (but visible)
- Score buttons should be big and separated to avoid fat-finger mistakes

---

## 12) Undo (Recommended)

Keep a short stack:
- `pastStates: MatchState[]`
- On each action (score/sub/rotate), push current state before changing
- Undo pops and restores

Cap it (e.g., last 25 actions).

---

## 13) GitHub Pages Deployment (Vite)

### A) Create repo
- `tvvc-lineup-tracker`

### B) Vite config for GitHub Pages
Set base path to repo name:
```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/tvvc-lineup-tracker/",
});
```

### C) Build
```bash
npm install
npm run build
```

### D) Deploy to GitHub Pages
Two options:

#### Option 1: gh-pages branch (simple)
- Use `gh-pages` package, publish `dist/`

#### Option 2: GitHub Actions (recommended)
- Build on push to `main`
- Deploy `dist/` to Pages automatically

---

## 14) “Definition of Done” Checklist (MVP)

- [ ] Team dropdown loads roster from code
- [ ] Bench shows full roster initially
- [ ] Drag from bench to court fills 6 spots
- [ ] Sub: bench player dropped onto court swaps correctly
- [ ] Rotate button rotates positions clockwise
- [ ] Position 1 always shows server indicator
- [ ] Score buttons increment correct side
- [ ] Everything auto-saves per team in localStorage
- [ ] Reload page restores last state for selected team

---

## 15) Optional Next Upgrades (Still No Backend)

- Match reset button (“New Match”)
- Opponent name + date field
- Simple event log (rotate/sub/score)
- Export/import JSON (share between coaches or devices)

---

## 16) Notes for Coaches (In-App Microcopy)

- “Drag players from bench onto the court.”
- “Drag a bench player onto a position to substitute.”
- “Tap Rotate when your team rotates.”
- “Server is always Position 1.”

---

## 17) Key Design Choice (Why this stays usable)

This app is designed for **real gym conditions**:
- loud
- chaotic
- one-handed use
- mistakes happen

So:
- big tap targets
- minimal typing
- persistent state
- undo

---

If you want, the next step is for me to generate:
- **starter code scaffolding** (Vite + React + dnd-kit + the state model)
- a `teams.ts` template you can paste rosters into
- GitHub Actions deploy YAML

All still GitHub Pages compatible and beginner-friendly.
