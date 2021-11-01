<?php

namespace OCA\HIP\Service;

require_once __DIR__ . '/../../vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
// use PhpAmqpLib\Exchange\AMQPExchangeType;


class MessageService
{
    public function __construct()
    {
    }

    public function send(string $message)
    {
        try {
            $connection = new AMQPStreamConnection(
                'hub',
                5672,
                'guest',
                'guest'
            );
            $channel = $connection->channel();

            $channel->queue_declare('tags', false, false, false, false);

            $msg = new AMQPMessage($message);
            $channel->basic_publish($msg, '', 'tags');

            $channel->close();
            $connection->close();
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }
}
