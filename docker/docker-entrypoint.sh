#!/bin/sh

set -e

echo "Running prisma migration..."
npx prisma migrate deploy

echo "Starting the application..."
exec node dist/server.js