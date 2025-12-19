import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
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
import './GameDayScreen.css';

export function GameDayScreen() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [history, setHistory] = useState<MatchState[]>([]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    if (!matchState || !currentTeam) return;

    const { active, over } = event;

    if (!over) return;

    const draggedPlayerId = active.id as string;
    const dropTarget = (over.data as unknown as { type: string; position?: PositionKey } | undefined);

    if (!dropTarget || dropTarget.type !== 'court') return;

    const position = dropTarget.position as PositionKey;
    const newState = { ...matchState };

    const { positions, bench } = performSubstitution(
      newState.positions,
      newState.bench,
      draggedPlayerId,
      position
    );

    const updatedState: MatchState = {
      ...newState,
      positions,
      bench,
      updatedAt: Date.now(),
    };

    setHistory([...history, matchState]);
    setMatchState(updatedState);
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

            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <CourtGrid
                positions={matchState.positions}
                playerMap={playerMap}
              />

              <BenchList benchPlayers={benchPlayers} />
            </DndContext>

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
