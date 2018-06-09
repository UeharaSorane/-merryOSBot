require('fs').readdirSync('./roll/').forEach(function(file) {
	if (file.match(/\.js$/) !== null && file !== 'index.js') {
	  var name = file.replace('.js', '');
	  exports[name] = require('../roll/' + file);
	}
  });
  
function parseInput(inputStr,UserID,UserN,GroupID) {
	console.log(UserN);
	//console.log('InputStr: ' + inputStr);
	_isNaN = function(obj) 	{
	return isNaN(parseInt(obj));  
	}
	
	let msgSplitor = (/\S+/ig);	
	let mainMsg = inputStr.match(msgSplitor); //定義輸入字串
	let trigger = mainMsg[0].toString().toLowerCase(); //指定啟動詞在第一個詞&把大階強制轉成細階
	
///////////////////////////////////////////////////////
////////////////////////開始分析////////////////////////
///////////////////////////////////////////////////////
	
////////////////////////測試用
	if (trigger.match(/^鸚鵡測試$/) != null) return exports.Testing.ReplyTest(UserN,mainMsg[1]);//測試reply功能用
	if (trigger.match(/^大聲測試$/) != null) return exports.Testing.PushTest(UserID,GroupID);//測試push功能用
	if (trigger.match(/^戰鬥系統測試$/) != null) return exports.Testing.SimBattle(UserID,GroupID,UserN);//測試開啟戰鬥系統功能用
}

module.exports = {
	parseInput:parseInput
};
