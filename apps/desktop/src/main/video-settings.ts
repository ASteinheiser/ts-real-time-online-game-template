// -----------------------------------------------------------------------------
// Video settings helpers (fullscreen + fixed resolutions)
// -----------------------------------------------------------------------------
import { app, type BrowserWindow, type Display } from 'electron';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'path';

export interface VideoSettings {
  fullscreen: boolean;
  width: number;
  height: number;
}

/** Common desktop game resolutions – will be filtered by display size */
const COMMON_RESOLUTIONS = [
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
] as const;

const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  fullscreen: false,
  ...COMMON_RESOLUTIONS[0],
};

/** Returns an array of supported resolutions filtered by current display size */
export const getAvailableResolutions = ({ size }: Display) => {
  return COMMON_RESOLUTIONS.filter((r) => r.width <= size.width && r.height <= size.height);
};

/** Location of the JSON settings file in the user data directory (varies by OS) */
const getConfigFile = () => join(app.getPath('userData'), 'video-settings.json');

/** Persists the video settings to a JSON file */
const saveVideoSettings = (settings: VideoSettings) => {
  try {
    writeFileSync(getConfigFile(), JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save video settings', err);
  }
};

/** Loads the video settings from the JSON file */
export const loadVideoSettings = (): VideoSettings => {
  try {
    const settingsFile = getConfigFile();

    if (existsSync(settingsFile)) {
      const data = JSON.parse(readFileSync(settingsFile, 'utf-8'));
      const { fullscreen, width, height } = data || {};

      return {
        fullscreen: typeof fullscreen === 'boolean' ? fullscreen : DEFAULT_VIDEO_SETTINGS.fullscreen,
        width: typeof width === 'number' ? width : DEFAULT_VIDEO_SETTINGS.width,
        height: typeof height === 'number' ? height : DEFAULT_VIDEO_SETTINGS.height,
      };
    }
  } catch (err) {
    console.error('Failed to load video settings, falling back to defaults', err);
  }
  return DEFAULT_VIDEO_SETTINGS;
};

/** Applies the video settings to the window and persists them */
export const applyVideoSettings = (window: BrowserWindow, newSettings: Partial<VideoSettings>) => {
  const existingSettings = loadVideoSettings();
  const mergedSettings = {
    fullscreen: newSettings.fullscreen ?? existingSettings.fullscreen,
    width: newSettings.width ?? existingSettings.width,
    height: newSettings.height ?? existingSettings.height,
  };

  if (mergedSettings.fullscreen) {
    window.setFullScreen(true);
  } else {
    window.setFullScreen(false);
    window.setContentSize(mergedSettings.width, mergedSettings.height);
    window.center();
  }

  saveVideoSettings(mergedSettings);
};
