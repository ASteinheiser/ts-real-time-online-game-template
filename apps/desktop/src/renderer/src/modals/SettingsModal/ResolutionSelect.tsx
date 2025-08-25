import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import type { ResolutionOption } from '../../../../shared/types';

interface ResolutionSelectProps {
  availableResolutions: Array<ResolutionOption>;
  currentResolution: string;
  onResolutionChange: (resolution: string) => void;
}

export const ResolutionSelect = ({
  availableResolutions,
  currentResolution,
  onResolutionChange,
}: ResolutionSelectProps) => {
  return (
    <Select value={currentResolution} onValueChange={onResolutionChange}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="--" />
      </SelectTrigger>

      <SelectContent>
        {availableResolutions.map(({ width, height }) => {
          const resolution = `${width}x${height}`;
          return (
            <SelectItem key={resolution} value={resolution}>
              {resolution}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
