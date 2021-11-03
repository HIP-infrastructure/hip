<?php

namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;
use OCP\SystemTag\ISystemTagManager;

class TagController extends Controller
{
    public function __construct(
        ILogger $logger,
        string $AppName,
        IRequest $request,
        ISystemTagManager $systemTagManager
    ) {
        parent::__construct($AppName, $request);
        $this->logger = $logger;
        $this->request = $request;
        $this->systemTagManager = $systemTagManager;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function list()
    {
        $systemTags = $this->systemTagManager->getAllTags();
        $tags = array();
        foreach ($systemTags as $tag) {
            $tagarray = array();
            $tagarray['id'] = intval($tag->getId());
            $tagarray['label'] = $tag->getName();
            array_push($tags, $tagarray);
        }

        return $tags;
    }
}
