FROM node:18 AS base

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /base

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qy \
 && apt-get install -qy --no-install-recommends \
        gettext

RUN npm install --location=global react-scripts typescript --silent
COPY package.json ./
RUN npm install
COPY . .


# RUN chown -R node:node /base
# USER node

RUN mkdir /base/node_modules/.cache
RUN chmod -R 777 /base/node_modules/.cache


FROM base AS build
ENV NODE_ENV=production

WORKDIR /build
COPY --from=base /base ./
RUN npm run publish
