var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var rollbase = require('../roll/rollbase.js');

var SkillDB = new GoogleSpreadsheet('19dmO1oYtwVES_It0rixnrYVojvRMsbz9w5H3yg1Cm9Y');

var Skills = [];

SkillDB.useServiceAccountAuth(creds, function (err) {
		
 
	
 // 是先將資料讀進陣列
	SkillDB.getRows(1 , 
		function (err, rows) {
			if (err) {
				console.log( err );
			}else{
				for(var i=0; i< rows.length; i++){
					Skills[i].Name = rows[i].skillname;
					Skills[i].Type = rows[i].type;
					Skills[i].Range = rows[i].range;
					Skills[i].Plus = rows[i].plus;
					Skills[i].minRM = rows[i].minrm;
					Skills[i].maxRM = rows[i].maxrm;
					Skills[i].SpdM = rows[i].spdm;
					Skills[i].Priority = rows[i].priority;
					
				}
				console.log(Skills);
				console.log('技能資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function damage(move,Atk,Spd,T){
	var type;
	
	for(var i = 0; i<Skills.length;i++){
		if(move == Skills[i].Name){
			if(Skills[i].Type == '攻擊'){
				type ='傷害';
				
				var Multiply = Skills[i].minRM + rollbase.Dice(Skills[i].maxRM-Skills[i].minRM);
				
				var dmg = Atk*Multiply;
				var rspd = Spd*Skills[i].SpdM;
				
				return type dmg rspd Skills[i].Priority T;
			}
		}
	}

}


module.exports = {
	damage
};
