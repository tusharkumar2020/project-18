FROM python:3.12.0-slim-bookworm

ENV PYTHONBUFFERED 1
ENV PYTHONWRITEBYTECODE 1
ENV APP=/app

# Change the workdir.
WORKDIR $APP

# Install the requirements
COPY requirements.txt $APP
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Copy the rest of the project
COPY . $APP

# Expose the Django port
EXPOSE 8000

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

# Start Django with gunicorn
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
