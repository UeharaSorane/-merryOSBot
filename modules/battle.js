////////////////////////
var BattileUI = require('../battlesys/battleUI.js');
var BattleInfo = BattileUI.BattleInfo;
var rollbase = require('../roll/rollbase.js');
var damageUI = require('../battlesys/damage.js');
var Skill = require('../database/Skill.js');
var Weapon = require('../database/Weapon.js');
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
	
	//console.log(info[3]);
	
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
		
		if(info[3][info[9]].ID == 'c'){
			
			var s = 1;
			
			for(var i = 0;i<3;i++){
				if(info[3][info[9]].Skill[i] != '無') s++;
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
						
						console.log('Nmp = ' + Nmp);
						
						if(info[5][info[9]] >= Nmp){
							if(Skills[M1].Range == '敵方單體'){
								for(var i = 0; i < info[3].length;i++){
									if(info[3][i].Team != info[3][info[9]].Team){
										w++
									}
								}
								
								Ctarget = rollbase.Dice(w);
								
								for(var i =0;i<Ctarget;i++){
									for(var j = 0; j<info[3].length;j++){
										if(info[3][j].Team != info[3][info[9]].Team){
											CT = info[3][j].UName;
											break;
										}
									}

								}
								SB++;
								break;
								
							}else if(Skills[M1].Range == '我方單體'){
								for(var i = 0; i < info[3].length;i++){
									if(info[3][i].Team == info[3][info[9]].Team){
										w++
									}
								}
								
								Ctarget = rollbase.Dice(w);
								
								for(var i =0;i<Ctarget;i++){
									for(var j = 0; j<info[3].length;j++){
										if(info[3][j].Team == info[3][info[9]].Team){
											CT = info[3][j].UName;
											break;
										}
									}

								}
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
		}else{
			bot.push(info[1],'錯誤！無效動作');
				
			return 0;
		}
		
		for(var i = 0; i<Skills.length;i++){
			if(UseSkill == Skills[i].Name){
				
				for(var NM1 = 0;NM1<WD.length;NM1++){
					console.log('武器:' + WD[NM1].Name);
					
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
				
				console.log('NeedMp = ' + NeedMp);
				
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
						
					}else if(Skill[i].Range == '我方全體'){
						say+='我方全體\n\
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
						
					}else if(Skill[i].Range == '全體'){
						say+='全體\
							\n 所有玩家都會受到影響';
					}else if(Skill[i].Range == '自身'){
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
							
							console.log('WT = ' + WT);
							
							
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
														console.log('1');
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
											}
											
										}
										
									}	
								}else if(spdl[i][0] == '回復'){
									for(var j = 0;j<Skills.length;j++){
										if(Skills[j].Name == spdl[i][6]){
											if(Skills[j].Range == '我方單體'){
												for(var k =0;k<info[3].length;k++){
													if(info[3][k].UName == spdl[i][4][0]){
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
			bot.push(info[1],SayResult);
			info[6]++;
			info[9] = 0;
			info[10].length = 0;
			battlesys('battleOn');
			setTimeout(function(){battlesys('MoveRequest'); }, 2000);
		}
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
