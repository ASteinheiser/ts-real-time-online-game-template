import { defineConfig } from 'eslint/config';

import { ALL_JS_FILES } from '@repo/eslint-config';
import webConfig from '@repo/eslint-config/web';

export default defineConfig([
  {
    files: [ALL_JS_FILES],
    extends: [webConfig],
  },
]);
