<?php

return [
    'routes' => [
        [
            'name' => 'page#index', 
            'url' => '/', 
            'verb' => 'GET'
        ],
        [
            'name' => 'api#groupfolders',
            'url' => '/api/groupfolders',
            'verb' => 'GET'
        ]
    ]
];
