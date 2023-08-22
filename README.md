# Human Intracerebral EEG Platform - Nextcloud App Frontend

## Overview

The HIP is a platform for processing and sharing Human intracerebral EEG data  
[More...](https://www.humanbrainproject.eu/en/medicine/human-intracerebral-eeg-platform/)

This component is part of the [HIP infrastructure frontend](https://github.com/HIP-infrastructure/frontend) and runs as a Nextcloud App. It also communicate directly with the [Gateway API](https://github.com/HIP-infrastructure/gateway) to the backend service for remote apps is the [App in Browser](https://github.com/HIP-infrastructure/app-in-browser)

## Development - Getting Started

You will need Docker, docker-compose, nodejs and npm installed on your machine

1. Clone the [Frontend](https://github.com/HIP-infrastructure/frontend).
2. Copy .env.template to .env and edit the variables according to your needs.
3. run `make deploy.dev`

### ESlint Setup

https://dev.to/leejianhowe/how-to-setup-eslint-for-react-typescript-projects-7ji  
Prettier Setup
https://prettier.io/docs/en/install.html

### Publish the app

On the master branch, `npm run publish` will produce a Nextcloud app, compiling all assets, css, images and JS code into a static folder and create a templates/index.php which refers to the build.

The package can then be deployed as a NextCloud app by moving the hip folder inside nextcloud/apps/hip

`make deploy`on the frontend package will also create the production version, based on React production assets.

## stats

Matomo is used to gather some metrics about events and page views.

trackEvent({
category: 'server',
action: 'view' || 'stop' || 'start' || 'resume' || 'pause'
})

trackEvent({
category: 'app',
action: 'stop' || 'start'
})

trackEvent({
category: 'bids',
action: 'import',
})

trackPageView { documentTitle: route }

## Acknowledgement

This research was supported by the EBRAINS research infrastructure, funded from the European Union’s Horizon 2020 Framework Programme for Research and Innovation under the Specific Grant Agreement No. 945539 (Human Brain Project SGA3).
