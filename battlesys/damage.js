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
				
				var Multiply = Skills[i].minRM + rollbase.Dice(Skills[i].maxRM-Skills[i].minRM);
				
				var dmg = Atk*Multiply;
				var rspd = Spd*Skills[i].SpdM;
				
				return [type,dmg,Spd,Skills[i].Priority,T,Who,move];
			}
		}
	}

}


module.exports = {
	damage
};
