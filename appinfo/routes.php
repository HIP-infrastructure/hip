<?php

return [
    'routes' => [
        [
            'name' => 'page#index', 
            'url' => '/', 
            'verb' => 'GET'
        ],
        [
            'name' => 'document#file', 
            'url' => '/document/file', 
            'verb' => 'GET'
        ],
        [
            'name' => 'document#files', 
            'url' => '/document/files', 
            'verb' => 'GET'
        ],
        [
            'name' => 'api#groupfolders',
            'url' => '/api/groupfolders',
            'verb' => 'GET'
        ]
    ]
];
