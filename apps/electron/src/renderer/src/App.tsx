import { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { MAP_WIDTH } from '@repo/core-game';
import { Button } from '@repo/ui';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import { EventBus } from './game/EventBus';
import { Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables } from './graphql';
import { StartGameForm } from './components/StartGameForm';
import { Versions } from './components/Versions';

const GET_TOTAL_PLAYERS = gql`
  query Desktop_GetTotalPlayers {
    totalPlayers
  }
`;

export const App = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery<Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables>(
    GET_TOTAL_PLAYERS
  );

  console.log({ totalPlayers: data?.totalPlayers ?? 0 });

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

  const ipcHandle = () => {
    window.electron.ipcRenderer.send('ping');
  };

  return (
    <div
      className="flex flex-col justify-center items-center h-screen mx-auto"
      style={{ width: MAP_WIDTH }}
    >
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <StartGameForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={onSubmit} />

      <div className="flex flex-row w-full justify-between items-center pt-4 pb-2 px-2">
        <Button onClick={ipcHandle}>Send IPC</Button>
        <Versions />
      </div>
    </div>
  );
};
