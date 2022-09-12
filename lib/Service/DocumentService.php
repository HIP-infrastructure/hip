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
                //$children = $this->getFiles($this->userFolder->getRelativePath($node->getPath()));
                $fileInfo = $this->fileInfo($node);
                //$fileInfo['children'] =  $children;
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

    public function createFolder($parentPath, $name)
    {
        $path = $parentPath . $name;

        if (!$this->userFolder->nodeExists($path)) {
            $parentFolder = $this->userFolder->get($parentPath);
            $parentFolder->newFolder($name);
        }

        return $this->getFiles($parentPath);
    }

    public function createBidsDataset($path, $data) {

        // $json= json_decode(file_get_contents('php://input'), true);

        if (!$this->userFolder->nodeExists($path)) {
            $parentFolder = $this->userFolder->get('/');
            $parentFolder->newFolder($path);

            $newFolder = $this->userFolder->get($path);
            $file = $newFolder->newFile('dataset_description.json');
            $file->fopen('w');
            $file->putContent($data);

        }

        return $this->getFiles('/');

        // return "ok";
    }
}
