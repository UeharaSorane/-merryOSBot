var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var rollbase = require('../roll/rollbase.js');
var Skill = require('../database/Skill.js');

var Skills = Skill.getSkillData();

function damage(Who,move,Atk,Spd,T){
	var type;
	
	
	for(var i = 0; i<Skills.length;i++){
		if(move == Skills[i].Name){
			if(Skills[i].Type == '攻擊'){
				type ='傷害';
				
				var RM;
				
				if(Skills[i].maxRM != Skills[i].minRM){
					RM = rollbase.Dice(Skills[i].maxRM-Skills[i].minRM);
				}else{
					RM = 0;
				}
				
				var Multiply = Skills[i].minRM + RM;
				
				var dmg = Atk*Multiply;
				var rspd = Spd*Skills[i].SpdM;
				
				return [type,dmg,rspd,Skills[i].Priority,T,Who,move];
			}
		}
	}

}


module.exports = {
	damage
};
