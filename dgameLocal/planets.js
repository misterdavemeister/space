//Object Global Variables
var homeworld, colony1, colony2, colony3, colony4, colony5, colony6, colony7, colony8;
var currentPlanet;
//Interval global variables
var currentPlanetResourceIntv;

function Planet(name, id, shipyardBool, reloadBool, buildingBool) {
	/********************************************** RESOURCES **********************************************/
	this.name = name;
	this.id = id;
	this.shipyardBool = false; //shipyard in use?
	this.reloadBool = false; //for shipyard Queue
	this.buildingBool = buildingBool || false; //building under construction?
	this.shipyardIntv;
	this.rename = function(nm) { 
		this.name = nm;
	};
	this.initResources = function(ma, r1, ca, r2, fa, r3, r4) 
	{
		this.metal = new Resource('metal', ma, r1);
		this.crystal = new Resource('crystal', ca, r2);
		this.fuel = new Resource('fuel', fa, r3);
		this.energy = new Energy(r4);
	};
	
	this.startProduction = function() {
			if (this.checkEnergyConsumption()) {
				this.metal.addAmount(this.metal.produce());
				this.crystal.addAmount(this.crystal.produce());
				this.fuel.addAmount(this.fuel.produce());
			}
			else {
				this.metal.addAmount(this.metal.produceLowEnergy());
				this.crystal.addAmount(this.crystal.produceLowEnergy());
				this.fuel.addAmount(this.fuel.produceLowEnergy());
			}
			displayResourceAmount(this);
	};
	
	this.checkEnergyConsumption = function() {
		this.energy.resetEnergyVariable();
		this.energy.consumeEnergy(this.metal);
		this.energy.consumeEnergy(this.crystal);
		this.energy.consumeEnergy(this.fuel);
		this.energy.setTotalUsedEnergy();
		if (this.energy.excessOutput() >= 0 && this.energy.getOutput() > 0)
			return true;
		else
			return false;
	};
	/********************************************** BUILDINGS **********************************************/

	/*
	*** parameters of initBuildings function correspond to the level of each consecutive building ***
	*** Building construction parameters ***
	1. type of building
	2. initial building level
	3. base cost - metal
	4. base cost - crystal
	5. base cost - fuel 
	*/
	this.initBuildings = function(b1, b2, b3, b4, b5, b6, b7, b8) {
		this.metalBuilding =	new Building('metal', b1, 60, 15, 0);
		this.crystalBuilding = 	new Building('crystal', b2, 48, 24, 0);
		this.fuelBuilding = 	new Building('fuel', b3, 225, 75, 0);
		this.energyBuilding = 	new Building('energy', b4, 75, 30, 0);
		this.roboticsBuilding = new Building('robotics', b5, 400, 120, 200);
		this.shipyardBuilding = new Building('shipyard', b6, 400, 200, 100);
		this.researchBuilding = new Building('research', b7, 200, 400, 200);
		this.naniteBuilding = 	new Building('nanite', b8, 1000000, 500000, 100000);
		// nanite factory: 1000000 metal, 500000 crystal, 100000 fuel--
			// requires robotic factory level 10 and computer technology level 10
	};
		
	/********************************************** SHIPS **********************************************/
	// Ship(type, quantity, baseCostMetal, baseCostCrystal, baseCostFuel, armor, shield, weapon, cargo, speed, fuel)
	// 14 ships

	this.initShips = function(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14) {
		this.scargoShip = 		 new Ship('Small Cargo', s1, 2000, 2000, 0, 4000, 10, 5, 5000, 5000, 10);
		this.lcargoShip = 		 new Ship('Large Cargo', s2, 6000, 6000, 0, 12000, 25, 5, 25000, 7500, 50);
		this.lfighterShip = 	 new Ship('Light Fighter', s3, 3000, 1000, 0, 4000, 10, 50, 50, 12500, 20);
		this.hfighterShip = 	 new Ship('Heavy Fighter', s4, 6000, 4000, 0, 10000, 25, 150, 100, 10000, 75);
		this.cruiserShip = 		 new Ship('Cruiser', s5, 20000, 7000, 2000, 27000, 50, 400, 800, 15000, 300);
		this.battleShip = 		 new Ship('Battleship', s6, 45000, 15000, 0, 60000, 200, 1000, 1500, 1000, 500);
		this.colonyShip = 		 new Ship('Colony Ship', s7, 10000, 20000, 10000, 30000, 100, 50, 7500, 2500, 1000);
		this.recyclerShip = 	 new Ship('Recycler', s8, 10000, 6000, 2000, 16000, 10, 1, 20000, 2000, 300);
		this.probeShip = 		 new Ship('Espionage Probe', s9, 0, 1000, 0, 1000, 0.01, 0.01, 5, 100000000, 1);
		this.bomberShip = 		 new Ship('Bomber', s10, 50000, 25000, 15000, 75000, 500, 1000, 500, 4000, 1000);
		this.satelliteShip = 	 new Ship('Solar Satellite', s11, 0, 2000, 500, 2000, 1, 1, 0, 0, 0);
		this.destroyerShip = 	 new Ship('Destroyer', s12, 60000, 50000, 15000, 110000, 500, 2000, 2000, 5000, 1000);
		this.deathstarShip = 	 new Ship('Deathstar', s13, 5000000, 4000000, 1000000, 9000000, 50000, 200000, 1000000, 100, 1);
		this.battlecruiserShip = new Ship('Battlecruiser', s14, 30000, 40000, 15000, 70000, 400, 700, 750, 10000, 250);
	};
	
	/********************************************** DEFENSE **********************************************/
	// 8 defenses
	//Defense(type, quantity, baseCostMetal, baseCostCrystal, baseCostFuel)
	/* 
	this.initDefenses = function(d1, d2, d3, d4, d5, d6, d7, d8){
		this.rocketDefense = new Defense('rocket', d1);
		this.llaserDefense = new Defense('llaser', d2);
		this.hlaserDefense = new Defense('hlaser', d3);
		this.gaussDefense = new Defense('gauss', d4);
		this.ionDefense = new Defense('ion', d5);
		this.plasmaDefense = new Defense('plasma', d6);
		this.sdomeDefense = new Defense('sdome', d7);
		this.ldomeDefense = new Defense('ldome', d8);
	}
	*/
	/********************************************** SHIPYARD QUEUE **********************************************/
	this.initQueue = function(arr, planet, div) {
		if (arr == undefined) this.queue = new Queue(undefined, planet, div);
		else this.queue = new Queue(arr, planet, div);
	}
	/******************************************** DEPENDENCIES ********************************************/
	
	this.getDependencies = function(obj) {
		var objId = obj.objId, 	// => Building, Research, Ship, Defense
			objType = obj.type;	// => metal, combustion, scargo, etc
		
		switch(objId) 
		{
			case 'Building':
				switch(objType)
				{
					case 'metal':
					case 'crystal':
					case 'fuel':
					case 'energy':
					case 'robotics':
					case 'research':
						return [[true], ["No dependencies"]];
						break;
					case 'shipyard':
						return [[this.roboticsBuilding.level >= 2], ["Robotics Factory (Level 2)"]];
						break;
					case 'nanite':
						return [[this.roboticsBuilding.level >= 10,  account.computerResearch.level >= 10], ["Robotics Factory (Level 10)", "Computer Technology (Level 10)"]];
						break;
				}
				break;
				
			case 'Research':
				switch(objType) {
					case 'energy':
						return [[this.researchBuilding.level >= 1], ["Research Lab (Level 1)"]];
						break;
					case 'laser':
						return [[this.researchBuilding.level >= 1, account.energyResearch.level >= 2], ['Research Lab (Level 1)', 'Energy Technology (Level 2)']];
						break;
					case 'ion':
						return [[this.researchBuilding.level >= 4, account.laserResearch.level >= 5, account.energyResearch.level >= 4], ["Research Lab (Level 4)", "Laser Technology (Level 5)", "Energy Technology (Level 4)"]];
						break;
					case 'plasma':
						return [[this.researchBuilding.level >= 4, account.energyResearch.level >= 8, account.laserResearch.level >= 10, account.ionResearch.level >= 5], ["Research Lab (Level 4)", "Energy Technology (Level 8)", "Laser Technology (Level 10)", "Ion Technology (Level 5)"]];
						break;
					case 'espionage':
						return [[this.researchBuilding.level >= 3], ['Research Lab (Level 3)']];
						break;
					case 'computer':
						return [[this.researchBuilding.level >= 1], ['Research Lab (Level 1)']];
						break;
					case 'hyperspaceTech':
						return [[this.researchBuilding.level >= 7, account.energyResearch.level >= 5, account.shieldingResearch.level >= 5], ['Research Lab (Level 7)', 'Energy Technology (Level 5)', 'Shielding Technology (Level 5)']];
						break;
					case 'intergalactic':
						return [[this.researchBuilding.level >= 10, account.computerResearch.level >= 8, account.hyperspaceTechResearch.level >= 8], ['Research Lab (Level 10)', 'Computer Technology (Level 8)', 'Hyperspace Technology (Level 8)']];
						break;
					case 'graviton':
						return [[this.researchBuilding.level >= 12], ['Research Lab (Level 12)']];
						break;
					case 'astrophysics':
						return [[this.researchBuilding.level >= 3, account.espionageResearch.level >= 4, account.impulseResearch.level >= 3], ['Research Lab (Level 3)', 'Espionage Technology (Level 4)', 'Impulse Drive (Level 3)']];
						break;
					case 'combustion':
						return [[this.researchBuilding.level >= 1, account.energyResearch.level >= 1], ['Research Lab (Level 1)', 'Energy Technology (Level 1)']];
						break;
					case 'impulse':
						return [[this.researchBuilding.level >= 2, account.energyResearch.level >= 1], ['Research Lab (Level 2)', 'Energy Technology (Level 1)']];
						break;
					case 'hyperspaceDrive':
						return [[this.researchBuilding.level >= 7, account.hyperspaceTechResearch.level >= 3], ['Research Lab (Level 7)', 'Hyperspace Technology (Level 3)']];
						break;
					case 'weapons':
						return [[this.researchBuilding.level >= 4], ['Research Lab (Level 4)']];
						break;
					case 'shielding':
						return [[this.researchBuilding.level >= 6, account.energyResearch.level >= 3], ['Research Lab (Level 6)', 'Energy Technology (Level 3)']];
						break;
					case 'armor':
						return [[this.researchBuilding.level >= 2], ['Research Lab (Level 2)']];
						break;
				}
				break;
				
			case 'Ship':
				switch(objType) {
					case 'Small Cargo':
						return [[this.shipyardBuilding.level >= 2, account.combustionResearch.level >= 2], ['Shipyard (Level 2)', 'Combustion Drive (Level 2)']];
						break;
					case 'Large Cargo':
						return [[this.shipyardBuilding.level >= 4, account.combustionResearch.level >= 6], ['Shipyard (Level 4)', 'Combustion Drive (Level 6)']];
						break;
					case 'Light Fighter':
						return [[this.shipyardBuilding.level >= 1, account.combustionResearch.level >= 1], ['Shipyard (Level 1)', 'Combustion Drive (Level 1)']];
						break;
					case 'Heavy Fighter':
						return [[this.shipyardBuilding.level >= 3, account.armorResearch.level >= 2, account.impulseResearch.level >= 2], ['Shipyard (Level 3)', 'Armor Technology (Level 2)', 'Impulse Drive (Level 2)']];
						break;
					case 'Cruiser':
						return [[this.shipyardBuilding.level >= 5, account.impulseResearch.level >= 4, account.ionResearch.level >= 2], ['Shipyard (Level 5)', 'Impulse Drive (Level 4)', 'Ion Technology (Level 2)']];
						break;
					case 'Battleship':
						return [[this.shipyardBuilding.level >= 7, account.hyperspaceDriveResearch.level >= 4], ['Shipyard (Level 7)', 'Hyperspace Drive (Level 4)']];
						break;
					case 'Colony Ship':
						return [[this.shipyardBuilding.level >= 4, account.impulseResearch.level >= 3], ['Shipyard (Level 4)', 'Impulse Drive (Level 3)']];
						break;
					case 'Recycler':
						return [[this.shipyardBuilding.level >= 4, account.combustionResearch.level >= 6, account.shieldingResearch.level >= 2], ['Shipyard (Level 4)', 'Combustion Drive (Level 6)', 'Shielding Technology (Level 2)']];
						break;
					case 'Espionage Probe':
						return [[this.shipyardBuilding.level >= 3, account.combustionResearch.level >= 3, account.espionageResearch.level >= 2], ['Shipyard (Level 3)', 'Combustion Drive (Level 3)', 'Espionage Technology (Level 2)']];
						break;
					case 'Bomber':
						return [[this.shipyardBuilding.level >= 8, account.impulseResearch.level >= 6, account.plasmaResearch.level >= 5], ['Shipyard (Level 8)', 'Impulse Drive (Level 6)', 'Plasma Technology (Level 5)']];
						break;
					case 'Solar Satellite':
						return [[this.shipyardBuilding.level >= 1], ['Shipyard (Level 1)']];
						break;
					case 'Destroyer':
						return [[this.shipyardBuilding.level >= 9, account.hyperspaceDriveResearch.level >= 6, account.hyperspaceTechResearch.level >= 5], ['Shipyard (Level 9)', 'Hyperspace Drive (Level 6)', 'Hyperspace Technology (Level 5)']];
						break;
					case 'Deathstar':
					return [[this.shipyardBuilding.level >= 12, account.hyperspaceDriveResearch.level >= 7, account.hyperspaceTechResearch.level >= 6, account.gravitonResearch.level >= 1], ['Shipyard (Level 12)', 'Hyperspace Drive (Level 7)', 'Hyperspace Technology (Level 6)', 'Graviton Technology (Level 1)']];
						break;
					case 'Battlecruiser':
						return [[this.shipyardBuilding.level >= 8, account.hyperspaceDriveResearch.level >= 5, account.hyperspaceTechResearch.level >= 5, account.laserResearch.level >= 12], ['Shipyard (Level 8)', 'Hyperspace Drive (Level 5)', 'Hyperspace Technology (Level 5)', 'Laser Technology (Level 12)']];
						break;
				}
				break;
				
			case 'Defense':
				break;
			default:
				alert('setDependencies function in planets.js -- error');
				break;
		}
	};
}

