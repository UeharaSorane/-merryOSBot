var BattileUI = require('../battlesys/battleUI.js');
var BattleInfo = BattileUI.BattleInfo;

var rollbase = require('../roll/rollbase.js');

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
info[2] = 0;//戰鬥類型

info[3] = [];//戰鬥員資料
info[4] = [];//當前Hp
info[5] = [];//當前Mp

info[6] = 0;//經過回合數
info[7] = 0;//戰鬥名稱
info[8] = [];//團隊名稱
info[9] = 0;//輪到誰行動

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
	//console.log(FightInfo[3][0].Hp);
	info[0] = FightInfo[0];
	info[1] = FightInfo[1];
	info[2] = FightInfo[2];
	info[3] = FightInfo[3];
	
	for(var i = 0;i<FightInfo[3].length;i++){
		info[4][i] = FightInfo[3][i].Hp;
		info[5][i] = FightInfo[3][i].Mp;
	}
	
	info[7] = FightInfo[4];
	info[8] = FightInfo[5];
	
	battlesys('battleOn');

	bot.push(info[1],battle);

}


function battleOff(){
	battlesys('battleOff');
	
	rply[0] = 'battleOff';
	rply[1] = '戰鬥系統關閉';
	return rply;
	
}

///////////////////////////////////////////////////////
////////////////////////戰鬥系統////////////////////////
///////////////////////////////////////////////////////
function battlesys(command){
	if(command == 'battleOn'){
		/////通常對戰系統
		if(info[2] == 1){
			battle = '[' + info[7] + '開始] 經過回合數:' + info[6] + '\n';
			
			for(var i = 0; i < info[8].length;i++){
				battle += '---團隊:' + info[8][i]  + '---\n';
				
				for(var j = 0;j < info[3].length;j++){
					if(info[3][j].Team == info[8][i]){
						battle += '玩家名:' + info[3][j].UName + '\
							\n角色名:' + info[3][j].CName + '\
							\nHp[';
						
						var HpP = info[4][j]/info[3][j].Hp*20;
						for(var k = 0; k < HpP;k++){
							battle += '|';
						}
						for(var k = 0; k < 20-HpP;k++){
							battle += ' ';
						}
						
						battle += '](' + info[4][j] + '/' + info[3][j].Hp + ')\
							\nMp[';
						
						var MpP = info[4][j]/info[3][j].Mp*20;
						for(var k = 0; k < MpP;k++){
							battle += '|';
						}
						for(var k = 0; k < 20-MpP;k++){
							battle += ' ';
						}
						
						battle += '](' + info[4][j] + '/' + info[3][j].Mp + ')\n';
					}
				}
			}
			
			battlesys('Move');
		}
			
		
	}else if(command == 'Move'){
		if(info[3][info[9]].ID == 'c'){
			var s = 1;
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無') s++;
			}
			
			var Cmove = rollbase.Dice(s);
			
		}else{
			var say = '輪到' + info[3][info[9]].UName + '的行動了！\
				\n你可以:\
				\n 1.普攻\n';
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無'){
					say +=' ' +  (i+2) + '.' + info[3][info[9]].Skill[i] + '\n';
				}
			}
			
			bot.push(info[1],say);
			
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
