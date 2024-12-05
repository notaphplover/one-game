# @cornie-js/backend-service-game

## 0.4.3

### Patch Changes

- 85e8109: Updated game pass turn flow to calculate the right next turn when skip cards are played
- Updated dependencies [99fb798]
- Updated dependencies [85e8109]
- Updated dependencies [99fb798]
  - @cornie-js/backend-app-game-env@0.3.0
  - @cornie-js/backend-game-application@0.4.1
  - @cornie-js/backend-game-adapter-pulsar@0.2.3
  - @cornie-js/backend-game-adapter-ioredis@0.2.3
  - @cornie-js/backend-game-adapter-typeorm@0.4.1

## 0.4.2

### Patch Changes

- 8ff6a38: Updated SseControllers to rely on custom FastifySseReplyFromResponseBuilder
- Updated dependencies [c51ec2c]
- Updated dependencies [c51ec2c]
- Updated dependencies [a77ce49]
- Updated dependencies [8ff6a38]
- Updated dependencies [380be3a]
- Updated dependencies [30ac61b]
- Updated dependencies [3ac73bf]
  - @cornie-js/backend-game-adapter-typeorm@0.4.0
  - @cornie-js/api-models@0.4.0
  - @cornie-js/backend-game-application@0.4.0
  - @cornie-js/backend-adapter-pulsar@0.3.0
  - @cornie-js/backend-http@0.4.0
  - @cornie-js/backend-game-adapter-pulsar@0.2.2
  - @cornie-js/backend-game-adapter-ioredis@0.2.2

## 0.4.1

### Patch Changes

- Updated dependencies [7c53e6e]
  - @cornie-js/backend-game-adapter-typeorm@0.3.1

## 0.4.0

### Minor Changes

- f5d8473: Updated GameV1 with isPublic
- eef7bfe: Added GET v1/games
- f5d8473: Updated GameCreateQueryV1 with isPublic

### Patch Changes

- Updated dependencies [675a1ce]
- Updated dependencies [28d92f2]
- Updated dependencies [f5d8473]
- Updated dependencies [28d92f2]
- Updated dependencies [eba015d]
- Updated dependencies [a9ad80c]
- Updated dependencies [8ec592e]
- Updated dependencies [2002d71]
- Updated dependencies [f5d8473]
  - @cornie-js/backend-game-adapter-typeorm@0.3.0
  - @cornie-js/backend-game-application@0.3.0
  - @cornie-js/api-models@0.3.0
  - @cornie-js/backend-http@0.3.0
  - @cornie-js/backend-game-adapter-pulsar@0.2.1
  - @cornie-js/backend-game-adapter-ioredis@0.2.1

## 0.3.0

### Minor Changes

- 18b221c: Added cornie-js-game-service-bootstrap bin script
- 18b221c: Added cornie-js-game-service-run-migrations bin script

## 0.2.0

### Minor Changes

- 166a6f6: - Added POST `/v1/games` endpoint.
  - Added GET `/v1/games/mine` endpoint.
  - Added GET `/v1/games/:gameId` endpoint.
  - Added PATCH `/v1/games/:gameId` endpoint.
  - Added POST `/v1/games/:gameId/slots` endpoint.
  - Added GET `/v1/games/:gameId/slots/:gameSlotIndex/cards` endpoint.
  - Added GET `/v1/games/:gameId/specs` endpoint.
  - Added GET `/v1/games/specs` endpoint.
  - Added GET `/v2/events/games/:gameId` endpoint.

### Patch Changes

- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
- Updated dependencies [a40a8c2]
  - @cornie-js/backend-adapter-pulsar@0.2.0
  - @cornie-js/backend-common@0.2.0
  - @cornie-js/backend-game-adapter-pulsar@0.2.0
  - @cornie-js/backend-monitoring@0.2.0
  - @cornie-js/api-models@0.2.0
  - @cornie-js/backend-game-adapter-ioredis@0.2.0
  - @cornie-js/backend-http@0.2.0
  - @cornie-js/backend-game-application@0.2.0
  - @cornie-js/backend-app-game-env@0.2.0
  - @cornie-js/backend-game-adapter-typeorm@0.2.0
