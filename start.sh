#!/bin/bash
sudo service rabbitmq-server start
sudo service redis-server start
pm2 stop all
pm2 start bin/www
pm2 start pooler/main.js
pm2 start pooler/workEmmiter.js
pm2 status
sleep 5
pm2 logs
