import { DevLogEntry } from '../../components/DevLogEntry';

export const DevLog = () => {
  return (
    <div className="flex flex-col gap-4 max-w-screen-md mx-auto py-6 px-4">
      <DevLogEntry />
      <DevLogEntry />
      <DevLogEntry />
    </div>
  );
};
