var rply = [];

function ReplyTest(UserN,myText) {
	///確認系統reply功能沒問題用
	rply[0] = 'reply';
      
	if(myText == null){
		rply[1] = UserN + '\n你啥都沒說啊...';
	}else{
		rply[1] = UserN + '你剛剛說了：' + myText;
	}
				
	return rply;
	
	///

}


function PushTest(UserN) {
	///確認系統reply功能沒問題用
	rply[0] = 'push';
      
	rply[1] ='你在大聲什麼啦!!!!!' +  UserN;
				
	return rply;
	
	///

}

module.exports = {
	ReplyTest,
	PushTest
};
