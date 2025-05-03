import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('string') username?: string;
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('boolean') isFacingRight: boolean = true;
  @type('boolean') isAttacking: boolean = false;
  @type('number') attackCount: number = 0;
  @type('number') lastAttackTime: number = 0;
  @type('number') killCount: number = 0;
  inputQueue: Array<InputPayload> = [];
  // this is for debugging purposes
  @type('number') attackDamageFrameX?: number;
  @type('number') attackDamageFrameY?: number;
}

export interface InputPayload {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
}

export class Enemy extends Schema {
  @type('string') id?: string;
  @type('number') x: number = 0;
  @type('number') y: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ array: Enemy }) enemies = new ArraySchema<Enemy>();
}
