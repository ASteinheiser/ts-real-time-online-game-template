import { useEffect, useRef } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from '@repo/client-auth/provider';
import { useSearchParamFlag } from '@repo/ui/hooks';
import { toast } from '@repo/ui';
import { PhaserGame, type IRefPhaserGame } from '../game/PhaserGame';
import type { MainMenu } from '../game/scenes/MainMenu';
import type { Game as GameScene } from '../game/scenes/Game';
import { EventBus, EVENT_BUS } from '../game/EventBus';
import type { Desktop_GetTotalPlayersQuery, Desktop_GetTotalPlayersQueryVariables } from '../graphql';
import { ProfileModal } from '../modals/ProfileModal';
import { SettingsModal } from '../modals/SettingsModal';
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useSearchParamFlag(SEARCH_PARAMS.SETTINGS);

  const shouldDisablePhaserInput = isProfileModalOpen || isSettingsModalOpen;

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

  // NOTE: the server will kick any clients with an expired token, however
  // supabase will automatically refresh the token before it expires (every hour)
  useEffect(() => {
    if (!session?.access_token) return;

    const scene = phaserRef?.current?.scene as GameScene;
    scene?.refreshToken?.({ token: session.access_token });
  }, [session]);

  useEffect(() => {
    EventBus.on(EVENT_BUS.GAME_START, () => {
      if (!session?.access_token) return;
      const scene = phaserRef?.current?.scene as MainMenu;

      scene?.startGame?.({ token: session.access_token });
    });

    return () => {
      EventBus.off(EVENT_BUS.GAME_START);
    };
  }, [session]);

  useEffect(() => {
    EventBus.on(EVENT_BUS.PROFILE_OPEN, () => setIsProfileModalOpen(true));
    EventBus.on(EVENT_BUS.SETTINGS_OPEN, () => setIsSettingsModalOpen(true));
    EventBus.on(EVENT_BUS.JOIN_ERROR, (error) => toast.error(error.message));
    EventBus.on(EVENT_BUS.RECONNECTION_ATTEMPT, (attempt) => toast.info(`Reconnecting... (${attempt})`));

    return () => {
      EventBus.off(EVENT_BUS.PROFILE_OPEN);
      EventBus.off(EVENT_BUS.SETTINGS_OPEN);
      EventBus.off(EVENT_BUS.JOIN_ERROR);
      EventBus.off(EVENT_BUS.RECONNECTION_ATTEMPT);
    };
  }, []);

  return (
    <>
      <PhaserGame ref={phaserRef} currentActiveScene={onCurrentSceneChange} />

      <SettingsModal isOpen={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />
      <ProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </>
  );
};
