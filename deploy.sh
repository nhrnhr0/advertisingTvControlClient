sudo git pull
cd my-app
sudo npm i
sudo npm run build
pm2 restart ecosystem.config.cjs
sudo service nginx restart
