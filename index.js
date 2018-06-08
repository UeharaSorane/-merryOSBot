var linebot = require('linebot');
var express = require('express');
require('fs').readdirSync(__dirname + '/modules/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./modules/' + file);
  }
});

var bot = linebot({
	channelId: process.env.LINE_CHANNEL_ID,
	channelSecret: process.env.LINE_CHANNEL_SECRET,
	channelAccechannelAccessToken: process.env.LINE_CHANNEL_ACCESSTOKEN,
});

var app = express();

app.post('/', bot.parser());

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
	var port = server.address().port;
	console.log("App now running on port", port);
	console.log("基本運轉似乎沒問題");
});

var battle = 0;

bot.on('message', function(event) {
	var msg = event.message.text;
	var rply;
	
	event.source.profile().then(function (profile) {
		if(event.message.type == 'text'){
			if(battle == 1){
				if(event.message.text=='強制終止戰鬥'){
					battle = 0;
					rply = '戰鬥被強制終止了';
					
				}else{
					rply = exports.battle.parseInput(msg, event.source.userId, profile.displayName);
				}
			}else{
				rply = exports.analytics.parseInput(msg, event.source.userId, profile.displayName);
			}
			if(rply[0] == 'text'){
				event.reply(rply).then(function (data) {
					  // success
					}).catch(function (error) {
					  // error
				});
			}
		}
	});

});
