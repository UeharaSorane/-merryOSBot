var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');

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
					Skills[i] = [];
					
					Skills[i][0] = rows[i].skillname;
					Skills[i][1] = rows[i].type;
					Skills[i][2] = rows[i].range;
					Skills[i][3] = rows[i].multiply;
					
				}
				console.log(Skills);
				console.log('技能資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function damage(move,Atk,Spd){
	//if(move == '通常攻擊')

}


module.exports = {
	damage
};
