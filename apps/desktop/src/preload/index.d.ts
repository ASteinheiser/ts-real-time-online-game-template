import type { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      onDeepLink: (cb: (url: string) => void) => void;
    };
  }
}
