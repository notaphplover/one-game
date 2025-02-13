FROM node:22.14.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS backendconsumergamebuild
RUN apk update && apk upgrade && apk add bash
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=@cornie-js/backend-consumer-game
RUN pnpm deploy --filter=@cornie-js/backend-consumer-game --prod /prod/backend-consumer-game
COPY ./.npmrc /prod/backend-consumer-game

FROM base AS backendserviceuserbuild
RUN apk update && apk upgrade && apk add bash
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=@cornie-js/backend-service-user
RUN pnpm deploy --filter=@cornie-js/backend-service-user --prod /prod/backend-service-user
COPY ./.npmrc /prod/backend-service-user

FROM base AS backendservicegamebuild
RUN apk update && apk upgrade && apk add bash
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=@cornie-js/backend-service-game
RUN pnpm deploy --filter=@cornie-js/backend-service-game --prod /prod/backend-service-game
COPY ./.npmrc /prod/backend-service-game

FROM base AS backendservicegatewaybuild
RUN apk update && apk upgrade && apk add bash
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build --filter=@cornie-js/backend-service-gateway
RUN pnpm deploy --filter=@cornie-js/backend-service-gateway --prod /prod/backend-service-gateway
COPY ./.npmrc /prod/backend-service-gateway

FROM base AS backendconsumergame
COPY --from=backendconsumergamebuild /prod/backend-consumer-game /prod/backend-consumer-game
WORKDIR /prod/backend-consumer-game
EXPOSE 3002
CMD [ "pnpm", "serve" ]

FROM base AS backendserviceuser
COPY --from=backendserviceuserbuild /prod/backend-service-user /prod/backend-service-user
WORKDIR /prod/backend-service-user
EXPOSE 3001
CMD [ "pnpm", "serve" ]

FROM base AS backendservicegame
COPY --from=backendservicegamebuild /prod/backend-service-game /prod/backend-service-game
WORKDIR /prod/backend-service-game
EXPOSE 3002
CMD [ "pnpm", "serve" ]

FROM base AS backendservicegateway
COPY --from=backendservicegatewaybuild /prod/backend-service-gateway /prod/backend-service-gateway
WORKDIR /prod/backend-service-gateway
EXPOSE 3003
CMD [ "pnpm", "serve" ]

FROM base AS npmbackendconsumergame
RUN pnpm i -g --prod @cornie-js/backend-consumer-game@0.3.3
CMD [ "cornie-js-game-consumer-bootstrap" ]

FROM base AS npmbackendservicegame
RUN pnpm i -g --prod @cornie-js/backend-service-game@0.4.2
CMD [ "cornie-js-game-service-bootstrap" ]

FROM base AS npmbackendserviceuser
RUN pnpm i -g --prod @cornie-js/backend-service-user@0.4.1
CMD [ "cornie-js-user-service-bootstrap" ]
