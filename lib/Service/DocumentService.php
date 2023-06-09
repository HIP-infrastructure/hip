<?php declare(strict_types=1);
// SPDX-FileCopyrightText: Manuel Spuhler <manuel.spuhler@chuv.ch>
// SPDX-License-Identifier: AGPL-3.0-or-later


namespace OCA\HIP\Service;

use OCP\Files\IRootFolder;
use OCP\Files\FileInfo;
use OCP\IDateTimeFormatter;
use OCP\ILogger;
use OCP\SystemTag\ISystemTagObjectMapper;

class DocumentService
{
    private $systemTagObjectMapper;

    public function __construct(
        IRootFolder $rootFolder,
        IDateTimeFormatter $dateTimeFormatter,
        ILogger $logger,
        ISystemTagObjectMapper $systemTagObjectMapper,
        string $userId = null
    ) {
        $this->rootFolder = $rootFolder;
        $this->dateTimeFormatter = $dateTimeFormatter;
        $this->logger = $logger;
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
                array_push($systemFileTags, $tagId);
            }
        }

        $data = array(
            'name' => $node->getName(),
            'type' => $node->getType(),
            'id' => $id,
            'path' => $this->userFolder->getRelativePath($node->getPath()),
            'modifiedDate' => $this->dateTimeFormatter->formatDateTime($timestamp, 'medium'),
            'owner' => $node->getOwner()->getDisplayName(),
            'isShared' => $node->isShared(),
            'tags' => $systemFileTags
        );

        $fileInfo = array(
            'key' => "$id",
            'label' => $node->getName(),
            'data' => $data
        );

        return $fileInfo;
    }

    private function getFiles($folderName)
    {
        if (!$this->userFolder->nodeExists($folderName)) {
            return [];
        }

        $folder = $this->userFolder->get($folderName);
        $nodes = $folder->getDirectoryListing();

        $fileNodes = [];
        foreach ($nodes as $node) {
            if ($node->getType() === FileInfo::TYPE_FOLDER) {
                $fileInfo = $this->fileInfo($node);
                array_push($fileNodes, $fileInfo);
            } else {
                array_push($fileNodes, $this->fileInfo($node));
            }
        }

        return $fileNodes;
    }

    public function files($path)
    {
        return $this->getFiles($path);
    }

    public function file($path)
    {
        if (!$this->userFolder->nodeExists($path)) {
            return [];
        }
        $file = $this->userFolder->get($path);
        return $file->getContent();
    }
}
