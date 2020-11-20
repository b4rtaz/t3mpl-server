#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

node -v
npm -v
git --version

echo "t3mpl-server..."
cd ../
rm -rf dist
npm install
npm run build

echo "session keys..."
cp -n configuration.example.json configuration.json
node scripts/random-session-keys.js configuration.json

echo "t3mpl-editor..."
rm -rf editor
git clone https://github.com/b4rtaz/t3mpl-editor.git editor
cd editor
npm install
npm run build:prod
