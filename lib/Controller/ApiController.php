<?php

namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCA\GroupFolders\Folder\FolderManager;
use OCP\Files\IRootFolder;
use OCP\IRequest;
use OCP\ILogger;

class ApiController extends Controller
{
    private FolderManager $manager;
    private IRootFolder $rootFolder;

    public function __construct(
        ILogger $logger,
        string $AppName,
        IRequest $request,
        FolderManager $manager,
        IRootFolder $rootFolder,
    ) {
        parent::__construct($AppName, $request);
        $this->logger = $logger;
        $this->request = $request;
        $this->manager = $manager;
        $this->rootFolder = $rootFolder;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function groupfolders()
    {
        return new DataResponse($this->manager->getAllFoldersWithSize($this->getRootFolderStorageId()));
    }

    private function getRootFolderStorageId(): int {
		return $this->rootFolder->getMountPoint()->getNumericStorageId();
	}
}
