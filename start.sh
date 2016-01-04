#!/bin/bash
sudo service rabbitmq-server start
sudo service redis-server start
pm2 stop all
pm2 start bin/www
pm2 start pooler/workProcessor.js
pm2 start pooler/workEmmit.js
pm2 status
sleep 5
pm2 logs
