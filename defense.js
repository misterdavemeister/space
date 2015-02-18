function displayDefense(planet) {
	var defenseEl = document.getElementById('defense1');
	if (planet.shipyardBuilding.level < 1) defenseEl.innerHTML = 'You must build a shipyard.'
	else defenseEl.innerHTML = 'defensey defensey defensey';
}

/*
this.getConstructionTimeDefense = function() {
			return Math.floor((((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 50) / 1000 ) / Math.pow(2, currentPlanet.shipyardBuilding.level)) * 1000; 
};*/