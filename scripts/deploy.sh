#!/bin/bash

# NOTE: This require a screen named 'msg_bot' running in 
# background already!

# Send commands to the screen
# Must not change the indentation below
# cmd="
# cd ~/webapp/url-shorten-bot/
# eval $(ssh-agent -s)
# ssh-add ~/.ssh/git
# git pull
# export PAGE_TOKEN=EAAYtISKCzugBAInWeMCsGDrTO0tBrR54jJWIcPFZB0bQYoZAJxWWkHQEjbmr4WfKbLxItmAaIBsPWXLTrAvkTsAIrujjAo81xdx4ZBVM$
# export MYSQL_USERNAME=root
# export MYSQL_PASSWORD=123
# npm start
# "
# screen -X -S "msg_bot" stuff "${cmd}"

<<EOF
    cd ~/webapp/url-shorten-bot/
    eval $(ssh-agent -s)
    ssh-add ~/.ssh/git
    git pull
    npm start
EOF
