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
					Skills[i] = {};
					
					Skills[i].Name = rows[i].skillname;
					Skills[i].Type = rows[i].type;
					Skills[i].Mp = Number(rows[i].mp);
					Skills[i].Range = rows[i].range;
					Skills[i].Plus = Number(rows[i].plus);
					Skills[i].minRM = Number(rows[i].minrm);
					Skills[i].maxRM = Number(rows[i].maxrm);
					Skills[i].SpdM = Number(rows[i].spdm);
					Skills[i].Priority = Number(rows[i].priority);
					Skills[i].Descirption = rows[i].description;
					Skills[i].W = [rows[i].W1,rows[i].W2,rows[i].W3];
					
				}
				console.log(Skills);
				console.log('技能資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function getSkillData(){
	return Skills;
}

module.exports = {
	getSkillData
};
