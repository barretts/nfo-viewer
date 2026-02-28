import React, { useRef, useEffect, useCallback } from 'react';
import type { NfoDocument } from '../lib/nfo-parser';
import type { NfoTheme } from '../lib/themes';

interface NfoRendererProps {
  doc: NfoDocument;
  theme: NfoTheme;
  zoom: number;
  renderMode: 'text' | 'block';
}

// Unicode block drawing characters that should use the block/highlight color
const BLOCK_CHARS = new Set([
  '░', '▒', '▓', '█', '▄', '▌', '▐', '▀', '■',
  '╔', '╗', '╚', '╝', '═', '║', '╠', '╣', '╦', '╩', '╬',
  '╒', '╓', '╕', '╖', '╘', '╙', '╛', '╜', '╞', '╟', '╡', '╢', '╤', '╥', '╧', '╨', '╪', '╫',
  '┌', '┐', '└', '┘', '─', '│', '├', '┤', '┬', '┴', '┼',
  '▲', '▼', '►', '◄', '◆', '●', '○', '◘', '◙',
]);

const NfoRenderer: React.FC<NfoRendererProps> = ({ doc, theme, zoom, renderMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const fontSize = Math.round(14 * zoom);

  const renderLine = useCallback(
    (line: string, lineIndex: number) => {
      if (renderMode === 'text') {
        return (
          <div
            key={lineIndex}
            style={{ whiteSpace: 'pre' }}
          >
            {line || ' '}
          </div>
        );
      }

      // Block mode: color block/box-drawing chars differently
      const spans: React.ReactNode[] = [];
      let currentRun = '';
      let currentIsBlock = false;

      const flushRun = (idx: number) => {
        if (currentRun.length === 0) return;
        if (currentIsBlock) {
          spans.push(
            <span key={idx} style={{ color: theme.block }}>
              {currentRun}
            </span>
          );
        } else {
          spans.push(<span key={idx}>{currentRun}</span>);
        }
        currentRun = '';
      };

      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const isBlock = BLOCK_CHARS.has(ch);
        if (isBlock !== currentIsBlock && currentRun.length > 0) {
          flushRun(i);
        }
        currentIsBlock = isBlock;
        currentRun += ch;
      }
      flushRun(line.length);

      return (
        <div
          key={lineIndex}
          style={{ whiteSpace: 'pre' }}
        >
          {spans.length > 0 ? spans : ' '}
        </div>
      );
    },
    [theme, renderMode],
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto p-4"
      style={{ background: theme.bg }}
    >
      <div className="mx-auto" style={{ width: 'fit-content' }}>
        <pre
          style={{
            fontFamily: "'IBM Plex Mono', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
            fontSize: `${fontSize}px`,
            lineHeight: '1em',
            letterSpacing: '0px',
            color: theme.fg,
            tabSize: 8,
            margin: 0,
            padding: '16px',
            userSelect: 'text',
          }}
        >
          {doc.lines.map((line, i) => renderLine(line, i))}
        </pre>
      </div>
    </div>
  );
};

export default NfoRenderer;
