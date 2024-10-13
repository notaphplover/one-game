# @cornie-js/backend-service-user

## 0.4.1

### Patch Changes

- 9fc87aa: Updated POST `/v1/users/email/{email}/code` to trigger proper reset password mail messages
- Updated dependencies [c51ec2c]
- Updated dependencies [8ff6a38]
- Updated dependencies [9fc87aa]
- Updated dependencies [3ac73bf]
  - @cornie-js/api-models@0.4.0
  - @cornie-js/backend-http@0.4.0
  - @cornie-js/backend-user-adapter-typeorm@0.2.2
  - @cornie-js/backend-user-application@0.3.1

## 0.4.0

### Minor Changes

- 28d92f2: Removed deprecated POST /v1/auth

### Patch Changes

- Updated dependencies [28d92f2]
- Updated dependencies [28d92f2]
- Updated dependencies [f5d8473]
- Updated dependencies [28d92f2]
- Updated dependencies [2002d71]
- Updated dependencies [f5d8473]
- Updated dependencies [c333080]
  - @cornie-js/backend-user-application@0.3.0
  - @cornie-js/api-models@0.3.0
  - @cornie-js/backend-http@0.3.0
  - @cornie-js/backend-user-adapter-typeorm@0.2.1

## 0.3.0

### Minor Changes

- ba1c512: Added cornie-js-user-service-bootstrap bin script
- ba1c512: Added cornie-js-user-service-run-migrations bin script

## 0.2.0

### Minor Changes

- 166a6f6: - Added POST `/v1/users` endpoint.
  - Added DELETE `/v1/users/email/:email/code` endpoint.
  - Added POST `/v1/users/email/:email/code` endpoint.
  - Added DELETE `/v1/users/me` endpoint.
  - Added GET `/v1/users/me` endpoint.
  - Added PATCH `/v1/users/me` endpoint.
  - Added GET `/v1/users/me/detail` endpoint.
  - Added GET `/v1/users/:userId` endpoint.
  - Added POST `/v1/auth` endpoint.
  - Added POST `/v2/auth` endpoint.
  - Added POST `/v2/users` endpoint.

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
  - @cornie-js/backend-common@0.2.0
  - @cornie-js/backend-monitoring@0.2.0
  - @cornie-js/api-models@0.2.0
  - @cornie-js/backend-user-adapter-typeorm@0.2.0
  - @cornie-js/backend-app-user-env@0.2.0
  - @cornie-js/backend-user-application@0.2.0
  - @cornie-js/backend-http@0.2.0
  - @cornie-js/backend-application-mail@0.2.0
  - @cornie-js/backend-adapter-nodemailer@0.2.0
