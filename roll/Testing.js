function ReplyTest(UserN,myText) {
	///確認系統reply功能沒問題用
	var rply;
      
	if(myText == null){
		rply = UserN + '\n你啥都沒說啊...';
	}else{
		rply = UserN + '你剛剛說了：' + myText;
	}
				
	return rply;
	
	///

}

module.exports = {
	ReplyTest
};
