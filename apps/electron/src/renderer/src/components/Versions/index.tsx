import { useState } from 'react';

export const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="flex flex-row gap-4">
      <li className="text-md font-title">Electron v{versions.electron}</li>
      <li className="text-md font-title">Chromium v{versions.chrome}</li>
      <li className="text-md font-title">Node v{versions.node}</li>
    </ul>
  );
};
