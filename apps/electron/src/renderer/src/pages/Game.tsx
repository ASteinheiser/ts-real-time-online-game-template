import { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../game/scenes/MainMenu';
import { EventBus } from '../game/EventBus';
import { Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables } from '../graphql';
import { StartGameForm } from '../components/StartGameForm';

const GET_TOTAL_PLAYERS = gql`
  query Desktop_GetTotalPlayers {
    totalPlayers
  }
`;

export const Game = () => {
  const { session, profile } = useSession();
  console.log({ session, profile });

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

  // this is how to send IPC messages to the main process
  // const ipcHandle = () => {
  //   window.electron.ipcRenderer.send('ping');
  // };

  return (
    <>
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <StartGameForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={onSubmit} />
    </>
  );
};
