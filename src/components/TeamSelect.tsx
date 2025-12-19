import type { Team } from '../types';
import './TeamSelect.css';

interface TeamSelectProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
}

export function TeamSelect({
  teams,
  selectedTeamId,
  onSelectTeam,
}: TeamSelectProps) {
  return (
    <div className="team-select-section">
      <label htmlFor="team-select" className="team-label">
        Select Team:
      </label>
      <select
        id="team-select"
        className="team-select"
        value={selectedTeamId || ''}
        onChange={(e) => onSelectTeam(e.target.value)}
      >
        <option value="">-- Choose a Team --</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
}
