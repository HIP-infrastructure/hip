<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Manuel Spuhler <manuel.spuhler@chuv.ch>
// SPDX-License-Identifier: AGPL-3.0-or-later
return [
    'routes' => [
        [
            'name' => 'page#index',
            'url' => '/',
            'verb' => 'GET'
        ],
        [
            'name' => 'document#file',
            'url' => '/documencd t/file',
            'verb' => 'GET'
        ],
        [
            'name' => 'document#files',
            'url' => '/document/files',
            'verb' => 'GET'
        ],
        [
            'name' => 'api#isloggedin',
            'url' => '/api/isloggedin',
            'verb' => 'GET'
        ],
        [
            'name' => 'api#uid',
            'url' => '/api/uid',
            'verb' => 'GET'
        ]
    ]
];
