//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // shadcn/ui が生成するコンポーネントは手を入れず原文のまま置いておきたいので
    // lint 対象から外す（`shadcn add` で再取得しても差分が出ないようにするため）
    ignores: [
      "eslint.config.js",
      "prettier.config.js",
      "src/components/ui/**",
      "src/lib/utils.ts",
    ],
  },
];
