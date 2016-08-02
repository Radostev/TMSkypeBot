// Required env variables:
// BOT_PORT, API_KEY, MICROSOFT_APP_ID, MICROSOFT_APP_PASSWORD
var restify = require('restify');
var builder = require('botbuilder');
var https = require('https');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(Number(process.env.BOT_PORT), function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('cancel', 'Ok, this search was canceled',
                          { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help',
                      { matches: /^help/i });
bot.beginDialogAction('search', '/search',
                  { matches: /^search/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Ticket Master Skype Bot")
            .text("Searching for events and venues.")
            .images([
                 builder.CardImage.create(session, "https://dl.dropboxusercontent.com/u/3288386/T.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hello! I'm the TicketMaster bot for Skype. I can search for events at ticketmaster.com.");
        session.beginDialog('/help');
    // },
    // function (session, results) {
    //     // Display search menu
    //     session.beginDialog('/search');
    // },
    // function (session, results) {
    //     // Always say goodbye
    //     session.send("See you later!");
    }
]);

bot.dialog('/search', [
    function (session) {
        builder.Prompts.choice(session, "What would you like to find?", "events|venues|(cancel)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(cancel)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the search
            session.send("Ok, cancel this search.");
            session.endDialog();
        }
    },
    function (session, results) {
        // The search menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/search');
    }
]).reloadAction('reloadMenu', null, { matches: /^search/i });

bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands for this bot:\n\n" +
                          "* search - Starts a new search;\n" +
                          "* cancel - End this conversation'\n" +
                          "* help - Displays these commands.");
    }
]);

bot.dialog('/events', [
    function (session) {
        session.send(
          "Ok, lets find an event for you.");
        builder.Prompts.text(session,
          "What event are you trying to find? " +
          "Please enter keyword: title, name, etc.");
    },
    function (session, results) {
        session.userData.keyword = results.response;
        builder.Prompts.text(session, "In what city?");
    },
    function (session, results) {
        session.userData.city = results.response;
        callback = function(response) {
          var body = '';

          response.on('data', function (chunk) {
            body += chunk;
          });

          response.on('end', function () {
            try {
              var jsonObject = JSON.parse(body);
              if (jsonObject._embedded == undefined){
                session.endDialog("Sorry, but there are no such events.");
              } else {
                session.send("How about the following event?");
                var repl = jsonObject._embedded.events[0].name;
                session.userData.eventObject = jsonObject._embedded.events[0];
                session.send(jsonObject._embedded.events[0].images[0].url);
                session.endDialog(repl);
              }
            } catch (err) {
              console.log(err);
            };

          });
        }
        var options = buildOptions(session, 'events',
                                   session.userData.keyword,
                                   session.userData.city);
        https.request(options, callback).end();
    },

]);


bot.dialog('/venues', [
    function (session) {
        session.send(
          "Sure! Let me find a venue.");
        builder.Prompts.text(session,
          "What venue are you trying to find? " +
          "Please enter keyword: title, name, etc.");
    },
    function (session, results) {
        session.userData.keyword = results.response;
        callback = function(response) {
          var body = '';

          response.on('data', function (chunk) {
            body += chunk;
          });

          response.on('end', function () {
            try {
              var jsonObject = JSON.parse(body);
              console.log(jsonObject);
              if (jsonObject._embedded == undefined){
                session.endDialog("Sorry, but there are no such venues.");
              } else {
                session.send("How about the following venue?");
                var repl = jsonObject._embedded.venues[0].name;
                session.userData.eventObject = jsonObject._embedded.venues[0];
                session.send(jsonObject._embedded.venues[0].url);
                session.endDialog(repl);
              }
            } catch (err) {
              console.log(err);
            };

          });
        }
        var options = buildOptions(session, 'venues', session.userData.keyword);
        https.request(options, callback).end();
    },

]);

//=========================================================
// Util Functions
//=========================================================

function buildOptions(session, type, keyword, city, size) {
  if (size == undefined){
    size = 1;
  }
  var params = {'size': size, 'apikey': process.env.API_KEY,
                'keyword': keyword};
  if (city != undefined){
    params['city'] = city;
  }
  var options = {
    host: 'app.ticketmaster.com',
    path: '/discovery/v2/' + type + '.json?' + encodeQueryParams(params),
    method: 'GET'
  };
  return options;
}

function encodeQueryParams(params)
{
   var ret = [];
   for (var p in params)
      ret.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
   return ret.join("&");
}
