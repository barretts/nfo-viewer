import React from 'react';
import {
  FolderOpen,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Type,
  Grid3X3,
  Download,
  Info,
} from 'lucide-react';
import type { NfoTheme } from '../lib/themes';
import { themes } from '../lib/themes';

interface ToolbarProps {
  theme: NfoTheme;
  zoom: number;
  renderMode: 'text' | 'block';
  hasDoc: boolean;
  fileName: string;
  onOpenFile: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onThemeChange: (themeId: string) => void;
  onRenderModeToggle: () => void;
  onExportPng: () => void;
  onShowAbout: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  theme,
  zoom,
  renderMode,
  hasDoc,
  fileName,
  onOpenFile,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onThemeChange,
  onRenderModeToggle,
  onExportPng,
  onShowAbout,
}) => {
  const [showThemePicker, setShowThemePicker] = React.useState(false);

  return (
    <div
      className="flex items-center gap-1 px-3 py-1.5 border-b select-none shrink-0"
      style={{
        background: theme.toolbarBg,
        borderColor: theme.toolbarBorder,
        color: theme.toolbarFg,
      }}
    >
      {/* File name */}
      <div className="flex items-center gap-2 mr-4 min-w-0">
        <span className="text-xs font-bold tracking-wider opacity-60 shrink-0">nfo-viewer</span>
        {hasDoc && (
          <span
            className="text-xs truncate max-w-[200px] opacity-80"
            title={fileName}
          >
            — {fileName}
          </span>
        )}
      </div>

      {/* Open */}
      <ToolbarButton
        icon={<FolderOpen size={15} />}
        label="Open File"
        onClick={onOpenFile}
        theme={theme}
      />

      <Separator theme={theme} />

      {/* Zoom */}
      <ToolbarButton
        icon={<ZoomOut size={15} />}
        label="Zoom Out"
        onClick={onZoomOut}
        disabled={!hasDoc}
        theme={theme}
      />
      <button
        className="text-xs px-2 py-1 rounded hover:opacity-80 cursor-pointer"
        style={{ color: theme.toolbarFg }}
        onClick={onZoomReset}
        title="Reset Zoom"
        disabled={!hasDoc}
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolbarButton
        icon={<ZoomIn size={15} />}
        label="Zoom In"
        onClick={onZoomIn}
        disabled={!hasDoc}
        theme={theme}
      />

      <Separator theme={theme} />

      {/* Render mode toggle */}
      <ToolbarButton
        icon={renderMode === 'block' ? <Grid3X3 size={15} /> : <Type size={15} />}
        label={renderMode === 'block' ? 'Block Mode' : 'Text Mode'}
        onClick={onRenderModeToggle}
        disabled={!hasDoc}
        active={renderMode === 'block'}
        theme={theme}
      />

      {/* Theme picker */}
      <div className="relative">
        <ToolbarButton
          icon={<Palette size={15} />}
          label="Theme"
          onClick={() => setShowThemePicker(!showThemePicker)}
          theme={theme}
        />
        {showThemePicker && (
          <div
            className="absolute top-full left-0 mt-1 rounded-lg shadow-xl border z-50 py-1 min-w-[160px]"
            style={{
              background: theme.toolbarBg,
              borderColor: theme.toolbarBorder,
            }}
          >
            {themes.map((t) => (
              <button
                key={t.id}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:opacity-80 cursor-pointer"
                style={{
                  color: t.id === theme.id ? theme.highlight : theme.toolbarFg,
                  background: t.id === theme.id ? theme.selectionBg : 'transparent',
                }}
                onClick={() => {
                  onThemeChange(t.id);
                  setShowThemePicker(false);
                }}
              >
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{
                    background: t.block,
                    borderColor: t.toolbarBorder,
                  }}
                />
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Export */}
      <ToolbarButton
        icon={<Download size={15} />}
        label="Export PNG"
        onClick={onExportPng}
        disabled={!hasDoc}
        theme={theme}
      />

      <Separator theme={theme} />

      {/* About */}
      <ToolbarButton
        icon={<Info size={15} />}
        label="About"
        onClick={onShowAbout}
        theme={theme}
      />
    </div>
  );
};

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  active,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  theme: NfoTheme;
}) {
  return (
    <button
      className="p-1.5 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
      style={{
        color: active ? theme.highlight : theme.toolbarFg,
        background: active ? theme.selectionBg : 'transparent',
      }}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {icon}
    </button>
  );
}

function Separator({ theme }: { theme: NfoTheme }) {
  return (
    <div
      className="w-px h-5 mx-1"
      style={{ background: theme.toolbarBorder }}
    />
  );
}

export default Toolbar;
