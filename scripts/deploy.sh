#!/bin/bash

cd ~/webapp/url-shorten-bot/
eval $(ssh-agent -s)
ssh-add ~/.ssh/git
git pull
npm start


