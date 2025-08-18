import type { ElectronAPI } from '@electron-toolkit/preload';

export type DeepLinkCallback = (url: string) => void;

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      /** called once by the renderer to setup a deep-link listener */
      onDeepLink: (callback: DeepLinkCallback) => void;
    };
  }
}
