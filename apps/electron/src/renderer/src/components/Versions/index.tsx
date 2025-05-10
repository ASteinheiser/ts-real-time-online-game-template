import { useState } from 'react';

export const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="flex flex-row gap-4">
      <li className="text-md">Electron v{versions.electron}</li>
      <li className="text-md">Chromium v{versions.chrome}</li>
      <li className="text-md">Node v{versions.node}</li>
    </ul>
  );
};
