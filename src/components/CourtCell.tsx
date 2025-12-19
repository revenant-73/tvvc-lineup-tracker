import { useDroppable } from '@dnd-kit/core';
import type { Player, PositionKey } from '../types';
import { isFrontRow } from '../utils/rotation';
import './CourtCell.css';

interface CourtCellProps {
  position: PositionKey;
  player: Player | null;
}

export function CourtCell({ position, player }: CourtCellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `court-${position}`,
    data: { position, type: 'court' },
  });

  const front = isFrontRow(position);

  return (
    <div
      ref={setNodeRef}
      className={`court-cell ${front ? 'front-row' : 'back-row'} ${isOver ? 'over' : ''}`}
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
