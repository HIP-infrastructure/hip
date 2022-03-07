# Human Intracerebral EEG Platform - Nextcloud App Frontend

## Overview

The HIP is a platform for processing and sharing HUMAN intracerebral EEG data  
[More...](https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/)

This service is part of the HIP infrastructure and runs as a Nextcloud App. It also communicate directly with the [Gateway API](https://github.com/HIP-infrastructure/gateway).

The main frontend deployment service is [Nextcloud docker](https://github.com/HIP-infrastructure/nextcloud-docker).
While the backend service for remote apps is the [App in Browser](https://github.com/HIP-infrastructure/app-in-browser)

## Development - Getting Started

You will need Docker, docker-compose, nodejs and npm installed on your machine

1. Install the [Nextcloud docker](https://github.com/HIP-infrastructure/nextcloud-docker).
2. Add this to the Caddyfile

   ```
   # hip nextcloud app, dev proxy to frontend
   handle /apps/hip/static/* {
       reverse_proxy web:3000
   }

   handle /apps/hip/css/* {
       reverse_proxy web:3000
   }

   # dev proxy to gateway
   handle /api/v1/* {
       reverse_proxy gateway:4000
   }
   ```

3. Install the Gateway service [Gateway API](https://github.com/HIP-infrastructure/gateway)
4. Clone this repository inside `/mnt/nextcloud-dp/nextcloud/apps/hip`
5. `cp templates/index.dev.php index.php`
6. On the main folder, create a .env with  
   HOSTNAME=example.com
   GATEWAY_API=https://example.com/api/v1

   REMOTE_APP_API=https://example.com/api
   REMOTE_APP_BASIC_AUTH=Basic pass

   HIP_ADMIN=hipadmin

   NODE_ENV=development
   NEXTCLOUD_VERSION=22.2.5-fpm
   NEXTCLOUD_VIRTUAL_HOST=dev.thehip.app

7. Copy the `docker-compose.yml` file to the top folder
8. `docker-compose up -d`
9. Enable the HIP app inside Nextcloud at https://example.com/index.php/settings/apps
10. Frontend will be visible at https://example.com/index.php/apps/hip/
11. cd to `/mnt/nextcloud-dp/nextcloud/apps/hip` , `npm install`, `npm start`, and start making changes

### ESlint Setup

https://dev.to/leejianhowe/how-to-setup-eslint-for-react-typescript-projects-7ji  
Prettier Setup
https://prettier.io/docs/en/install.html

### Publish the app

On the master branch, `npm run publish` will produce a Nextcloud app, compiling all assets, css, images and JS code into a static folder and create a templates/index.php which refers to the build.

`docker-compose -f docker-compose-dev.yml run web npm run publish`

The package can then be deployed as a NextCloud app by moving the hip folder inside nextcloud/apps/hip

On the master branch, `npm run publish` will produce a Nextcloud app, compiling all assets, css, images and JS code into a static folder and create a templates/index.php which refers to the build.

`docker-compose -f docker-compose-dev.yml run web bash -c "npm i && npm run publish"`

The package can then be deployed as a NextCloud app by moving the hip folder inside nextcloud/apps/hip

## Current proof of concept

![System design overview](./doc/2021.04.02-microservice.png 'System design overview')

[Server and App Sequences](https://xstate.js.org/viz/?gist=5390ee0dbd82b6c12d9c1c3b5d542837)
