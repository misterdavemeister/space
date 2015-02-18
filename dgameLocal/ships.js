
/************************************* SHIP CONSTRUCTOR *************************************/
function Ship(type, amount, baseCostMetal, baseCostCrystal, baseCostFuel, armor, shield, weapon, cargo, speed, fuel) {
	this.type = type;
	this.amount = amount;
	this.baseCostMetal = baseCostMetal;
	this.baseCostCrystal = baseCostCrystal;
	this.baseCostFuel = baseCostFuel;
	this.armor = armor;
	this.shield = shield;
	this.weapon = weapon;
	this.cargo = cargo;
	this.speed = speed;
	this.fuel = fuel;
	this.objId = 'Ship';
	this.dependencyArray;
	
	this.addAmount = function(am) {
		this.amount += am;
	};
	
	this.subAmount = function(am) {
		if (this.amount >= am)
			this.amount -= am;
		else this.amount = 0;
	};
	
	this.getPrice = function(res, quantity) {
		switch(res) {
			case 'metal':
				return this.baseCostMetal * quantity;
				break;
			case 'crystal':
				return this.baseCostCrystal * quantity;
				break;
			case 'fuel':
				return this.baseCostFuel * quantity;
				break;
			default:
				console.log('getPrice switch function in ships.js -- something went wrong');
				break;
		}
	};
	this.dependenciesMet = function(planet){
			this.dependencyArray = planet.getDependencies(this);
			return this.dependencyArray[0].every(function(b) {return b === true;});
	};
	
	this.listDependencies = function(planet) {
		var node, textnode, tmpnode, mainnode;
		//if (this.dependencyArray == undefined)
			this.dependencyArray = planet.getDependencies(this);
		
		mainnode = document.createElement('DIV');
		node = document.createElement('P');
		tmpnode = "Requires: ";
		textnode = document.createTextNode(tmpnode);
		node.appendChild(textnode);
		mainnode.appendChild(node);
		
		for (var i = 0; i < this.dependencyArray[0].length; i++) {
			if (this.dependencyArray[0][i]) 
			{
				node = document.createElement('P');
				tmpnode = this.dependencyArray[1][i];
				textnode = document.createTextNode(tmpnode);
				node.appendChild(textnode);
				node.className += ' green';
				mainnode.appendChild(node);
			}
			else 
			{
				node = document.createElement('P');
				tmpnode = this.dependencyArray[1][i];
				textnode = document.createTextNode(tmpnode);
				node.appendChild(textnode);
				node.className += ' red';
				mainnode.appendChild(node);
			}
			if (i != (this.dependencyArray[0].length - 1)) {
				// add a comma between all items, and skip last item
				node = document.createElement('P');
				textnode = document.createTextNode(', ');
				node.appendChild(textnode);
				mainnode.appendChild(node);
			}
		}
		return mainnode;
	};
	
	this.hasResources = function(planet) {
		var metalSum, crystalSum, fuelSum;
		metalSum = this.baseCostMetal;
		crystalSum = this.baseCostCrystal;
		fuelSum = this.baseCostFuel;
		
		return checkResourceRequirements('metal', metalSum, planet) && checkResourceRequirements('crystal', crystalSum, planet) && checkResourceRequirements('fuel', fuelSum, planet);
	};
	
	/*this.getConstructionTime = function() {
		return Math.floor(((((this.baseCostMetal + this.baseCostCrystal) * 360) / 1000 ) / (1 + currentPlanet.roboticsBuilding.level)) / Math.pow(2, currentPlanet.naniteBuilding.level)) * 1000;
	};*/
		this.getConstructionTime = function() {
			return Math.floor(((((this.baseCostMetal + this.baseCostCrystal) * 360) / 1000 ) / (1 + currentPlanet.roboticsBuilding.level)) / Math.pow(2, currentPlanet.naniteBuilding.level)) * 1000;
		};
}

