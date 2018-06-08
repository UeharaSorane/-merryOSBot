var rply = [];
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
});

function ReplyTest(UserN,myText) {
	///確認系統reply功能沒問題用
	rply[0] = 'text';
      
	if(myText == null){
		rply[1] = UserN + '\n你啥都沒說啊...';
	}else{
		rply[1] = UserN + '你剛剛說了：' + myText;
	}
	console.log(rply);		
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
