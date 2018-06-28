var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var rollbase = require('../roll/rollbase.js');
var Skill = require('../database/Skill.js');

var Skills = Skill.getSkillData();

function damage(data){
	var type;
	
	
	for(var i = 0; i<Skills.length;i++){
		if(data.Move == Skills[i].Name){
			if(Skills[i].Type == '攻擊'){
				type ='傷害';
				
				var RM;
				
				if(Skills[i].maxRM != Skills[i].minRM){
					RM = rollbase.Dice(Skills[i].maxRM-Skills[i].minRM+1);
				}else{
					RM = 1;
				}
				
				var Multiply = Skills[i].minRM + RM -1;
				
				console.log(Multiply);
				
				var dmg = Math.floor(data.Atk*Multiply/100 + Skills[i].Plus);
				var rspd = data.Spd*Skills[i].SpdM;
				
				return [type,dmg,rspd,Skills[i].Priority,data.Target,data.UName,data.Move];
			}
		}
	}

}


module.exports = {
	damage
};