function getMaxShips(el, ship, planet) {
	var metal, crystal, fuel;
	metal = ship.baseCostMetal != 0 ? Math.floor(planet.metal.amount / ship.baseCostMetal) : Infinity;
	crystal = ship.baseCostCrystal != 0 ? Math.floor(planet.crystal.amount / ship.baseCostCrystal) : Infinity;
	fuel = ship.baseCostFuel != 0 ? Math.floor(planet.fuel.amount / ship.baseCostFuel) : Infinity;
	if (el != undefined) { // called to display text on page
		el = document.getElementById(el);
		el.innerHTML = "Enter quantity (Max: " + addCommas(Math.min(metal, crystal, fuel)) + ")";
	}
	else return Math.min(metal, crystal, fuel); // called requesting a Number for math
}

function addToQueue(ship, planet, shipAmount) {
	shipAmount = document.getElementById(shipAmount); //element
	var amount = Number(shipAmount.value); //amount requested
	var max, mAmount, cAmount, fAmount; 
	shipAmount.value = '';
	if (isNaN(amount)) return;
	ship = getShip(ship, planet); //ship object
	max = getMaxShips(undefined, ship, planet); //max ships allowed due to resources
	if (amount > max)
		amount = max;
	if (amount < 1) return;
	mAmount = ship.getPrice('metal', amount);
	cAmount = ship.getPrice('crystal', amount);
	fAmount = ship.getPrice('fuel', amount);
	subtractResAmount('metal', mAmount, planet);
	subtractResAmount('crystal', cAmount, planet);
	subtractResAmount('fuel', fAmount, planet);
	planet.queue.addShip(ship, amount);
	displayShips(planet);
}

function getShip(ship, planet) {
	switch(ship) {
		case 'Small Cargo':
			console.log('getting ship Small Cargo');
			return planet.scargoShip;
			console.log('and planet.name = ', planet.name);
			break;
		case 'Large Cargo':
			return planet.lcargoShip;
			break;
		case 'Light Fighter':
			return planet.lfighterShip;
			break;
		case 'Heavy Fighter':
			return planet.hfighterShip;
			break;
		case 'Cruiser':
			return planet.cruiserShip;
			break;
		case 'Battleship':
			return planet.battleShip;
			break;
		case 'Bomber':
			return planet.bomberShip;
			break;
		case 'Destroyer':
			return planet.destroyerShip;
			break;
		case 'Deathstar':
			return planet.deathstarShip;
			break;
		case 'Colony Ship':
			return planet.colonyShip;
			break;
		case 'Recycler':
			return planet.recyclerShip;
			break;
		case 'Espionage Probe':
			return planet.probeShip;
			break;
		case 'Solar Satellite':
			return planet.satelliteShip;
			break;
		case 'Battlecruiser':
			return planet.battlecruiserShip;
			break;
	}
}

