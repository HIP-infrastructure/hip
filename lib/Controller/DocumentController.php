<?php

namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;

use OCA\HIP\Service\DocumentService;

class DocumentController extends Controller
{
    public function __construct(ILogger $logger, string $AppName, IRequest $request, DocumentService $service) {
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->logger = $logger;
        $this->request = $request;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
    */
    public function list() {
        return $this->service->files('/');
    }
}