function getPlanet(planet) {
	switch(planet) {
		case 'Homeworld':
			return account.homeworld;
			break;
		case 'Colony1':
			return account.colony1;
			break;	
		case 'Colony2':
			return account.colony2;
			break;	
		case 'Colony3':
			return account.colony3;
			break;	
		case 'Colony4':
			return account.colony4;
			break;	
		case 'Colony5':
			return account.colony5;
			break;	
		case 'Colony6':
			return account.colony6;
			break;	
		case 'Colony7':
			return account.colony7;
			break;	
		case 'Colony8':
			return account.colony8;
			break;	
	}
}

function getPlanetNames() {
	var elArray = ['homeworld-menu-item', 'colony1-menu-item', 'colony2-menu-item', 'colony3-menu-item', 'colony4-menu-item', 'colony5-menu-item', 'colony6-menu-item', 'colony7-menu-item', 'colony8-menu-item'];
	var planetArray = [account.homeworld, account.colony1, account.colony2, account.colony3, account.colony4, account.colony5, account.colony6, account.colony7, account.colony8];
	
	for (var i = 0; i < elArray.length; i++){
		var tmp = document.getElementById(elArray[i]);
		if (planetArray[i] != undefined) 
			tmp.innerHTML = planetArray[i].name;
	}
}

