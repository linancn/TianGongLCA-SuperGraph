# TianGongLCA Super Graph


### Configure mirror
```bash
yarn config set registry https://registry.npm.taobao.org
yarn config set disturl https://npm.taobao.org/dist
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/
```
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
```bash
https://studio.apollographql.com/sandbox/explorer
```

### Debug Endpoint:
```bash
http://localhost:3000/graphql
```

### Voyager Endpoint:
```
http://localhost:3000/voyager
```

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

### Pull schema.prisma from Database
```bash
npx prisma db pull
```

### Generate prisma_client from schema.prisma
```bash
npx prisma generate
```

### Run docker db 
```bash
docker run -d -p 55435:5432 -l lca --restart=always -e PGDATA=/postgres/data linancn/postgres_55435:220612
```
