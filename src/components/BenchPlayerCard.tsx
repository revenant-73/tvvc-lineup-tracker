import type { Player } from '../types';
import './BenchPlayerCard.css';

interface BenchPlayerCardProps {
  player: Player;
  isSelected?: boolean;
  onSelect?: (player: Player) => void;
}

export function BenchPlayerCard({ player, isSelected, onSelect }: BenchPlayerCardProps) {
  return (
    <div
      className={`bench-player-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect?.(player)}
    >
      <div className="bench-player-number">{player.number}</div>
      <div className="bench-player-name">{player.name}</div>
    </div>
  );
}
