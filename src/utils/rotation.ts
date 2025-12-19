import type { CourtState, PositionKey } from '../types';

export function rotatePositions(positions: CourtState): CourtState {
  return {
    1: positions[2],
    2: positions[3],
    3: positions[4],
    4: positions[5],
    5: positions[6],
    6: positions[1],
  };
}

export function getServerPosition(positions: CourtState): string | null {
  return positions[1];
}

export function isFrontRow(position: PositionKey): boolean {
  return position === 2 || position === 3 || position === 4;
}

export function isBackRow(position: PositionKey): boolean {
  return position === 1 || position === 5 || position === 6;
}
