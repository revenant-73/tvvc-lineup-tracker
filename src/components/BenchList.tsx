import type { Player } from '../types';
import { BenchPlayerCard } from './BenchPlayerCard';
import './BenchList.css';

interface BenchListProps {
  benchPlayers: Player[];
}

export function BenchList({ benchPlayers }: BenchListProps) {
  return (
    <div className="bench-section">
      <div className="bench-header">
        <h3>Bench ({benchPlayers.length} players)</h3>
      </div>
      <div className="bench-list">
        {benchPlayers.length === 0 ? (
          <div className="empty-bench">All players on court!</div>
        ) : (
          benchPlayers.map((player) => (
            <BenchPlayerCard key={player.id} player={player} />
          ))
        )}
      </div>
    </div>
  );
}
