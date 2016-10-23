var builder = require('botbuilder');
var https = require("https");
var restify = require("restify");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});
/*
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api', connector.listen());
*/
var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
var model = "https://api.projectoxford.ai/luis/v1/application?id=9590dd96-5e61-4a7b-815d-920ef577b682&subscription-key=ec1a2ef489f74d4c98036c15d1918a09";
intents = intents.recognizer(new builder.LuisRecognizer(model));

bot.dialog('/', intents);

//=============== intents =============
intents.matches("Bible Verse", [
    function (session, args) {
        try {
            session.userData.topic = builder.EntityRecognizer.findEntity(args.entities, 'topic').entity;
            session.beginDialog('/verse');
        } catch (e) {
            session.send("Sorry, I didn't understand that.");
        }
    }

]);

intents.matches("Game", [
    function (session) {
        session.beginDialog('/game');
    }

]);

intents.matches("Greeting", [
    function (session) {
        session.beginDialog('/greet');
    }

]);

intents.matches("Gospel", [
    function (session) {
        session.beginDialog('/gospel');
    }

]);

intents.matches("Commands", [
    function (session) {
        session.beginDialog('/commands');
    }

]);

intents.matches("None", [
    function (session) {
        session.beginDialog('/commands');
    }
]);

intents.matches("Tongues", [
    function (session) {
        session.beginDialog('/tongues');
    }
]);

//========== dialogs ====================

bot.dialog('/game', [
    function (session) {
        builder.Prompts.text(session, 'Okay! Let\'s play a game!');
    },
    function (session, results) {
        session.endDialog();
    }
]);

bot.dialog('/verse', [
    function (session) {
        https.get({
            host: 'api.biblia.com',
            path: `/v1/bible/search/LEB.js?query=${session.userData.topic}&mode=verse&start=0&limit=10&key=497ed26b357db5d55be1a161d0417f2f`
        }, function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var result = JSON.parse(body);
                var option = Math.floor(Math.random() * result.results.length);
                session.send(result.results[option].title + " - " + result.results[option].preview);
            });
        });

        session.endDialog();
    }
]);

var greetings = [
    "Hey! Peace be with you. John 20:21.",
    "Hi! Holy kisses to you xx. 1 Cor 16:20.",
    "Hello! God working good in our lives! Rom 8:28.",
    "Hi! Walk by the spirit and not by the flesh. Gal 5:16-17.",
    "Hey! Cast your anxieties on the Lord. Phil 4:6-7."
];

bot.dialog('/greet', [
    function (session) {
        session.send(greetings[Math.floor(Math.random() * greetings.length)]);
        session.endDialog();
    }
]);

bot.dialog('/gospel', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/commands', [
    function (session) {
        session.send('Here are the available commands: \n  What does the bible say about [topic]? \n  Let\'s play a game! \n  I need help');
        session.endDialog();
    }
]);

var none = [
    "*Casting Crowns blasting in the background* Wha? Oops, sorry I didn't catch that.",
    "Didn't understand that.. are you speaking in tongues?"
];
bot.dialog('/tongues', [
    function (session) {
        session.send(none[Math.random() < 0.5 ? 0 : 1]);
        session.endDialog();
    }
]);