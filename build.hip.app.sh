#!/usr/bin/env bash

TEMPLATE='templates/index.php'

echo '<div id="hip-root" style="width: 100%;"></div>' > $TEMPLATE

JS=$(ls build/static/js/*.js | xargs -n 1 basename)
for f in $JS; do 
    echo "<?php script(\$_['appId'], '../build/static/js/${f%.*}'); ?>" >> $TEMPLATE
done

CSS=$(ls build/static/css/*.css | xargs -n 1 basename)
for f in $CSS; do 
    echo "<?php style(\$_['appId'], '../build/static/css/${f%.*}'); ?>" >> $TEMPLATE
done

