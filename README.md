# Audiobookshelf Tracker

...

## Install

Create the local data folder for the SQLite database

```sh
mkdir data
chmod -R 777 data
```

Create a `docker-compose.yml` and set the environment variables:

```yml
services:
  server:
    container_name: server
    image: ghcr.io/xairoo/audiobookshelf-tracker-server:latest
    restart: always
    ports:
      - 3005:3005
    networks:
      - audiobookshelf_tracker
    volumes:
      - ./data:/data
    environment:
      - CLIENT_PORT=3000
      - SERVER_PORT=3005
      - PASSWORD= # admin password, change this
      - JWT_SECRET= # random salt, change this
      - ABS_URL= # Audiobookshelf server, e.g.: http://192.168.0.129:13378
      - ABS_TOKEN= # Your Audiobookshelf admin token (Settings -> Users -> root account -> API token)

  client:
    container_name: client
    image: ghcr.io/xairoo/audiobookshelf-tracker-client:latest
    restart: always
    ports:
      - 3000:3000
    networks:
      - audiobookshelf_tracker
    environment:
      - CLIENT_PORT=3000
      - SERVER_PORT=3005

networks:
  audiobookshelf_tracker:
    external: true
```

Create a Docker network

```sh
docker network create audiobookshelf_tracker
```

Start the containers

```sh
docker compose -f docker-compose.yml up -d
```

Now you can login at http://localhost:3000 with the user `admin` and the password you have set.

Enjoy!

## Remote Access

You can easily tunnel the client container with [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) or a NGINX proxy. Just use http://localhost:3000 as target.

## Development

This repo is configured to be built with Docker, and Docker compose. To build all apps in this repo:

```
# Install dependencies
npm ci

# Create a network, which allows containers to communicate
# with each other, by using their container name as a hostname
docker network create audiobookshelf_tracker

# Build prod using new BuildKit engine
docker-compose -f docker-compose-dev.yml build

# Start the containers
docker-compose -f docker-compose.yml up
```

Build the container:

```sh
docker-compose -f docker-compose-dev.yml build
```


Open http://localhost:3000.

To shutdown all running containers:

```
# Stop all running containers
docker kill $(docker ps -q) && docker rm $(docker ps -a -q)
```
