FROM node:22.15.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS frontendservicewebuibuild
RUN apk update && apk upgrade && apk add bash
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY ./docker/frontend/env/.env.production ./packages/frontend/web-ui
RUN pnpm run build --filter=@cornie-js/web-ui
RUN mkdir -p /prod/web-ui
RUN cp -r ./packages/frontend/web-ui/dist /prod/web-ui

FROM nginx:1.27.5-alpine AS frontendservicewebui

COPY ./docker/frontend/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=frontendservicewebuibuild /prod/web-ui/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
