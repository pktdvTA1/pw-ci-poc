# installation & getting start

```
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

## API

```
// normal external API requests (postmanEcho, jsonplaceholder)
$ npm run pw:api

// POC of setup/teardown database using Prisma which require the actual db(postgres) atleast in docker
// this will execute the truncate and insert at setup level
$ npm run pw:tdb
```

## Running simple API

```
// port is 3000 by default
// Also require database connection as well
$ npm run dev

```

## UI ([basic](https://todomvc.com/examples/react/dist/), [login](https://www.saucedemo.com/))

The Login with POMs + Setup and StorageState.

The Setup (as a dependencies) are in `./tests/setup/login.setup.ts`. Assumed that we're using only 1 signle account, This setup will run as global setup for Saucelab project using valid account, After it's successfully login it will then create the session storage file in `tests/.auth/loginSetup.json` this will be used as sharing state for each and every suites under the same project to avoid login.

- The basicLogin has has cookie and origins set as empty to avoid auth,

- The inventory spec file has bypassed the login via setup

```
$ npm run pw:sd

```

# [eslint](https://www.npmjs.com/package/eslint-plugin-playwright)

```

$ npm run eslint:fix

```

# Prisma `./databases/prisma`

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
- Setup & Global setup
- Setup simple API

  - ~~Connect with DB~~

    - ~~Prisma~~
      - ~~docker-compose.yaml~~
      - ~~Migration~~

  - Stub
  - nock

- UI

  - ~~Basic end to end with POMS~~
  - ~~Basic end to end with auth~~

- Husky
  - ~~precommit > prepush~~
