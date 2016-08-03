# TMSkypeBot
TicketMaster Bot

## Overview:

The TicketMaster Bot is a bot for searching events and venues at TicketMaster.
This bot is based on the Microsoft Bot Builder SDK (http://botframework.com).


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

export BOT_PORT=3978

export API_KEY=your_key

export MICROSOFT_APP_ID=your_id

export MICROSOFT_APP_PASSWORD=your_password

Run your bot:

node main.js


## How to link with Skype:

Register your bot at botframework.com

NOTE: Microsoft asking for HTTPS connection with signed certificates,
if you have it, put key and cert files at the same folder and
uncomment related code.
If you do not have, you might want to download ngrok and
set up forwarding https requests.
