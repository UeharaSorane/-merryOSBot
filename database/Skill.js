var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');

var SkillDB = new GoogleSpreadsheet('19dmO1oYtwVES_It0rixnrYVojvRMsbz9w5H3yg1Cm9Y');

var Skill = [];

SkillDB.useServiceAccountAuth(creds, function (err) {
		
 
	
 // 是先將資料讀進陣列
	SkillDB.getRows(1 , 
		function (err, rows) {
			if (err) {
				console.log( err );
			}else{
				for(var i=0; i< rows.length; i++){
					Skill[i] = {};
					
					Skills[i].Name = rows[i].skillname;
					Skills[i].Type = rows[i].type;
					Skills[i].Range = rows[i].range;
					Skills[i].Plus = rows[i].plus;
					Skills[i].minRM = rows[i].minrm;
					Skills[i].maxRM = rows[i].maxrm;
					Skills[i].SpdM = rows[i].spdm;
					Skills[i].Priority = rows[i].priority;
					Skills[i].Descirption = rows[i].description;
					
				}
				console.log(Skills);
				console.log('技能資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function getSkillData(){
	return Skill;
}

module.exports = {
	getSkillData
};
