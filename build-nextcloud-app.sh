#!/bin/sh

set -e

TARGET=$1

TEMPLATE="$TARGET/templates/index.php"

echo '<div id="hip-root" style="width: 100%;"></div>' > $TEMPLATE

JS=$(ls $TARGET/static/js/*.js | xargs -n 1 basename)
for f in $JS; do 
    echo "<?php script(\$_['appId'], '../static/js/${f%.*}'); ?>" >> $TEMPLATE
done

CSS=$(ls $TARGET/static/css/*.css | xargs -n 1 basename)
for f in $CSS; do 
    echo "<?php style(\$_['appId'], '../static/css/${f%.*}'); ?>" >> $TEMPLATE
done

