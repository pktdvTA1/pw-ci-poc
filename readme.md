# installation

```
$ npm i
// for postgress with port 5432
$ docker-compose up -d

```

# Running

```
// normal API req (postmanEcho, jsonplaceholder)
$ npm run pw:api

// with DB using Prisma which require the actual db(postgres) atleast in docker
// this will execute the truncate and insert at setup level
$ npm run pw:tdb


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

# Todo

- ~~Eslint~~
- ~~Fixture~~
- Setup & Global setup
- Setup simple API

  - Connect with actual db

    - Prisma
      - ~~docker-compose.yaml~~
      - ~~Migration~~

  - Stub
  - nock
