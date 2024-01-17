# Deployment

A kubernetes config is provided to deploy all the services.

## Requirements

- `kubectl` version 1.28 or later.
- `helm` version 3.10 or later.
- k8s server should have [redis-operator](https://github.com/OT-CONTAINER-KIT/redis-operator) installed.

Consider the following script to install them:

```bash

helm repo add ot-helm https://ot-container-kit.github.io/helm-charts/
helm repo add cnpg https://cloudnative-pg.github.io/charts

helm repo update

helm upgrade --install cnpg cnpg/cloudnative-pg \
    --namespace cnpg-system --create-namespace --wait

helm upgrade --install redis-operator ot-helm/redis-operator \
    --namespace ot-operators --create-namespace --wait
```

### Why not use the official redis k8s operator?

The [official Redis Kubernetes operator](https://docs.redis.com/latest/kubernetes/) is probably one of the best solutions out there, but their opaque pricing policy was the reason to automatically discard it as a feasible option. Having said that, developers are encouraged to take their own decissions regarding how they want to deploy their infrastructure, so feel free to use any other operator or any other deployment solution different than this one.

## Deploying services

Just connect to the cluster and run the deploy script:

```bash
./k8s/deploy
```

### Deploying services locally with minikube

You might need to enale addons to use hpa and ingresses:

```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

You might want to deploy containers using local docker images, such as `one-game-backend-service-user:latest`. Asuming you have build the local [docker image](./docker-images.md), consider importing then through minikube:

```bash
minikube image load one-game-backend-service-user:latest
minikube image load one-game-backend-service-game:latest
```

Assuming you want to locally deploy services through minikube, consider `minikube tunnel` to provide external ips to exposed services.

#### Enabling minikube ingress

In order to enable ingress features, consider adding the right addon:

```bash
minikube addons enable ingress
```

Last but not least, you should find a way to resolve the expected hosts to your local minikube ip.

The most simple approach might be updating your host file (traditionally at `/etc/hosts`) with a new entry:

```
<your-minikube-ip>    api.cornie.game
<your-minikube-ip>    cornie.game
```

## Destroying services

Just connect to the cluster and run the destroy script:

```bash
./k8s/destroy
```
