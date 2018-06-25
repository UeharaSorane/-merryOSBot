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
					Skills[i].Multiply = rows[i].multiply;
					Skills[i].Plus = rows[i].plus;
					
				}
				console.log(Skills);
				console.log('技能資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function damage(move,Atk,Spd){
	for(var i = 0; i<Skills.length;i++){
		if(move == Skills[i].Name){
			if(Skills[i].Type == '攻擊'){
				var dmg = Atk*Skills[i].multiply
				
			}
		}
	}

}


module.exports = {
	damage
};
