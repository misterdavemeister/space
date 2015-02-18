// Global variables
var account;
var MainGameIntv;
var gameStarted;
var points;

function Account(username) {
	this.username = username;
	
	this.initPlanets = function() {
		this.homeworld = new Planet('Homeworld', 'Homeworld');
		this.colony1 = new Planet('Colony1', 'Colony1');
		this.colony2 = new Planet('Colony2', 'Colony2');
		this.colony3 = new Planet('Colony3', 'Colony3');
		this.colony4 = new Planet('Colony4', 'Colony4');
		this.colony5 = new Planet('Colony5', 'Colony5');
		this.colony6 = new Planet('Colony6', 'Colony6');
		this.colony7 = new Planet('Colony7', 'Colony7');
		this.colony8 = new Planet('Colony8', 'Colony8');
	
		// each parameter is the next building's level
		this.homeworld.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony1.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony2.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony3.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony4.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony5.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony6.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony7.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
		this.colony8.initBuildings(0, 0, 0, 0, 15, 15, 15, 1);
	
		/* metal amount, metal building level, crystal amount, crystal building level,
		fuel amount, fuel building level, energy level */
		this.homeworld.initResources(5000000, 0, 5000000, 0, 5000000, 0, 0);
		this.colony1.initResources(5000000, 0, 5000000, 0, 5000000, 0, 0);
		this.colony2.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony3.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony4.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony5.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony6.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony7.initResources(5000, 0, 5000, 0, 0, 0, 0);
		this.colony8.initResources(5000, 0, 5000, 0, 0, 0, 0);
	
		// 14 ships (parameters correspond to ship quantity)
		this.homeworld.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony1.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony2.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony3.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony4.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony5.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony6.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony7.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		this.colony8.initShips(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	
		/* 8 defenses (parameters => defense quantity)
		//TODO: implement defenses
		homeworld.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony1.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony2.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony3.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony4.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony5.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony6.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony7.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);
		colony8.initDefenses(0, 0, 0, 0, 0, 0, 0, 0);*/
	
		this.homeworld.initQueue(undefined, this.homeworld, 'homeworld-shipyard-queue');
		this.colony1.initQueue(undefined, this.colony1, 'colony1-shipyard-queue');
		this.colony2.initQueue(undefined, this.colony2, 'colony2-shipyard-queue');
		this.colony3.initQueue(undefined, this.colony3, 'colony3-shipyard-queue');
		this.colony4.initQueue(undefined, this.colony4, 'colony4-shipyard-queue');
		this.colony5.initQueue(undefined, this.colony5, 'colony5-shipyard-queue');
		this.colony6.initQueue(undefined, this.colony6, 'colony6-shipyard-queue');
		this.colony7.initQueue(undefined, this.colony7, 'colony7-shipyard-queue');
		this.colony8.initQueue(undefined, this.colony8, 'colony8-shipyard-queue');
		currentPlanet = this.homeworld;
	};
	
		/********************************************** RESEARCH *********************************************/
	//16 researches
	//Research(type, level, baseCostMetal, baseCostCrystal, baseCostFuel, baseCostEnergy)
	this.initResearches = function(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16) {
		console.log('loading researches for account');
		this.energyResearch = new Research('energy', r1, 0, 800, 400);
		this.laserResearch = new Research('laser', r2, 200, 100, 0);
		this.ionResearch = new Research('ion', r3, 1000, 300, 100);
		this.plasmaResearch = new Research('plasma', r4, 2000, 4000, 1000);
		this.espionageResearch = new Research('espionage', r5, 200, 1000, 200);
		this.computerResearch = new Research('computer', r6, 0, 400, 600);
		this.hyperspaceTechResearch = new Research('hyperspaceTech', r7, 0, 4000, 2000);
		this.intergalacticResearch = new Research('intergalactic', r8, 240000, 400000, 160000);
		this.gravitonResearch = new Research('graviton', r9, 0, 0, 0, 300000);
		this.astrophysicsResearch = new Research('astrophysics', r10, 4000, 8000, 4000);
		this.combustionResearch = new Research('combustion', r11, 400, 0, 600);
		this.impulseResearch = new Research('impulse', r12, 2000, 4000, 600);
		this.hyperspaceDriveResearch = new Research('hyperspaceDrive', r13, 10000, 20000, 6000);
		this.weaponsResearch = new Research('weapons', r14, 800, 200, 0);
		this.shieldingResearch = new Research('shielding', r15, 200, 600, 0);
		this.armorResearch = new Research('armor', r16, 1000, 0, 0);
	};

	this.loadPlanets = function() {
		//loading old game through localStorage (JSON.parse)
		//if (planet == 'Homeworld') {
			this.homeworld = new Planet(homeworldJSON.name, 'Homeworld', homeworldJSON.shipyardBool, homeworldJSON.reloadBool, homeworldJSON.buildingBool);
			currentPlanet = this.homeworld;
			this.homeworld.initBuildings(homeworldJSON.metalBLevel, homeworldJSON.crystalBLevel, homeworldJSON.fuelBLevel, homeworldJSON.energyBLevel, homeworldJSON.roboticsBLevel, homeworldJSON.shipyardBLevel, homeworldJSON.researchBLevel, homeworldJSON.naniteBLevel);
			this.homeworld.initResources(homeworldJSON.metalAmount, homeworldJSON.metalBLevel, homeworldJSON.crystalAmount, homeworldJSON.crystalBLevel, homeworldJSON.fuelAmount, homeworldJSON.fuelBLevel, homeworldJSON.energyBLevel);
			this.homeworld.initShips(homeworldJSON.scargoShip, homeworldJSON.lcargoShip, homeworldJSON.lfighterShip, homeworldJSON.hfighterShip, homeworldJSON.cruiserShip, homeworldJSON.battleShip, homeworldJSON.colonyShip, homeworldJSON.recyclerShip, homeworldJSON.probeShip, homeworldJSON.bomberShip, homeworldJSON.satelliteShip, homeworldJSON.destroyerShip, homeworldJSON.deathstarShip, homeworldJSON.battlecruiserShip);
			this.homeworld.initQueue(homeworldJSON.queueArray, this.homeworld, 'homeworld-shipyard-queue');
			//}
		//else if (planet == 'Colony1') {
			this.colony1 = new Planet(colony1JSON.name, 'Colony1', colony1JSON.shipyardBool, colony1JSON.reloadBool, colony1JSON.buildingBool);		
			currentPlanet = this.colony1;
			this.colony1.initBuildings(colony1JSON.metalBLevel, colony1JSON.crystalBLevel, colony1JSON.fuelBLevel, colony1JSON.energyBLevel, colony1JSON.roboticsBLevel, colony1JSON.shipyardBLevel, colony1JSON.researchBLevel, colony1JSON.naniteBLevel);
			this.colony1.initResources(colony1JSON.metalAmount, colony1JSON.metalBLevel, colony1JSON.crystalAmount, colony1JSON.crystalBLevel, colony1JSON.fuelAmount, colony1JSON.fuelBLevel, colony1JSON.energyBLevel);
			this.colony1.initShips(colony1JSON.scargoShip, colony1JSON.lcargoShip, colony1JSON.lfighterShip, colony1JSON.hfighterShip, colony1JSON.cruiserShip, colony1JSON.battleShip, colony1JSON.colonyShip, colony1JSON.recyclerShip, colony1JSON.probeShip, colony1JSON.bomberShip, colony1JSON.satelliteShip, colony1JSON.destroyerShip, colony1JSON.deathstarShip, colony1JSON.battlecruiserShip);
			this.colony1.initQueue(colony1JSON.queueArray, this.colony1, 'colony1-shipyard-queue');
			//}
		//else if (planet == 'Colony2') {
			this.colony2 = new Planet(colony2JSON.name, 'Colony2', colony2JSON.shipyardBool, colony2JSON.reloadBool, colony2JSON.buildingBool);
			currentPlanet = this.colony2;
			this.colony2.initBuildings(colony2JSON.metalBLevel, colony2JSON.crystalBLevel, colony2JSON.fuelBLevel, colony2JSON.energyBLevel, colony2JSON.roboticsBLevel, colony2JSON.shipyardBLevel, colony2JSON.researchBLevel, colony2JSON.naniteBLevel);
			this.colony2.initResources(colony2JSON.metalAmount, colony2JSON.metalBLevel, colony2JSON.crystalAmount, colony2JSON.crystalBLevel, colony2JSON.fuelAmount, colony2JSON.fuelBLevel, colony2JSON.energyBLevel);
			this.colony2.initShips(colony2JSON.scargoShip, colony2JSON.lcargoShip, colony2JSON.lfighterShip, colony2JSON.hfighterShip, colony2JSON.cruiserShip, colony2JSON.battleShip, colony2JSON.colonyShip, colony2JSON.recyclerShip, colony2JSON.probeShip, colony2JSON.bomberShip, colony2JSON.satelliteShip, colony2JSON.destroyerShip, colony2JSON.deathstarShip, colony2JSON.battlecruiserShip);
			this.colony2.initQueue(colony2JSON.queueArray, this.colony2, 'colony2-shipyard-queue');
			//}
		//else if (planet == 'Colony3') {
			this.colony3 = new Planet(colony3JSON.name, 'Colony3', colony3JSON.shipyardBool, colony3JSON.reloadBool, colony3JSON.buildingBool);
			currentPlanet = this.colony3;
			this.colony3.initBuildings(colony3JSON.metalBLevel, colony3JSON.crystalBLevel, colony3JSON.fuelBLevel, colony3JSON.energyBLevel, colony3JSON.roboticsBLevel, colony3JSON.shipyardBLevel, colony3JSON.researchBLevel, colony3JSON.naniteBLevel);
			this.colony3.initResources(colony3JSON.metalAmount, colony3JSON.metalBLevel, colony3JSON.crystalAmount, colony3JSON.crystalBLevel, colony3JSON.fuelAmount, colony3JSON.fuelBLevel, colony3JSON.energyBLevel);	
			this.colony3.initShips(colony3JSON.scargoShip, colony3JSON.lcargoShip, colony3JSON.lfighterShip, colony3JSON.hfighterShip, colony3JSON.cruiserShip, colony3JSON.battleShip, colony3JSON.colonyShip, colony3JSON.recyclerShip, colony3JSON.probeShip, colony3JSON.bomberShip, colony3JSON.satelliteShip, colony3JSON.destroyerShip, colony3JSON.deathstarShip, colony3JSON.battlecruiserShip);
			this.colony3.initQueue(colony3JSON.queueArray, this.colony3, 'colony3-shipyard-queue');	
			//}
		//else if (planet == 'Colony4') {
			this.colony4 = new Planet(colony4JSON.name, 'Colony4', colony4JSON.shipyardBool, colony4JSON.reloadBool, colony4JSON.buildingBool);
			currentPlanet = this.colony4;
			this.colony4.initBuildings(colony4JSON.metalBLevel, colony4JSON.crystalBLevel, colony4JSON.fuelBLevel, colony4JSON.energyBLevel, colony4JSON.roboticsBLevel, colony4JSON.shipyardBLevel, colony4JSON.researchBLevel, colony4JSON.naniteBLevel);
			this.colony4.initResources(colony4JSON.metalAmount, colony4JSON.metalBLevel, colony4JSON.crystalAmount, colony4JSON.crystalBLevel, colony4JSON.fuelAmount, colony4JSON.fuelBLevel, colony4JSON.energyBLevel);
			this.colony4.initShips(colony4JSON.scargoShip, colony4JSON.lcargoShip, colony4JSON.lfighterShip, colony4JSON.hfighterShip, colony4JSON.cruiserShip, colony4JSON.battleShip, colony4JSON.colonyShip, colony4JSON.recyclerShip, colony4JSON.probeShip, colony4JSON.bomberShip, colony4JSON.satelliteShip, colony4JSON.destroyerShip, colony4JSON.deathstarShip, colony4JSON.battlecruiserShip);
			this.colony4.initQueue(colony4JSON.queueArray, this.colony4, 'colony4-shipyard-queue');
			//}
		//else if (planet == 'Colony5') {
			this.colony5 = new Planet(colony5JSON.name, 'Colony5', colony5JSON.shipyardBool, colony5JSON.reloadBool, colony5JSON.buildingBool);
			currentPlanet = this.colony5;
			this.colony5.initBuildings(colony5JSON.metalBLevel, colony5JSON.crystalBLevel, colony5JSON.fuelBLevel, colony5JSON.energyBLevel, colony5JSON.roboticsBLevel, colony5JSON.shipyardBLevel, colony5JSON.researchBLevel, colony5JSON.naniteBLevel);
			this.colony5.initResources(colony5JSON.metalAmount, colony5JSON.metalBLevel, colony5JSON.crystalAmount, colony5JSON.crystalBLevel, colony5JSON.fuelAmount, colony5JSON.fuelBLevel, colony5JSON.energyBLevel);
			this.colony5.initShips(colony5JSON.scargoShip, colony5JSON.lcargoShip, colony5JSON.lfighterShip, colony5JSON.hfighterShip, colony5JSON.cruiserShip, colony5JSON.battleShip, colony5JSON.colonyShip, colony5JSON.recyclerShip, colony5JSON.probeShip, colony5JSON.bomberShip, colony5JSON.satelliteShip, colony5JSON.destroyerShip, colony5JSON.deathstarShip, colony5JSON.battlecruiserShip);
			this.colony5.initQueue(colony5JSON.queueArray, this.colony5, 'colony5-shipyard-queue');
			//}
		//else if (planet == 'Colony6') {
			this.colony6 = new Planet(colony6JSON.name, 'Colony6', colony6JSON.shipyardBool, colony6JSON.reloadBool, colony6JSON.buildingBool);
			currentPlanet = this.colony6;
			this.colony6.initBuildings(colony6JSON.metalBLevel, colony6JSON.crystalBLevel, colony6JSON.fuelBLevel, colony6JSON.energyBLevel, colony6JSON.roboticsBLevel, colony6JSON.shipyardBLevel, colony6JSON.researchBLevel, colony6JSON.naniteBLevel);
			this.colony6.initResources(colony6JSON.metalAmount, colony6JSON.metalBLevel, colony6JSON.crystalAmount, colony6JSON.crystalBLevel, colony6JSON.fuelAmount, colony6JSON.fuelBLevel, colony6JSON.energyBLevel);
			this.colony6.initShips(colony6JSON.scargoShip, colony6JSON.lcargoShip, colony6JSON.lfighterShip, colony6JSON.hfighterShip, colony6JSON.cruiserShip, colony6JSON.battleShip, colony6JSON.colonyShip, colony6JSON.recyclerShip, colony6JSON.probeShip, colony6JSON.bomberShip, colony6JSON.satelliteShip, colony6JSON.destroyerShip, colony6JSON.deathstarShip, colony6JSON.battlecruiserShip);
			this.colony6.initQueue(colony6JSON.queueArray, this.colony6, 'colony6-shipyard-queue');
			//}
		//else if (planet == 'Colony7') {
			this.colony7 = new Planet(colony7JSON.name, 'Colony7', colony7JSON.shipyardBool, colony7JSON.reloadBool, colony7JSON.buildingBool);
			currentPlanet = this.colony7;
			this.colony7.initBuildings(colony7JSON.metalBLevel, colony7JSON.crystalBLevel, colony7JSON.fuelBLevel, colony7JSON.energyBLevel, colony7JSON.roboticsBLevel, colony7JSON.shipyardBLevel, colony7JSON.researchBLevel, colony7JSON.naniteBLevel);
			this.colony7.initResources(colony7JSON.metalAmount, colony7JSON.metalBLevel, colony7JSON.crystalAmount, colony7JSON.crystalBLevel, colony7JSON.fuelAmount, colony7JSON.fuelBLevel, colony7JSON.energyBLevel);
			this.colony7.initShips(colony7JSON.scargoShip, colony7JSON.lcargoShip, colony7JSON.lfighterShip, colony7JSON.hfighterShip, colony7JSON.cruiserShip, colony7JSON.battleShip, colony7JSON.colonyShip, colony7JSON.recyclerShip, colony7JSON.probeShip, colony7JSON.bomberShip, colony7JSON.satelliteShip, colony7JSON.destroyerShip, colony7JSON.deathstarShip, colony7JSON.battlecruiserShip);
			this.colony7.initQueue(colony7JSON.queueArray, this.colony7, 'colony7-shipyard-queue');
	//	}
	//	else if (planet == 'Colony8') {
			this.colony8 = new Planet(colony8JSON.name, 'Colony8', colony8JSON.shipyardBool, colony8JSON.reloadBool, colony8JSON.buildingBool);
			currentPlanet = this.colony8;
			this.colony8.initBuildings(colony8JSON.metalBLevel, colony8JSON.crystalBLevel, colony8JSON.fuelBLevel, colony8JSON.energyBLevel, colony8JSON.roboticsBLevel, colony8JSON.shipyardBLevel, colony8JSON.researchBLevel, colony8JSON.naniteBLevel);
			this.colony8.initResources(colony8JSON.metalAmount, colony8JSON.metalBLevel, colony8JSON.crystalAmount, colony8JSON.crystalBLevel, colony8JSON.fuelAmount, colony8JSON.fuelBLevel, colony8JSON.energyBLevel);
			this.colony8.initShips(colony8JSON.scargoShip, colony8JSON.lcargoShip, colony8JSON.lfighterShip, colony8JSON.hfighterShip, colony8JSON.cruiserShip, colony8JSON.battleShip, colony8JSON.colonyShip, colony8JSON.recyclerShip, colony8JSON.probeShip, colony8JSON.bomberShip, colony8JSON.satelliteShip, colony8JSON.destroyerShip, colony8JSON.deathstarShip, colony8JSON.battlecruiserShip);
			this.colony8.initQueue(colony8JSON.queueArray, this.colony8, 'colony8-shipyard-queue');
	//	}
		this.initResearches(accountJSON.energyResearch, accountJSON.laserResearch, accountJSON.ionResearch, accountJSON.plasmaResearch, accountJSON.espionageResearch, accountJSON.computerResearch, accountJSON.hyperspaceTechResearch, accountJSON.intergalacticResearch, accountJSON.gravitonResearch, accountJSON.astrophysicsResearch, accountJSON.combustionResearch, accountJSON.impulseResearch, accountJSON.hyperspaceDriveResearch, accountJSON.weaponsResearch, accountJSON.shieldingResearch, accountJSON.armorResearch);
		//return currentPlanet;
	}
};

function newGame() 
{
	localStorage['gameStarted'] = true;
		gameStarted = localStorage['gameStarted'];
		var accountName = 't';
		/*do {
			accountName = prompt("Choose a Username:");
			localStorage['accountName'] = accountName;
		} 
		while (!accountName);*/
		account = new Account(accountName);
		account.initPlanets();
		account.initResearches(2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		saveJSON(account.homeworld);
		saveJSON(account.colony1);
		saveJSON(account.colony2);
		saveJSON(account.colony3);
		saveJSON(account.colony4);
		saveJSON(account.colony5);
		saveJSON(account.colony6);
		saveJSON(account.colony7);
		saveJSON(account.colony8);
		displayCurrentPlanet(account.homeworld);
		startGameIntv(); //main interval for timer/random events
}

function resumeGame(planet)//planet = first letter uppercase
{
	console.log('resuming game');
	clearInterval(currentPlanetResourceIntv);
	clearInterval(MainGameIntv);
	clearInterval(buildingIntv);
	clearInterval(msgIntv);
	currentPlanetResourceIntv = undefined;
	MainGameIntv = undefined;
	buildingIntv = undefined;
	gameStarted = undefined;
	//TODO: building interval for each planet
	msgIntv = undefined;
	accountName = localStorage['accountName'];
	account = new Account(accountName);
	changePage('Buildings');
	loadJSON();
	account.loadPlanets();
	var planets = [account.homeworld, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1];
	for (var i = 0; i < planets.length; i++) {
		clearInterval(planets[i].shipyardIntv);
	}
	currentPlanet = getPlanet(planet);
	//research recovery
	researchBool = accountJSON.researchBool || false;
	currentResearchTime = accountJSON.currentResearchTime;
	currentResearchType = accountJSON.currentResearchType;
	currentResearchEl = accountJSON.currentResearchEl;
	currentResearchPlanet = accountJSON.currentResearchPlanet; 
	currentResearchId = accountJSON.currentResearchId;
	//
	displayCurrentPlanet(currentPlanet);
	startGameIntv(); //main interval for timer/random events 
}

function resetShipyards() {
	var planets = [account.homeworld, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1, account.colony1],
		divArray = [];
	for (var i = 0; i < planets.length; i++) {
		clearInterval(planets[i].shipyardIntv);
		divArray.push(document.getElementById(planets[i].queue.queueDiv));
	}
	for (i = 0; i < divArray.length; i++) {
		while (divArray[i].firstChild != null) divArray[i].removeChild(divArray[i].firstChild);
	}
}

function resetGame() { //planet = first letter uppercase
	if (confirm('This will reset your game. Hit OK to reset, cancel to continue')) {
		clearInterval(currentPlanetResourceIntv);
		clearInterval(MainGameIntv);
		clearInterval(buildingIntv);
		clearInterval(researchIntv);
		clearInterval(msgIntv);
		currentPlanetResourceIntv = undefined;
		MainGameIntv = undefined;
		buildingIntv = undefined;
		researchIntv = undefined;
		shipyardIntv = undefined;
		gameStarted = undefined;
		msgIntv = undefined;
		points = undefined;
		researchBool = false; 
		//shipyardBool = false;
		buildingBool = false;
		currentResearchPlanet = undefined; 
		currentResearchId = undefined; 
		currentResearchTime = undefined; 
		currentResearchType = undefined; 
		currentResearchEl = undefined;
		resetShipyards();
		localStorage.clear();
		window.location = "file:///Users/david/Desktop/server/dgameLocal/index.html/";
	}
	else return;
}

function saveGame() {
	saveJSON(currentPlanet);
}

function addCommas(num) {
	if (num > 999999999999999999999) return num;
	if (typeof(num) != "number") return num;
	var numArr = String(num).split('').reverse();
	var tmpStr = [];
	if (num >= 0) {
		for (var i = 0; i < numArr.length; i++) {
			if (i % 3 === 0 && i !== 0) 
				tmpStr.unshift(numArr[i] + ",");
			else 
				tmpStr.unshift(numArr[i]);
		}
		return tmpStr.join('');
	}
	else {
		numArr.pop();
		for (var i = 0; i < numArr.length; i++) {
			if (i % 3 === 0 && i !== 0) 
				tmpStr.unshift(numArr[i] + ",");
			else 
				tmpStr.unshift(numArr[i]);
		}
		tmpStr.unshift('-');
		return tmpStr.join('');
	}
}

function getTimeClock(milli) {
	//milli = 150000001
	var returnString = '';
	var day = Math.floor(milli / 86400000), //day = 1
		hour = Math.floor((milli - (day * 86400000)) / 3600000), // hour = 17
		min = Math.floor(((milli - (day * 86400000)) - (hour * 3600000)) / 60000), // min = 40
		sec = (((milli - (day * 86400000)) - (hour * 3600000)) - (min * 60000)) / 1000; // sec = 1
	if (day == 1) returnString += String(day) + ' day, ';
	else if (day > 1) returnString += String(day) + ' days, ';
	if (hour < 10) returnString += '0' + String(hour) + ':';
	else if (hour >= 10) returnString += String(hour) + ':';
	if (min < 10) returnString += '0' + String(min) + ':';
	else if (min >= 10) returnString += String(min) + ':';
	if (sec < 10) returnString += '0' + String(Math.round(sec));
	else if (sec >= 10) returnString += String(Math.round(sec));
	
	return returnString;
}

function startGameIntv()
{ 
	var curr = 0;
		MainGameIntv = setInterval(function() {
			curr++;
			if (curr == 10) {
				makeEvent('benign');
				saveJSON(currentPlanet);
			}
			else if (curr == 20) {
				makeEvent('neutral');
				saveJSON(currentPlanet);
			}
			else if (curr == 30) {
				curr = 0;
				makeEvent('danger');
				saveJSON(currentPlanet);
			}
		}, 1000);
}

function changePlanet(planet) {
	var homeworldMenuItem = document.getElementById('homeworld-menu-item'),
			colony1MenuItem = document.getElementById('colony1-menu-item'),
			colony2MenuItem = document.getElementById('colony2-menu-item'),
			colony3MenuItem = document.getElementById('colony3-menu-item'),
			colony4MenuItem = document.getElementById('colony4-menu-item'),
			colony5MenuItem = document.getElementById('colony5-menu-item'),
			colony6MenuItem = document.getElementById('colony6-menu-item'),
			colony7MenuItem = document.getElementById('colony7-menu-item'),
			colony8MenuItem = document.getElementById('colony8-menu-item');
			
	var	homeworldShipyardQueue = document.getElementById('homeworld-shipyard-queue'),
			colony1ShipyardQueue = document.getElementById('colony1-shipyard-queue'),
			colony2ShipyardQueue = document.getElementById('colony2-shipyard-queue'),
			colony3ShipyardQueue = document.getElementById('colony3-shipyard-queue'),
			colony4ShipyardQueue = document.getElementById('colony4-shipyard-queue'),
			colony5ShipyardQueue = document.getElementById('colony5-shipyard-queue'),
			colony6ShipyardQueue = document.getElementById('colony6-shipyard-queue'),
			colony7ShipyardQueue = document.getElementById('colony7-shipyard-queue'),
			colony8ShipyardQueue = document.getElementById('colony8-shipyard-queue');
			if (planet == 'Homeworld') {
				colony1MenuItem.style.color = 'gray';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'rgb(0, 136, 204)';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'block';
			}
			
			else if (planet == 'Colony1') {
				colony1MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'block';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony2') {
				colony2MenuItem.style.color = 'rgb(0, 136, 204)';
				colony1MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'block';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony3') {
				colony3MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'block';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony4') {
				colony4MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'block';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony5') {
				colony5MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'block';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony6') {
				colony6MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'block';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony7') {
				colony7MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				colony8MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'block';
				colony8ShipyardQueue.style.display = 'none';
				homeworldShipyardQueue.style.display = 'none';
			}
			else if (planet == 'Colony8') {
				colony8MenuItem.style.color = 'rgb(0, 136, 204)';
				colony2MenuItem.style.color = 'gray';
				colony3MenuItem.style.color = 'gray';
				colony4MenuItem.style.color = 'gray';
				colony5MenuItem.style.color = 'gray';
				colony6MenuItem.style.color = 'gray';
				colony7MenuItem.style.color = 'gray';
				colony1MenuItem.style.color = 'gray';
				homeworldMenuItem.style.color = 'gray';
				
				colony1ShipyardQueue.style.display = 'none';
				colony2ShipyardQueue.style.display = 'none';
				colony3ShipyardQueue.style.display = 'none';
				colony4ShipyardQueue.style.display = 'none';
				colony5ShipyardQueue.style.display = 'none';
				colony6ShipyardQueue.style.display = 'none';
				colony7ShipyardQueue.style.display = 'none';
				colony8ShipyardQueue.style.display = 'block';
				homeworldShipyardQueue.style.display = 'none';
			}
}

function changePage(div) //called from HTML to change sections of the page without reloading 
{
	var overviewPage = document.getElementById('overviewpage'),
			overviewMenuItem = document.getElementById('overview-menu-item'),
			buildingsPage = document.getElementById('buildingspage'),
			buildingsMenuItem = document.getElementById('buildings-menu-item'),
			shipyardPage = document.getElementById('shipyardpage'),
			shipyardMenuItem = document.getElementById('shipyard-menu-item'),
			researchPage = document.getElementById('researchpage'),
			researchMenuItem = document.getElementById('research-menu-item'),
			fleetPage = document.getElementById('fleetpage'),
			fleetMenuItem = document.getElementById('fleet-menu-item'),
			galaxyPage = document.getElementById('galaxypage'),
			galaxyMenuItem = document.getElementById('galaxy-menu-item'),
			defensePage = document.getElementById('defensepage'),
			defenseMenuItem = document.getElementById('defense-menu-item');

	var pageName = document.getElementById('pagename');
	pageName.innerHTML = '' + '<br>';
	document.title = "DGame - " + div;
	//$('.page').animate({display: 'none'});
	$('#overviewpage').animate({top: '-252px'}, 200);
	$('#buildingspage').animate({top: '-1330px'}, 200); 
	$('#shipyardpage').animate({top: '-2794'}, 200);
	$('#researchpage').animate({top: '-2422'}, 200);
	$('#fleetpage').animate({top: '-252px'}, 200);
	$('#galaxypage').animate({top: '-252px'}, 200);
	$('#defensepage').animate({top: '-252px'}, 200);
	if (div == 'Overview') {
	/*	buildingsPage.style.display = 'none';
		shipyardPage.style.display = 'none';
		researchPage.style.display = 'none';
		fleetPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		defensePage.style.display = 'none';*/
		//overviewPage.style.display = 'block';
		$('.page#overviewpage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});
		
		buildingsMenuItem.style.color = 'gray';
		shipyardMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'rgb(0, 136, 204)';
	}
	else if (div == 'Buildings') {
		/*overviewPage.style.display = 'none';
		shipyardPage.style.display = 'none';
		researchPage.style.display = 'none';
		fleetPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		defensePage.style.display = 'none';*/
		//buildingsPage.style.display = 'block';
		$('.page#buildingspage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		shipyardMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'gray';
		buildingsMenuItem.style.color = 'rgb(0, 136, 204)';
	}
	else if (div == 'Shipyard') {
	/*	overviewPage.style.display = 'none';
		buildingsPage.style.display = 'none';
		researchPage.style.display = 'none';
		fleetPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		defensePage.style.display = 'none';*/
	//	shipyardPage.style.display = 'block';
		$('.page#shipyardpage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		buildingsMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'gray';
		shipyardMenuItem.style.color = 'rgb(0, 136, 204)';
	}
	else if (div == 'Research') {
		/*overviewPage.style.display = 'none';
		buildingsPage.style.display = 'none';
		fleetPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		defensePage.style.display = 'none';
		shipyardPage.style.display = 'none';*/
		//researchPage.style.display = 'block';
		$('.page#researchpage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		buildingsMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'rgb(0, 136, 204)';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'gray';
		shipyardMenuItem.style.color = 'gray';
	}
	else if (div == 'Fleet') {
		/*overviewPage.style.display = 'none';
		buildingsPage.style.display = 'none';
		researchPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		defensePage.style.display = 'none';
		shipyardPage.style.display = 'none';*/
	//	fleetPage.style.display = 'block';
		$('.page#fleetpage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		buildingsMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'rgb(0, 136, 204)';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'gray';
		shipyardMenuItem.style.color = 'gray';
	}
	else if (div == 'Galaxy') {
		/*overviewPage.style.display = 'none';
		buildingsPage.style.display = 'none';
		researchPage.style.display = 'none';
		fleetPage.style.display = 'none';
		defensePage.style.display = 'none';
		shipyardPage.style.display = 'none';*/
		//galaxyPage.style.display = 'block';
		$('.page#galaxypage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		buildingsMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'rgb(0, 136, 204)';
		defenseMenuItem.style.color = 'gray';
		shipyardMenuItem.style.color = 'gray';
	}
	else if (div == 'Defense') {
	/*	overviewPage.style.display = 'none';
		buildingsPage.style.display = 'none';
		researchPage.style.display = 'none';
		fleetPage.style.display = 'none';
		galaxyPage.style.display = 'none';
		shipyardPage.style.display = 'none';*/
		//defensePage.style.display = 'block';
		$('.page#defensepage').animate({top: '124px'}, 500, function(){
				pageName.innerHTML = div.toUpperCase();
		});

		buildingsMenuItem.style.color = 'gray';
		overviewMenuItem.style.color = 'gray';
		researchMenuItem.style.color = 'gray';
		fleetMenuItem.style.color = 'gray';
		galaxyMenuItem.style.color = 'gray';
		defenseMenuItem.style.color = 'rgb(0, 136, 204)';
		shipyardMenuItem.style.color = 'gray';
	}
}

/**************************************************** START FOR TESTING */
	//TODO: ERASE THIS
	//for testing

function addResources(res) {
	var amount = prompt();
	if (!isNaN(amount))
	{
		if (res == 'metal') 
			currentPlanet.metal.addAmount(Number(amount));
		else if (res == 'crystal')
			currentPlanet.crystal.addAmount(Number(amount));
		else if (res == 'fuel') 
			currentPlanet.fuel.addAmount(Number(amount));
	}
}

function changeLevel(toChange, type) {
	var change, metalSum, crystalSum, fuelSum;
	if (confirm('increase level?'))
	{
		if (type == 'building'){
			buildingBool = false;
			change = getBuilding(toChange, currentPlanet);
		}
		else if (type == 'research'){
			researchBool = false;
			change = getResearch(toChange, currentPlanet);
		}
		metalSum = change.getCostPerLevel('metal');
		crystalSum = change.getCostPerLevel('crystal');
		fuelSum = change.getCostPerLevel('fuel');
		if (points == null || points == undefined) points = 0;
		points += metalSum + crystalSum + fuelSum;
		change.levelUp();
		displayCurrentPlanet(currentPlanet);
		saveJSON(currentPlanet);
	}
}
/**************************************************** END FOR TESTING */