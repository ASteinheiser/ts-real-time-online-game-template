import { LoadingSpinner } from '@repo/ui';

export const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen mt-nav-footer pt-40">
      <LoadingSpinner />
    </div>
  );
};
