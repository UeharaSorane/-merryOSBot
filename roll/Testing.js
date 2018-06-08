var rply = [];
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: process.env.LINE_CHANNEL_ID,
	channelSecret: process.env.LINE_CHANNEL_SECRET,
	channelAccechannelAccessToken: process.env.LINE_CHANNEL_ACCESSTOKEN,
});

function ReplyTest(UserN,myText) {
	///確認系統reply功能沒問題用
	rply[0] = 'text';
      
	if(myText == null){
		rply[1] = UserN + '\n你啥都沒說啊...';
	}else{
		rply[1] = UserN + '你剛剛說了：' + myText;
	}
				
	return rply;
	
	///

}


function PushTest(UserID) {
	///確認系統push功能沒問題用
				
	bot.push(UserID,'你在大聲什麼啦？');
	
	///

}

module.exports = {
	ReplyTest,
	PushTest
};
