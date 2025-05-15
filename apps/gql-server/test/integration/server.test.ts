import assert from 'assert';
import { ApolloServer } from '@apollo/server';
import { server, typeDefs } from '../../src/server';
import { Context } from '../../src/context';
import { resolvers } from '../../src/graphql/resolvers';
import { BooksDataSource } from '../../src/data-source/Books';

describe('server', () => {
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

    const server = new ApolloServer<Context>({
      typeDefs,
      resolvers,
    });

    const booksDb = new BooksDataSource();
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

    const result = await server.executeOperation(
      {
        query: GET_BOOKS,
      },
      {
        contextValue: {
          dataSources: {
            booksDb,
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
