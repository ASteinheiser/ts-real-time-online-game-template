import { LoadingSpinner } from '@repo/ui';

export const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner size="lg" color="primary" />
    </div>
  );
};
