import { Book } from '../graphql/generated-types';

export class BooksDataSource {
  constructor() {
    // pass and set db connections here
  }

  async getBooks(): Promise<Book[]> {
    return [
      {
        title: 'The Awakening',
        author: 'Kate Chopin',
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster',
      },
    ];
  }
}
