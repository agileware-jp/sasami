# Environment

node: v22.14.0 <br/>
npm: v10.9.2

# Setup
## Database
```sh
$ docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sasami-dev -p 5432:5432 -d postgres
```

```sh
$ docker exec -it postgres bash
$ psql -U postgres -d sasami-dev

\dt;
```

`.env`

```sh
DATABASE_URL="postgresql://postgres:password@localhost:5432/sasami-dev?schema=public"
```

## パッケージインストール
```shell
npm install
```
