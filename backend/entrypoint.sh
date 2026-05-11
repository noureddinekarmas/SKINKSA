#!/bin/bash
set -e

if [ "$RUN_MIGRATIONS_ON_START" = "true" ]; then
  echo "Running Alembic migrations..."
  alembic upgrade head
fi

if [ "$SEED_ON_START" = "true" ]; then
  echo "Running seed data..."
  python -m app.seed.seed_initial_data
fi

echo "Starting uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
