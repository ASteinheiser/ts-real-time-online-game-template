import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import { EventBus } from './game/EventBus';
import { StartGameForm } from './forms/StartGameForm';

export const App = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    EventBus.on('menu-open__game-start', () => {
      setIsModalOpen(true);
    });

    return () => {
      EventBus.off('menu-open__game-start');
    };
  }, []);

  const onSubmit = ({ username }: { username: string }) => {
    const scene = phaserRef?.current?.scene as MainMenu;
    scene?.changeScene(username);

    setIsModalOpen(false);
  };

  const onCurrentSceneChange = (scene: Phaser.Scene) => {
    console.log(scene);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <StartGameForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={onSubmit} />
    </div>
  );
};
