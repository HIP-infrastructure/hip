<?php

namespace OCA\HIP\Controller;

use OCA\HIP\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\IRequest;
use OCP\ILogger;

/**
 * Class PageController
 *
 * @package OCA\HIP\Controller
 */
class PageController extends Controller
{
	public function __construct(ILogger $logger, IRequest $request)
	{
		parent::__construct(Application::APP_ID, $request);
		$this->logger = $logger;
	}
	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @return TemplateResponse
	 */
	public function index()
	{
		// Util::addScript(Application::APP_ID, 'index');
		
		$response = new TemplateResponse(
			Application::APP_ID,
			'index',
			[
				'appId' => $this->appName,
				'inline-settings' => 'false'
			]
		);

		$csp = new ContentSecurityPolicy();
		$csp->addAllowedFrameDomain('gpu1.thehip.app');
		$csp->addAllowedFrameDomain('cpu1.thehip.app');
		$csp->addAllowedFrameDomain('cpu2.thehip.app');
		$csp->addAllowedFrameDomain('backend.thehip.app');
		$csp->addAllowedFrameDomain('iam.ebrains.eu');
		$csp->addAllowedFrameDomain('iam-int.ebrains.eu');
		$csp->addAllowedFrameDomain('hip.local:9001');
		$csp->addAllowedFrameDomain('hip.collab.local:9001');
		$csp->addAllowedFrameDomain('collab-dev.thehip.app');
		$csp->addAllowedFrameDomain('keycloak.thehip.app');
		$csp->addAllowedFrameDomain('id.thehip.app');
		$csp->addAllowedFrameDomain('dev.id.thehip.app');
		$csp->addAllowedFrameDomain('hip-infrastructure.github.io');
		if ($d = getenv('ALLOWED_FRAME_DOMAIN', true)) {
			$csp->addAllowedFrameDomain($d);
		}

		$csp->addAllowedConnectDomain('gpu1.thehip.app');
		$csp->addAllowedConnectDomain('cpu1.thehip.app');
		$csp->addAllowedConnectDomain('cpu2.thehip.app');
		$csp->addAllowedConnectDomain('backend.thehip.app');
		$csp->addAllowedConnectDomain('iam.ebrains.eu');
		$csp->addAllowedConnectDomain('iam-int.ebrains.eu');
		$csp->addAllowedConnectDomain('hip.local:9001');
		$csp->addAllowedConnectDomain('hip.collab.local:9001');
		$csp->addAllowedConnectDomain('collab-dev.thehip.app');
		$csp->addAllowedConnectDomain('keycloak.thehip.app');
		$csp->addAllowedConnectDomain('id.thehip.app');
		$csp->addAllowedConnectDomain('dev.id.thehip.app');
		$csp->addAllowedConnectDomain('stats.humanbrainproject.eu');

		$response->setContentSecurityPolicy($csp);

		return $response;
	}
}

