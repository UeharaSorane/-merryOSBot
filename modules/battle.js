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
////////////////////////
var battle;
var rply = [];
////////////////////////
var info = [];

info[0] = 0;//是否在群組內遊玩
info[1] = 0;//群組ID
info[2] = 0;//玩家1的ID

info[3] = 0;//玩家1的Hp
info[4] = 0;//電腦的Hp

info[5] = 0;//玩家1的Mp
info[6] = 0;//電腦的Mp

info[7] = 0;//玩家1的Atk
info[8] = 0;//電腦的Atk

info[9] = 0;//經過回合數

info[10] = 0;//玩家1的當前Hp
info[11] = 0;//電腦的當前Hp

info[12] = 0;//玩家1的當前Mp
info[13] = 0;//電腦的當前Mp

info[14] = 0;//玩家1的當前Atk
info[15] = 0;//電腦的當前Atk

info[16] = 0;//玩家1的line名稱
info[17] = 0;//玩家1的腳色名稱

info[18] = 0;//戰鬥類型

info[19] = 0;//電腦的腳色名稱
////////////////////////

function parseInput(inputStr,UserID,UserN) {
	//console.log('InputStr: ' + inputStr);
	_isNaN = function(obj) 	{
	return isNaN(parseInt(obj));  
	}
	
	let msgSplitor = (/\S+/ig);	
	let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
	let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
	
	////////////////管理用指令
	if (trigger.match(/^強制終止戰鬥$/) != null){
		return battleOff();//強制終止戰鬥
	}
	////////////////
	
	
	////////////////無效指令時，直接回覆戰況
	else{
		rply[0] = 'rply';
		rply[1] = battle;
		return rply;
	}
	////////////////
}

function battleON(FightInfo){
	info = FightInfo;
	if(FightInfo[0] == 0){
		bot.push(FightInfo[2],'戰鬥模式啟動');
	}else{
		bot.push(FightInfo[1],'戰鬥模式啟動');
	}
	battlesys('battleOn');
	
	rply[0] = 'rply';
	rply[1] = battle;
	return rply;
}


function battleOff(){
	battle = '戰鬥模式關閉';
	battlesys('battleOff');
	console.log(battle);
	
	if(info[0] == 0){
		bot.push(info[2],battle);
	}else{
		bot.push(info[1],battle);
	}
	
	rply[0] = 'battleOff';
	rply[1] = '戰鬥系統關閉';
	return rply;
	
}

///////////////////////////////////////////////////////
////////////////////////戰鬥系統////////////////////////
///////////////////////////////////////////////////////
function battlesys(command){
	if(command == 'battleOn'){
		if(info[18] == 0){
			info[10] = info[3];
			info[11] = info[4];

			info[12] = info[5];
			info[13] = info[6];

			info[14] = info[7];
			info[15] = info[8];
			
			battle = '[測試戰鬥進行中]\
			\n玩家名:' + info[16] + '\
			\n玩家腳色名:' + info[17] + '\
			\nHp:[';
			var Phpbar = info[10]/info[3]*20;
			for(var i = 0;i<Phpbar;i++){
				battle += '|';
			}
			
			for(var i = 0;i<20-Phpbar;i++){
				battle += ' ';
			}
			
			battle += ']' + info[10] + '/' + info[3] +'(' + Math.ceil(info[10]/info[3]*100) + ')\nMp:';
			
			var Pmpbar = info[12]/info[5]*20;
			for(var i = 0;i<Pmpbar;i++){
				battle += '|';
			}
			
			for(var i = 0;i<20-Pmpbar;i++){
				battle += ' ';
			}
		
			battle += ']' + info[12] + '/' + info[5] +'(' + Math.ceil(info[12]/info[5]*100) + ')\nAtk:' + info[14] + '\n=======VS=======\
			\n電腦腳色名:' + info[19] + '\
			\nHp:';
			var Chpbar = info[11]/info[4]*20;
			for(var i = 0;i<Chpbar;i++){
				battle += '|';
			}
			
			for(var i = 0;i<20-Chpbar;i++){
				battle += ' ';
			}
			
			battle += ']' + info[11] + '/' + info[4] +'(' + Math.ceil(info[11]/info[4]*100) + ')\nMp:';
			
			var Cmpbar = info[13]/info[6]*20;
			for(var i = 0;i<Cmpbar;i++){
				battle += '|';
			}
			
			for(var i = 0;i<20-Cmpbar;i++){
				battle += ' ';
			}
			
			battle += ']' + info[13] + '/' + info[6] +'(' + Math.ceil(info[13]/info[6]*100) + ')\nAtk:' + info[15];
			
			
			
		}
		
	}else if(command == 'battleOff'){
		for(var i = 0;i<info.length;i++){
			info[i] = 0;
		}
	}
	
}


///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
module.exports = {
	parseInput:parseInput,
	battleON,
	battleOff
};
