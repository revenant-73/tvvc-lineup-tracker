import './ScoreBar.css';

interface ScoreBarProps {
  usScore: number;
  oppScore: number;
  onUSScoreInc: () => void;
  onOppScoreInc: () => void;
  onUSScoreDec: () => void;
  onOppScoreDec: () => void;
}

export function ScoreBar({
  usScore,
  oppScore,
  onUSScoreInc,
  onOppScoreInc,
  onUSScoreDec,
  onOppScoreDec,
}: ScoreBarProps) {
  return (
    <div className="score-bar">
      <div className="score-section tvvc">
        <div className="score-label">TVVC</div>
        <div className="score-display">{usScore}</div>
        <div className="score-buttons">
          <button
            className="score-btn decrement"
            onClick={onUSScoreDec}
            title="Decrease TVVC score"
          >
            -
          </button>
          <button
            className="score-btn increment"
            onClick={onUSScoreInc}
            title="Increase TVVC score"
          >
            +
          </button>
        </div>
      </div>

      <div className="score-divider"></div>

      <div className="score-section opponent">
        <div className="score-label">Opponent</div>
        <div className="score-display">{oppScore}</div>
        <div className="score-buttons">
          <button
            className="score-btn decrement"
            onClick={onOppScoreDec}
            title="Decrease Opponent score"
          >
            -
          </button>
          <button
            className="score-btn increment"
            onClick={onOppScoreInc}
            title="Increase Opponent score"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
