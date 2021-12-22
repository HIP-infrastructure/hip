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

                $message = array(
                    "event" => $event->getEvent(),
                    "objectId" => $objectId,
                    "path" => $path
                );

                $payload = json_encode(array("message" => $message));

                $ch = curl_init('http://gateway:4000/api/v1/remote-app/bids');
                curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


                $response = curl_exec($ch);
                curl_close($ch);

            } catch (Throwable $e) {
                $this->logger->error('Error sending event: ' . $e->getMessage(), [
                    'exception' => $e,
                ]);
            }
        }
    }
}
