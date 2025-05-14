import { ContextFunction } from '@apollo/server';
import { BooksDataSource } from './data-source/Books';

export interface Context {
  dataSources: {
    booksDb: BooksDataSource;
  };
}

export const createContext: ContextFunction<[], Context> = async () => {
  return {
    dataSources: {
      booksDb: new BooksDataSource(),
    },
  };
};
