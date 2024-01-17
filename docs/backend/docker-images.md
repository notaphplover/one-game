# Docker images

This monorepo contains a `docker` folder with dockerfiles to generate docker images for every backend service available.

## Building docker images

To generate a docker image, use the npm `docker:build` scripts provided for this purpose. For example, to build a user service docker image, consider the following command:

```
pnpm run docker:build:user
```

## Serving docker containers locally

In case you're interested in serving docker containers locally, ensure their respective docker images are correctly build and labeled and all the `.env` files are set. Consider [setup docs](./setup.md) to get instructions to set `.env` files.

To run the REST API services:

1. Run `serve:api:rest:dependencies` pnpm script to launch all the required services to launch REST API ones.
2. Run `serve:api:rest:docker` pnpm script to launch REST API dockerized services.
