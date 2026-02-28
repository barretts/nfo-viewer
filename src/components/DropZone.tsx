import React, { useCallback, useState } from 'react';
import { FileUp } from 'lucide-react';
import type { NfoTheme } from '../lib/themes';

interface DropZoneProps {
  theme: NfoTheme;
  onFileLoaded: (file: File) => void;
  onOpenFile: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ theme, onFileLoaded, onOpenFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileLoaded(files[0]);
      }
    },
    [onFileLoaded],
  );

  return (
    <div
      className="flex-1 flex items-center justify-center"
      style={{ background: theme.bg }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className="flex flex-col items-center gap-6 p-12 rounded-2xl border-2 border-dashed transition-all"
        style={{
          borderColor: isDragging ? theme.highlight : theme.toolbarBorder,
          background: isDragging ? theme.selectionBg : 'transparent',
        }}
      >
        <FileUp
          size={48}
          style={{ color: theme.highlight, opacity: 0.6 }}
        />
        <div className="text-center">
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: theme.fg }}
          >
            Drop an NFO file here
          </p>
          <p className="text-sm opacity-60" style={{ color: theme.fg }}>
            or{' '}
            <button
              className="underline cursor-pointer hover:opacity-80"
              style={{ color: theme.highlight }}
              onClick={onOpenFile}
            >
              browse to open
            </button>
          </p>
          <p className="text-xs mt-4 opacity-40" style={{ color: theme.fg }}>
            Supports .nfo, .txt, .diz, .asc files
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
