import type { ElectronAPI } from '@electron-toolkit/preload';

export type DeepLinkCallback = (url: string) => void;

interface ResolutionOption {
  width: number;
  height: number;
}

interface VideoSettings extends ResolutionOption {
  fullscreen: boolean;
}

export interface CustomAPI {
  /** called once by the renderer to setup a deep-link listener */
  onDeepLink: (callback: DeepLinkCallback) => void;
  /** video settings helpers */
  video: {
    /** Returns an array of supported resolutions filtered by current display */
    getAvailableResolutions: () => Promise<Array<ResolutionOption>>;
    /** Returns the currently saved video settings */
    getVideoSettings: () => Promise<VideoSettings>;
    /** Applies and persists new video settings */
    setVideoSettings: (settings: Partial<VideoSettings>) => Promise<void>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: CustomAPI;
  }
}
