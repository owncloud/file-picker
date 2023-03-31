#!/bin/bash

echo "Checking whether ownCloud Design System is installed"

if [ ! -d "./node_modules/owncloud-design-system/dist" ]
then
  echo "Installing ownCloud Design System" &&
  cd ./node_modules/owncloud-design-system &&
  pnpm install &&
  pnpm build:system
else
  echo "ownCloud Design System is already installed"
fi