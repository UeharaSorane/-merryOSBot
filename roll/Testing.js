var rply = [];
var linebot = require('linebot');
var express = require('express');
var battle = require('../modules/battle.js');
var BattileUI = require('../battlesys/battleUI.js');

var BattleInfo = BattileUI.BattleInfo;

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
	
	return rply;

}

function SimBattle(UserID,GroupID,UserN){
	var FightInfo = [];
	
	FightInfo[0] = 0;//是否在群組內遊玩
	FightInfo[1] = 0;//群組ID
	
	if(GroupID != null){
		FightInfo[0] = 1;
		FightInfo[1] = GroupID;
	}else{
		rply[0] = 'rply';
		rply[1] = '請在群組內戰鬥';
		return rply;
	}
	FightInfo[2] = 1;//戰鬥類型
	
	FightInfo[3] = [];//戰鬥員情報
	FightInfo[3][0] = new BattleInfo(UserID,UserN,'測試用玩家','player',10,10,2,10,'無','無','無','無','無','無','無','無','無','無');
	FightInfo[3][1] = new BattleInfo('c','電腦','測試用電腦','computer',10,10,2,10,'無','無','無','無','無','無','無','無','無','無');
	
	FightInfo[4] = '測試用戰鬥';//戰鬥名稱
	
	FightInfo[5] = ['player','computer'];
	
	battle.battleON(FightInfo);
	
	rply[0] = 'battleOn';
	rply[1] = '';
	return rply;
}

module.exports = {
	ReplyTest,
	PushTest,
	SimBattle
};
