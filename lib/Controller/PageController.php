<?php

namespace OCA\HIP\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;

/**
 * Class PageController
 *
 * @package OCA\HIP\Controller
 */
class PageController extends Controller {
	/**
     * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return TemplateResponse
	 */
	public function index() {

		$response = new TemplateResponse(
			$this->appName,
			'index',
			[
				'appId' => $this->appName
			]
		);

        $csp = new ContentSecurityPolicy();
		$csp->addAllowedFrameDomain('gpu1.thehip.app');
		//$scp->addAllowedConnectDomain('*');
		// $csp->addAllowedScriptDomain('unsafe-inline');
        $response->setContentSecurityPolicy($csp);

		return $response;
	}
}
