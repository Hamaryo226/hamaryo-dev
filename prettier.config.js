//  @ts-check

/**
 * 旧 ryota-space（Next.js 版）のコードスタイルに合わせている。
 * ページコンポーネントの大半をそのまま移植しているため、
 * scaffold 既定の semi:false / singleQuote:true ではなく元の書式を採用する。
 *
 * @type {import('prettier').Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
};

export default config;
