<?php

namespace OCA\HIP\Listener;

use OCP\EventDispatcher\IEventListener;
use OCP\EventDispatcher\Event;
use OCP\SystemTag\MapperEvent;
use OCA\HIP\Service\MessageService;
use OCP\ILogger;

class TagEventListener implements IEventListener {

    public function __construct(ILogger $logger)
	{
		$this->logger = $logger;
	}

    public function handle(Event $event): void {
        if (!($event instanceOf MapperEvent)) {
        //     return;
        }

		$this->logger->info($event->getEvent());

        $message = new MessageService();
		$message->send($event->getEvent());
    }
}