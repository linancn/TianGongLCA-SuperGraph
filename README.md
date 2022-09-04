# TianGongLCA Super Graph


### Start project

```bash
yarn start
```

### Build project

```bash
yarn build
```

### Check code style

```bash
yarn lint
```

You can also use script to auto fix some lint error:

```bash
yarn lint:fix
```

### Test code

```bash
yarn test
```

### GraphQL Tesing
https://studio.apollographql.com/sandbox/explorer


### Debug Endpoint:
http://localhost:3000/graphql


### Voyager Endpoint:
http://localhost:3000/voyager

### Checking Endpoint
```bash
npx diagnose-endpoint --endpoint=http://localhost:3000/graphql
```

### Checking duplicate graphql version
```bash
yarn list --pattern graphql
```

### Checking duplicate graphql version
```bash
npx apollo client:download-schema src/apollo/ecoinvent.gql --endpoint http://39.107.231.23:8080/v1/graphql --header "X-Hasura-Admin-Secret: myadminsecretkey"
```

### Pull shcema.prisma from Database
```bash
npx prisma db pull
```

### Generate prisma_client from shcema.prisma
```bash
npx prisma generate
```

### Run docker db 
```bash
docker run -d -p 55435:5432 -l lca --restart=always -e PGDATA=/postgres/data linancn/postgres_55435:220612
```
