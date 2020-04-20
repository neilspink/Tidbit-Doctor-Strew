const config = require('./config.json');
const Discord = require('discord.js');
const Twit = require('twit');

const client = new Discord.Client();

// you can only
const botName1 = '<@' + config.discord_bot_id + '>';
const botName2 = '<@!' + config.discord_bot_id + '>';

client.once('ready', () => {
	console.log('Ready!');
});

function BlankOutIrrelevant(words) {
	for (var i = 0; i < words.length; i++) {
		if (words[i].indexOf('<@!') >= 0) {
			words[i] = "";
		}
		if (words[i].startsWith("!")) {
			words[i] = "";
		}
	}
}

function SortLongestFirst(words) {
	words.sort(function (a, b) {
		return b.length - a.length;
	});
}

function GetFirstTen(words) {
	var items = ((words.length > 10) ? 10 : words.length);

	var search = "";

	for (var i = 0; i < items; i++) {
		search += words[i] + " ";
	}
	return search;
}

client.on('message', message => {
	if (message === '!ping') {
		message.channel.send('Pong.');
	}

	console.log("-----");
	console.log(message.content);

	if (message.content.indexOf(botName1)  >= 0 || message.content.indexOf(botName2) >= 0)
	{
		var words = message.content.split(" ");

		BlankOutIrrelevant(words);
		SortLongestFirst(words);

		var search = GetFirstTen(words);

		console.log("search twitter for: " + search);

		try {

			var T = new Twit({
				consumer_key: config.twitter_consumer_key,
				consumer_secret: config.twitter_consumer_secret,
				access_token: config.twitter_access_token,
				access_token_secret: config.twitter_access_token_secret,
				timeout_ms: 8000,
				strictSSL: true,
			});

			T.get('search/tweets', {q: search, count: 1}, function (err, data, response) {

				//console.log(data);

				if (data.statuses[0] != undefined) {

					var result = data.statuses[0].text;
					var final = result.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

					console.log("response: " + final);
					message.reply(final);
				}
				else
				{
					var i = Math.floor(Math.random() * 10); //between 0 to 9
					var response = [
						"I'm thinking.",
						"Blah! Blah!",
						"I'm Busy!",
						"Cool story, bro.",
						"Sorry fella, I don’t have the energy to pretend to like you today.",
						"Umm...pardon me, I wasn’t listening. Can you repeat what you just said?",
						"Ok.",
						"Sorry, I don’t understand what you’re saying.",
						"Thank you very much for thinking about me! Bye.",
						"Shhh!"];

					console.log("response: " + response[i]);
					message.reply(response[i]);
				}
			})
		}
		catch(err)
		{
			message.reply("Blah! Blah! I'm Busy Dealing With Errors...");
			console.log(err.message);
		}
	}

});

client.login(config.discord_token)
