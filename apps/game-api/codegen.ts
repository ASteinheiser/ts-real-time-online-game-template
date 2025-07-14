import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/graphql/schema.graphql',
  // documents are only used here to generate test graphql types
  documents: ['test/integration/**/*.ts'],
  emitLegacyCommonJSImports: false,
  generates: {
    './src/graphql/generated-types.ts': {
      config: {
        useIndexSignature: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    // these graphql types are only created by and used in tests
    './test/graphql/generated-types/': {
      preset: 'client',
    },
  },
};

export default config;
