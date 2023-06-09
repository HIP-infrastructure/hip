<?php declare(strict_types=1);
// SPDX-FileCopyrightText: Manuel Spuhler <manuel.spuhler@chuv.ch>
// SPDX-License-Identifier: AGPL-3.0-or-later


namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;

use OCA\HIP\Service\DocumentService;

class DocumentController extends Controller
{
    public function __construct(ILogger $logger, string $AppName, IRequest $request, DocumentService $service)
    {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->logger = $logger;
        $this->request = $request;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function files(string $path)
    {
        return $this->service->files($path);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function file(string $path)
    {
        return $this->service->file($path);
    }

}
