# V 1.0

# Structure

```
.
├── databases // databases related
│   └── prisma
│       ├── migrations
│       │   └── // Pay no heed, there aremigrations file generated from Prisma's command
│       ├── seeders
│       │   │   // Data to seed into table the name of file is the model (table) itself.
│       │   ├── index.ts
│       │   └── *.ts
│       │   // type mapper between model (tableName) and columns.
│       ├── dataMapper.type.ts
│       │   // common functions for manageing dblike truncate, insert
│       ├── dbService.ts
│       │   // The prisma's model schema. (very important)
│       └── schema.prisma
├── playwright-report
│   └── // Test result, may contains subdirectory of reports, results
├── src
│   │   // Local development
│   ├── configs
│   │   │   // config (read or declare defualt value for environment variables.)
│   │   └── env.ts
│   ├── enums
│   │   └── // enum values
│   │    ...
│   │    ...
│   ├── index.ts
│   └── app.ts
├── tests
│   ├── e2e
│   │   └── // UI tests. (*.spec.ts)
│   ├── fixtures
│   │   └── // fixture files.
│   ├── helpers
│   │   └── // some helper functions
│   ├── integration
│   │   └── // API testing file (*.spec.ts)
│   ├── poms
│   │   └── // POMS file, if it's end with *.page.ts meaning it's for UI otherwise API
│   ├── setup
│   │   └── // Setup file (global set) (*.setup.ts)
│   └── tsconfig.json
├── docker-compose.yaml // for simple postgres db
├── eslint.config.js
├── package-lock.json
├── package.json
├── playwright.config.ts
├── readme.md
└── tsconfig.json
```

There are only 2 things that we're trying to do with playwright (Plus static static code analyzer for better life.)

1. API Testing (`./tests/integration/*.spec.ts`)

   2.1 Simple REST API.

   2.2 Local Server, DB Management.

   2.3 Test Double (stub).

2. UI Testing (`./tests/e2e/**/*.spec.ts`)

   2.1 Handle simple actions.

   2.2 Handle Authentications (Bypassing).

So most of source we're testing against are our made up localAPI (fastify) + DB(Postgres + Prisma) and free 3rd party <3. ([TodoMVC](https://todomvc.com/examples/react/dist/), [saucedemo](https://www.saucedemo.com/), [PostmanEcho](https://learning.postman.com/docs/developer/echo-api/), [jsonPlaceholder](https://jsonplaceholder.typicode.com/)).

The pattern are mixd of the most basic of all in 1 script, POM, Fixtures, Setup. Should you find trouble what to use or configuration. We'd suggest you to look into `./playwright.config.ts` for projects and thier dependencies.

# installation & getting start

```
// vscode extension is a strongly recommend.

$ npm i
// DB, for postgres with port 5432
$ docker-compose up -d
// Prisma
// Migrate db
$ npm run prisma:migration
// Generate type safty
$ npm run prisma:gen

```

# Running

## API Automation Scripts

```
// normal external API requests (postmanEcho, jsonplaceholder).
// only request internet connection
$ npm run pw:api

// POC of setup/teardown database using Prisma which require the actual db(postgres) atleast in docker
// this will execute the truncate and insert at setup level
$ npm run pw:tdb
```

## Running with simple local API

```
// port is 3000 by default
// Also require database connection as well
$ npm run dev

// The POC of connecting to 3rd party (jsonPlaceholder)
// a local API doing simple logic file

$ npm run pw:tdb
// This will setup db as global set and then execute 3 scripts
// 004-api-db.spec.ts           > simple quering DB
// 005-api-local-db.spec.ts     > this run against local server
// 006-api-3rdparty-db-spec.ts  > this will use local DB and try to get stuff from 3rdParty

```

## Sinon stub

The main purpose of this is to test our integration logic without any care for 3rd party, dependencies or even internet connection. This also run in CI as well.

```
// be careful of Port.
$ npm run pw:stub
```

## UI ([basic](https://todomvc.com/examples/react/dist/), [login](https://www.saucedemo.com/))

The Login with POMs + Setup and StorageState.

The Setup (as a dependencies) are in `./tests/setup/login.setup.ts`. Assumed that we're using only 1 signle account, This setup will run as global setup for Saucelab project using valid account, After it's successfully login it will then create the session storage file in `tests/.auth/loginSetup.json` this will be used as sharing state for each and every suites under the same project to avoid login.

- The basicLogin has has cookie and origins set as empty to avoid auth,

- The inventory spec file has bypassed the login via setup

```
$ npm run pw:sd
```

## [eslint](https://www.npmjs.com/package/eslint-plugin-playwright)

```
$ npm run eslint:fix
```

## Prisma `./databases/prisma`

- When the schema (schema.prisma) is updated (migration)

```

$ npm run prisma:migration

```

- Also generate types

```

$ npm run prisma:gen

```

- Lastely if ModelName or new Model is added, Be sure to add key-pair value for (Prisma.ModelName: <Model>CreateManyInput), this is for Insert function type safefy.

# Todo

- ~~Eslint~~
- ~~Fixture~~
- ~~Setup & Global setup~~
- ~~Setup simple API~~

  - ~~Connect with DB~~

    - ~~Prisma~~
      - ~~docker-compose.yaml~~
      - ~~Migration~~

  - ~~Stub~~
  - nock

- UI

  - ~~Basic end to end with POMS~~
  - ~~Basic end to end with auth~~

- Husky

  - ~~precommit > prepush~~

- ~~better docs~~
