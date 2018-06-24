function Dice(diceSided){	
	return Math.floor((Math.random() * diceSided) + 1)
}

module.exports = {
	Dice
};
