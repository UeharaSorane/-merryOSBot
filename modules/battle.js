require('fs').readdirSync('./roll/').forEach(function(file) {
	if (file.match(/\.js$/) !== null && file !== 'index.js') {
	  var name = file.replace('.js', '');
	  exports[name] = require('../roll/' + file);
	}
});
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
});


var battle;
var rply = [];

function parseInput(inputStr,UserID,UserN) {
	//console.log('InputStr: ' + inputStr);
	_isNaN = function(obj) 	{
	return isNaN(parseInt(obj));  
	}
	
	let msgSplitor = (/\S+/ig);	
	let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
	let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
	
///////////////////////////////////////////////////////
////////////////////////開始戰鬥////////////////////////
///////////////////////////////////////////////////////
	rply[0] = 'text';
	rply[1] = battle;
	return rply;
}

function battleON(FightInfo){
	battle = '戰鬥模式啟動';
	console.log(battle);
	if(FightInfo[0] == 0){
		bot.push(FightInfo[2],battle);
	}else{
		bot.push(FightInfo[1],battle);
	}
	
}

module.exports = {
	parseInput:parseInput,
	battleON
};
