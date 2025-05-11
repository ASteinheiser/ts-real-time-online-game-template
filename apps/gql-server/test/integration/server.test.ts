import assert from 'assert';
import { server } from '../../src/server';

describe('server', () => {
  it('should be defined', () => {
    assert.ok(server);
  });
});
