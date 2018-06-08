var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
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
	event.source.profile().then(function (profile) {
		console.log(profile);
		if (event.message.type = 'text') {
			var msg = profile.displayName + '說：\
				\n「' + event.message.type + '」';
			
			event.reply(msg).then(function(data) {
				// success 
				console.log(msg);
			}).catch(function(error) {
				// error 
				console.log('error');
			});
		}
	});

});
