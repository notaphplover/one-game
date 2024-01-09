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

### Deploying services locally

Assuming you want to locally deploy services through minikube, consider `minikube tunnel` to provide external ips to exposed services.

## Destroying services

Just connect to the cluster and run the destroy script:

```bash
./k8s/destroy
```
