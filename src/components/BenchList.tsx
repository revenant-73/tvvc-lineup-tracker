import type { Player } from '../types';
import { BenchPlayerCard } from './BenchPlayerCard';
import './BenchList.css';

interface BenchListProps {
  benchPlayers: Player[];
  selectedPlayer?: Player | null;
  onPlayerSelect?: (player: Player) => void;
}

export function BenchList({ benchPlayers, selectedPlayer, onPlayerSelect }: BenchListProps) {
  return (
    <div className="bench-section">
      <div className="bench-header">
        <h3>Bench ({benchPlayers.length} players)</h3>
        {selectedPlayer && <span className="selected-info">Selected: {selectedPlayer.name}</span>}
      </div>
      <div className="bench-list">
        {benchPlayers.length === 0 ? (
          <div className="empty-bench">All players on court!</div>
        ) : (
          benchPlayers.map((player) => (
            <BenchPlayerCard
              key={player.id}
              player={player}
              isSelected={selectedPlayer?.id === player.id}
              onSelect={onPlayerSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
