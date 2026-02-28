import React from 'react';
import { X } from 'lucide-react';
import type { NfoTheme } from '../lib/themes';

interface AboutModalProps {
  theme: NfoTheme;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ theme, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl border shadow-2xl p-6 max-w-md w-full mx-4"
        style={{
          background: theme.toolbarBg,
          borderColor: theme.toolbarBorder,
          color: theme.fg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: theme.highlight }}>
            nfo-viewer
          </h2>
          <button
            className="p-1 rounded hover:opacity-80 cursor-pointer"
            style={{ color: theme.toolbarFg }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3 text-sm" style={{ color: theme.fg }}>
          <p>
            A cross-platform NFO file viewer inspired by{' '}
            <a
              href="https://github.com/syndicodefront/infekt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: theme.highlight }}
            >
              iNFekt
            </a>
            .
          </p>
          <p className="opacity-70">
            Supports CP437 encoding, Unicode, block character rendering,
            multiple themes, and works both in the browser and as a native
            desktop app via Tauri.
          </p>
          <div className="pt-2 border-t" style={{ borderColor: theme.toolbarBorder }}>
            <p className="text-xs opacity-50">
              Built with React, TypeScript, Vite &amp; Tauri.
            </p>
            <p className="text-xs opacity-50 mt-1">
              Keyboard shortcuts: Ctrl+O (open), Ctrl+= / Ctrl+- (zoom),
              Ctrl+0 (reset zoom)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
