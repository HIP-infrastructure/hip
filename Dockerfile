FROM node:17 AS base

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /base

RUN npm install -g npm@7.19.1
RUN npm install -g react-scripts typescript --silent
COPY package.json ./
RUN npm install
COPY . .

RUN apt update && apt install -y gettext

RUN chown -R node:node /base
USER node


FROM base AS build
ENV NODE_ENV=production

WORKDIR /build
COPY --from=base /base ./
RUN npm run publish
