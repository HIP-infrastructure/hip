<?php

namespace OCA\HIP\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\SystemTag\MapperEvent;
use OCA\HIP\Listener\TagEventListener;


class Application extends App implements IBootstrap {
	public const APP_ID = 'hip';

	public function __construct() {
		parent::__construct(self::APP_ID);

		$dispatcher = $this->getContainer()->query(IEventDispatcher::class);
		$dispatcher->addServiceListener(MapperEvent::EVENT_ASSIGN, TagEventListener::class); 
	}

	public function register(IRegistrationContext $context): void {
	}

	public function boot(IBootContext $context): void {
	}
}
