import type { CourtState, PositionKey } from '../types';

export function performSubstitution(
  positions: CourtState,
  bench: string[],
  playerId: string,
  position: PositionKey
): { positions: CourtState; bench: string[] } {
  const currentPlayer = positions[position];
  
  const newPositions = { ...positions };
  newPositions[position] = playerId;
  
  const newBench = bench.filter((id) => id !== playerId);
  if (currentPlayer) {
    newBench.push(currentPlayer);
  }
  
  return { positions: newPositions, bench: newBench };
}

export function initializeCourtFromRoster(roster: string[]): CourtState {
  return {
    1: roster[0] || null,
    2: roster[1] || null,
    3: roster[2] || null,
    4: roster[3] || null,
    5: roster[4] || null,
    6: roster[5] || null,
  };
}

export function getRemainingBench(
  rosterId: string[],
  positions: CourtState
): string[] {
  const onCourt = Object.values(positions).filter((id) => id !== null);
  return rosterId.filter((id) => !onCourt.includes(id));
}
