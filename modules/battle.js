////////////////////////
var BattileUI = require('../battlesys/battleUI.js');
var BattleInfo = BattileUI.BattleInfo;
var rollbase = require('../roll/rollbase.js');
var damageUI = require('../battlesys/damage.js');
var Skill = require('../database/Skill.js');
var Weapon = require('../database/Weapon.js');
var Impact = require('../database/Impact.js');
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
var WD = Weapon.getWeaponData();
var ImpactD = Impact.getImpactData();
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
info[11] = [];//異常狀態
info[12] = [];//攻擊力加成
info[13] = 0;//爆裂解禁
info[14] = [];//是否使用過必殺技
info[15] = 0;//輪到誰確認必殺技
info[16] = [];//是否可以使用必殺技
info[17] = [];//紀錄必殺技

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
	
	if (trigger.match(/^必殺技$/) != null){
		if(UserID == info[3][info[15]].ID){
			battlesys('ImpactMove',mainMsg[1],info[3][info[15]].UName);
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
	
	//console.log(info[3]);
	
	for(var i = 0;i<FightInfo[3].length;i++){
		info[4][i] = FightInfo[3][i].Hp;
		info[5][i] = FightInfo[3][i].Mp;
	}
	
	info[7] = FightInfo[4];
	info[8] = FightInfo[5];
	for(var AB = 0;AB<FightInfo.length;AB++){
		info[12].push(100);
		info[14].push(0);
		info[16].push(0);
	}
	
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
			
			if(info[13] == 1) battle += '爆裂解禁！\n';
			
			for(var i = 0; i < info[8].length;i++){
				battle += '---團隊:' + info[8][i]  + '---\n';
				
				for(var j = 0;j < info[3].length;j++){
					if(info[3][j].Team == info[8][i]){
						battle += '玩家名:' + info[3][j].UName + '\
							\n角色名:' + info[3][j].CName;
						
						if(info[4][j]<=0){
							battle += '(戰鬥不能)';
						}else if(Array.isArray(info[11][j]) == true){
							if(info[11][j][0] != '無') battle += '(' + info[11][j][0] + 'x' + info[11][j][1] + ')';
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
		
		if(info[3][info[9]].ID == 'c'){
			
			var s = 1;
			
			var LiveE = [];
			LiveE.length = 0;
			
			for(var LE1 = 0;LE1<info[3].length;LE1++){
				if(info[3][LE1].Team != info[3][info[9]].Team && info[4][LE1]>0){
					LiveE.push(info[3][LE1].UName);
				}
			}
			
			var LiveM = [];
			LiveM.length = 0;
			
			for(var LM1 = 0;LM1<info[3].length;LM1++){
				if(info[3][LM1].Team == info[3][info[9]].Team && info[4][LM1]>0){
					LiveM.push(info[3][LM1].UName);
				}
			}
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無') s++;
			}
			
			if(info[13] == 1){
				if(info[3][info[9]].MS != '無') s++;
			}	
			
			var Cmove = 0;
			var SD;
			var w=0;
			var Ctarget = 0
			var CT;
			
			var SB = 0;
			
			while(SB == 0){
				
				
				Cmove = rollbase.Dice(s);
				
				if(Cmove == 1){
					SD = '通常攻擊';
				}else if(Cmove == s){
					SD = info[3][info[9]].MS;
				}else{
					SD = info[3][info[9]].Skill[Cmove-2];
					
					
				}

				for(var M1 = 0;M1<Skills.length;M1++){

					if(SD == Skills[M1].Name){
						var Nmp = 0;
						var cwt;
						
						for(var NMC1 = 0;NMC1<WD.length;NMC1++){
							if(info[3][info[9]].EW == WD[NMC1].Name){
								cwt = WD[NMC1].Type;
								break;
							}
						}
						
						for(var NMC2 = 0;NMC2<Skills[M1].W.length;NMC2++){
							if(cwt == Skills[M1].W[NMC2]){
								Nmp = Skills[M1].Mp/2;
							}else{
								Nmp = Skills[M1].Mp;
							}
						}
						
						//console.log('Nmp = ' + Nmp);
						
						if(info[5][info[9]] >= Nmp){
							if(Skills[M1].Range == '敵方單體'){

								Ctarget = rollbase.Dice(LiveE.length);
								CT = LiveE[Ctarget-1];
								SB++;
								break;
								
							}else if(Skills[M1].Range == '我方單體'){
								Ctarget = rollbase.Dice(LiveM.length);
								CT = LiveM[Ctarget-1];
								SB++;
								break;
								
							}else if(Skills[M1].Range == '敵方全體'){
								CT = '敵方全體';
								SB++;
								break;
								
							}else if(Skills[M1].Range == '我方全體'){
								CT = '我方全體';
								SB++;
								break;
								
							}else if(Skills[M1].Range == '全體'){
								CT = '全體';
								SB++;
								break;
								
							}else if(Skills[M1].Range == '自身'){
								CT = '自身';
								SB++;
								break;
								
							}
						}

					}
				}
			}
			if(info[4][info[9]]>0){
				battlesys('move',Cmove,CT,info[3][info[9]].UName);
			}else{
				battlesys('move','Dead');
			}
			
			
			
		}else{
			var say = '';
			
			if(info[13] == 1) say = '爆裂解禁中！可以使用夥伴技能還有必殺技！\n';
			
			say += '輪到' + info[3][info[9]].UName + '的行動了！\
					\n角色名:' + info[3][info[9]].CName; 
			
			if(Array.isArray(info[11][info[9]]) == true){
				if(info[11][info[9]][0] != '無') say += '(' + info[11][info[9]][0] + 'x' + info[11][info[9]][1] + ')';
			}
			
			say+='\nHp[';
						
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
			
			
			if(info[13] == 1&&info[3][info[9]].MS!='無') say +='夥伴技能.' + info[3][info[9]].MS + '\n';
			
			
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
		var UseSkill;
		var NeedMp = 0;
		
		if(move == 1){
			UseSkill = '通常攻擊';
		}else if(move == 'Dead'){
			
		}else if(move == 2||move == 3 || move == 4){
			if(info[3][info[9]].Skill[move-2] !='無'){
				UseSkill = info[3][info[9]].Skill[move-2];
				
			}else{
				bot.push(info[1],'錯誤！無效動作');
				
				return 0;
			}
		}else if(move == '夥伴技能'){
			UseSkill = info[3][info[9]].MS;
		}else{
			bot.push(info[1],'錯誤！無效動作');
				
			return 0;
		}
		
		for(var i = 0; i<Skills.length;i++){
			if(UseSkill == Skills[i].Name){
				
				for(var NM1 = 0;NM1<WD.length;NM1++){
					//console.log('武器:' + WD[NM1].Name);
					
					if(info[3][info[9]].EW == WD[NM1].Name){
						for(var NM2 = 0;NM2< Skills[i].W.length;NM2++){
							if(WD[NM1].Type == Skills[i].W[NM2]){
								NeedMp = Skills[i].Mp/2;
								NM1 = WD.length;
								
								break;
							}else{
								NeedMp = Skills[i].Mp;
							}
						}
					}
				}				
				
				if(target == null){
					say = '技能名稱:' + Skills[i].Name + '\
						\n 消耗Mp:' + NeedMp + '\
						\n 施放範圍:' + Skills[i].Range + '\
						\n 描述:\n' + Skills[i].Description + '\
						\n--------------------\
						\n你可以選擇的對象有:\n';
					
					if(Skills[i].Range == '敵方單體'){
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
					}else if(Skills[i].Range == '我方單體'){
						for(var i = 0; i < info[3].length;i++){
							if(info[3][i].Team == info[3][info[9]].Team && info[4][i]>0){

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
					}else if(Skills[i].Range == '敵方全體'){
						say+='敵方全體\n\
							\n以下玩家都會受到影響:\n';
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
						
					}else if(Skills[i].Range == '我方全體'){
						say+='我方全體\n\
							\n以下玩家都會受到影響:\n';
						for(var i = 0; i < info[3].length;i++){
							if(info[3][i].Team == info[3][info[9]].Team && info[4][i]>0){

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
						
					}else if(Skills[i].Range == '全體'){
						say+='全體\
							\n 所有玩家都會受到影響\n';
					}else if(Skills[i].Range == '自身'){
						say+='自身';
						
						say += '玩家名:' + info[3][info[9]].UName + '\
						\n角色名:' + info[3][info[9]].CName + '\
						\nHp[';

						var HpP = info[4][info[9]]/info[3][info[9]].Hp*20;
						for(var k = 0; k < HpP;k++){
							say += '|';
						}
						for(var k = 0; k < 20-HpP;k++){
							say += ' ';
						}

						say += '](' + info[4][info[9]] + '/' + info[3][info[9]].Hp + ')\n\n';
					}
					
					say += '請輸入 [戰鬥 ' + move +' 對象名(角色,團體)] 確認行動\
						\n如果想更換其他行動 請輸入 [戰鬥 行動編號]';

					bot.push(info[1],say);

					return 0;
					
					
					
				}else{
					if(info[5][info[9]] >= NeedMp){
						if(Skills[i].Range == '敵方單體'){
							for(var j = 0;j<info[3].length;j++){
								if(target == info[3][j].UName||target == info[3][j].CName){
									if(info[3][j].Team == info[3][info[9]].Team || info[4][j]<=0){
										bot.push(info[1],'錯誤！無效對象');

										return 0;
									}else{

										info[10].push([UseSkill,[info[3][j].UName],commander]);

									}
								}
							}
							
						}else if(Skills[i].Range == '我方單體'){
							for(var j = 0;j<info[3].length;j++){
								if(target == info[3][j].UName||target == info[3][j].CName){
									if(info[3][j].Team != info[3][info[9]].Team || info[4][j]<=0){
										bot.push(info[1],'錯誤！無效對象');

										return 0;
									}else{

										info[10].push([UseSkill,[info[3][j].UName],commander]);

									}
								}
							}
							
						}else if(Skills[i].Range == '敵方全體'){
							if(target != '敵方全體'){
								console.log(target);
								
								bot.push(info[1],'錯誤！無效對象');

								return 0;
							}else{
								var TgGroup = [];
								for(var j = 0;j<info[3].length;j++){
									if(info[3][j].Team != info[3][info[9]].Team && info[4][j]>0){
										TgGroup.push(info[3][j].UName);
									}
								}
								
								info[10].push([UseSkill,TgGroup,commander]);
							}
						}else if(Skills[i].Range == '我方全體'){
							if(target != '我方全體'){
								bot.push(info[1],'錯誤！無效對象');

								return 0;
							}else{
								var TgGroup = [];
								for(var j = 0;j<info[3].length;j++){
									if(info[3][j].Team == info[3][info[9]].Team && info[4][j]>0){
										TgGroup.push(info[3][j].UName);
									}
								}
								
								info[10].push([UseSkill,TgGroup,commander]);
							}
						}else if(Skills[i].Range == '全體'){
							if(target != '全體'){
								bot.push(info[1],'錯誤！無效對象');

								return 0;
							}else{
								var TgGroup = [];
								for(var j = 0;j<info[3].length;j++){
									if(info[4][j]>0){
										TgGroup.push(info[3][j].UName);
									}
								}
								
								info[10].push([UseSkill,TgGroup,commander]);
							}
						}else if(Skills[i].Range == '自身'){
							if(target == info[3][info[9]].UName||target == info[3][info[9]].CName || target == '自身'){
								info[10].push([UseSkill,[info[3][info[9]].UName],commander]);
							}else{
								bot.push(info[1],'錯誤！無效對象');

								return 0;
							}
							
						}
					
					}else{
						bot.push(info[1],'錯誤！Mp不足');

						return 0;
					}
					
				}
			}
		}
		
		info[9]++;

		if(info[9] == info[3].length){
			battlesys('result');

			return 0;
		}

		battlesys('MoveRequest');

		return 0;
		
	}else if(command == 'result'){	
		var GE = 0;
		
		var resultA = [];
		
		//console.log(info[10]);
		
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
						Atk: Math.floor(info[3][j].Atk*info[12][j]/100),
						Spd: info[3][j].Spd,
						Target: info[10][i][1]
					};
					
					resultA[i] = damageUI.damage(data);
				}
			}
		}
		
		//console.log(resultA);
		
		var spdl = resultA;
		
		for(var i =0;i<spdl.length-1;i++){
			var temp = spdl[i];
			
			for(var j = i-1;j>=0;j--){
				if(spdl[j][3]<spdl[i][3]){
					spdl[i] = spdl[j];
					spdl[j] = temp;
				}else if(spdl[j][3] == spdl[i][3]){
					if(spdl[j][2]<spdl[i][2]){
						spdl[i] = spdl[j];
						spdl[j] = temp;
					}else if(spdl[j][2] == spdl[i][2]){
						var Dic = rollbase.Dice(2);
						//console.log(Dic);
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
			
			for(var sm1 = 0;sm1<Skills.length;sm1++){
				if(spdl[i][6] == Skills[sm1].Name){
					for(var sm2 = 0;sm2<info[3].length;sm2++){
						if(spdl[i][5] == info[3][sm2].UName){
							if(info[4][sm2]<=0){
								sm1 = Skills.length;
								break;
							}
							
							var NeedMp = 0;
							var WT ='';
							
							
							for(var sm3 = 0; sm3<WD.length;sm3++){
								if(info[3][sm2].EW == WD[sm3].Name){
									WT = WD[sm3].Type;
									break;
								}
							}
							
							//console.log('WT = ' + WT);
							
							
							for(var sm4 = 0; sm4<Skills[sm1].W.length;sm4++){
								
								if(WT == Skills[sm1].W[sm4]){
									NeedMp = Skills[sm1].Mp/2;
									break;
								}else{
									NeedMp = Skills[sm1].Mp;
								}
							}
							
							
							if(info[5][sm2]>=NeedMp){
								info[5][sm2]-=NeedMp;
								
								if(spdl[i][0] == '傷害'){
									for(var j = 0;j<Skills.length;j++){
										if(Skills[j].Name == spdl[i][6]){
											if(Skills[j].Range == '敵方單體'){
												for(var k =0;k<info[3].length;k++){
													if(info[3][k].UName == spdl[i][4][0]){
														//console.log('1');
														if(info[4][k]<=0){
															SayResult +='\n' +  spdl[i][5] + '想使用' + spdl[i][6] + '\
																	\n 卻因為對象已被打倒而施放失敗！';
														}else{
															info[4][k]-= spdl[i][1];

															SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n攻擊' + info[3][k].CName;

															SayResult += '\n承受' + spdl[i][1] + '點傷害\
																	\nHp[';

															var HpP = info[4][k]/info[3][k].Hp*20;
															for(var l = 0; l < HpP;l++){
																SayResult += '|';
															}
															for(var l = 0; l < 20-HpP;l++){
																SayResult += ' ';
															}

															SayResult += '](' + info[4][k] + '/' + info[3][k].Hp + ')';

															var KC = battlesys('killCheck','',info[3][k].UName);


															SayResult += KC[1];

															if(KC[0] == 1){
																GE = battlesys('DefeatCheck');

																if(GE == 1){
																	SayResult += '\n--------------------';
																	bot.push(info[1],SayResult);
																	battlesys('GameEnd');
																	return 0;

																}

															}
														}
														
														j = Skills.length;
													}
												}	
											}else if(Skills[j].Range == '敵方全體'){
												
												SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n攻擊敵方全體\n';
												
												for(var EAll1 = 0;EAll1<spdl[i][4].length;EAll1++){
													for(var k =0;k<info[3].length;k++){
														if(info[3][k].UName == spdl[i][4][EAll1]){
															if(info[4][k]<=0){
																break;
															}

															info[4][k]-= spdl[i][1];

															SayResult +=info[3][k].CName + '\n承受' + spdl[i][1] + '點傷害\
																	\nHp[';

															var HpP = info[4][k]/info[3][k].Hp*20;
															for(var l = 0; l < HpP;l++){
																SayResult += '|';
															}
															for(var l = 0; l < 20-HpP;l++){
																SayResult += ' ';
															}

															SayResult += '](' + info[4][k] + '/' + info[3][k].Hp + ')';

															var KC = battlesys('killCheck','',info[3][k].UName);


															SayResult += KC[1] + '\n';

															if(KC[0] == 1){
																GE = battlesys('DefeatCheck');

																if(GE == 1){
																	SayResult += '\n--------------------';
																	bot.push(info[1],SayResult);
																	battlesys('GameEnd');
																	return 0;

																}
															}
														}
													}
												}
												
												j = Skills.length;
											}else if(Skills[j].Range == '全體'){
												
												SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n攻擊全體玩家\n';
												
												for(var EAll1 = 0;EAll1<spdl[i][4].length;EAll1++){
													for(var k =0;k<info[3].length;k++){
														if(info[3][k].UName == spdl[i][4][EAll1]){
															if(info[4][k]<=0){
																break;
															}

															info[4][k]-= spdl[i][1];

															SayResult +=info[3][k].CName + '\n承受' + spdl[i][1] + '點傷害\
																	\nHp[';

															var HpP = info[4][k]/info[3][k].Hp*20;
															for(var l = 0; l < HpP;l++){
																SayResult += '|';
															}
															for(var l = 0; l < 20-HpP;l++){
																SayResult += ' ';
															}

															SayResult += '](' + info[4][k] + '/' + info[3][k].Hp + ')';

															var KC = battlesys('killCheck','',info[3][k].UName);


															SayResult += KC[1] + '\n';

															if(KC[0] == 1){
																GE = battlesys('DefeatCheck');

																if(GE == 1){
																	SayResult += '\n--------------------';
																	bot.push(info[1],SayResult);
																	battlesys('GameEnd');
																	return 0;

																}
															}
														}
													}
												}
												
												j = Skills.length;
											}
											
										}
										
									}	
								}else if(spdl[i][0] == '回復'){
									for(var j = 0;j<Skills.length;j++){
										if(Skills[j].Name == spdl[i][6]){
											if(Skills[j].Range == '我方單體'){
												for(var k =0;k<info[3].length;k++){
													if(info[3][k].UName == spdl[i][4][0]){
														if(info[4][k]<=0){
															SayResult +='\n' +  spdl[i][5] + '想使用' + spdl[i][6] + '\
																	\n 卻因為對象已被打倒而施放失敗！';
														}else{
															info[4][k]+= spdl[i][1];
														
															if(info[4][k]>info[3][k].Hp) info[4][k] = info[3][k].Hp;

															SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n治癒' + info[3][k].CName;

															SayResult += '\n恢復' + spdl[i][1] + '點Hp\
																	\nHp[';

															var HpP = info[4][k]/info[3][k].Hp*20;
															for(var l = 0; l < HpP;l++){
																SayResult += '|';
															}
															for(var l = 0; l < 20-HpP;l++){
																SayResult += ' ';
															}

															SayResult += '](' + info[4][k] + '/' + info[3][k].Hp + ')';
														}
													}
													j = Skills.length;
												}
												
											}else if(Skills[j].Range == '我方全體'){
												
												SayResult +='\n' +  spdl[i][5] + '使用' + spdl[i][6] + '\n治癒我方全體\n';
												
												for(var EAll1 = 0;EAll1<spdl[i][4].length;EAll1++){
													for(var k =0;k<info[3].length;k++){
														if(info[3][k].UName == spdl[i][4][EAll1]){
															if(info[4][k]<=0){
																break;
															}

															info[4][k]+= spdl[i][1];
															if(info[4][k]>info[3][k].Hp) info[4][k] = info[3][k].Hp;

															SayResult +=info[3][k].CName + '\n恢復' + spdl[i][1] + '點Hp\
																	\nHp[';

															var HpP = info[4][k]/info[3][k].Hp*20;
															for(var l = 0; l < HpP;l++){
																SayResult += '|';
															}
															for(var l = 0; l < 20-HpP;l++){
																SayResult += ' ';
															}

															SayResult += '](' + info[4][k] + '/' + info[3][k].Hp + ')\n';
														}
													}
												}
												
												j = Skills.length;
											}
										}	
									}
								}
								
								
								if(Skills[sm1].Effect != ['無']){
									var Effect1 = [];
									for(var E0 = 0; E0<Skills[sm1].Effect.length;E0++){
										Effect1.push(Skills[sm1].Effect[E0].split(','))
									}
									
									for(var E1 = 0;E1<Skills[sm1].Effect.length;E1++){
										
										if(Effect1[E1][0] == 'MpRecoverPer'){
											if(Effect1[E1][2] == '自身'){
												info[5][sm2] += (info[3][sm2].Mp/Effect1[E1][1]);
												if(info[5][sm2]>info[3][sm2].Mp) info[5][sm2] = info[3][sm2].Mp;
												
											}
										}else if(Effect1[E1][0] == 'GiveBurn'){
											if(Effect1[E1][2] == '被命中者'){
												for(var Burn1 = 0;Burn1<spdl[i][4].length;Burn1++){
													for(var Burn2 = 0;Burn2<info[3].length;Burn2++){
														if(info[3][Burn2].UName == spdl[i][4][Burn1]){
															var GiveB = rollbase.Dice(100);
															
															if(GiveB<=Effect1[E1][1]){
																SayResult +='\n' +  info[3][Burn2].CName + '燃燒起來了！';
																info[11][Burn2] = ['燃燒',Effect1[E1][3]];
															}
														}
													}
												}
											}
										}
									}
								}
							}else{
								SayResult +='\n' +  spdl[i][5] + '想使用' + spdl[i][6] + '\
										\n 卻因為魔力不足而無法使用！';
							}
						}
					}
				}
			}
			
			
			
			SayResult += '\n--------------------';
		}
		
		if(GE == 0){
			info[15] = 0;
			bot.push(info[1],SayResult);
			battlesys('ImpactCheck');
		}
	}else if(command == 'ImpactCheck'){
		if(info[13] == 1){
			if(info[3][info[15]].Impact !='無' && info[4][info[15]]>0){
				console.log(1);
				for(var Impact1 = 0;Impact1 < ImpactD.length;Impact1++){
					//console.log(info[3][info[15]]);
					if(info[3][info[15]].Impact == ImpactD[Impact1].Name){
						console.log(2);
						var con = [];
						var ImpOK = 0;

						con[0] =  ImpactD[Impact1].con[0].split(',');
						con[1] =  ImpactD[Impact1].con[1].split(',');
						con[2] =  ImpactD[Impact1].con[2].split(',');
						
						for(var Impact3 = 0;Impact3<3;Impact3++){
							
							if(con[Impact3][0] != '無'){
								console.log(3);
								
								if(con[Impact3][0] == 'LastE'){
									console.log(4);
									
									var LE = 0;
									for(var Impact3a = 0; Impact3a<info[3].length;Impact3a++){
										if(info[3][Impact3a].Team != info[3][info[15]].Team && info[4][Impact3a]>0){
											LE++;
										}
									}
									if(LE<=con[Impact3][1]) ImpOK++;
								}else if(con[Impact3][0] == 'LowerHpH'){
									if(info[4][info[15]] >= con[Impact3][1]) ImpOK++;
									
								}else if(con[Impact3][0] == 'LowerHpE'){

									for(var Impact3b = 0; Impact3b<info[3].length;Impact3b++){
										if(info[3][Impact3b].Team != info[3][info[15]].Team && info[4][Impact3a] <= con[Impact3][1]) ImpOK++;
										break;
									}
								}
							}else{
								ImpOK++;
							}
						}
						
						//console.log('ImpOK: ' + ImpOK);
														     
						if(ImpOK>=3 && info[14][info[15]] == 0){
							
							
							info[14][info[16]] = 1;
							
							if(info[3][info[15]].ID == 'c'){
								if(info[5][info[15]] >= ImpactD[Impact1].Mp) battlesys('ImpactMove','施放',info[3][info[15]].UName);
								else battlesys('ImpactMove','不施放',info[3][info[15]].UName);
							}else{
								var SayImp = '玩家' + info[3][info[15]].UName + '達成必殺技所有條件，可以施放必殺技\
										\n 請問要施放必殺技嗎？\
										\n--------------------\
										\n必殺技名稱:' + info[3][info[15]].Impact + '\
										\n必殺技類型:' + ImpactD[Impact1].Type + '\
										\n消耗Mp:' + ImpactD[Impact1].Mp + '\
										\n描述:\n' + ImpactD[Impact1].Description  + '\
										\n--------------------\
										\n如果想要施放的話，請輸入[必殺技 施放]\
										\n反之，請輸入[必殺技 不施放]';

								bot.push(info[1],SayImp);
							}
						}else{
							console.log(5);
							battlesys('ImpactMove');
						}
					}
				}
			}else{
				console.log(5);
				battlesys('ImpactMove');
			}
		}else{
			info[6]++;
			info[9] = 0;
			info[10].length = 0;
			if(info[13] != 1) setTimeout(function(){battlesys('BurstCheck'); }, 500);
			setTimeout(function(){ battlesys('AbSCheck'); }, 1000);
			setTimeout(function(){ battlesys('battleOn'); }, 1500);
			setTimeout(function(){ battlesys('MoveRequest'); }, 2000);
			
		}
	}else if(command == 'ImpactMove'){
		console.log(6);
		
		if(move == '施放'){
			for(var IC = 1;IC<ImpactD.length;IC++){
				if(info[5][info[15]]>=ImpactD[IC].Mp){
					info[5][info[15]]-=ImpactD[IC].Mp;
					info[17].push = [ImpactD[IC].Name,info[3][info[15]].UName,info[3][info[15]].Spd*ImpactD[IC].SpdM,info[3][info[15]].Team];
					break;
				}else{
					bot.push(info[1],'錯誤！Mp不足');

					return 0;
				}
			}
		}
		
		info[15]++;
		if(info[15] >= info[3].length) battlesys('ImpactActive');
		else battlesys('ImpactCheck');
	}else if(command == 'ImpactActive'){
		console.log(7);
		var spdl = info[17];
		
		if(spdl.length >0){
			for(var i =0;i<spdl.length-1;i++){
				var temp = spdl[i];

				for(var j = i-1;j>=0;j--){
					if(spdl[j][2]<spdl[i][2]){
						spdl[i] = spdl[j];
						spdl[j] = temp;
					}else if(spdl[j][2] == spdl[i][2]){
						var Dic = rollbase.Dice(2);
						//console.log(Dic);
						if(Dic == 2){
							spdl[i] = spdl[j];
							spdl[j] = temp;
						}
					}
				}
			}

			var SayImpA = '';

			for(var ImpA1 = 0; ImpA1<spdl.length;ImpA1++){

				for(var ImpA2 = 0;ImpA2<ImpactD.length;ImpA2++){
					if(spdl[ImpA1][0] == ImpactD[ImpA2].Name){
						SayImpA = '玩家 ' + spdl[ImpA1][1] + '要施放必殺技了！';
						bot.push(info[1],SayImpA);

						for(var ImpA3 = 0; ImpA3<ImpactD[ImpA2].CharLine.length;ImpA3++){
							setTimeout(function(){bot.push(info[1],ImpactD[ImpA2].CharLine[ImpA3]); }, 500);
						}

						if(ImpactD[ImpA2].Type == '強擊'){
							if(ImpactD[ImpA2].Range == '敵方全體'){
								for(var ImpA4a = 0;ImpA4a<info[3].length;ImpA4a++){
									if(info[3][ImpA4a].Team != spdl[ImpA1][3] && info[4][ImpA4a]>0){
										info[4][ImpA4a]-= ImpactD[ImpA2].Dmg;

										SayResult +=info[3][ImpA4a].CName + '\n承受' + ImpactD[ImpA2].Dmg + '點傷害\
														\nHp[';
										var HpP = info[4][ImpA4a]/info[3][ImpA4a].Hp*20;
										for(var l = 0; l < HpP;l++){
											SayResult += '|';
										}
										for(var l = 0; l < 20-HpP;l++){
											SayResult += ' ';
										}

										SayResult += '](' + info[4][ImpA4a] + '/' + info[3][ImpA4a].Hp + ')';

										var KC = battlesys('killCheck','',info[3][ImpA4a].UName);


										SayResult += KC[1] + '\n';

										if(KC[0] == 1){
											GE = battlesys('DefeatCheck');

											if(GE == 1){
												SayResult += '\n--------------------';
												bot.push(info[1],SayResult);
												battlesys('GameEnd');
												return 0;

											}
										}
									}
								}
							}
						}

					}
				}
			}
			
		}

		info[6]++;
		info[9] = 0;
		info[10].length = 0;
		if(info[13] != 1) setTimeout(function(){battlesys('BurstCheck'); }, 500);
		setTimeout(function(){ battlesys('AbSCheck'); }, 1000);
		setTimeout(function(){ battlesys('battleOn'); }, 1500);
		setTimeout(function(){ battlesys('MoveRequest'); }, 2000);
	}else if(command == 'DefeatCheck'){
		for(var DC1 = 0;DC1<info[3].length;DC1++){
			if(info[4][DC1] > 0){
				for(var DC2 = 0 ; DC2<info[3].length;DC2++){
					if(info[4][DC2] > 0 && info[3][DC2].Team != info[3][DC1].Team){
						return 0;
					}
				}
				return 1;		
			}
		}
		
	}else if(command == 'killCheck'){
		for(var k1 = 0;k1<info[3].length;k1++){
			if(target == info[3][k1].UName){
				if(info[4][k1] <=0){
					return [1,'\n' + info[3][k1].CName + ' Hp歸0，再起不能！\n'];
				}else{
					return [0,'\n'];
				}
			}
		}
	}else if(command == 'BurstCheck'){
		var SayBurst;
		
		if(info[6] >= 5){
			SayBurst = '爆裂之時已經來臨！借助夥伴及必殺技卡片的力量吧！';
			info[13] = 1;
			
		}else{
			SayBurst = '距離爆裂解禁還差' + (5 - info[6]) + '回合！';
		}
		bot.push(info[1],SayBurst);
		return 0;
		
	}else if(command == 'AbSCheck'){
		var SayAbs = '';
		
		for(var abs1 = 0;abs1<info[3].length;abs1++){
			if(Array.isArray(info[11][abs1]) == true){
				if(info[11][abs1][0] == '燃燒'){
					if(info[11][abs1][1] <= 0){
						info[11][abs1] = ['無',0];
					}else{
						if(info[4][abs1]>0){
							info[4][abs1] -= Math.floor(info[3][abs1].Hp/10);

							SayAbs = info[3][abs1].CName + '因為燃燒狀態\
										\n 承受' + Math.floor(info[3][abs1].Hp/10) + '的傷害！\nHp[';

							var HpP = info[4][abs1]/info[3][abs1].Hp*20;
							for(var l = 0; l < HpP;l++){
								SayAbs += '|';
							}
							for(var l = 0; l < 20-HpP;l++){
								SayAbs += ' ';
							}

							SayAbs += '](' + info[4][abs1] + '/' + info[3][abs1].Hp + ')';

							var KC = battlesys('killCheck','',info[3][abs1].UName);


							SayAbs += KC[1] + '\n--------------------';

							if(KC[0] == 1){
								GE = battlesys('DefeatCheck');

								if(GE == 1){
									SayAbs += '\n--------------------';
									bot.push(info[1],SayAbs);
									battlesys('GameEnd');
									return 0;

								}
							}

							info[11][abs1][1]--;
						}
					}
				}
			}
		}
		
		bot.push(info[1],SayAbs);
	}else if(command == 'GameEnd'){
		for(var GE1 = 0;GE1 < info[3].length;GE1++){
			if(info[4][GE1] > 0){
				var SayR = '戰鬥結束！\
					\nWinner:';
				
				for(var GE2 = 0;GE2 < info[3].length;GE2++){
					if(info[3][GE2].Team == info[3][GE1].Team){
						SayR += '\n' + info[3][GE2].UName;
					}
				}
				
				setTimeout(function(){
					bot.push(info[1],SayR); 
					setTimeout(function(){BTon = 0; battlesys('battleOff');}, 2000);
				}, 1000);
				return 0;
			}
		}
		
	}else if(command == 'battleOff'){
		info[0] = 0;//是否在群組內遊玩
		info[1] = 0;//群組ID
		info[2] = 0;//戰鬥類型

		info[3].length = 0;//戰鬥員資料
		info[4].length = 0;//當前Hp
		info[5].length = 0;//當前Mp

		info[6] = 1;//經過回合數
		info[7] = 0;//戰鬥名稱
		info[8].length = 0;//團隊名稱
		info[9] = 0;//輪到誰行動
		info[10].length = 0;//紀錄行動
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
