import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../apps/game-api/src/graphql/schema.graphql',
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/generated-types/': {
      preset: 'client',
    },
  },
};

export default config;
