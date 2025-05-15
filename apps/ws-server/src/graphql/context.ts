import { ContextFunction } from '@apollo/server';
import { BooksRepository } from '../repo/Books';

export interface Context {
  dataSources: {
    booksDb: BooksRepository;
  };
}

export const createContext: ContextFunction<[], Context> = async () => {
  return {
    dataSources: {
      booksDb: new BooksRepository(),
    },
  };
};
