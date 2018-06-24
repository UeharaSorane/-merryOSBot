////////////////////////////////////////////////////
////////////////此區設計玩家及敵人資料////////////////
////////////////////////////////////////////////////

function BattleInfo(ID,UName,CName,Team,Hp,Mp,Atk,spd,Ability,WS,AS,BS,S1,S2,S3,MS,MStype,Impact){
  this.ID = ID;
  this.UName = UName;
  this.CName = CName;
  this.Team = Team;
  this.Hp = Hp;
  this.Mp = Mp;
  this.Atk = Atk;
  this.spd = spd;
  this.Ability = Ability;
  this.WS = WS;
  this.AS = AS;
  this.BS = BS;
  this.S1 = S1;
  this.S2 = S2;
  this.S3 = S3;
  this.MS = MS;
  this.MStype = MStype;
  this.Immpact = Impact;
  
};


module.exports = {
	BattleInfo
};
