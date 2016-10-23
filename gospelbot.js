var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
var model = "https://api.projectoxford.ai/luis/v1/application?id=9590dd96-5e61-4a7b-815d-920ef577b682&subscription-key=ec1a2ef489f74d4c98036c15d1918a09";
intents = intents.recognizer(new builder.LuisRecognizer(model));

bot.dialog('/', intents);

//=============== intents =============
intents.matches("Biblical Figure", [
    function (session) {
        session.beginDialog('/figure');
    }

]);

intents.matches("Bible Verse", [
    function (session) {
        session.beginDialog('/verse');
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

intents.matches("None", [
    function (session) {
        session.beginDialog('/none');
    }

]);

//========== dialogs ====================
bot.dialog('/figure', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

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
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/greet', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
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

bot.dialog('/none', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);