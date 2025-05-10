import { MAP_WIDTH, MAP_HEIGHT } from '@repo/core-game';
import { Label, Button } from '@repo/ui';
import { Versions } from './components/Versions';

export const App = () => {
  const ipcHandle = () => {
    window.electron.ipcRenderer.send('ping');
  };

  return (
    <div className="mx-auto" style={{ maxWidth: MAP_WIDTH }}>
      <div className="flex flex-row pt-2 pb-4 justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl">Powered by electron-vite</h1>
          <Label>Build an Electron app with React and TypeScript</Label>
        </div>
        <Button onClick={ipcHandle}>Send IPC</Button>
      </div>

      <iframe src="http://localhost:4200" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }} />

      <div className="flex flex-row justify-end pt-4 pb-2">
        <Versions />
      </div>
    </div>
  );
};
