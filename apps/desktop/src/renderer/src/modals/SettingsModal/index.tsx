import { useEffect, useState } from 'react';
import { Checkbox, Label, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@repo/ui';
import type { ResolutionOption } from '../../../../shared/types';
import { ResolutionSelect } from './ResolutionSelect';
import { Versions } from './Versions';

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ isOpen, onOpenChange }: SettingsModalProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [resolution, setResolution] = useState('');
  const [availableRes, setAvailableRes] = useState<Array<ResolutionOption>>([]);

  useEffect(() => {
    (async () => {
      const [resolutions, videoSettings] = await Promise.all([
        window.api.video.getAvailableResolutions(),
        window.api.video.getVideoSettings(),
      ]);
      setAvailableRes(resolutions);
      setFullscreen(videoSettings.fullscreen);
      setResolution(`${videoSettings.width}x${videoSettings.height}`);
    })();
  }, []);

  const handleChangeFullscreen = (checked: boolean) => {
    setFullscreen(checked);
    window.api.video.setVideoSettings({ fullscreen: checked });
  };

  const handleChangeResolution = (res: string) => {
    setResolution(res);
    const [width, height] = res.split('x').map(Number);
    window.api.video.setVideoSettings({ width, height });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="pt-2 font-pixel text-4xl text-muted-foreground">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-2 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <Label className="font-title text-xl">Fullscreen</Label>
            <Checkbox
              className="size-6"
              checked={fullscreen}
              onCheckedChange={(checked) => handleChangeFullscreen(Boolean(checked.valueOf()))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="font-title text-xl">Resolution</Label>
            <ResolutionSelect
              availableResolutions={availableRes}
              currentResolution={resolution}
              onResolutionChange={handleChangeResolution}
            />
          </div>
        </div>

        <div className="w-20 h-[2px] bg-secondary mx-auto" />

        <DialogFooter className="py-2">
          <Versions />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
