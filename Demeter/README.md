# Demeter Backend

## Rocket.toml
The `Rocket.toml` file is not included in the repo because it must contain a secret key for the server. A Python script is included to generate a `Rocket.toml`.

## Environment Variables
One environment variable, DATABASE_URL, must be set to give Demeter a path to the database. For example,
```
DATABASE_URL=./demeterDB.sqlite
```

## Database
Run the following to create the database if one does not exist:
```$
$ diesel setup
```