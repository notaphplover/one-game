FROM node:20.10.0-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as frontendservicewebuibuild
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY ./docker/frontend/env/.env.production ./packages/frontend/web-ui
RUN pnpm run build --filter=web-ui
RUN mkdir -p /prod/web-ui
RUN cp -r ./packages/frontend/web-ui/dist /prod/web-ui

FROM nginx:1.25.4-alpine as frontendservicewebui

COPY ./docker/frontend/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=frontendservicewebuibuild /prod/web-ui/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
