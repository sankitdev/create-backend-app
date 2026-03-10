# Dependencies and Versions

## How versions are chosen

The scaffolded project’s `package.json` uses **caret ranges** (e.g. `^5.1.0`) for dependencies. That means:

- **Minimum version** is the one we tested with when we released the scaffolder.
- **Maximum version** is the next major (e.g. `^5.1.0` allows any `5.x.x` but not `6.0.0`).

So the template is not “pinned” to a single version; it stays within a major version band that we consider compatible.

## Staying up to date

After scaffolding, the lockfile (`package-lock.json` or equivalent) will record the exact versions installed at that time. To get newer minor/patch releases within the same major:

```bash
npm update
# or
yarn upgrade
# or
pnpm update
```

To move to the latest **major** versions (e.g. Express 6 when it exists), upgrade packages explicitly and fix any breaking changes:

```bash
npm install express@latest mongoose@latest
```

Then run your tests and fix any type or runtime breaks.

## Why the scaffold can feel “behind”

- The **scaffolder’s template** is updated when we release a new version of `@sankitdev/create-backend-app`. Until then, the template keeps the dependency ranges we last validated.
- **Your project** gets whatever versions `npm install` resolves at scaffold time (within those ranges). After that, only you run `npm update` or upgrade packages.

So it’s normal for a project created months ago to have older resolved versions until you run `npm update` or upgrade specific packages.

## Recommendation

1. After scaffolding: run `npm install` (or your package manager).
2. Optionally run `npm update` to get the latest compatible minor/patch versions.
3. For new projects, use the latest `npx @sankitdev/create-backend-app` so the template (and its ranges) are as current as the published package.
