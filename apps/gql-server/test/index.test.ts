import assert from 'assert';
import { app } from '../src/app';

describe('server', () => {
  it('should be defined', () => {
    assert.ok(app);
  });
});
