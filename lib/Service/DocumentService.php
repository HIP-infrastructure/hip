<?php

namespace OCA\HIP\Service;

use OCP\Files\IRootFolder;
use OCP\Files\FileInfo;
use OCP\IDateTimeFormatter;
use OCP\ILogger;
use OCP\SystemTag\ISystemTagManager;
use OCP\SystemTag\ISystemTagObjectMapper;

class DocumentService
{
    private $systemTagManager;
    private $systemTagObjectMapper;

    public function __construct(
        IRootFolder $rootFolder,
        IDateTimeFormatter $dateTimeFormatter,
        ILogger $logger,
        ISystemTagManager $systemTagManager,
        ISystemTagObjectMapper $systemTagObjectMapper,
        string $userId = null,
    ) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
        $this->systemTagManager = $systemTagManager;
        $this->systemTagObjectMapper = $systemTagObjectMapper;
        $this->currentUser = $userId;
        $this->userFolder = $this->rootFolder->getUserFolder($this->currentUser);
    }

    private function getFileNodesRecursively($folderName)
    {
        if (!$this->userFolder->nodeExists($folderName)) {
            return [];
        }

        $folder = $this->userFolder->get($folderName);
        $nodes = $folder->getDirectoryListing();

        $fileNodes = [];
        foreach ($nodes as $node) {
            if ($node->getType() === FileInfo::TYPE_FOLDER) {
                array_push($fileNodes, $node);
                $fileNodes = array_merge($fileNodes, $this->getFileNodesRecursively($this->userFolder->getRelativePath($node->getPath())));
            } else {
                array_push($fileNodes, $node);
            }
        }

        return $fileNodes;
    }

    public function files($parentFolder)
    {
        $files = [];

        $nodes = $this->getFileNodesRecursively($parentFolder);
        $systemTags = $this->systemTagManager->getAllTags();

        foreach ($nodes as $node) {
            $fileId = $node->getId();
            $path = '/apps/files/?dir=' . $this->userFolder->getRelativePath($node->getParent()->getPath()) . '&openfile=' . $fileId;
            $name = $node->getName();
            $timestamp = $node->getMTime();
            $modifiedDate = $this->dateTimeFormatter->formatDateTime($timestamp, 'medium');
            $owner = $node->getOwner()->getDisplayName();

            $tagIds = $this->systemTagObjectMapper->getTagIdsForObjects([$fileId], $node->getType() . 's');
            $systemFileTags = array();
            foreach ($tagIds as $fileId => $tags) {
                foreach($tags as $tagId) {
                    array_push($systemFileTags, $systemTags[$tagId]->getName());
                }
            }

            $fileInfo = array(
                'name' => $name,
                'type' => $node->getType(),
                'id' =>$fileId,
                'path' => $path,
                'modifiedDate' => $modifiedDate,
                'owner' => $owner,
                'isShared' => $node->isShared(),
                'tags' => $systemFileTags
            );

            array_push($files, $fileInfo);
        }

        return $files;
    }
}
