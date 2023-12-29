FROM node:20.10.0-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as backendserviceuserbuild
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=backend-service-user
RUN pnpm deploy --filter=backend-service-user --prod /prod/backend-service-user
COPY ./.npmrc /prod/backend-service-user

FROM base as backendservicegamebuild
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=backend-service-game
RUN pnpm deploy --filter=backend-service-game --prod /prod/backend-service-game
COPY ./.npmrc /prod/backend-service-game

FROM base as backendservicegatewaybuild
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=backend-service-gateway
RUN pnpm deploy --filter=backend-service-gateway --prod /prod/backend-service-gateway
COPY ./.npmrc /prod/backend-service-gateway

FROM backendserviceuserbuild AS backendserviceuser
COPY --from=backendserviceuserbuild /prod/backend-service-user /prod/backend-service-user
WORKDIR /prod/backend-service-user
EXPOSE 3001
CMD [ "pnpm", "serve" ]

FROM backendservicegamebuild AS backendservicegame
COPY --from=backendservicegamebuild /prod/backend-service-game /prod/backend-service-game
WORKDIR /prod/backend-service-game
EXPOSE 3002
CMD [ "pnpm", "serve" ]

FROM backendservicegatewaybuild AS backendservicegateway
COPY --from=backendservicegatewaybuild /prod/backend-service-gateway /prod/backend-service-gateway
WORKDIR /prod/backend-service-gateway
EXPOSE 3002
CMD [ "pnpm", "serve" ]
