import { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { useSearchParamFlag } from '@repo/ui/hooks';
import { toast } from '@repo/ui';
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
  const { session } = useSession();

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
      if (!session?.access_token) return;
      const scene = phaserRef?.current?.scene as MainMenu;

      scene?.startGame?.(session.access_token);
    });

    return () => {
      EventBus.off('menu-open__game-start');
    };
  }, [session]);

  useEffect(() => {
    EventBus.on('menu-open__profile', () => setIsProfileModalOpen(true));
    EventBus.on('menu-open__options', () => setIsOptionsModalOpen(true));
    EventBus.on('join-error', (error) => toast.error(error.message));

    return () => {
      EventBus.off('menu-open__profile');
      EventBus.off('menu-open__options');
      EventBus.off('join-error');
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
