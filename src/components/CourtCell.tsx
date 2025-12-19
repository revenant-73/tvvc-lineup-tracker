import type { Player, PositionKey } from '../types';
import { isFrontRow } from '../utils/rotation';
import './CourtCell.css';

interface CourtCellProps {
  position: PositionKey;
  player: Player | null;
  isSelected?: boolean;
  onSelect?: (position: PositionKey) => void;
}

export function CourtCell({ position, player, isSelected, onSelect }: CourtCellProps) {
  const front = isFrontRow(position);

  return (
    <div
      className={`court-cell ${front ? 'front-row' : 'back-row'} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(position)}
    >
      <div className="position-label">Pos {position}</div>
      {position === 1 && <div className="serving-indicator">🏐</div>}
      {player ? (
        <div className="player-info">
          <div className="player-number">{player.number}</div>
          <div className="player-name">{player.name}</div>
        </div>
      ) : (
        <div className="empty-cell">Empty</div>
      )}
    </div>
  );
}
