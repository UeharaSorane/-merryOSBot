var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');

var WeaponDB = new GoogleSpreadsheet('19dmO1oYtwVES_It0rixnrYVojvRMsbz9w5H3yg1Cm9Y');

var Weapons = [];

WeaponDB.useServiceAccountAuth(creds, function (err) {
		
 
	
 // 是先將資料讀進陣列
	WeaponDB.getRows(2 , 
		function (err, rows) {
			if (err) {
				console.log( err );
			}else{
				for(var i=0; i< rows.length; i++){
					Weapons[i] = {};
					
					Weapons[i].ID = rows[i].id;
					Weapons[i].Name = rows[i].name;
					Weapons[i].Rare = rows[i].rare;
					Weapons[i].Type = rows[i].type;
					Weapons[i].HpB = Number(rows[i].hpb);
					Weapons[i].MpB = Number(rows[i].mpb);
					Weapons[i].AtkB = Number(rows[i].atkb);
					Weapons[i].Ability = rows[i].ability;
					Weapons[i].Descirption = rows[i].description;
					Weapons[i].HTGI = rows[i].htgi;
					
				}
				//console.log(Weapons);
				console.log('武器資料 讀取完成');
			}
		

			
			});
	
		
		
	});

function getWeaponData(){
	return Weapons;
}

module.exports = {
	getWeaponData
};
