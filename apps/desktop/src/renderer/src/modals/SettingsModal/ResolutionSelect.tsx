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
    <Select>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="--" />
      </SelectTrigger>

      <SelectContent defaultValue={currentResolution}>
        {availableResolutions.map(({ width, height }) => {
          const resolution = `${width}x${height}`;
          return (
            <SelectItem key={resolution} value={resolution} onClick={() => onResolutionChange(resolution)}>
              {resolution}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
