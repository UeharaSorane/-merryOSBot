var linebot = require('linebot');
var express = require('express');
require('fs').readdirSync(__dirname + '/modules/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    exports[name] = require('./modules/' + file);
  }
});

var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
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
	var rply = [];
	
		if(event.message.type == 'text'){
			event.source.profile().then(function (profile) {
				if(battle == 1){
					rply = exports.battle.parseInput(msg, event.source.userId, profile.displayName, event.source.groupId);
					if(rply[0] == 'battleOff'){
						battle = 0;
					}
				}else{
					rply = exports.analytics.parseInput(msg, event.source.userId, profile.displayName,event.source.groupId);
					if(rply[0] == 'battleOn'){
						battle = 1;
					}
				}
				if(rply[0] == 'rply'){
					event.reply(rply[1]).then(function (data) {
					  // success
					}).catch(function (error) {
					  // error
				});
				}
				
			});
			
		}
});
