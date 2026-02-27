export interface NfoTheme {
  id: string;
  name: string;
  bg: string;
  fg: string;
  block: string;
  highlight: string;
  toolbarBg: string;
  toolbarBorder: string;
  toolbarFg: string;
  selectionBg: string;
}

export const themes: NfoTheme[] = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    bg: '#0a0e17',
    fg: '#b0b8c8',
    block: '#66ccff',
    highlight: '#66ccff',
    toolbarBg: '#111827',
    toolbarBorder: '#1f2937',
    toolbarFg: '#9ca3af',
    selectionBg: 'rgba(102, 204, 255, 0.2)',
  },
  {
    id: 'classic-green',
    name: 'Classic Green',
    bg: '#0a100a',
    fg: '#a0c8a0',
    block: '#33ff33',
    highlight: '#33ff33',
    toolbarBg: '#0d150d',
    toolbarBorder: '#1a2e1a',
    toolbarFg: '#7da87d',
    selectionBg: 'rgba(51, 255, 51, 0.15)',
  },
  {
    id: 'classic-amber',
    name: 'Classic Amber',
    bg: '#1a1000',
    fg: '#ccaa66',
    block: '#ffaa00',
    highlight: '#ffcc44',
    toolbarBg: '#1a1200',
    toolbarBorder: '#332200',
    toolbarFg: '#aa8844',
    selectionBg: 'rgba(255, 170, 0, 0.15)',
  },
  {
    id: 'dark',
    name: 'Dark',
    bg: '#1a1a2e',
    fg: '#c8c8e0',
    block: '#e066ff',
    highlight: '#bb77ff',
    toolbarBg: '#16162a',
    toolbarBorder: '#2a2a4a',
    toolbarFg: '#9898b0',
    selectionBg: 'rgba(224, 102, 255, 0.15)',
  },
  {
    id: 'light',
    name: 'Light',
    bg: '#f5f5f0',
    fg: '#333333',
    block: '#0066cc',
    highlight: '#0044aa',
    toolbarBg: '#e8e8e3',
    toolbarBorder: '#ccccbb',
    toolbarFg: '#555555',
    selectionBg: 'rgba(0, 102, 204, 0.15)',
  },
  {
    id: 'white',
    name: 'White on Black',
    bg: '#000000',
    fg: '#cccccc',
    block: '#ffffff',
    highlight: '#ffffff',
    toolbarBg: '#0a0a0a',
    toolbarBorder: '#222222',
    toolbarFg: '#888888',
    selectionBg: 'rgba(255, 255, 255, 0.15)',
  },
];

export function getThemeById(id: string): NfoTheme {
  return themes.find((t) => t.id === id) || themes[0];
}
