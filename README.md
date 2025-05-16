# Real-time Online Game Template (TypeScript)

A _highly opinionated_ template for creating real-time, online games using [TypeScript](https://www.typescriptlang.org/)! Quickly create mmo-style games using [React](https://react.dev/) + [Phaser](https://phaser.io/) for rendering, [Colyseus](https://colyseus.io/) for websockets, [Electron](https://www.electronjs.org/) for native builds, and [SST](https://sst.dev/) ([IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code)) for deployment! Also has support for [Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA). Oh, and lots and lots of [Vite](https://vite.dev/) for builds and testing!

## Developer Quickstart

If you are familiar with Node.js and `pnpm`, you can skip to [Useful Commands](#useful-commands) or quickly start development with:
```bash
pnpm i
pnpm dev
```

When you run `dev`, you should see:
- Native desktop window pop up with the game inside it
- Web game at http://localhost:4200
- Colyseus playground at http://localhost:4204
- Colyseus monitor tool at http://localhost:4204/monitor
- Apollo GraphQL playground at http://localhost:4208

#### Otherwise, you should:

First <ins>ensure</ins> you are using the <ins>correct version</ins> of <ins>Node.js</ins>. You can validate this by comparing your local version of node (`node -v`) with the `.nvmrc`.

NOTE: The `.nvmrc` uses an alias for the node version. I highly recommend managing your local node version with [`nvm`](https://github.com/nvm-sh/nvm). This will allow you to quickly swap to the correct version with: `nvm use`.

This project uses [`pnpm`](https://pnpm.io/) for it's dependency mangement. You can install it with `npm`:
```
npm i -g pnpm
```

This project also uses [Turborepo](https://turborepo.com/) to manage scripts across the monorepo. While this is NOT necessary, [it is recommended](https://turborepo.com/docs/getting-started/installation#installing-turbo) that you install a local version:
```
npm i -g turbo
```

With the `turbo` cli, you can take a look at the project structure as well as the available commands:
```
turbo ls
turbo run
```

## Useful Commands

These commands are available from the root directory whether you decide to install the `turbo` cli locally or not...

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run local development servers for each app |
| `pnpm ci:all-checks` | Runs the linter, typecheck and tests for each repo |
| `pnpm test:watch` | Runs the test suites in each repo and watches for changes |
| `pnpm test:load` | Builds and runs the `game-server` then starts the load test |
| `pnpm preview` | Builds each app and runs a local server using the output |
| `pnpm build:[win\|mac\|linux]` | Builds the desktop app (via Electron) |

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Installs dependencies for each repo |
| `pnpm ci:all-checks` | Runs the linter, typecheck and tests for each repo |
| `pnpm lint` | Runs the code linting check in each repo |
| `pnpm lint:fix` | Runs the linter and fixes code when possible |
| `pnpm test` | Runs the test suites in each repo and returns the result |
| `pnpm test:watch` | Runs the test suites in each repo and watches for changes |
| `pnpm test:load` | Builds and runs the `game-server` then starts the load test |
| `pnpm check-types` | Runs the typescript check in each repo |
| `pnpm generate:gql-types` | Generates the GraphQL types in each repo |
| `pnpm generate:gql-types:watch` | Generates the GraphQL types and watches each repo  |
| `pnpm dev` | Run local development servers for each app |
| `pnpm generate:app-icons` | Generates PWA/Electron icons from `apps/web/public/logo.svg` |
| `pnpm generate:pwa-assets` | Generates PWA assets from `apps/web/public/logo.svg` |
| `pnpm build` | Generates icons and builds each app including sub-repos |
| `pnpm preview` | Builds each app and runs a local server using the output |
| `pnpm build:win` | Builds the desktop app (via Electron) for Windows |
| `pnpm build:mac` | Builds the desktop app (via Electron) for MacOS |
| `pnpm build:linux` | Builds the desktop app (via Electron) for Linux |

## Hosting setup

The goal is to provide Infrastructure as Code (IaC) for hosting a scalable, cheap setup:

<img src="./infra/system-design.png" width="800px" height="auto">
