import { useState, useEffect, useCallback } from 'react';
import type { Team, Player, MatchState, PositionKey } from '../types';
import { TEAMS } from '../data/teams';
import { rotatePositions } from '../utils/rotation';
import { performSubstitution, initializeCourtFromRoster, getRemainingBench } from '../utils/lineup';
import { saveMatchState, loadMatchState, clearMatchState } from '../utils/storage';
import { TeamSelect } from './TeamSelect';
import { ScoreBar } from './ScoreBar';
import { CourtGrid } from './CourtGrid';
import { BenchList } from './BenchList';
import { ControlsBar } from './ControlsBar';
import { ConfirmSubModal } from './ConfirmSubModal';
import './GameDayScreen.css';

export function GameDayScreen() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [history, setHistory] = useState<MatchState[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionKey | null>(null);

  const playerMap = currentTeam
    ? currentTeam.roster.reduce(
        (acc, player) => ({ ...acc, [player.id]: player }),
        {} as Record<string, Player>
      )
    : {};

  const handleTeamSelect = useCallback(
    (teamId: string) => {
      const team = TEAMS.find((t) => t.id === teamId);
      if (!team) return;

      setSelectedTeamId(teamId);
      setCurrentTeam(team);

      const saved = loadMatchState(teamId);
      if (saved) {
        setMatchState(saved);
        setHistory([]);
      } else {
        const rosterIds = team.roster.map((p) => p.id);
        const initialPositions = initializeCourtFromRoster(rosterIds);
        const benchPlayers = getRemainingBench(rosterIds, initialPositions);

        const newState: MatchState = {
          teamId,
          usScore: 0,
          oppScore: 0,
          positions: initialPositions,
          bench: benchPlayers,
          updatedAt: Date.now(),
        };

        setMatchState(newState);
        setHistory([]);
      }
    },
    []
  );

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handlePositionSelect = (position: PositionKey) => {
    setSelectedPosition(position);
  };

  const handleConfirmSubstitution = () => {
    if (!selectedPlayer || !selectedPosition || !matchState) return;

    const newState = { ...matchState };
    const { positions, bench } = performSubstitution(
      newState.positions,
      newState.bench,
      selectedPlayer.id,
      selectedPosition
    );

    const updatedState: MatchState = {
      ...newState,
      positions,
      bench,
      updatedAt: Date.now(),
    };

    setHistory([...history, matchState]);
    setMatchState(updatedState);
    setSelectedPlayer(null);
    setSelectedPosition(null);
  };

  const handleCancelSubstitution = () => {
    setSelectedPlayer(null);
    setSelectedPosition(null);
  };

  const handleRotate = () => {
    if (!matchState) return;

    const newState = { ...matchState };
    newState.positions = rotatePositions(newState.positions);
    newState.updatedAt = Date.now();

    setHistory([...history, matchState]);
    setMatchState(newState);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setMatchState(previousState);
    setHistory(history.slice(0, -1));
  };

  const handleReset = () => {
    if (!currentTeam) return;

    const rosterIds = currentTeam.roster.map((p) => p.id);
    const initialPositions = initializeCourtFromRoster(rosterIds);
    const benchPlayers = getRemainingBench(rosterIds, initialPositions);

    const newState: MatchState = {
      teamId: currentTeam.id,
      usScore: 0,
      oppScore: 0,
      positions: initialPositions,
      bench: benchPlayers,
      updatedAt: Date.now(),
    };

    clearMatchState(currentTeam.id);
    setMatchState(newState);
    setHistory([]);
  };

  const handleUSScoreInc = () => {
    if (!matchState) return;
    const newState = { ...matchState, usScore: matchState.usScore + 1, updatedAt: Date.now() };
    setHistory([...history, matchState]);
    setMatchState(newState);
  };

  const handleOppScoreInc = () => {
    if (!matchState) return;
    const newState = { ...matchState, oppScore: matchState.oppScore + 1, updatedAt: Date.now() };
    setHistory([...history, matchState]);
    setMatchState(newState);
  };

  const handleUSScoreDec = () => {
    if (!matchState || matchState.usScore === 0) return;
    const newState = { ...matchState, usScore: matchState.usScore - 1, updatedAt: Date.now() };
    setHistory([...history, matchState]);
    setMatchState(newState);
  };

  const handleOppScoreDec = () => {
    if (!matchState || matchState.oppScore === 0) return;
    const newState = { ...matchState, oppScore: matchState.oppScore - 1, updatedAt: Date.now() };
    setHistory([...history, matchState]);
    setMatchState(newState);
  };

  useEffect(() => {
    if (matchState && selectedTeamId) {
      saveMatchState(matchState);
    }
  }, [matchState, selectedTeamId]);

  const benchPlayers = matchState && currentTeam
    ? matchState.bench.map((id) => currentTeam.roster.find((p) => p.id === id)).filter(Boolean) as Player[]
    : [];

  return (
    <div className="game-day-screen">
      <div className="container">
        <div className="header">
          <h1>TVVC Lineup Tracker</h1>
        </div>

        <TeamSelect
          teams={TEAMS}
          selectedTeamId={selectedTeamId}
          onSelectTeam={handleTeamSelect}
        />

        {matchState && currentTeam ? (
          <>
            <ScoreBar
              usScore={matchState.usScore}
              oppScore={matchState.oppScore}
              onUSScoreInc={handleUSScoreInc}
              onOppScoreInc={handleOppScoreInc}
              onUSScoreDec={handleUSScoreDec}
              onOppScoreDec={handleOppScoreDec}
            />

            <CourtGrid
              positions={matchState.positions}
              playerMap={playerMap}
              selectedPosition={selectedPosition}
              onPositionSelect={handlePositionSelect}
            />

            <BenchList
              benchPlayers={benchPlayers}
              selectedPlayer={selectedPlayer}
              onPlayerSelect={handlePlayerSelect}
            />

            <ConfirmSubModal
              isOpen={!!(selectedPlayer && selectedPosition)}
              selectedPlayer={selectedPlayer}
              selectedPosition={selectedPosition}
              currentPlayerInPosition={
                selectedPosition ? playerMap[matchState.positions[selectedPosition] || ''] : null
              }
              onConfirm={handleConfirmSubstitution}
              onCancel={handleCancelSubstitution}
            />

            <ControlsBar
              onRotate={handleRotate}
              onUndo={handleUndo}
              onReset={handleReset}
              canUndo={history.length > 0}
            />
          </>
        ) : (
          <div className="no-team-message">
            <p>Select a team to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
