<?php

namespace OCA\HIP\Service;

use OCP\Files\IRootFolder;
use OCP\Files\FileInfo;
use OCP\IDateTimeFormatter;
use OCP\ILogger;
use OCP\SystemTag\ISystemTagManager;

class DocumentService
{
    public function __construct(
        IRootFolder $rootFolder,
        IDateTimeFormatter $dateTimeFormatter,
        ILogger $logger,
        ISystemTagManager $tagManager,
        string $userId = null
    ) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
        $this->tagManager = $tagManager;
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

        // Get all files from documents and data requests recursively
        $nodes = $this->getFileNodesRecursively($parentFolder);

        $alltags = $this->tagManager->getAllTags();
        $tagMap = array();
        foreach ($alltags as $tag) {
            array_push($tagMap, $tag->getName());
        }

        foreach ($nodes as $node) {
            $fileId = $node->getId();
            $path = '/apps/files/?dir=' . $this->userFolder->getRelativePath($node->getParent()->getPath()) . '&openfile=' . $fileId;
            $name = $node->getName();
            $timestamp = $node->getMTime();
            $modifiedDate = $this->dateTimeFormatter->formatDateTime($timestamp, 'medium');
            $owner = $node->getOwner()->getDisplayName();
            // $currentTags = $this->tagManager->getTagsForObjects([$fileId]);


            $fileInfo = array(
                'path' => $path,
                'name' => $name,
                'modifiedDate' => $modifiedDate,
                'owner' => $owner,
                'isShared' => $node->isShared(),
                'tags' => $tagMap,
                // 'test' => array_map(fn($tag): string => $tag.getName(), $tags)
            );

            array_push($files, $fileInfo);
        }

        return $files;
    }
}
