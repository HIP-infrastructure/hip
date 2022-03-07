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
		$csp->addAllowedFrameDomain('backend.thehip.app');
		$csp->addAllowedFrameDomain('iam.ebrains.eu');
		$csp->addAllowedFrameDomain('hipapp.local');
		$csp->addAllowedConnectDomain('gpu1.thehip.app');
		$csp->addAllowedConnectDomain('backend.thehip.app');
		$csp->addAllowedConnectDomain('iam.ebrain.eu');
		$csp->addAllowedConnectDomain('hipapp.local');
		$response->setContentSecurityPolicy($csp);

		return $response;
	}
}
