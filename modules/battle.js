////////////////////////
var BattileUI = require('../battlesys/battleUI.js');
var BattleInfo = BattileUI.BattleInfo;
var rollbase = require('../roll/rollbase.js');
var damageUI = require('../battlesys/damage.js');
var Skill = require('../database/Skill.js');
var NormalSys = require('./NormalSys.js');
var linebot = require('linebot');
var express = require('express');
////////////////////////
var bot = linebot({
	channelId: "1568211787",
	channelSecret: "9848b4e4a814dd07e84212da82bad4a3",
	channelAccessToken: "68lsiTjqwl30Ff6Ik5NH7KYW4FGyRsZYV+NZcVsS85CU3o+QaiLETQNZgaZwYNKkdX71iUjw4pz1OfJCkJeovBzfvF2Eoit0anKv9/Mxxd6OEY06r20Ad6Lxi3rdadSKqE8khBgJZUYxQDbLndtoBQdB04t89/1O/w1cDnyilFU=",
});
////////////////////////
var battle;
var rply = [];

var Skills = Skill.getSkillData();
////////////////////////
var BTon = 0;
var info = [];

info[0] = 0;//是否在群組內遊玩
info[1] = 0;//群組ID
info[2] = 0;//戰鬥類型

info[3] = [];//戰鬥員資料
info[4] = [];//當前Hp
info[5] = [];//當前Mp

info[6] = 1;//經過回合數
info[7] = 0;//戰鬥名稱
info[8] = [];//團隊名稱
info[9] = 0;//輪到誰行動
info[10] = [];//紀錄行動

////////////////////////

function parseInput(inputStr,UserID,UserN,GroupID) {
	//console.log('InputStr: ' + inputStr);
	_isNaN = function(obj) 	{
	return isNaN(parseInt(obj));  
	}
	
	let msgSplitor = (/\S+/ig);	
	let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
	let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
	
	////////////////判定是否在戰鬥
	if(BTon == 0){
		var R = NormalSys.NormalMode(mainMsg,trigger,UserID,UserN,GroupID);
		
		if(R[0] == 'battleOn'){
			battleON(R[1]);
		}else{
			return R;
		}
		
	}
	////////////////
	
	////////////////管理用指令
	if (trigger.match(/^強制終止戰鬥$/) != null){
		return battleOff();//強制終止戰鬥
	}
	////////////////
	
	////////////////戰鬥用指令
	if (trigger.match(/^戰鬥$/) != null){
		if(UserID == info[3][info[9]].ID){
			battlesys('move',mainMsg[1],mainMsg[2],info[3][info[9]].UName);
			
		}else{
			rply[0] = 'rply';
			rply[1] = '現在不是你行動喔';
			return rply;
		}
	}
	
	if (trigger.match(/^戰況$/) != null){
			rply[0] = 'rply';
			rply[1] = battle;
			return rply;
	}
	////////////////
	
	////////////////無效指令時，無作用
	else{
		rply[0] = 'rply';
		rply[1] = '';
		return rply;
	}
	////////////////
}

function battleON(FightInfo){
	
	BTon = 1;
	
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
	
	setTimeout(function(){battlesys('MoveRequest'); }, 2000);
}


function battleOff(){
	
	BTon = 0;
	battlesys('battleOff');
	
	rply[0] = 'rply';
	rply[1] = '戰鬥系統關閉';
	return rply;
	
}

