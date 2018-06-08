var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: process.env.LINE_CHANNEL_ID,
	channelSecret: process.env.LINE_CHANNEL_SECRET,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
	verify: true
});

var app = express();

app.post('/', bot.parser());

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
	var port = server.address().port;
	console.log("App now running on port", port);
	console.log("基本運轉似乎沒問題");
});

bot.on('message', function(event) {
	if (event.message.type = 'text') {
		var msg = event.message.text;
		event.reply(msg).then(function(data) {
			// success 
			console.log(msg);
		}).catch(function(error) {
			// error 
			console.log('error');
		});
	}
});
