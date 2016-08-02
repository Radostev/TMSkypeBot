# TMSkypeBot
TicketMaster Skype Bot

## Overview:
The TicketMaster Skype Bot is a bot for searching events and venues at TicketMaster. This bot is based on the Microsoft Bot Builder SDK (http://botframework.com).


## How to build:

Get your TicketMaster API key:

http://developer.ticketmaster.com/products-and-docs/apis/getting-started/

Create a new Microsoft application in order to get application ID and password:

https://apps.dev.microsoft.com/

Get the source:

git clone https://github.com/Radostev/TMSkypeBot.git
cd TMSkypeBot
npm install

Set all environment variables:
set BOT_PORT 3978
set API_KEY your_key
set MICROSOFT_APP_ID your_id
set MICROSOFT_APP_PASSWORD your_password

Run your bot:

node main.js

Register your bot at botframework.com
