<?php

namespace OCA\HIP\Service;

require_once __DIR__ . '/../../vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

// DATA='{
//     "properties":{},
//     "routing_key":"red",
//     "payload":"'$4'",
//     "payload_encoding":"string"
// }'


class MessageService
{
    public function __construct()
    {
    }

    public function send()
    {
        $connection = new AMQPStreamConnection('https://hub.thehip.app/api/exchanges/%2F/test-exchange/publish', 5672, 'hipadmin', 'UVg0i3Wz4usqfhpM9qJP');
        $channel = $connection->channel();

        $channel->queue_declare('hello', false, false, false, false);

        $msg = new AMQPMessage('Hello World!');
        $channel->basic_publish($msg, '', 'hello');

        $channel->close();
        $connection->close();
    }
}
