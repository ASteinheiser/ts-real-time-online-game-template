import { Versions } from './components/Versions';

export const App = () => {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');

  return (
    <div>
      <h1>Powered by electron-vite</h1>
      <div>Build an Electron app with React and TypeScript</div>
      <p>
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div>
        <div>
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div>
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>

      <Versions />

      {/* <webview src="http://localhost:4200" style={{ flexGrow: 1, width: '100%', height: '100%' }} /> */}
    </div>
  );
};
