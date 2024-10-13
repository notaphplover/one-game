# Release

Manually releasing all the packages of a monorepo can be as challenging as inappropriate. For such a reason we rely on changesets, GH actions and as less as possible manual steps.

## Requirements

- Privileges to trigger GH actions.
- In some circumstances, privileges to update CI secrets.
- Proper changesets to be deployed.

## Steps

### Publish npm packages

Run the `publish` GH action. This should generate a PR with version bumps and changelogs updates. After carefully reviewing the PR, merge it and run the `publish` action again. This should trigger an attempt to publish npm packages and generate github releases

### Update docker image tags

Sometimes backend service packages are updated this way. These packages are the following ones:

- @cornie-js/backend-consumer-game
- @cornie-js/backend-service-user
- @cornie-js/backend-service-game

In the event of any of this package versions being updated, the corresponding files must be updated in a PR:

- `docker/backend/Dockerfile`
- `package.json` (`docker:build:game:*:npm` scripts)

### Publish docker images

Run the `publish-docker-image` with all the affected services.
