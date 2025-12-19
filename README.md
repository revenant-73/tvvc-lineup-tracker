# TVVC Lineup Tracker

A mobile-first web application for TVVC volleyball coaches to track lineups, serving order, and substitutions during matches.

## Features

- **Team Selection**: Choose from 10 pre-loaded TVVC teams
- **Drag & Drop Lineup Management**: Drag players from the bench onto the court to make substitutions
- **Court Visualization**: 3×2 volleyball court grid showing:
  - Front row (positions 4, 3, 2)
  - Back row (positions 5, 6, 1 with serving indicator)
- **Score Tracking**: Easy-to-use score buttons for TVVC and opponent
- **Rotation**: Click Rotate to rotate your team clockwise
- **Undo**: Revert the last action
- **Auto-Save**: Match state is automatically saved to your browser's localStorage per team

## Technology Stack

- React 18
- TypeScript
- Vite
- dnd-kit (drag and drop)
- CSS3 (mobile-first responsive design)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Select a Team**: Choose your team from the dropdown
2. **Set Your Lineup**: The first 6 players from the roster are automatically placed on the court
3. **Make Substitutions**: Drag a bench player onto a court position to substitute
4. **Track Score**: Use the + and - buttons to update scores
5. **Rotate**: Click the Rotate button when your team rotates (clockwise)
6. **Undo**: Click Undo to revert the last action
7. **Reset**: Click Reset to start a new match with the same team

All changes are automatically saved to your browser and will be restored when you reload the page.

## Deployment

This project is configured for deployment to GitHub Pages.

### Steps

1. Create a GitHub repository: `tvvc-lineup-tracker`
2. Push your code to the `main` branch
3. GitHub Actions will automatically build and deploy to GitHub Pages

The app will be available at: `https://<your-username>.github.io/tvvc-lineup-tracker/`

## Data Storage

- **Rosters**: Stored in `src/data/teams.ts` (update here to change team rosters)
- **Match State**: Stored in browser's localStorage per team, persists across sessions

## Customization

### Adding or Modifying Teams

Edit `src/data/teams.ts` to add, remove, or modify teams and their rosters.

### Styling

All components include individual CSS files with a mobile-first approach. Modify these to customize colors, fonts, and layouts.

## Browser Support

Works on all modern browsers that support:
- ES2020
- localStorage
- CSS Grid
- Flexbox

## Notes for Coaches

- The app is designed for use in noisy gym environments
- Large touch targets for fat-finger accuracy
- Minimal typing required
- State persists even if the page is refreshed or closed
- No internet connection required after initial load

## Future Enhancements

- Match event log
- Export/import match data
- Opponent name and date fields
- Player statistics tracking
- Rotation patterns
- Match templates

## License

ISC
