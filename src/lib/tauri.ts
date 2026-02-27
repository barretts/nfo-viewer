/**
 * Tauri integration helpers.
 * These are no-ops when running in the browser (non-Tauri environment).
 *
 * Dynamic imports use a variable so Vite's static analysis doesn't try
 * to resolve the bare specifiers at dev time.
 */

// Trick Vite's import analysis by building module names at runtime
const TAURI_FS = '@tauri-apps/' + 'plugin-fs';
const TAURI_CLI = '@tauri-apps/' + 'plugin-cli';
const TAURI_DIALOG = '@tauri-apps/' + 'plugin-dialog';

export function isTauri(): boolean {
  return !!(window as any).__TAURI__;
}

/** Read a file from disk via Tauri's fs API */
export async function tauriReadFile(path: string): Promise<Uint8Array | null> {
  if (!isTauri()) return null;
  try {
    const mod = await (Function('m', 'return import(m)') as (m: string) => Promise<any>)(TAURI_FS);
    return await mod.readFile(path);
  } catch {
    return null;
  }
}

/** Get the file path passed as CLI argument (file association) */
export async function tauriGetOpenFilePath(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const mod = await (Function('m', 'return import(m)') as (m: string) => Promise<any>)(TAURI_CLI);
    const matches = await mod.getMatches();
    const args = matches.args;
    if (args['file'] && typeof args['file'].value === 'string') {
      return args['file'].value;
    }
    return null;
  } catch {
    return null;
  }
}

/** Open a file dialog via Tauri */
export async function tauriOpenFileDialog(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    const mod = await (Function('m', 'return import(m)') as (m: string) => Promise<any>)(TAURI_DIALOG);
    const result = await mod.open({
      multiple: false,
      filters: [
        { name: 'NFO Files', extensions: ['nfo'] },
        { name: 'Text Files', extensions: ['nfo', 'txt', 'diz', 'asc'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (typeof result === 'string') return result;
    return null;
  } catch {
    return null;
  }
}
