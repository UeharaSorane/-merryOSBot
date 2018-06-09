var rply = [];
var linebot = require('linebot');
var express = require('express');
var battle = require('../modules/battle.js');

var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
});

function ReplyTest(UserN,myText) {
	///確認系統reply功能沒問題用
	rply[0] = 'rply';
      
	if(myText == null){
		rply[1] = UserN + '\n你啥都沒說啊...';
	}else{
		rply[1] = UserN + '你剛剛說了：' + myText;
	}
	console.log(rply);		
	return rply;
	
	///

}


function PushTest(UserID,GroupID) {
	///確認系統push功能沒問題用
	rply[0] = 'push';
	
	if(GroupID != null){
		bot.push(GroupID,'你在大聲什麼啦？');
	}else{
		bot.push(UserID,'你在大聲什麼啦？');
	}
	///

}

function SimBattle(UserID,GroupID){
	var FightInfo = [];
	
	FightInfo[0] = 0;//是否在群組內遊玩
	FightInfo[1] = 0;//群組ID
	FightInfo[2] = 0;//玩家1的ID
	
	if(GroupID != null){
		FightInfo[0] = 1;
		FightInfo[1] = GroupID;
	}else{
		FightInfo[0] = 0;
	}
	
	FightInfo[2] = UserID;
	
	battle.battleON(FightInfo);
	
	rply[0] = 'battleOn';
	return rply;
}

module.exports = {
	ReplyTest,
	PushTest,
	SimBattle
};
