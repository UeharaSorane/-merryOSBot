var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: process.env.LINE_CHANNEL_ID,
	channelSecret: process.env.LINE_CHANNEL_SECRET,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
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
	if(event.message.type == 'text') {
		console.log(event.message.text); //把收到訊息的 event 印出來看看
		event.reply('Hello, world').then(function (data) {
			// success
		}).catch(function (error) {
			// error
		});
		
	}
});
