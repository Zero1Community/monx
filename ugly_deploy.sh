#!/bin/bash

node -v | if grep -q "v5.2" ; then
	echo "Found latest node"
 else
	echo "Setting up node"
      	curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
	apt-get install nodejs
fi
npm -v | if grep -q "3.3.12" ; then
	echo "Found latest npm"
else
	echo "No NPM Found"
	exit
fi

npm install

sudo npm install -g pm2
sudo npm install -g nodemon

sudo chown -R tuwid:tuwid .

# permissions te logset
# instalim global te disa moduleve

# redis
sudo apt-get install build-essential
sudo apt-get install tcl8.5
cd /usr/local/src
sudo wget http://download.redis.io/releases/redis-stable.tar.gz
sudo tar xzf redis-stable.tar.gz
sudo cd redis-stable
sudo make
sudo make install
sudo ./utils/install_server.sh
sudo service redis_6379 restart

#rabbitmq 
cd ~
sudo echo "deb http://www.rabbitmq.com/debian/ testing main" >> /etc/apt/sources.list
wget https://www.rabbitmq.com/rabbitmq-signing-key-public.asc
sudo apt-key add rabbitmq-signing-key-public.asc
sudo apt-get -y install rabbitmq-server

# ulimit -S -n 4096
