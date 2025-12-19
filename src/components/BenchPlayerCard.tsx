import { useDraggable } from '@dnd-kit/core';
import type { Player } from '../types';
import './BenchPlayerCard.css';

interface BenchPlayerCardProps {
  player: Player;
}

export function BenchPlayerCard({ player }: BenchPlayerCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { type: 'player', origin: 'bench' },
  });

  return (
    <div
      ref={setNodeRef}
      className={`bench-player-card ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className="bench-player-number">{player.number}</div>
      <div className="bench-player-name">{player.name}</div>
    </div>
  );
}
