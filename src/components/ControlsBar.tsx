import './ControlsBar.css';

interface ControlsBarProps {
  onRotate: () => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export function ControlsBar({
  onRotate,
  onUndo,
  onReset,
  canUndo,
}: ControlsBarProps) {
  return (
    <div className="controls-bar">
      <button
        className="control-btn rotate-btn"
        onClick={onRotate}
        title="Rotate team clockwise"
      >
        ↻ Rotate
      </button>
      <button
        className="control-btn undo-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last action"
      >
        ↶ Undo
      </button>
      <button
        className="control-btn reset-btn"
        onClick={onReset}
        title="Reset match"
      >
        ↻ Reset
      </button>
    </div>
  );
}
