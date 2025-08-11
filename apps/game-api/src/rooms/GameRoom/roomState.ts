import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import type { InputPayload } from '@repo/core-game';

export class Player extends Schema {
  @type('string') userId: string;
  @type('number') tokenExpiresAt: number;
  @type('string') username: string;
  @type('number') x: number;
  @type('number') y: number;
  @type('boolean') isFacingRight: boolean = true;
  @type('boolean') isAttacking: boolean = false;
  @type('number') attackCount: number = 0;
  @type('number') lastAttackTime: number = 0;
  @type('number') killCount: number = 0;
  inputQueue: Array<InputPayload> = [];
  /** Latest input sequence processed by the server for this player */
  @type('number') lastProcessedInputSeq: number = 0;
  /** This is used for networking checks */
  @type('number') lastActivityTime: number = Date.now();
  /** This is stored for debugging purposes */
  @type('number') attackDamageFrameX: number;
  /** This is stored for debugging purposes */
  @type('number') attackDamageFrameY: number;
}

export class Enemy extends Schema {
  @type('string') id: string;
  @type('number') x: number;
  @type('number') y: number;
}

export class GameRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ array: Enemy }) enemies = new ArraySchema<Enemy>();
}
