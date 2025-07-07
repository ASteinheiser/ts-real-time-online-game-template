import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { StartGame } from './main';
import { EventBus, EVENT_BUS } from './EventBus';
import { GAME_CONTAINER_ID } from './constants';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame(
  { currentActiveScene },
  ref
) {
  const game = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame(GAME_CONTAINER_ID);

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on(EVENT_BUS.CURRENT_SCENE_READY, (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === 'function') {
        currentActiveScene(scene_instance);
      }

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    });

    return () => {
      EventBus.removeListener(EVENT_BUS.CURRENT_SCENE_READY);
    };
  }, [currentActiveScene, ref]);

  return <div id={GAME_CONTAINER_ID}></div>;
});