///////////////////////////////////////////////////////
////////////////////////戰鬥系統////////////////////////
///////////////////////////////////////////////////////
function battlesys(command,move,target,commander){
	if(command == 'battleOn'){
		/////通常對戰系統
		if(info[2] == 1){
			battle = '[' + info[7] + '] 目前回合:' + info[6] + '\n';
			
			for(var i = 0; i < info[8].length;i++){
				battle += '---團隊:' + info[8][i]  + '---\n';
				
				for(var j = 0;j < info[3].length;j++){
					if(info[3][j].Team == info[8][i]){
						battle += '玩家名:' + info[3][j].UName + '\
							\n角色名:' + info[3][j].CName;
						
						if(info[4][j]<=0){
							battle += '(戰鬥不能)';
						}
						battle +='\nHp[';
						
						var HpP = info[4][j]/info[3][j].Hp*20;
						for(var k = 0; k < HpP;k++){
							battle += '|';
						}
						for(var k = 0; k < 20-HpP;k++){
							battle += ' ';
						}
						
						battle += '](' + info[4][j] + '/' + info[3][j].Hp + ')\
							\nMp[';
						
						var MpP = info[5][j]/info[3][j].Mp*20;
						for(var k = 0; k < MpP;k++){
							battle += '|';
						}
						for(var k = 0; k < 20-MpP;k++){
							battle += ' ';
						}
						
						battle += '](' + info[5][j] + '/' + info[3][j].Mp + ')\n';
					}
				}
			}
		}
			
		
	}else if(command == 'MoveRequest'){
		console.log(info[3][info[9]].ID);
		
		if(info[3][info[9]].ID == 'c'){
			
			var s = 1;
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無') s++;
			}
			
			var Cmove = rollbase.Dice(s);
			
			var w=0;
			for(var i = 0; i < info[3].length;i++){
				if(info[3][i].Team != info[3][info[9]].Team){
					w++
				}
			}
			var Ctarget = rollbase.Dice(w);
			
			var CT;
			
			for(var i =0;i<Ctarget;i++){
				for(var j = 0; j<info[3].length;j++){
					if(info[3][j].Team != info[3][info[9]].Team){
						if(CT != info[3][j].UName){
							CT = info[3][j].UName;
							break;
						}
					}
				}
				
			}
			if(info[4][info[9]]>0){
				console.log(info[4][info[9]]);
				battlesys('move',Cmove,CT,info[3][info[9]].UName);
			}else{
				battlesys('move','Dead');
			}
			
			
			
		}else{
			var say = '輪到' + info[3][info[9]].UName + '的行動了！\
					\n角色名:' + info[3][info[9]].CName + '\
					\nHp[';
						
			var HpP = info[4][info[9]]/info[3][info[9]].Hp*20;
			for(var k = 0; k < HpP;k++){
				say += '|';
			}
			for(var k = 0; k < 20-HpP;k++){
				say += ' ';
			}

			say += '](' + info[4][info[9]] + '/' + info[3][info[9]].Hp + ')\
				\nMp[';
			
			var MpP = info[5][info[9]]/info[3][info[9]].Mp*20;
			for(var k = 0; k < MpP;k++){
				say += '|';
			}
			for(var k = 0; k < 20-MpP;k++){
				say += ' ';
			}

			say += '](' + info[5][info[9]] + '/' + info[3][info[9]].Mp + ')\
					\n--------------------\
					\n你可以:\
					\n 1.通常攻擊\n';
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無'){
					say +=' ' +  (i+2) + '.' + info[3][info[9]].Skill[i] + '\n';
				}
			}
			
			say += '\n--------------------\
				\n請輸入 [戰鬥 行動編號] 決定行動\
				\n或輸入 [戰況] 確認目前情勢';
			
			if(info[4][info[9]]>0){
				bot.push(info[1],say);
			}else{
				var say = '玩家' + info[3][info[9]].UName + '已被擊倒！\
					\n無法行動';
				bot.push(info[1],say);
				
				battlesys('move','Dead');
				
				return 0;
			}
			
		}
	}else if(command == 'move'){
		
		if(move == 1){
			if(target == null){
				say = '你可以攻擊的對象:\n';
				for(var i = 0; i < info[3].length;i++){
					if(info[3][i].Team != info[3][info[9]].Team && info[4][i]>0){

						say += '玩家名:' + info[3][i].UName + '\
						\n角色名:' + info[3][i].CName + '\
						\nHp[';

						var HpP = info[4][i]/info[3][i].Hp*20;
						for(var k = 0; k < HpP;k++){
							say += '|';
						}
						for(var k = 0; k < 20-HpP;k++){
							say += ' ';
						}

						say += '](' + info[4][i] + '/' + info[3][i].Hp + ')\n\n';

					}
				}
				
				say += '請輸入 [戰鬥 1 對象玩家名(角色名)] 確認攻擊\
					\n如果想更換其他行動 請輸入 [戰鬥 行動編號]';
				
				bot.push(info[1],say);
				
				return 0;
			}else{
				for(var i = 0;i<info[3].length;i++){
					if(target == info[3][i].UName||target == info[3][i].CName){
						if(info[3][i].Team == info[3][info[9]].Team || info[4][i]<=0){
							bot.push(info[1],'錯誤！無效對象');

							return 0;
						}else{
							
							info[10][info[9]] = ['通常攻擊',info[3][i].UName,commander];
							
						}
					}
				}
				
				
			}	
		}else if(move == 'Dead'){
				
				
		}else{
			bot.push(info[1],'錯誤！無效動作');
				
			return 0;
		}
		
		info[9]++;

		if(info[9] == info[3].length){
			battlesys('result');

			return 0;
		}

		battlesys('MoveRequest');

		return 0;
		
	}else if(command == 'result'){	
		var resultA = [];
		
		console.log(info[10]);
		
		for(var i =0;i<info[10].length;i++){
			for(var j = 0;j<info[3].length;j++){
				if(info[3][j].UName == info[10][i][2]){
					var data = {
						UName: info[3][j].UName,
						Move: info[10][i][0],
						MaxHp: info[3][j].Hp,
						NowHp: info[4][j],
						MaxMp: info[3][j].Mp,
						NowMp: info[5][j],
						Atk: info[3][j].Atk,
						Spd: info[3][j].Spd,
						Target: info[10][i][1]
					};
					
					resultA[i] = damageUI.damage(data);
				}
			}
		}
		
		var spdl = resultA;
		
		for(var i =0;i<spdl.length;i++){
			var temp = spdl[i];
			for(var j =i+1; j<spdl.length;j++){
				if(spdl[i][3] < spdl[j][3]){
					spdl[i] = spdl[j];
					spdl[j] = temp;
				}else if(spdl[i][3] == spdl[j][3]){
					if(spdl[i][2] < spdl[j][2]){
						spdl[i] = spdl[j];
						spdl[j] = temp;
					}else if(spdl[i][2] == spdl[j][2]){
						var Dic = rollbase.Dice(2);
						console.log(Dic);
						
						
						if(Dic == 2){
							spdl[i] = spdl[j];
							spdl[j] = temp;
						}
					}
				}
			}
		}
		
		console.log(spdl);

		
		var SayResult = '戰鬥回合:' + info[6] + '\n--------------------';
		
		for(var i =0;i<spdl.length;i++){
			if(spdl[i][0] == '傷害'){
				for(var j =0;j <info[3].length;j++){
					if(info[3][j].UName == spdl[i][4]){
						info[4][j]-= spdl[i][1];
						
						SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n攻擊' + info[3][j].CName;
						
						SayResult += '\n承受' + spdl[i][1] + '點傷害\
								\nHp[';

						var HpP = info[4][j]/info[3][j].Hp*20;
						for(var k = 0; k < HpP;k++){
							SayResult += '|';
						}
						for(var k = 0; k < 20-HpP;k++){
							SayResult += ' ';
						}

						SayResult += '](' + info[4][j] + '/' + info[3][j].Hp + ')';
						
						if(info[4][j] <= 0){
							SayResult += '\n' + info[3][j].CName + '被打倒了！';
							
							var GameEnd = battlesys('DefeatCheck');
							if(GameEnd == 1){
								SayResult += '\n--------------------';
								
								bot.push(info[1],SayResult);
								
								for(var i = 0;i<info[3].length;i++){
									if(info[4][i] > 0){

										SayResult = '戰鬥結束！\
												\nWinner:';

										for(var k = 0; k<info[3].length;k++){
											if(info[3][k].Team == info[3][i].Team){
												SayResult += '\n' + info[3][k].UName;
											}
										}
										setTimeout(function(){
											bot.push(info[1],SayResult); 
											setTimeout(function(){BTon = 0; battlesys('battleOff');}, 2000);
										}, 1000);
										
										return 0;
									}
								}
							}
						}
					}
				}	
			}
			
			SayResult += '\n--------------------';
		}
		
		
		bot.push(info[1],SayResult);
		info[6]++;
		info[9] = 0;
		info[10] = [0];
		battlesys('battleOn');
		setTimeout(function(){battlesys('MoveRequest'); }, 2000);
	}else if(command == 'DefeatCheck'){
		for(var i = 0;i<info[3].length;i++){
			if(info[4][i] > 0){
				for(var j = 0 ; j<info[3].length;j++){
					if(info[4][j] > 0 && info[3][j].Team != info[3][i].Team){
						return 0;
					}
				}
				
				return 1;
				
				SayResult = '戰鬥結束！\
						\nWinner:';
				
				for(var k = 0; k<info[3].length;k++){
					if(info[3][k].Team == info[3][i].Team){
						SayResult += '\n' + info[3][k].UName;
					}
				}
				
				BTon = 0;
				bot.push(info[1],SayResult);
				battlesys('battleOff');
				
				
			}
		}
		
	}else if(command == 'battleOff'){
		info[0] = 0;//是否在群組內遊玩
		info[1] = 0;//群組ID
		info[2] = 0;//戰鬥類型

		info[3] = [];//戰鬥員資料
		info[4] = [];//當前Hp
		info[5] = [];//當前Mp

		info[6] = 1;//經過回合數
		info[7] = 0;//戰鬥名稱
		info[8] = [];//團隊名稱
		info[9] = 0;//輪到誰行動
		info[10] = [];//紀錄行動
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