function displayCurrentPlanet(planet) {
	if (currentPlanetResourceIntv > 0) {
		clearInterval(currentPlanetResourceIntv);
		currentPlanetResourceIntv = null;
	}
	getPlanetNames();
	var planetEl = document.getElementById('planetName');
	planetEl.innerHTML = planet.name;
	displayPointAmount(planet);
	displayResourceAmount(planet);
	if (!buildingBool)
		displayBuildings(planet);
	if (!researchBool)
		displayResearch(planet);
	else {
		continueResearch(currentResearchType, currentResearchTime, currentResearchEl, currentResearchPlanet, currentResearchId);
		(displayResearch(planet, true));
	}
	displayShips(planet);
	if (!planet.shipyardBool) {//TODO: make variable for each planet -- causing a bug as it is
		if (planet.queue.array.length > 0) 
			displayQueue(planet.queue.array.slice(0), planet.queue.addCount, undefined, planet, planet.queue.queueDiv);
	}
	displayDefense(planet);
	currentPlanetResourceIntv = setInterval(function() {
		planet.startProduction();
		if (!buildingBool)
			setButtonColors(planet);
		if (!researchBool)
			setResearchButtonColors(planet);
		setShipColors(planet);
	}, 1000);
}

function renamePlanet(el, planet) {
	var name = prompt('Rename planet: ');
	if (name) {
		planet.rename(name);
		displayCurrentPlanet(planet);
	}
}

