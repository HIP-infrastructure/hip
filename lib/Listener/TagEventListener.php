<?php

namespace OCA\HIP\Listener;

use OCP\EventDispatcher\IEventListener;
use OCP\EventDispatcher\Event;
use OCP\SystemTag\MapperEvent;
use OC\Files\Filesystem;
use OCA\HIP\Service\MessageService;
use Psr\Log\LoggerInterface;
use Throwable;
use function sprintf;

class TagEventListener implements IEventListener
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function handle(Event $event): void
    {
        if ($event instanceof MapperEvent) {
            //     return;

            try {
                $this->logger->debug(
                    sprintf('TagEventListener %d', $event->getEvent())
                );

                $objectId = $event->getObjectId();
                $path = Filesystem::getPath($objectId);
                $info = Filesystem::getFileInfo($path);
                // $a = \OC::$server->getRootFolder()->getById($objectId);

                $message = array();
                $message['event'] = $event->getEvent();
                $message['objectId'] = $objectId;
                $message['path'] = $path;
                // $message['info'] = $info;

                $messageService = new MessageService();
                $messageService->send($path);
                // $messageService->send(serialize($message));
            } catch (Throwable $e) {
                $this->logger->error('Error sending event: ' . $e->getMessage(), [
                    'exception' => $e,
                ]);
            }
        }
    }
}
