import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import type { ResolutionOption } from '../../../../shared/types';

interface ResolutionSelectProps {
  disabled: boolean;
  availableResolutions: Array<ResolutionOption>;
  currentResolution: ResolutionOption;
  onResolutionChange: (resolution: ResolutionOption) => void;
  onOpenChange: (open: boolean) => void;
}

export const ResolutionSelect = ({
  disabled,
  availableResolutions,
  currentResolution,
  onResolutionChange,
  onOpenChange,
}: ResolutionSelectProps) => {
  return (
    <Select
      value={stringifyResolution(currentResolution)}
      onValueChange={(value) => onResolutionChange(parseResolution(value))}
      onOpenChange={onOpenChange}
    >
      <SelectTrigger className="w-[140px] text-xl font-pixel" disabled={disabled}>
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

const stringifyResolution = (res: ResolutionOption) => {
  return `${res.width}x${res.height}`;
};

const parseResolution = (res: string): ResolutionOption => {
  const [width, height] = res.split('x').map(Number);
  return { width, height };
};
