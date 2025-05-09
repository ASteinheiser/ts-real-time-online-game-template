import { MAP_WIDTH, MAP_HEIGHT } from '@repo/core-game';
import { Versions } from './components/Versions';

export const App = () => {
  const ipcHandle = () => {
    window.electron.ipcRenderer.send('ping');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1>Powered by electron-vite</h1>
        <div>Build an Electron app with React and TypeScript</div>
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          <button>Send IPC</button>
        </a>
      </div>

      <div style={{ marginBottom: '80px' }}>
        <iframe src="http://localhost:4200" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }} />
      </div>

      <div>
        <Versions />
      </div>
    </div>
  );
};
