var builder = require('botbuilder');
var https = require("https");
var nodeMailer = require("nodemailer");

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
var model = "https://api.projectoxford.ai/luis/v1/application?id=9590dd96-5e61-4a7b-815d-920ef577b682&subscription-key=ec1a2ef489f74d4c98036c15d1918a09";
intents = intents.recognizer(new builder.LuisRecognizer(model));


var transporter = nodeMailer.createTransport("SMTP", {
           host: 'smtp-mail.outlook.com',
           secureConnection: false, // TLS requires secureConnection to be false
           port: 587,
           auth: {
               user: 'gospelbot@outlook.com',
               pass: 'c4tk2016'
           },
		   tls: {
			   ciphers: "SSLv3"
		   }
       });



       var mailOptions = {
           from: 'gospelbot@outlook.com',
           to: 'chew.andreas@gmail.com',
           subject: 'Prayer Request',
           text: 'Hi, a person needs your prayer!'
       };

       

bot.dialog('/', intents);

//=============== intents =============
intents.matches("Biblical Figure", [
    function (session) {
        session.beginDialog('/figure');
    }

]);

intents.matches("Bible Verse", [
    function (session, args) {
        session.userData.topic = builder.EntityRecognizer.findEntity(args.entities, 'topic').entity;
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

intents.matches("Commands", [
    function (session) {
        session.beginDialog('/commands');
    }

]);

intents.matches("Contact", [
    function (session) {
        session.beginDialog('/contact');
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
        https.get({
            host: 'api.biblia.com',
            path: `/v1/bible/search/ASV.js?query=${session.userData.topic}&mode=verse&start=0&limit=3&key=497ed26b357db5d55be1a161d0417f2f`
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                var result = JSON.parse(body);
                console.log(result);
                session.send(result.results[0].title + " - " + result.results[0].preview);
            });
        });

        session.endDialog();
    }
]);

bot.dialog('/greet', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.send('Hello %s!', results.response);
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
        builder.Prompts.text(session, 'Here are the available commands: \n  What does the bible say about [topic]? \n  Let\'s play a game! \n  I need help');
		session.endDialog();
    }
]);

bot.dialog('/contact', [
    function (session) {
        builder.Prompts.text(session, 'Would you like to me to email a pastor your prayer request?');
    },
    function (session, results) {
        if (results.response == "yes" || results.response == "yea" || results.response == "sure") {
			builder.Prompts.text(session, 'Would you like to provide your email?');
			
		} else {
			session.send("Alright, I'll pray for you in my matrix!");
			session.endDialog();
		}	
    },
	function (session, results) {
		if (results.response == "yes" || results.response == "yea" || results.response == "sure") {
			builder.Prompts.text(session, 'What\'s your email?');
			sendTemplateEmail();
		} else {
			session.send("Alright, I'll keep you annonomous!");
			session.endDialog();
		}	
	},
	function (session, results) {
		session.send("Alright, I'm sending the email right now!");

		var email = results.response;
		mailOptions = {
           from: 'gospelbot@outlook.com',
           to: 'chew.andreas@gmail.com',
           subject: 'Prayer Request',
           text: 'Hi, a person needs your prayer! \nHere\'s their email! \n' + email
       };
	   sendTemplateEmail();
	   
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

function sendTemplateEmail() {
	transporter.sendMail(mailOptions, function(error, response){
				if(error){
					console.log(error);
				}else{
					console.log("Message sent: " + response.message);
				}
				//transporter.close();
		});
}