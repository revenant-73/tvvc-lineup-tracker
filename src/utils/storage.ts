import type { MatchState } from '../types';

const STORAGE_KEY_PREFIX = 'tvvc_lineup_state__';

export function getStorageKey(teamId: string): string {
  return `${STORAGE_KEY_PREFIX}${teamId}`;
}

export function saveMatchState(state: MatchState): void {
  try {
    const key = getStorageKey(state.teamId);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save match state:', error);
  }
}

export function loadMatchState(teamId: string): MatchState | null {
  try {
    const key = getStorageKey(teamId);
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as MatchState;
  } catch (error) {
    console.error('Failed to load match state:', error);
    return null;
  }
}

export function clearMatchState(teamId: string): void {
  try {
    const key = getStorageKey(teamId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear match state:', error);
  }
}
