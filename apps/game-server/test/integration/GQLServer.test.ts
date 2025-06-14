import assert from 'assert';
import type { GoTrueAdminApi } from '@supabase/supabase-js';
import { server } from '../../src/graphql';
import { BooksRepository } from '../../src/repo/Books';
import { ProfilesRepository } from '../../src/repo/Profiles';
import type { PrismaClient } from '../../src/prisma-client';

describe('GQLServer', () => {
  it('should be defined', () => {
    assert.ok(server);
  });

  it('fetches books', async () => {
    const GET_BOOKS = `
      query GetBooks {
        books {
          title
          author
        }
      }
    `;

    const authClient = {} as GoTrueAdminApi;
    const booksDb = new BooksRepository();
    booksDb.getBooks = async () => [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
      },
    ];
    const profilesDb = new ProfilesRepository({} as PrismaClient);

    const result = await server.executeOperation(
      {
        query: GET_BOOKS,
      },
      {
        contextValue: {
          dataSources: {
            booksDb,
            profilesDb,
          },
          authClient,
          user: {
            id: 'abc',
            email: 'test@test.com',
          },
        },
      }
    );

    const data =
      result.body.kind === 'single'
        ? result.body.singleResult?.data?.books
        : result.body.initialResult.data?.books;

    assert.deepEqual(data, [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    ]);
  });
});
