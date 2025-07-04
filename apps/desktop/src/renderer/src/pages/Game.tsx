import { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { useSearchParamFlag } from '@repo/ui/hooks';
import { PhaserGame, type IRefPhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../game/scenes/MainMenu';
import { EventBus } from '../game/EventBus';
import type { Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables } from '../graphql';
import { ProfileModal } from '../modals/ProfileModal';
import { OptionsModal } from '../modals/OptionsModal';
import { SEARCH_PARAMS } from '../router/constants';

const GET_TOTAL_PLAYERS = gql`
  query Desktop_GetTotalPlayers {
    totalPlayers
  }
`;

export const Game = () => {
  const { profile } = useSession();

  const phaserRef = useRef<IRefPhaserGame | null>(null);

  const { data } = useQuery<Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables>(
    GET_TOTAL_PLAYERS
  );
  console.log({ totalPlayers: data?.totalPlayers ?? 0 });

  const [isProfileModalOpen, setIsProfileModalOpen] = useSearchParamFlag(SEARCH_PARAMS.PROFILE);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useSearchParamFlag(SEARCH_PARAMS.OPTIONS);

  const shouldDisablePhaserInput = isProfileModalOpen || isOptionsModalOpen;

  const setPhaserInputEnabled = (enabled: boolean) => {
    if (phaserRef?.current?.scene?.input) {
      phaserRef.current.scene.input.enabled = enabled;
    }
  };

  useEffect(() => {
    setPhaserInputEnabled(!shouldDisablePhaserInput);
  }, [shouldDisablePhaserInput]);

  const onCurrentSceneChange = (scene: Phaser.Scene) => {
    // ensure that new scenes have the correct "input enabled" setting
    // for example, handles the case where the scene changes with a modal open
    setPhaserInputEnabled(!shouldDisablePhaserInput);

    console.log(scene);
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

  return (
    <>
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <OptionsModal isOpen={isOptionsModalOpen} onOpenChange={setIsOptionsModalOpen} />
      <ProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </>
  );
};
