////////////////////////////////////////////////////
////////////////此區設計玩家及敵人資料////////////////
////////////////////////////////////////////////////

function BattleInfo(ID,UName,CName,Team,Hp,Mp,Atk,spd,Ability,EW,WS,AS,BS,Skill,MS,MStype,Impact){
  this.ID = ID;
  this.UName = UName;
  this.CName = CName;
  this.Team = Team;
  this.Hp = Hp;
  this.Mp = Mp;
  this.Atk = Atk;
  this.Spd = spd;
  this.Ability = Ability;
  this.EW = EW;
  this.WS = WS;
  this.AS = AS;
  this.BS = BS;
  this.Skill = Skill;
  this.MS = MS;
  this.MStype = MStype;
  this.Immpact = Impact;
  
};


module.exports = {
	BattleInfo
};