function displayPointAmount(planet) {
	var pointsEl = document.getElementById('points');
	pointsEl.innerHTML = "Points: " + addCommas(Math.floor(points / 1000));
	// pointsEl.innerHTML = "Points: " + Math.floor(points / 1000);
}
/* now using window.onload
function changeCurrentPlanet(planet) {
	switch(planet) {
		case 'homeworld':
			currentPlanet = homeworld;
			displayCurrentPlanet(homeworld);
			break;
		case 'colony1':
			currentPlanet = colony1;
			displayCurrentPlanet(colony1);
			break;
		case 'colony2':
			currentPlanet = colony2;
			displayCurrentPlanet(colony2);
			break;
		case 'colony3':
			currentPlanet = colony3;
			displayCurrentPlanet(colony3);
			break;
		case 'colony4':
			currentPlanet = colony4;
			displayCurrentPlanet(colony4);
			break;
		case 'colony5':
			currentPlanet = colony5;
			displayCurrentPlanet(colony5);
			break;
		case 'colony6':
			currentPlanet = colony6;
			displayCurrentPlanet(colony6);
			break;
		case 'colony7':
			currentPlanet = colony7;
			displayCurrentPlanet(colony7);
			break;
		case 'colony8':
			currentPlanet = colony8;
			displayCurrentPlanet(colony8);
			break;
	}
}
*/