# Setup

Welcome aboard! In this doc you will be provided with all the relevant knowledge to set up the backend services locally.

## Requirements

A few software tools are required to set the backend services:

- docker ([installation instructions](https://docs.docker.com/engine/install/)).
- NodeJS 22. (we strongly suggest using [nvm](https://github.com/nvm-sh/nvm)).
- [pnpm](https://pnpm.io/) is used as package manager, so be sure you have it globally installed.

## Steps to set up the backend monorepo

1. Clone this repo

```
git clone https://github.com/notaphplover/one-game.git
```

2. Go to the root package

```
cd one-game
```

3. Install dependencies

```
pnpm i
```

4. Generate `.env` files. Some packages require certain env variables to work properly. On a local setup, `.env` files are read to propagate them. For now, those packages are `backend-dev-proxy`, `backend-dev-game-db`, `backend-dev-user-db`, `backend-service-game`, `backend-service-gateway` and `backend-service-user`. In each of those folders you can find an `.env.example` file which has a valid local configuration. You can generate the `.env` file simply copying the `.env.example` file.

5. Run migrations

```
pnpm run migrations:run
```

Don't worry, build tasks are cached through `turbo`.

6. Generate a certificate to be used by the dev proxy server.

To accomplish that, go to `packages/backend/tools/backend-dev-proxy` and run the following command:

```
mkdir ssl && \
openssl req -x509 -newkey rsa:4096 -keyout ssl/localhost.key.pem -out ssl/localhost.cert.pem -sha256 -days 3650 -nodes -subj "/CN=Dev proxy certificate"
```

7. Launch services. On the root folder of the monorepo, launch the `serve` script:

```
pnpm run serve
```

You might be interested in just running the HTTP REST API services. In that case, launch the `serve:api:rest` script:

```
pnpm run serve:api:rest
```

That's all! You are ready to start calling the API

## Throubleshoot topics

### Database issues

Sometimes a database is not properly created. Trying to launch the servers with no env variables is a way to do this. Reseting the db is probably the easiest way to go, at least in a local setup.

Db state is saved on local volumes. Deleting the db container is not enough to reset the db state. Only after killing the container, removing it and removing its volume the db state is reset.

### Pulsar cluster issues

You might experience issues the first time the pulsar cluster is started. If the cluster is not properly initialized, errors such as "TopicNotFound"
might appear in the game services logs. In order to solve this issue, follow these steps:

- Remove apache pulsar container:

```bash
docker kill <pulsar-container-id>
docker rm <pulsar-container-id>
docker volume rm pulsardata
docker volume rm pulsarconf
```

- Start services:

```bash
pnpm run serve:api:rest:dependencies
```

- Once the pulsar cluster is properly initialized (10 seconds should be more than enough), you should be free to run backend services like in any other
scenario:

```bash
pnpm run serve:api:rest
```

Note: The pulsar cluster logs a summary once it's properly initialized, you should be able to see logs indicating the service is ready:

```
2024-11-05T11:36:19,907+0000 [worker-scheduler-0] INFO  org.apache.pulsar.functions.worker.SchedulerManager - Schedule summary - execution time
0.050956318 sec | total unassigned: 0 | stats: {"Added": 0, "Updated": 0, "removed": 0}
{
  "c-standalone-fw-localhost-8080" : {
    "originalNumAssignments" : 0,
    "finalNumAssignments" : 0,
    "instancesAdded" : 0,
    "instancesRemoved" : 0,
    "instancesUpdated" : 0,
    "alive" : true
  }
}
```
