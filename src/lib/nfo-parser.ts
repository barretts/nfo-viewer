import { smartDecode } from './cp437';

export interface NfoDocument {
  text: string;
  lines: string[];
  width: number;
  height: number;
  fileName: string;
}

/** Parse raw bytes into an NfoDocument */
export function parseNfo(bytes: Uint8Array, fileName: string): NfoDocument {
  const text = smartDecode(bytes);
  // Normalize line endings to LF
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  // Remove trailing empty line if present
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  const width = lines.reduce((max, line) => Math.max(max, line.length), 0);
  return {
    text: normalized,
    lines,
    width,
    height: lines.length,
    fileName,
  };
}

/** Load an NFO file from a File object (browser) */
export async function loadNfoFromFile(file: File): Promise<NfoDocument> {
  const buffer = await file.arrayBuffer();
  return parseNfo(new Uint8Array(buffer), file.name);
}

/** Load an NFO file from a URL */
export async function loadNfoFromUrl(url: string): Promise<NfoDocument> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  const fileName = url.split('/').pop() || 'remote.nfo';
  return parseNfo(new Uint8Array(buffer), fileName);
}
