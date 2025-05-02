import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@repo/ui';
import { StartGameForm } from './forms/StartGameForm';
import './theme.css';

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <StartGameForm isOpen={isOpen} onOpenChange={setIsOpen} onSubmit={console.log} />

      <div>
        <a
          href="https://github.com/ASteinheiser/ts-real-time-online-game-template"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/logo.svg"
            className="logo"
            alt="App logo"
            style={{ width: '120px', height: 'auto', padding: '20px', marginLeft: '20px' }}
          />
        </a>
        <div className="card">
          <Button onClick={() => setIsOpen(true)}>Open that form!</Button>
        </div>
      </div>
    </>
  );
};

createRoot(document.getElementById('app')!).render(<App />);
