# Docker Setup for Next.js Application

This document provides instructions for building and running the Next.js
application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Building and Running with Docker Compose

The easiest way to build and run the application is using Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at http://localhost:3000

## Building and Running with Docker Directly

If you prefer to use Docker commands directly:

```bash
# Build the Docker image
docker build -t nextjs-app -f apps/www/Dockerfile .

# Run the container
docker run -p 3000:3000 nextjs-app
```

## Development Mode

For development, it's recommended to run the application directly with pnpm:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm www:dev
```

## Troubleshooting

If you encounter any issues with the Docker build:

1. Make sure all dependencies are correctly specified in the package.json files
2. Check that the Next.js application is configured for standalone output
3. Verify that the Docker daemon is running
4. Try clearing Docker cache with `docker builder prune`
