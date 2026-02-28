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

interface FileArgResult {
  path: string;
  name: string;
  bytes: number[];
}

/** Get the startup file passed as CLI argument (file association).
 *  Returns { path, name, bytes } or null. Reads the file in Rust
 *  to bypass fs plugin scope restrictions. */
export async function tauriGetStartupFile(): Promise<{ name: string; bytes: Uint8Array } | null> {
  if (!isTauri()) return null;

  try {
    console.log('[tauri] invoking get_file_arg...');
    const result = await invoke<FileArgResult | null>('get_file_arg');
    console.log('[tauri] get_file_arg result:', result ? `${result.name} (${result.bytes.length} bytes)` : 'null');
    if (result) {
      return { name: result.name, bytes: new Uint8Array(result.bytes) };
    }
  } catch (e) {
    console.error('[tauri] get_file_arg failed:', e);
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
