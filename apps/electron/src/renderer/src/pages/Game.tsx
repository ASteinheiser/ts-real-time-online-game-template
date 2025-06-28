import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../game/scenes/MainMenu';
import { EventBus } from '../game/EventBus';
import { Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables } from '../graphql';
import { ProfileModal } from '../components/ProfileModal';
import { OptionsModal } from '../components/OptionsModal';

const GET_TOTAL_PLAYERS = gql`
  query Desktop_GetTotalPlayers {
    totalPlayers
  }
`;

export const Game = () => {
  const { profile } = useSession();

  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const { data } = useQuery<Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables>(
    GET_TOTAL_PLAYERS
  );
  console.log({ totalPlayers: data?.totalPlayers ?? 0 });

  const [searchParams, setSearchParams] = useSearchParams();
  const isProfileModalOpen = searchParams.get('editProfile') === 'true';

  const setIsProfileModalOpen = (open: boolean) => {
    setSearchParams({ editProfile: open ? 'true' : 'false' });
  };

  useEffect(() => {
    EventBus.on('menu-open__game-start', () => {
      const scene = phaserRef?.current?.scene as MainMenu;
      scene?.changeScene(profile?.userName);
    });

    EventBus.on('menu-open__profile', () => setIsProfileModalOpen(true));
    EventBus.on('menu-open__options', () => setIsOptionsModalOpen(true));

    return () => {
      EventBus.off('menu-open__game-start');
      EventBus.off('menu-open__profile');
      EventBus.off('menu-open__options');
    };
  }, []);

  const onCurrentSceneChange = (scene: Phaser.Scene) => {
    console.log(scene);
  };

  return (
    <>
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <OptionsModal isOpen={isOptionsModalOpen} onOpenChange={setIsOptionsModalOpen} />
      <ProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </>
  );
};
