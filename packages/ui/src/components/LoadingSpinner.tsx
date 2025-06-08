import { cn } from '../utils';

type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
type LoadingSpinnerColor = 'primary' | 'secondary' | 'foreground';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  color?: LoadingSpinnerColor;
}

export const LoadingSpinner = ({ size = 'md', color = 'primary' }: LoadingSpinnerProps) => {
  const { innerSize, outerSize } = getSizeClass(size);
  const colorClass = getColorClass(color);

  return (
    <div className="relative">
      <div
        className={cn(
          'border-y-transparent rounded-full animate-[spin_1.25s_linear_infinite]',
          outerSize,
          colorClass
        )}
      />
      <div
        className={cn(
          'absolute border-y-transparent rounded-full animate-[spin_1.25s_linear_infinite_reverse]',
          innerSize,
          colorClass
        )}
      />
    </div>
  );
};

const getSizeClass = (size: LoadingSpinnerSize): { innerSize: string; outerSize: string } => {
  switch (size) {
    case 'sm':
      return { innerSize: 'border-2 size-4 top-1 left-1', outerSize: 'border-2 size-6' };
    case 'lg':
      return { innerSize: 'border-6 size-10 top-3 left-3', outerSize: 'border-6 size-16' };
    case 'md':
    default:
      return { innerSize: 'border-4 size-6 top-2 left-2', outerSize: 'border-4 size-10' };
  }
};

const getColorClass = (color: LoadingSpinnerColor): string => {
  switch (color) {
    case 'foreground':
      return 'border-x-muted-foreground';
    case 'secondary':
      return 'border-x-secondary';
    case 'primary':
    default:
      return 'border-x-primary';
  }
};