function setShipColors(planet, btn) {
	var shipSCargoQ = document.getElementById('ship-scargo-queue'),
			shipLCargoQ = document.getElementById('ship-lcargo-queue'),
			shipColonyQ = document.getElementById('ship-colony-queue'),
			shipRecyclerQ = document.getElementById('ship-recycler-queue'),
			shipProbeQ = document.getElementById('ship-probe-queue'),
			shipSatelliteQ = document.getElementById('ship-satellite-queue'),
			shipLFighterQ = document.getElementById('ship-lfighter-queue'),
			shipHFighterQ = document.getElementById('ship-hfighter-queue'),
			shipCruiserQ = document.getElementById('ship-cruiser-queue'),
			shipBattleshipQ = document.getElementById('ship-battleship-queue'),
			shipBomberQ = document.getElementById('ship-bomber-queue'),
			shipBattlecruiserQ = document.getElementById('ship-battlecruiser-queue'),
			shipDestroyerQ = document.getElementById('ship-destroyer-queue'),
			shipDeathstarQ = document.getElementById('ship-deathstar-queue');
			
			if (btn == undefined) { 
				shipSCargoQ.style.backgroundColor = planet.scargoShip.dependenciesMet(planet) && planet.scargoShip.hasResources(planet) ? 'green' : 'gray';
				shipLCargoQ.style.backgroundColor = planet.lcargoShip.dependenciesMet(planet) && planet.lcargoShip.hasResources(planet) ? 'green' : 'gray';
				shipColonyQ.style.backgroundColor = planet.colonyShip.dependenciesMet(planet) && planet.colonyShip.hasResources(planet) ? 'green' : 'gray';
				shipRecyclerQ.style.backgroundColor = planet.recyclerShip.dependenciesMet(planet) && planet.recyclerShip.hasResources(planet) ? 'green' : 'gray';
				shipProbeQ.style.backgroundColor = planet.probeShip.dependenciesMet(planet) && planet.probeShip.hasResources(planet) ? 'green' : 'gray';
				shipSatelliteQ.style.backgroundColor = planet.satelliteShip.dependenciesMet(planet) && planet.satelliteShip.hasResources(planet) ? 'green' : 'gray';
				shipLFighterQ.style.backgroundColor = planet.lfighterShip.dependenciesMet(planet) && planet.lfighterShip.hasResources(planet) ? 'green' : 'gray';
				shipHFighterQ.style.backgroundColor = planet.hfighterShip.dependenciesMet(planet) && planet.hfighterShip.hasResources(planet) ? 'green' : 'gray';
				shipCruiserQ.style.backgroundColor = planet.cruiserShip.dependenciesMet(planet) && planet.cruiserShip.hasResources(planet) ? 'green' : 'gray';
				shipBattleshipQ.style.backgroundColor = planet.battleShip.dependenciesMet(planet) && planet.battleShip.hasResources(planet) ? 'green' : 'gray';
				shipBomberQ.style.backgroundColor = planet.bomberShip.dependenciesMet(planet) && planet.bomberShip.hasResources(planet) ? 'green' : 'gray';
				shipBattlecruiserQ.style.backgroundColor = planet.battlecruiserShip.dependenciesMet(planet) && planet.battlecruiserShip.hasResources(planet) ? 'green' : 'gray';
				shipDestroyerQ.style.backgroundColor = planet.destroyerShip.dependenciesMet(planet) && planet.destroyerShip.hasResources(planet) ? 'green' : 'gray';
				shipDeathstarQ.style.backgroundColor = planet.deathstarShip.dependenciesMet(planet) && planet.deathstarShip.hasResources(planet) ? 'green' : 'gray';
			}
}

