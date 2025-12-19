import type { Player, PositionKey } from '../types';
import './ConfirmSubModal.css';

interface ConfirmSubModalProps {
  selectedPlayer: Player | null;
  selectedPosition: PositionKey | null;
  currentPlayerInPosition: Player | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSubModal({
  selectedPlayer,
  selectedPosition,
  currentPlayerInPosition,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmSubModalProps) {
  if (!isOpen || !selectedPlayer || !selectedPosition) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Substitution</h2>

        <div className="sub-details">
          <div className="player-coming-in">
            <div className="label">Coming In (Bench)</div>
            <div className="player-display">
              <div className="player-number">{selectedPlayer.number}</div>
              <div className="player-name">{selectedPlayer.name}</div>
            </div>
          </div>

          <div className="arrow">→</div>

          <div className="position-going-to">
            <div className="label">Position {selectedPosition}</div>
            {currentPlayerInPosition ? (
              <div className="player-display">
                <div className="player-number">{currentPlayerInPosition.number}</div>
                <div className="player-name">{currentPlayerInPosition.name}</div>
                <div className="going-to-bench">(to bench)</div>
              </div>
            ) : (
              <div className="empty">Empty</div>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
