## Cotrax API

This BackEnd service was created with Golang. In short, this is a service for the Cotrax extension that has the function of running the database system logic behind the frontend.

## Implemented features

- Structured API
- Hierarchical Logging
- Database
- Schema Management

## How to RUN?

If you want to run this backend locally, you must first:

### 1. Please make sure to install [Golang](https://go.dev/doc/install)

### 2. Install [PostgreSQL](https://www.postgresql.org/) or you can use Cloud Databases Service PostgreSQL like [Supabase](https://supabase.com/). Then create a database, for example named CotraxAPI.

### 3. This is for database, we use migrate. so please install [Golang Migrate Tools](https://github.com/golang-migrate/migrate/releases)

### 4. Make sure Golang, PostgreSQL and Golang Migrate Tools can be called in the terminal.

If you have already completed the previous step, you can now perform several setups for this backend:

### 1. Create .env files in root folder

```sh
git clone https://github.com/Myriadn/Cotrax.git
cd Cotrax
```

### 2. Create .env files in root folder

```sh
PORT=

DB_DRIVER=
DB_URL=
```

### 3. Install dependency

```sh
go mod tidy
```

### 4. Run Database Migration

```sh
migrate -path db/migrations -database "$DB_URL" up
```

or

```sh
migrate -path db/migrations -database "postgres://[user]:[password]@[host]:[port]/[database_name]" up
```

### 5. You can run the BackEnd

```sh
go run ./cmd/server/main.go
```

## Friendly Reminder

- We actually use [Supabase PostgreSQL](https://supabase.com/) for Databases Cloud for this App. Some of you may want to use Supabase as well, or you can use a local one, but outside of PostgreSQL, you can configure it yourself.
- If you accidentally run this application directly, it will usually change the value to the default except for DB_URL. Also, make sure that DB_URL is not empty so that this application runs properly.
