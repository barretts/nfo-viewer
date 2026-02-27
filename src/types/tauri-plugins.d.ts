declare module '@tauri-apps/plugin-fs' {
  export function readFile(path: string): Promise<Uint8Array>;
}

declare module '@tauri-apps/plugin-cli' {
  interface ArgMatch {
    value: string | boolean | string[] | null;
    occurrences: number;
  }
  interface CliMatches {
    args: Record<string, ArgMatch>;
    subcommand: { name: string; matches: CliMatches } | null;
  }
  export function getMatches(): Promise<CliMatches>;
}

declare module '@tauri-apps/plugin-dialog' {
  interface OpenDialogOptions {
    multiple?: boolean;
    filters?: { name: string; extensions: string[] }[];
  }
  export function open(options?: OpenDialogOptions): Promise<string | string[] | null>;
}