function displayShips(planet) {
	var shipInfo = document.getElementById('ship-info'),
			shipList = document.getElementById('ship-list');
			
	var shipSCargo = document.getElementById('ship-scargo'),
			shipSCargoR = document.getElementById('ship-scargo-requirements'),
			shipSCargoD = document.getElementById('ship-scargo-dependencies'),
			shipSCargoQ = document.getElementById('ship-scargo-div'),
			
			shipLCargo = document.getElementById('ship-lcargo'),
			shipLCargoR = document.getElementById('ship-lcargo-requirements'),
			shipLCargoD = document.getElementById('ship-lcargo-dependencies'),
			shipLCargoQ = document.getElementById('ship-lcargo-div'),
			
			shipColony = document.getElementById('ship-colony'),
			shipColonyR = document.getElementById('ship-colony-requirements'),
			shipColonyD = document.getElementById('ship-colony-dependencies'),
			shipColonyQ = document.getElementById('ship-colony-div'),
			
			shipRecycler = document.getElementById('ship-recycler'),
			shipRecyclerR = document.getElementById('ship-recycler-requirements'),
			shipRecyclerD = document.getElementById('ship-recycler-dependencies'),
			shipRecyclerQ = document.getElementById('ship-recycler-div'),
			
			shipProbe = document.getElementById('ship-probe'),
			shipProbeR = document.getElementById('ship-probe-requirements'),
			shipProbeD = document.getElementById('ship-probe-dependencies'),
			shipProbeQ = document.getElementById('ship-probe-div'),
			
			shipSatellite = document.getElementById('ship-satellite'),
			shipSatelliteR = document.getElementById('ship-satellite-requirements'),
			shipSatelliteD = document.getElementById('ship-satellite-dependencies'),
			shipSatelliteQ = document.getElementById('ship-satellite-div'),
			
			shipLFighter = document.getElementById('ship-lfighter'),
			shipLFighterR = document.getElementById('ship-lfighter-requirements'),
			shipLFighterD = document.getElementById('ship-lfighter-dependencies'),
			shipLFighterQ = document.getElementById('ship-lfighter-div'),
			
			shipHFighter = document.getElementById('ship-hfighter'),
			shipHFighterR = document.getElementById('ship-hfighter-requirements'),
			shipHFighterD = document.getElementById('ship-hfighter-dependencies'),
			shipHFighterQ = document.getElementById('ship-hfighter-div'),
			
			shipCruiser = document.getElementById('ship-cruiser'),
			shipCruiserR = document.getElementById('ship-cruiser-requirements'),
			shipCruiserD = document.getElementById('ship-cruiser-dependencies'),
			shipCruiserQ = document.getElementById('ship-cruiser-div'),
			
			shipBattleship = document.getElementById('ship-battleship'),
			shipBattleshipR = document.getElementById('ship-battleship-requirements'),
			shipBattleshipD = document.getElementById('ship-battleship-dependencies'),
			shipBattleshipQ = document.getElementById('ship-battleship-div'),
			
			shipBomber = document.getElementById('ship-bomber'),
			shipBomberR = document.getElementById('ship-bomber-requirements'),
			shipBomberD = document.getElementById('ship-bomber-dependencies'),
			shipBomberQ = document.getElementById('ship-bomber-div'),
			
			shipBattlecruiser = document.getElementById('ship-battlecruiser'),
			shipBattlecruiserR = document.getElementById('ship-battlecruiser-requirements'),
			shipBattlecruiserD = document.getElementById('ship-battlecruiser-dependencies'),
			shipBattlecruiserQ = document.getElementById('ship-battlecruiser-div'),
			
			shipDestroyer = document.getElementById('ship-destroyer'),
			shipDestroyerR = document.getElementById('ship-destroyer-requirements'),
			shipDestroyerD = document.getElementById('ship-destroyer-dependencies'),
			shipDestroyerQ = document.getElementById('ship-destroyer-div'),
			
			shipDeathstar = document.getElementById('ship-deathstar'),
			shipDeathstarR = document.getElementById('ship-deathstar-requirements'),
			shipDeathstarD = document.getElementById('ship-deathstar-dependencies'),
			shipDeathstarQ = document.getElementById('ship-deathstar-div');
			
	if (planet.shipyardBuilding.level < 1) {
		shipInfo.style.display = 'block';
		shipList.style.display = 'none';
		shipInfo.innerHTML = 'You must build a shipyard.';
	}
	else { // shipyard is built
		shipInfo.style.display = 'none';
		shipList.style.display = 'block';
		
		shipSCargo.innerHTML = "Small Cargo (" + addCommas(planet.scargoShip.amount) + ')';
		shipSCargoR.innerHTML = "Cost: " + addCommas(planet.scargoShip.baseCostMetal) + " metal, " + addCommas(planet.scargoShip.baseCostCrystal) + " crystal, " + addCommas(planet.scargoShip.baseCostFuel) + " fuel";
		if (planet.scargoShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipSCargoQ.style.display = 'inline';
			getMaxShips('ship-scargo-max', planet.scargoShip, planet);
			shipSCargoD.innerHTML = '';
		}
		else {// dependencies required
			shipSCargoQ.style.display = 'none';
			node = planet.scargoShip.listDependencies(planet);
			while (shipSCargoD.firstChild != null)
				shipSCargoD.removeChild(shipSCargoD.firstChild);
			shipSCargoD.appendChild(node);
		}
		
		shipLCargo.innerHTML = "Large Cargo (" + addCommas(planet.lcargoShip.amount) + ')';
		shipLCargoR.innerHTML = "Cost: " + addCommas(planet.lcargoShip.baseCostMetal) + " metal, " + addCommas(planet.lcargoShip.baseCostCrystal) + " crystal, " + addCommas(planet.lcargoShip.baseCostFuel) + " fuel";
		if (planet.lcargoShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipLCargoQ.style.display = 'inline';
			getMaxShips('ship-lcargo-max', planet.lcargoShip, planet);
			shipLCargoD.innerHTML = '';
		}
		else {// dependencies required
			shipLCargoQ.style.display = 'none';
			node = planet.lcargoShip.listDependencies(planet);
			while (shipLCargoD.firstChild != null)
				shipLCargoD.removeChild(shipLCargoD.firstChild);
			shipLCargoD.appendChild(node);
		}
		
		shipColony.innerHTML = "Colony Ship (" + addCommas(planet.colonyShip.amount) + ')';
		shipColonyR.innerHTML = "Cost: " + addCommas(planet.colonyShip.baseCostMetal) + " metal, " + addCommas(planet.colonyShip.baseCostCrystal) + " crystal, " + addCommas(planet.colonyShip.baseCostFuel) + " fuel";
		if (planet.colonyShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipColonyQ.style.display = 'inline';
			getMaxShips('ship-colony-max', planet.colonyShip, planet);
			shipColonyD.innerHTML = '';
		}
		else {// dependencies required
			shipColonyQ.style.display = 'none';
			node = planet.colonyShip.listDependencies(planet);
			while (shipColonyD.firstChild != null)
				shipColonyD.removeChild(shipColonyD.firstChild);
			shipColonyD.appendChild(node);
		}
		
		shipRecycler.innerHTML = "Recycler (" + addCommas(planet.recyclerShip.amount) + ')';
		shipRecyclerR.innerHTML = "Cost: " + addCommas(planet.recyclerShip.baseCostMetal) + " metal, " + addCommas(planet.recyclerShip.baseCostCrystal) + " crystal, " + addCommas(planet.recyclerShip.baseCostFuel) + " fuel";
		if (planet.recyclerShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipRecyclerQ.style.display = 'inline';
			getMaxShips('ship-recycler-max', planet.recyclerShip, planet);
			shipRecyclerD.innerHTML = '';
		}
		else {// dependencies required
			shipRecyclerQ.style.display = 'none';
			node = planet.recyclerShip.listDependencies(planet);
			while (shipRecyclerD.firstChild != null)
				shipRecyclerD.removeChild(shipRecyclerD.firstChild);
			shipRecyclerD.appendChild(node);
		}
		
		shipProbe.innerHTML = "Espionage Probe (" + addCommas(planet.probeShip.amount) + ')';
		shipProbeR.innerHTML = "Cost: " + addCommas(planet.probeShip.baseCostMetal) + " metal, " + addCommas(planet.probeShip.baseCostCrystal) + " crystal, " + addCommas(planet.probeShip.baseCostFuel) + " fuel";
		if (planet.probeShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipProbeQ.style.display = 'inline';
			getMaxShips('ship-probe-max', planet.probeShip, planet);
			shipProbeD.innerHTML = '';
		}
		else {// dependencies required
			shipProbeQ.style.display = 'none';
			node = planet.probeShip.listDependencies(planet);
			while (shipProbeD.firstChild != null)
				shipProbeD.removeChild(shipProbeD.firstChild);
			shipProbeD.appendChild(node);
		}
		
		shipSatellite.innerHTML = "Solar Satellite (" + addCommas(planet.satelliteShip.amount) + ')';
		shipSatelliteR.innerHTML = "Cost: " + addCommas(planet.satelliteShip.baseCostMetal) + " metal, " + addCommas(planet.satelliteShip.baseCostCrystal) + " crystal, " + addCommas(planet.satelliteShip.baseCostFuel) + " fuel";
		if (planet.satelliteShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipSatelliteQ.style.display = 'inline';
			getMaxShips('ship-satellite-max', planet.satelliteShip, planet);
			shipSatelliteD.innerHTML = '';
		}
		else {// dependencies required
			shipSatelliteQ.style.display = 'none';
			node = planet.satelliteShip.listDependencies(planet);
			while (shipSatelliteD.firstChild != null)
				shipSatelliteD.removeChild(shipSatelliteD.firstChild);
			shipSatelliteD.appendChild(node);
		}
		
		shipLFighter.innerHTML = "Light Fighter (" + addCommas(planet.lfighterShip.amount) + ')';
		shipLFighterR.innerHTML = "Cost: " + addCommas(planet.lfighterShip.baseCostMetal) + " metal, " + addCommas(planet.lfighterShip.baseCostCrystal) + " crystal, " + addCommas(planet.lfighterShip.baseCostFuel) + " fuel";
		if (planet.lfighterShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipLFighterQ.style.display = 'inline';
			getMaxShips('ship-lfighter-max', planet.lfighterShip, planet);
			shipLFighterD.innerHTML = '';
		}
		else {// dependencies required
			shipLFighterQ.style.display = 'none';
			node = planet.lfighterShip.listDependencies(planet);
			while (shipLFighterD.firstChild != null)
				shipLFighterD.removeChild(shipLFighterD.firstChild);
			shipLFighterD.appendChild(node);
		}
		
		shipHFighter.innerHTML = "Heavy Fighter (" + addCommas(planet.hfighterShip.amount) + ')';
		shipHFighterR.innerHTML = "Cost: " + addCommas(planet.hfighterShip.baseCostMetal) + " metal, " + addCommas(planet.hfighterShip.baseCostCrystal) + " crystal, " + addCommas(planet.hfighterShip.baseCostFuel) + " fuel";
		if (planet.hfighterShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipHFighterQ.style.display = 'inline';
			getMaxShips('ship-hfighter-max', planet.hfighterShip, planet);
			shipHFighterD.innerHTML = '';
		}
		else {// dependencies required
			shipHFighterQ.style.display = 'none';
			node = planet.hfighterShip.listDependencies(planet);
			while (shipHFighterD.firstChild != null)
				shipHFighterD.removeChild(shipHFighterD.firstChild);
			shipHFighterD.appendChild(node);
		}
		
		shipCruiser.innerHTML = "Cruiser (" + addCommas(planet.cruiserShip.amount) + ')';
		shipCruiserR.innerHTML = "Cost: " + addCommas(planet.cruiserShip.baseCostMetal) + " metal, " + addCommas(planet.cruiserShip.baseCostCrystal) + " crystal, " + addCommas(planet.cruiserShip.baseCostFuel) + " fuel";
		if (planet.cruiserShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipCruiserQ.style.display = 'inline';
			getMaxShips('ship-cruiser-max', planet.cruiserShip, planet);
			shipCruiserD.innerHTML = '';
		}
		else {// dependencies required
			shipCruiserQ.style.display = 'none';
			node = planet.cruiserShip.listDependencies(planet);
			while (shipCruiserD.firstChild != null)
				shipCruiserD.removeChild(shipCruiserD.firstChild);
			shipCruiserD.appendChild(node);
		}
		
		shipBattleship.innerHTML = "Battleship (" + addCommas(planet.battleShip.amount) + ')';
		shipBattleshipR.innerHTML = "Cost: " + addCommas(planet.battleShip.baseCostMetal) + " metal, " + addCommas(planet.battleShip.baseCostCrystal) + " crystal, " + addCommas(planet.battleShip.baseCostFuel) + " fuel";
		if (planet.battleShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipBattleshipQ.style.display = 'inline';
			getMaxShips('ship-battleship-max', planet.battleShip, planet);
			shipBattleshipD.innerHTML = '';
		}
		else {// dependencies required
			shipBattleshipQ.style.display = 'none';
			node = planet.battleShip.listDependencies(planet);
			while (shipBattleshipD.firstChild != null)
				shipBattleshipD.removeChild(shipBattleshipD.firstChild);
			shipBattleshipD.appendChild(node);
		}
		
		shipBomber.innerHTML = "Bomber (" + addCommas(planet.bomberShip.amount) + ')';
		shipBomberR.innerHTML = "Cost: " + addCommas(planet.bomberShip.baseCostMetal) + " metal, " + addCommas(planet.bomberShip.baseCostCrystal) + " crystal, " + addCommas(planet.bomberShip.baseCostFuel) + " fuel";
		if (planet.bomberShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipBomberQ.style.display = 'inline';
			getMaxShips('ship-bomber-max', planet.bomberShip, planet);
			shipBomberD.innerHTML = '';
		}
		else {// dependencies required
			shipBomberQ.style.display = 'none';
			node = planet.bomberShip.listDependencies(planet);
			while (shipBomberD.firstChild != null)
				shipBomberD.removeChild(shipBomberD.firstChild);
			shipBomberD.appendChild(node);
		}
		
		shipBattlecruiser.innerHTML = "Battlecruiser (" + addCommas(planet.battlecruiserShip.amount) + ')';
		shipBattlecruiserR.innerHTML = "Cost: " + addCommas(planet.battlecruiserShip.baseCostMetal) + " metal, " + addCommas(planet.battlecruiserShip.baseCostCrystal) + " crystal, " + addCommas(planet.battlecruiserShip.baseCostFuel) + " fuel";
		if (planet.battlecruiserShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipBattlecruiserQ.style.display = 'inline';
			getMaxShips('ship-battlecruiser-max', planet.battlecruiserShip, planet);
			shipBattlecruiserD.innerHTML = '';
		}
		else {// dependencies required
			shipBattlecruiserQ.style.display = 'none';
			node = planet.battlecruiserShip.listDependencies(planet);
			while (shipBattlecruiserD.firstChild != null)
				shipBattlecruiserD.removeChild(shipBattlecruiserD.firstChild);
			shipBattlecruiserD.appendChild(node);
		}
		
		shipDestroyer.innerHTML = "Destroyer (" + addCommas(planet.destroyerShip.amount) + ')';
		shipDestroyerR.innerHTML = "Cost: " + addCommas(planet.destroyerShip.baseCostMetal) + " metal, " + addCommas(planet.destroyerShip.baseCostCrystal) + " crystal, " + addCommas(planet.destroyerShip.baseCostFuel) + " fuel";
		if (planet.destroyerShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipDestroyerQ.style.display = 'inline';
			getMaxShips('ship-destroyer-max', planet.destroyerShip, planet);
			shipDestroyerD.innerHTML = '';
		}
		else {// dependencies required
			shipDestroyerQ.style.display = 'none';
			node = planet.destroyerShip.listDependencies(planet);
			while (shipDestroyerD.firstChild != null)
				shipDestroyerD.removeChild(shipDestroyerD.firstChild);
			shipDestroyerD.appendChild(node);
		}
		
		shipDeathstar.innerHTML = "Deathstar (" + addCommas(planet.deathstarShip.amount) + ')';
		shipDeathstarR.innerHTML = "Cost: " + addCommas(planet.deathstarShip.baseCostMetal) + " metal, " + addCommas(planet.deathstarShip.baseCostCrystal) + " crystal, " + addCommas(planet.deathstarShip.baseCostFuel) + " fuel";
		if (planet.deathstarShip.dependenciesMet(planet)) {// no dependencies left to acquire
			shipDeathstarQ.style.display = 'inline';
			getMaxShips('ship-deathstar-max', planet.deathstarShip, planet);
			shipDeathstarD.innerHTML = '';
		}
		else {// dependencies required
			shipDeathstarQ.style.display = 'none';
			node = planet.deathstarShip.listDependencies(planet);
			while (shipDeathstarD.firstChild != null)
				shipDeathstarD.removeChild(shipDeathstarD.firstChild);
			shipDeathstarD.appendChild(node);
		}
	}
}