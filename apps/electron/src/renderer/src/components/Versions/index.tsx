import { useState } from 'react';

export const Versions = () => {
  const [versions] = useState(window.electron.process.versions);

  return (
    <ul className="flex flex-row gap-4">
      <li className="text-md font-montserrat">Electron v{versions.electron}</li>
      <li className="text-md font-montserrat">Chromium v{versions.chrome}</li>
      <li className="text-md font-montserrat">Node v{versions.node}</li>
    </ul>
  );
};
