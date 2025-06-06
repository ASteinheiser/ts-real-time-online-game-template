import { cn } from '../utils';

type LoadingSpinnerSize = 'sm' | 'md' | 'lg';
type LoadingSpinnerColor = 'primary' | 'secondary';

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
          'w-10 h-10 border-4 border-t-transparent border-b-transparent border-primary rounded-full animate-[spin_1.25s_linear_infinite]',
          outerSize,
          colorClass
        )}
      />
      <div
        className={cn(
          'absolute top-2 left-2 w-6 h-6 border-4 border-t-transparent border-b-transparent border-primary rounded-full animate-[spin_1.25s_linear_infinite_reverse]',
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
      return { innerSize: '', outerSize: '' };
    case 'lg':
      return { innerSize: '', outerSize: '' };
    case 'md':
    default:
      return { innerSize: '', outerSize: '' };
  }
};

const getColorClass = (color: LoadingSpinnerColor): string => {
  switch (color) {
    case 'secondary':
      return '';
    case 'primary':
    default:
      return '';
  }
};
