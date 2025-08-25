import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import type { ResolutionOption } from '../../../../shared/types';

interface ResolutionSelectProps {
  availableResolutions: Array<ResolutionOption>;
  currentResolution: string;
  onResolutionChange: (resolution: string) => void;
  onOpenChange: (open: boolean) => void;
}

export const ResolutionSelect = ({
  availableResolutions,
  currentResolution,
  onResolutionChange,
  onOpenChange,
}: ResolutionSelectProps) => {
  return (
    <Select value={currentResolution} onValueChange={onResolutionChange} onOpenChange={onOpenChange}>
      <SelectTrigger className="w-[140px] text-xl font-pixel">
        <SelectValue placeholder="--" />
      </SelectTrigger>

      <SelectContent>
        {availableResolutions.map((resolution) => {
          const resString = stringifyResolution(resolution);
          return (
            <SelectItem key={resString} value={resString} className="text-xl font-pixel">
              {resString}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const stringifyResolution = (res: ResolutionOption) => {
  return `${res.width}x${res.height}`;
};

export const parseResolution = (res: string): ResolutionOption => {
  const [width, height] = res.split('x').map(Number);
  return { width, height };
};
