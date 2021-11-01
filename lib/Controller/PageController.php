<?php

namespace OCA\HIP\Controller;

use OCA\HIP\AppInfo\Application;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\IRequest;
use OCA\HIP\Service\MessageService;


/**
 * Class PageController
 *
 * @package OCA\HIP\Controller
 */
class PageController extends Controller
{
	public function __construct(IRequest $request)
	{
		parent::__construct(Application::APP_ID, $request);
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
		// $message = new MessageService();
		// $message->send();

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
		//$scp->addAllowedConnectDomain('*');
		// $csp->addAllowedScriptDomain('unsafe-inline');
		$response->setContentSecurityPolicy($csp);

		return $response;
	}
}
