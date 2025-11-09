#!/bin/bash
set -e

# Create telemetry database if it doesn't exist
# TypeORM will create tables automatically via synchronize option

# Check if database exists
DB_EXISTS=$(psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tAc "SELECT 1 FROM pg_database WHERE datname='telemetry'")

if [ "$DB_EXISTS" != "1" ]; then
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE DATABASE telemetry;
EOSQL
    echo "Telemetry database created successfully"
else
    echo "Telemetry database already exists"
fi

