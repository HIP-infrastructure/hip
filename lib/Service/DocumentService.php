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
        string $userId = null
    ) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
        $this->systemTagManager = $systemTagManager;
        $this->systemTagObjectMapper = $systemTagObjectMapper;
        $this->currentUser = $userId;
        $this->userFolder = $this->rootFolder->getUserFolder($this->currentUser);
    }

    private function fileInfo($node)
    {

        $id = $node->getId();
        $timestamp = $node->getMTime();
        $tagIds = $this->systemTagObjectMapper->getTagIdsForObjects([$id], 'files');
        $systemFileTags = array();
        foreach ($tagIds as $fileId => $tags) {
            foreach ($tags as $tagId) {
                // $tagarray = array();
                // $tagarray['id'] = $systemTags[$tagId]->getId();
                // $tagarray['label'] = $systemTags[$tagId]->getName();
                array_push($systemFileTags, $tagId);
            }
        }

        $data = array(
            'name' => $node->getName(),
            'type' => $node->getType(),
            'id' => $id,
            'path' => '/apps/files/?dir=' . $this->userFolder->getRelativePath($node->getParent()->getPath()) . '&openfile=' . $node->getId(),
            'modifiedDate' => $this->dateTimeFormatter->formatDateTime($timestamp, 'medium'),
            'owner' => $node->getOwner()->getDisplayName(),
            'isShared' => $node->isShared(),
            'tags' => $systemFileTags
        );

        $fileInfo = array(
            'key' => $id,
            'data' => $data
        );

        return $fileInfo;
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
                $children = $this->getFileNodesRecursively($this->userFolder->getRelativePath($node->getPath()));
                $fileInfo = $this->fileInfo($node);
                $fileInfo['children'] =  $children;
                array_push($fileNodes, $fileInfo);
            } else {
                array_push($fileNodes, $this->fileInfo($node));
            }
        }

        return $fileNodes;
    }

    public function files($parentFolder)
    {
        return $this->getFileNodesRecursively($parentFolder);
    }
}
