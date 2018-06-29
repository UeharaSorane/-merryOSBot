
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');

var SkillDB = new GoogleSpreadsheet('19dmO1oYtwVES_It0rixnrYVojvRMsbz9w5H3yg1Cm9Y');

var Skills = [];

SkillDB.useServiceAccountAuth(creds, function (err) {
		
 
	
 // 是先將資料讀進陣列
	SkillDB.getRows(3 , 
		function (err, rows) {
			if (err) {
				console.log( err );
			}else{
				for(var i=0; i< rows.length; i++){
					Skills[i] = {};
					
					Skills[i].Name = rows[i].name;
					Skills[i].Type = rows[i].type;
					Skills[i].Mp = Number(rows[i].mp);
					Skills[i].Range = rows[i].range;
					Skills[i].con= [rows[i].effect.con1(','),rows[i].effect.con2(','),rows[i].effect.con3(',')];
					Skills[i].Dmg = Number(rows[i].dmg);
					Skills[i].Effect= rows[i].effect.split(';');
					Skills[i].Description = rows[i].description;
					Skills[i].CScrpit= rows[i].effect.cscrpit('/');


				}
				console.log(Skills);
				console.log('必殺技資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function getImpactData(){
	return Skills;
}

module.exports = {
	getImpactData
};
