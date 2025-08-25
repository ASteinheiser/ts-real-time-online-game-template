import { useState } from 'react';
import { Electron, Chromium, Node } from '@repo/ui/icons';
import { version } from '../../../../../package.json';

export const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-xl font-pixel flex flex-row items-center gap-1">
        Version<span className="text-lg font-label">{version}</span>
      </p>

      <ul className="flex flex-row gap-4">
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
    </div>
  );
};
