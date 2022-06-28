#!/bin/bash

set -e

GITHUB_REPO=HIP-infrastructure/hip
APP_NAME=hip

# git checkout master
# git pull origin master

git diff --quiet --exit-code
[ $? != 0 ] && echo There is unstaged changes && exit 1

[ -z "$GITHUB_TOKEN" ] && echo GITHUB_TOKEN var is missing. Go to https://github.com/settings/tokens && exit 1

VERSION=v`grep '<version>' appinfo/info.xml | sed 's/[^0-9.]//g'`
UPLOAD_URL=`curl -sH "Authorization: token $GITHUB_TOKEN" -d "{\"tag_name\":\"$VERSION\"}" https://api.github.com/repos/$GITHUB_REPO/releases | grep '"upload_url"' | sed 's/.*"\(https:.*\){.*/\1/'`
[ -z "$UPLOAD_URL" ] && echo Can not get upload url && exit 1

git tag $VERSION

curl -sH "Authorization: token $GITHUB_TOKEN" -H 'Content-Type: application/octet-stream' --data-binary '@release.tar.gz' ${UPLOAD_URL}?name=release.tar.gz > /dev/null
