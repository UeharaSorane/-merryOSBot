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
	var msg = event.message.text;
	
	event.source.profile().then(function (profile) {
		let msgSplitor = (/\S+/ig);	
		let mainMsg = msg.match(msgSplitor); //定義輸入字串
		let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
		
		var rply = null;
		var UserN = profile.displayName;
		
		if(mainMsg[0] == '鸚鵡測試'){
			if(mainMsg[1] == null){
				rply = UserN + '你啥都沒說啊...';
			}else{
				rply = UserN + '你剛剛說了：' + mainMsg[1];
			}
			event.reply(rply).then(function (data) {
				  // success
				}).catch(function (error) {
				  // error
				});	
		
		}else if(mainMsg[0] == '主動對話測試'){
		}
	});

});
