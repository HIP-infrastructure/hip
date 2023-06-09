<?php declare(strict_types=1);
// SPDX-FileCopyrightText: Manuel Spuhler <manuel.spuhler@chuv.ch>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;
use OCP\ILogger;
use OCP\IUserSession;

class ApiController extends Controller
{
    public function __construct(
        ILogger $logger,
        string $AppName,
        IRequest $request,
        IUserSession $userSession
    ) {
        parent::__construct($AppName, $request);

        $this->logger = $logger;
        $this->request = $request;
        $this->userSession = $userSession;
    }

     /**
     * @NoAdminRequired
     */
    public function isloggedin()
    {
        return $this->userSession->isLoggedIn();
    }

    /**
     * @NoAdminRequired
     */
    public function uid()
    {
        return $this->userSession->getUser()->getUID();
    }
}
