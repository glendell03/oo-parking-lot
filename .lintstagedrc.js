const path = require("path");

const biomeCheck = (filenames) =>
  `pnpm dlx biome check --apply --organize-imports-enabled=true --verbose --colors=force ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`;

module.exports = {
  "*.{ts,tsx,js,jsx}": [biomeCheck],

  "**/*.{css,scss,md,html,json}": [biomeCheck],
};
