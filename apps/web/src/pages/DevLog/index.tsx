import { DevLogEntry1 } from './entries/devlog-1';
import { DevLogEntry2 } from './entries/devlog-2';
import { DevLogEntry3 } from './entries/devlog-3';

export const DevLog = () => {
  return (
    <div className="flex flex-col gap-4 max-w-screen-md mx-auto py-6 px-4">
      <DevLogEntry1 />
      <DevLogEntry2 />
      <DevLogEntry3 />
    </div>
  );
};
