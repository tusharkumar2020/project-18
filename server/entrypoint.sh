#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
while ! nc -z mongo_db 27017; do
  sleep 1
done
echo "MongoDB started"

echo "Collecting static files"
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start server
exec "$@"
