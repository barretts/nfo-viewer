import React, { useState, useCallback, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import NfoRenderer from './components/NfoRenderer';
import DropZone from './components/DropZone';
import AboutModal from './components/AboutModal';
import { loadNfoFromFile } from './lib/nfo-parser';
import { getThemeById } from './lib/themes';
import { isTauri, tauriReadFile, tauriGetOpenFilePath, tauriOpenFileDialog } from './lib/tauri';
import { parseNfo } from './lib/nfo-parser';
import type { NfoDocument } from './lib/nfo-parser';
import type { NfoTheme } from './lib/themes';

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4.0;
const ZOOM_STEP = 0.1;

function App() {
  const [doc, setDoc] = useState<NfoDocument | null>(null);
  const [themeId, setThemeId] = useState(() => localStorage.getItem('nfo-viewer-theme') || 'classic-blue');
  const [zoom, setZoom] = useState(1.0);
  const [renderMode, setRenderMode] = useState<'text' | 'block'>('block');
  const [showAbout, setShowAbout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = getThemeById(themeId);

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem('nfo-viewer-theme', themeId);
  }, [themeId]);

  // On mount, check for Tauri CLI file argument
  useEffect(() => {
    (async () => {
      if (isTauri()) {
        const filePath = await tauriGetOpenFilePath();
        if (filePath) {
          const bytes = await tauriReadFile(filePath);
          if (bytes) {
            const fileName = filePath.split(/[/\\]/).pop() || 'file.nfo';
            setDoc(parseNfo(bytes, fileName));
          }
        }
      }
    })();
  }, []);

  // Handle file from browser file picker or drag-and-drop
  const handleFileLoaded = useCallback(async (file: File) => {
    try {
      setError(null);
      const nfoDoc = await loadNfoFromFile(file);
      setDoc(nfoDoc);
    } catch (e: any) {
      setError(e.message || 'Failed to load file');
    }
  }, []);

  // Open file dialog (Tauri-native or browser)
  const handleOpenFile = useCallback(async () => {
    if (isTauri()) {
      const filePath = await tauriOpenFileDialog();
      if (filePath) {
        const bytes = await tauriReadFile(filePath);
        if (bytes) {
          const fileName = filePath.split(/[/\\]/).pop() || 'file.nfo';
          setDoc(parseNfo(bytes, fileName));
        }
      }
    } else {
      fileInputRef.current?.click();
    }
  }, []);

  const handleBrowserFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileLoaded(file);
      // Reset value so same file can be re-opened
      e.target.value = '';
    },
    [handleFileLoaded],
  );

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
  }, []);
  const handleZoomReset = useCallback(() => {
    setZoom(1.0);
  }, []);

  // Render mode toggle
  const handleRenderModeToggle = useCallback(() => {
    setRenderMode((m) => (m === 'block' ? 'text' : 'block'));
  }, []);

  // Export PNG via canvas
  const handleExportPng = useCallback(() => {
    if (!doc) return;
    const fontSize = 14;
    const lineHeight = fontSize;
    const padding = 16;
    const charWidth = fontSize * 0.6;

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(doc.width * charWidth + padding * 2);
    canvas.height = Math.ceil(doc.height * lineHeight + padding * 2);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "IBM Plex Mono", "Cascadia Code", Consolas, "Courier New", monospace`;
    ctx.textBaseline = 'top';

    const BLOCK_CHARS = new Set([
      '░', '▒', '▓', '█', '▄', '▌', '▐', '▀', '■',
      '╔', '╗', '╚', '╝', '═', '║', '╠', '╣', '╦', '╩', '╬',
      '╒', '╓', '╕', '╖', '╘', '╙', '╛', '╜', '╞', '╟', '╡', '╢', '╤', '╥', '╧', '╨', '╪', '╫',
      '┌', '┐', '└', '┘', '─', '│', '├', '┤', '┬', '┴', '┼',
      '▲', '▼', '►', '◄', '◆', '●', '○', '◘', '◙',
    ]);

    doc.lines.forEach((line, row) => {
      const y = padding + row * lineHeight;
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        ctx.fillStyle = BLOCK_CHARS.has(ch) ? theme.block : theme.fg;
        ctx.fillText(ch, padding + col * charWidth, y);
      }
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (doc.fileName.replace(/\.[^.]+$/, '') || 'nfo') + '.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [doc, theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'o') {
        e.preventDefault();
        handleOpenFile();
      } else if (ctrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        handleZoomIn();
      } else if (ctrl && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (ctrl && e.key === '0') {
        e.preventDefault();
        handleZoomReset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleOpenFile, handleZoomIn, handleZoomOut, handleZoomReset]);

  // Global drag-and-drop
  useEffect(() => {
    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file) handleFileLoaded(file);
    };
    const handleGlobalDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener('drop', handleGlobalDrop);
    window.addEventListener('dragover', handleGlobalDragOver);
    return () => {
      window.removeEventListener('drop', handleGlobalDrop);
      window.removeEventListener('dragover', handleGlobalDragOver);
    };
  }, [handleFileLoaded]);

  return (
    <div className="h-full flex flex-col">
      {/* Hidden browser file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".nfo,.txt,.diz,.asc"
        className="hidden"
        onChange={handleBrowserFileChange}
      />

      <Toolbar
        theme={theme}
        zoom={zoom}
        renderMode={renderMode}
        hasDoc={!!doc}
        fileName={doc?.fileName || ''}
        onOpenFile={handleOpenFile}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onThemeChange={setThemeId}
        onRenderModeToggle={handleRenderModeToggle}
        onExportPng={handleExportPng}
        onShowAbout={() => setShowAbout(true)}
      />

      {error && (
        <div
          className="px-4 py-2 text-sm"
          style={{ background: '#4a1515', color: '#ff8888' }}
        >
          {error}
        </div>
      )}

      {doc ? (
        <NfoRenderer doc={doc} theme={theme} zoom={zoom} renderMode={renderMode} />
      ) : (
        <DropZone theme={theme} onFileLoaded={handleFileLoaded} onOpenFile={handleOpenFile} />
      )}

      {showAbout && <AboutModal theme={theme} onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
