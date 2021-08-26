# Human Intracerebral EEG Platform

Nextcloud App Frontend

## Getting Started

You will need Docker and docker-compose installed on your machine

### For Development

As for now create .env variable for the whole stack so it's loaded with the docker-compose.

```
cat <<EOT >> .env
HOSTNAME=127.0.0.1
GATEWAY_API=http://${HOSTNAME}:4000
GATEWAY_API_PREFIX=/api/v1

REMOTE_APP_API=
APP_BASIC_AUTH=Basic

PRIVATE_WEBDAV_URL=
COLLAB_WEBDAV_URL=
COLLAB_WEBDAV_USERNAME=
COLLAB_WEBDAV_PASSWORD=

NODE_ENV=development
EOT
```

Fire the env

```
docker-compose up -d
```

Frontend will be visible at [http://${HOSTNAME}:3000)](http://${HOSTNAME}:3000)

You can interract with npm like this

```
docker-compose exec [frontend|gateway] npm add bulma
```

ESlint Setup
https://dev.to/leejianhowe/how-to-setup-eslint-for-react-typescript-projects-7ji
Prettier Setup
https://prettier.io/docs/en/install.html

## Current proof of concept

as of 2014.04.02, the goal is to connect a web interface to the [App in browser](https://github.com/HIP-infrastructure/app-in-browser) in order to fire process, get feedbacks etc.

![System design overview](./doc/2021.04.02-microservice.png 'System design overview')

[Server and App Sequences](https://xstate.js.org/viz/?gist=5390ee0dbd82b6c12d9c1c3b5d542837)
