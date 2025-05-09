import { Versions } from './components/Versions';

export const App = () => {
  const ipcHandle = () => {
    window.electron.ipcRenderer.send('ping');
  };

  return (
    <div>
      <h1>Powered by electron-vite</h1>
      <div>Build an Electron app with React and TypeScript</div>
      <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
        <button>Send IPC</button>
      </a>

      {/* <webview src="http://localhost:4200" style={{ flexGrow: 1, width: '100%', height: '100%' }} /> */}

      <div>
        <Versions />
      </div>
    </div>
  );
};
