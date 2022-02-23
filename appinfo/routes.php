<?php

return ['routes' => [
    ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
    ['name' => 'document#files', 'url' => '/document/files', 'verb' => 'GET'],
    ['name' => 'document#file', 'url' => '/document/file', 'verb' => 'GET'],
    // ['name' => 'document#createFolder', 'url' => '/document/folder', 'verb' => 'GET'],
    ['name' => 'tag#list', 'url' => '/tag/list', 'verb' => 'GET'],
    ['name' => 'document#createBids', 'url' => '/document/createBids', 'verb' => 'POST'],
]];
