import assert from 'assert';
import { gql } from 'graphql-tag';
import { server } from '../../src/graphql';
import { ProfilesRepository } from '../../src/repo/Profiles';
import type { RESULTS } from '../../src/rooms/MyRoom';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import type { User } from '../../src/auth/jwt';
import { parseGQLData, createTestPrismaClient, setupTestDb, cleanupTestDb, TEST_USERS } from './utils';
import { Test_GetTotalPlayersQuery, Test_GetTotalPlayersQueryVariables } from '../graphql';

describe('GQLServer', () => {
  let prisma: ReturnType<typeof createTestPrismaClient>;

  before(async () => {
    prisma = createTestPrismaClient();
    await cleanupTestDb(prisma);
    await setupTestDb(prisma);
  });

  after(async () => {
    await cleanupTestDb(prisma);
    await prisma.$disconnect();
  });

  const makeDefaultContext = () => ({
    contextValue: {
      dataSources: {
        profilesDb: new ProfilesRepository(prisma),
        gameResults: null as typeof RESULTS,
      },
      authClient: null as GoTrueAdminApi,
      user: null as User,
    },
  });

  it('should fetch total players', async () => {
    const result = await server.executeOperation<
      Test_GetTotalPlayersQuery,
      Test_GetTotalPlayersQueryVariables
    >(
      {
        query: gql`
          query Test_GetTotalPlayers {
            totalPlayers
          }
        `,
      },
      makeDefaultContext()
    );

    const { totalPlayers } = parseGQLData(result);

    // add +1 for the keep alive user
    assert.deepEqual(totalPlayers, TEST_USERS.length + 1);
  });
});
