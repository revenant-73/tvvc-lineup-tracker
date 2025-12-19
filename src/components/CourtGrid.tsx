import type { CourtState, PositionKey, Player } from '../types';
import { CourtCell } from './CourtCell';
import './CourtGrid.css';

interface CourtGridProps {
  positions: CourtState;
  playerMap: Record<string, Player>;
}

export function CourtGrid({ positions, playerMap }: CourtGridProps) {
  return (
    <div className="court-grid">
      <div className="court-section">
        <div className="row-label">Front Row</div>
        <div className="court-row front-row">
          {[4, 3, 2].map((pos) => (
            <CourtCell
              key={pos}
              position={pos as PositionKey}
              player={positions[pos as PositionKey] ? playerMap[positions[pos as PositionKey]!] : null}
            />
          ))}
        </div>
      </div>

      <div className="net"></div>

      <div className="court-section">
        <div className="row-label">Back Row</div>
        <div className="court-row back-row">
          {[5, 6, 1].map((pos) => (
            <CourtCell
              key={pos}
              position={pos as PositionKey}
              player={positions[pos as PositionKey] ? playerMap[positions[pos as PositionKey]!] : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
