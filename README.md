# Audiobookshelf Tracker

...

## Install

Create the local data folder for the SQLite database

```sh
mkdir data
```

Set the environment variables in the `docker-compose.yml`:

```
PASSWORD= # admin password, change this
JWT_SECRET= # random salt, change this
ABS_URL= # Audiobookshelf server, e.g.: http://192.168.0.129:13378
ABS_TOKEN= # Your Audiobookshelf admin token
```

Create a Docker network

```sh
docker network create audiobookshelf_tracker
```

Start the containers

```sh
docker-compose -f docker-compose.yml build
```

## Development

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Install dependencies
npm ci

# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create audiobookshelf_tracker

# Build prod using new BuildKit engine
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build

# Start prod in detached mode
docker-compose -f docker-compose.yml up -d
```

Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```
