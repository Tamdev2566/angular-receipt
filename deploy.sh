nice -10 node --max-old-space-size=16000 /usr/local/bin/ng build  --base-href /v3/
rm -rf /var/www/html/v3/*
cp -r dist/* /var/www/html/v3/
