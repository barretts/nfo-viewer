/**
 * Tauri integration helpers.
 * These are no-ops when running in the browser (non-Tauri environment).
 */

import { readFile } from '@tauri-apps/plugin-fs';
import { getMatches } from '@tauri-apps/plugin-cli';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

export function isTauri(): boolean {
  return !!(window as any).__TAURI_INTERNALS__;
}

/** Read a file from disk via Tauri's fs API */
export async function tauriReadFile(path: string): Promise<Uint8Array | null> {
  if (!isTauri()) return null;
  try {
    console.log('[tauri] readFile:', path);
    const data = await readFile(path);
    console.log('[tauri] readFile success, bytes:', data?.length);
    return data;
  } catch (e) {
    console.error('[tauri] readFile failed:', e);
    return null;
  }
}

/** Get the file path passed as CLI argument (file association) */
export async function tauriGetOpenFilePath(): Promise<string | null> {
  if (!isTauri()) return null;

  // Primary: use Rust command that reads raw process args directly
  try {
    console.log('[tauri] invoking get_file_arg...');
    const filePath = await invoke<string | null>('get_file_arg');
    console.log('[tauri] get_file_arg result:', filePath);
    if (filePath) return filePath;
  } catch (e) {
    console.error('[tauri] get_file_arg failed:', e);
  }

  // Fallback: try CLI plugin
  try {
    console.log('[tauri] trying CLI plugin getMatches...');
    const matches = await getMatches();
    console.log('[tauri] CLI matches:', JSON.stringify(matches, null, 2));
    const args = matches.args;
    if (args['file'] && typeof args['file'].value === 'string') {
      console.log('[tauri] file arg from CLI plugin:', args['file'].value);
      return args['file'].value;
    }
    console.log('[tauri] no file arg from CLI plugin');
  } catch (e) {
    console.error('[tauri] getMatches failed:', e);
  }

  return null;
}

/** Open a file dialog via Tauri */
export async function tauriOpenFileDialog(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    console.log('[tauri] opening file dialog...');
    const result = await open({
      multiple: false,
      filters: [
        { name: 'NFO Files', extensions: ['nfo'] },
        { name: 'Text Files', extensions: ['nfo', 'txt', 'diz', 'asc'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    console.log('[tauri] dialog result:', result);
    if (typeof result === 'string') return result;
    return null;
  } catch (e) {
    console.error('[tauri] dialog failed:', e);
    return null;
  }
}
