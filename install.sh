#!/bin/bash

# t3mpl-server
rm -rf ./dist
npm install
npm run build

# t3mpl-editor
rm -rf ./editor
git clone https://github.com/b4rtaz/t3mpl-editor.git ./editor
cd ./editor
npm install
npm run build:prod
