# Docker images

This monorepo contains a `Dockerfile` file to generate docker images for every backend service available.

## Building docker images

To generate a docker image, use docker to build it. For example, to build a user service docker image, consider the following command:

```
docker build . --target backendserviceuser --tag backend-service-user:latest
```

The current docker images available are:
- `backendserviceuser`.
- `backendservicegame`.
- `backendservicegateway`.
