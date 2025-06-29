# Real-time Online Game Template (TypeScript)

A _highly opinionated_ template for creating real-time, online games using [TypeScript](https://www.typescriptlang.org/)! Quickly create mmo-style games using [React](https://react.dev/) + [Phaser](https://phaser.io/) for rendering, [Colyseus](https://colyseus.io/) for websockets, [Electron](https://www.electronjs.org/) for native builds, and [SST](https://sst.dev/) ([IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code)) for deployment! Also has support for [Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) (PWA). Oh, and lots and lots of [Vite](https://vite.dev/) for builds and testing!

#### Comes with 3 apps:

- `desktop`: Frontend rendering for the game written in TypeScript using Electron, React, Phaser, Colyseus and GraphQL. When built, compiles an executable that runs a version of Chromium to render the game.
- `game-api`: Backend server that handles the game state and data via WebSockets and GraphQL. Written in TypeScript with Colyseus, Express and [Apollo GraphQL](https://www.apollographql.com/docs).
- `web`: Static webpage that can serve as a marketing site, devlog, roadmap, wiki etc. Written in Typescript with React and GraphQL. Could also be used to serve the Phaser/Colyseus game (with support for PWA).

#### And 5 packages:

- `core-game`: Main logic for the game. Shareable for use on the server as well as the client. Client-side prediction ([CSP](https://en.wikipedia.org/wiki/Client-side_prediction)) demo included.
- `client-auth`: Shared auth forms, hooks, etc. built with the local `ui` package. Used by both the static webpage and Electron app.
- `ui`: Shared Tailwindcss theme and Shadcn/ui components
- `typescript-config`: Shared TypeScript configs
- `eslint-config`: Shared ESlint configs

## Third-party Dependencies

This project relies on [Supabase](https://supabase.com/) for [JWT authentication](https://auth0.com/docs/secure/tokens/json-web-tokens). They offer a very generous free tier ([50k MAU](https://supabase.com/pricing)) and a straight-forward developer experience.

You'll need to create a free tier [project](https://supabase.com/dashboard/) and add the relevant keys to the environment. Keys can be found by navigating to your [Supabase project](https://supabase.com/dashboard/), then from the sidebar, "Project Settings"->"Data API". Here you should see a few important sections: "Project URL", "Project API Keys" and "JWT Settings". **Use these values to fill out the following:**
- `apps/electron/.env`
- `apps/game-server/.env`
- `apps/web/.env`

You can also quickly customize the auth emails using the templates under `packages/client-auth/email-templates` by navigating to:

`https://supabase.com/dashboard/project/<PROJECT_ID>/auth/templates`

## Developer Quickstart

If you are familiar with `pnpm` and `docker-compose`, you can skip to [Useful Commands](#useful-commands) or quickly start development with:
```bash
pnpm i
pnpm db:start
pnpm db:sync
pnpm dev
```

When you run `dev`, you should see:
- Native desktop window with the game connected to ws://localhost:4204
- Colyseus playground at http://localhost:4204
- Colyseus monitor tool at http://localhost:4204/monitor
- Apollo GraphQL playground at http://localhost:4204/graphql
- Web page at http://localhost:4200
- PostgreSQL DB at postgresql://guest:guest@localhost:5432/game_db

#### Otherwise, you should:

Install the `docker-compose` cli, which can be [installed via Docker Desktop](https://docs.docker.com/compose/install/). Make sure you have Docker Desktop running!

<b>Ensure</b> you are using the <ins>correct version</ins> of <ins>Node.js</ins>. You can validate this by comparing your local version of node (`node -v`) with the `.nvmrc`.

NOTE: The `.nvmrc` uses an alias for the node version. I highly recommend managing your local node version with [`nvm`](https://github.com/nvm-sh/nvm). This will allow you to quickly swap to the correct version with:
```
nvm use
```

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

## Most Used Commands

These commands are available from the root directory whether you decide to install the `turbo` cli locally or not...

<b>NOTE</b>: Commands should <ins>almost always</ins> be ran from the root directory. The package manager, `pnpm`, uses `turbo` to manage and run scripts. Since code can be shared between repos, `turbo` helps ensure that scripts run in a certain order when necessary.

| Command | Description |
|---------|-------------|
| `pnpm db:[start\|stop\|sync]` | Uses `docker-compose` and `prisma` to manage a local PostgreSQL DB |
| `pnpm dev` | Run local development servers for each app |
| `pnpm test` | Runs the typecheck, linter and tests for each repo |
| `pnpm test:watch` | Runs the test suite in each repo and watches for changes |
| `pnpm test:load` | Builds and runs the `game-server` then starts the load test |
| `pnpm preview` | Builds each app and runs a local server using the output |
| `pnpm build:[win\|mac\|linux]` | Builds the desktop app via Electron |

<b>NOTE</b>: If, for example, your Electron app is throwing an error when building, but was previously working, try:
```
pnpm install:clean
```

## Working with the PostgreSQL DB

If this is your first time running the project, you'll need to start the DB with `docker-compose` and sync the tables with `prisma`:
```
pnpm db:start
pnpm db:sync
```

`pnpm generate:db-types` will run during `dev`, `build`, etc., if you're using the monorepo commands.

However, if you change the DB schema via `apps/game-server/prisma/schema.prisma`, then you'll need to run:
```
pnpm db:sync
```

This will generate a SQL migration, migrate your local DB, and update your types.

<b>NOTE</b>: This project uses Turborepo's Terminal UI ([tui](https://turborepo.com/blog/turbo-2-0#new-terminal-ui)) and some tasks are interactive, such as `test:watch` and `db:sync`. When you want to interact with a window, press "i", then interact as normal. Press "ctrl" + "z" to leave interactive mode.

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Installs dependencies for each repo |
| `pnpm install:clean` | Runs a script to clear builds, caches, deps, etc., then runs install |
| `pnpm test` | Runs the typecheck, linter and tests for each repo |
| `pnpm test:watch` | Runs the test suite in each repo and watches for changes |
| `pnpm test:load` | Builds and runs the `game-server` then starts the load test |
| `pnpm lint` | Runs the code linting check in each repo |
| `pnpm lint:fix` | Runs the linter and fixes code when possible |
| `pnpm check-types` | Runs the typescript check in each repo |
| `pnpm generate:gql-types` | Generates the GraphQL types in each repo |
| `pnpm generate:gql-types:watch` | Generates the GraphQL types and watches each repo  |
| `pnpm generate:db-types` | Generates DB types via `prisma.schema` |
| `pnpm generate:db-types:watch` | Generates DB types via `prisma.schema` and watches for changes |
| `pnpm db:start` | Uses `docker-compose` to start a local PostgreSQL DB |
| `pnpm db:stop` | Uses `docker-compose` to stop the local PostgreSQL DB |
| `pnpm db:sync` | Uses `prisma` to manage the local DB based on the `schema.prisma` |
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
