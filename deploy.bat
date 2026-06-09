clear
cp D:\setting\config-dev.json src\config.json -f
node --max-old-space-size=16000 node_modules\@angular\cli\bin\ng build --output-path "C:/nginx-1.20.2/html/siborok/" --delete-output-path --watch --base-href /siborok/

