FROM node:current-alpine AS base
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /base

RUN apk add --no-cache gettext
RUN npm install -g npm@7.19.1
RUN npm install -g react-scripts typescript --silent
COPY package.json ./
RUN npm install
COPY . .

RUN chown -R node:node /base

FROM base AS build
ENV NODE_ENV=production

WORKDIR /build
COPY --from=base /base ./
RUN npm run publish
