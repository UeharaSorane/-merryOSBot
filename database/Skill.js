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
					Skills[i].Description = rows[i].description;
					Skills[i].W = [rows[i].w1,rows[i].w2,rows[i].w3];
					
					let Effect1 = rows[i].effect.split(';');
					let Effect2 = [];
					
					for(var sp1 = 0; sp1<Effect1.length;sp1++){
						Effect2.push(Effect1[sp1].split(','));
					}
					
					console.log(Effect2);
					
					Skills[i].Effect = Effect2;
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
