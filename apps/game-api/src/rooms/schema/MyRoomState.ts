import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import type { InputPayload } from '@repo/core-game';

export class Player extends Schema {
  @type('string') userId: string;
  @type('number') tokenExpiresIn: number;
  @type('string') username: string;
  @type('number') x: number;
  @type('number') y: number;
  @type('boolean') isFacingRight: boolean = true;
  @type('boolean') isAttacking: boolean = false;
  @type('number') attackCount: number = 0;
  @type('number') lastAttackTime: number = 0;
  @type('number') killCount: number = 0;
  inputQueue: Array<InputPayload> = [];
  // this is for debugging purposes
  @type('number') attackDamageFrameX: number;
  @type('number') attackDamageFrameY: number;
}

export class Enemy extends Schema {
  @type('string') id: string;
  @type('number') x: number;
  @type('number') y: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ array: Enemy }) enemies = new ArraySchema<Enemy>();
}
