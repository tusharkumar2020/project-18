#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Run migrations and collect static files
echo "Applying database migrations..."
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

# Start the server
echo "Starting the server..."
exec "$@"
