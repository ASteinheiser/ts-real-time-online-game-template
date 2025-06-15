import assert from 'assert';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { server } from '../../src/graphql';
import { ProfilesRepository } from '../../src/repo/Profiles';
import type { PrismaClient } from '../../src/prisma-client';
import { parseGQLData } from './utils';

describe('GQLServer', () => {
  it('should be defined', () => {
    assert.ok(server);
  });

  it('fetches total players', async () => {
    const GET_TOTAL_PLAYERS = `
      query GetTotalPlayers {
        totalPlayers
      }
    `;

    const profilesDb = new ProfilesRepository({} as PrismaClient);
    const TOTAL_PLAYERS = 5;
    profilesDb.getTotalPlayers = async () => TOTAL_PLAYERS;

    const authClient = {} as GoTrueAdminApi;
    const user = {
      id: 'abc',
      email: 'test@test.com',
    };

    const result = await server.executeOperation<{ totalPlayers: number }>(
      { query: GET_TOTAL_PLAYERS },
      {
        contextValue: {
          dataSources: { profilesDb },
          authClient,
          user,
        },
      }
    );

    const { totalPlayers } = parseGQLData(result);

    assert.deepEqual(totalPlayers, TOTAL_PLAYERS);
  });
});
