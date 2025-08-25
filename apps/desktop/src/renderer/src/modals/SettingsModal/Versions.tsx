import { useState } from 'react';
import { Electron, Chromium, Node } from '@repo/ui/icons';

export const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="flex flex-row gap-4 justify-center w-full">
      <li className="text-sm font-label flex flex-row items-center">
        <Electron size={20} className="mr-2" />v{versions.electron}
      </li>
      <li className="text-sm font-label flex flex-row items-center">
        <Chromium size={20} className="mr-2" /> v{versions.chrome}
      </li>
      <li className="text-sm font-label flex flex-row items-center">
        <Node size={20} className="mr-2" /> v{versions.node}
      </li>
    </ul>
  );
};
