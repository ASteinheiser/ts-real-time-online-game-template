import assert from 'assert';
import { server } from '../../src/graphql';
import { BooksRepository } from '../../src/repo/Books';
import { UsersRepository } from '../../src/repo/Users';
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
    const usersDb = new UsersRepository({} as PrismaClient);

    const result = await server.executeOperation(
      {
        query: GET_BOOKS,
      },
      {
        contextValue: {
          dataSources: {
            booksDb,
            usersDb,
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
