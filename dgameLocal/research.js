// Global variables
var researchIntv, researchBool = false, currentResearchPlanet, currentResearchId, currentResearchTime, currentResearchType, currentResearchEl;
/*********************************** RESEARCH CONSTRUCTOR ***********************************/
function Research(type, level, baseCostMetal, baseCostCrystal, baseCostFuel, baseCostEnergy) {
	this.type = type;
	this.level = level;
	this.baseCostMetal = baseCostMetal;
	this.baseCostCrystal = baseCostCrystal;
	this.baseCostFuel = baseCostFuel;
	if (baseCostEnergy == undefined) this.baseCostEnergy = 0;
	else this.baseCostEnergy = baseCostEnergy;
	this.objId = 'Research';
	this.dependencyArray;
	
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
	
	this.getLevel = function() {
		return this.level;
	};
	this.levelUp = function() {
		this.level += 1;
	};
	
	this.hasResources = function(planet) {
		var metalSum, crystalSum, fuelSum;
		metalSum = this.getCostPerLevel('metal');
		crystalSum = this.getCostPerLevel('crystal');
		fuelSum = this.getCostPerLevel('fuel');
		energySum = this.getCostPerLevel('energy');
		if (this.type == 'graviton') 
			return checkResourceRequirements('energy', energySum, planet);
		else
		return checkResourceRequirements('metal', metalSum, planet) && checkResourceRequirements('crystal', crystalSum, planet) && checkResourceRequirements('fuel', fuelSum, planet);
	};
	
	this.getCostPerLevel = function(res) {
		switch(this.type) {
			case 'graviton':
					if (res == 'metal') return 0;
					else if (res == 'crystal') return 0;
					else if (res == 'fuel') return 0;
					else if (res == 'energy') return this.baseCostEnergy * (Math.pow(3, this.level));
					break;
			case 'astrophysics':
					if (res == 'metal') return Math.round(this.baseCostMetal * (Math.pow(1.75, this.level)));
					else if (res == 'crystal') return Math.round(this.baseCostCrystal * (Math.pow(1.75, this.level)));
					else if (res == 'fuel') return Math.round(this.baseCostFuel * (Math.pow(1.75, this.level)));
					else if (res == 'energy') return Math.round(this.baseCostEnergy * (Math.pow(1.75, this.level)));
					break;
			default:
					if (res == 'metal') return Math.round(this.baseCostMetal * (Math.pow(2, this.level)));
					else if (res == 'crystal') return Math.round(this.baseCostCrystal * (Math.pow(2, this.level)));
					else if (res == 'fuel') return Math.round(this.baseCostFuel * (Math.pow(2, this.level)));
					else if (res == 'energy') return Math.round(this.baseCostEnergy * (Math.pow(2, this.level)));
					break;
		}
	};
	this.getResearchTime = function() {
		/* ogame-identical research times:
		return (((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 36) / 1000 ) / (1 + currentPlanet.researchBuilding.level) * 100000; 
		*/
		if (this.type == 'graviton') return 1000;
		else 
			return (((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 9) / 1000 ) / (1 + currentPlanet.researchBuilding.level) * 100000; 
	};
}

function upgradeResearch(btn, researchType, planet, researchEl) {
	console.log('researchBool: ', researchBool);
	var currentResearch = getResearch(researchType),
			metalSum = currentResearch.getCostPerLevel('metal'),
			crystalSum = currentResearch.getCostPerLevel('crystal'),
			fuelSum = currentResearch.getCostPerLevel('fuel'),
			energySum = currentResearch.getCostPerLevel('energy');
			
	if (btn.value == 'Cancel') //cancelling research
		cancelResearch(btn, currentResearch, planet, metalSum, crystalSum, fuelSum);
	else { // researching
		if (currentResearch.hasResources(planet))
		{ // have enough resources
			if (researchBool == false) 
			{ // no other researches being researched
				researchBool = true;
				accountJSON.researchBool = researchBool;
				if (!currentResearch.dependenciesMet(planet))
				{ // dependencies not met
					researchBool = false;
					accountJSON.researchBool = researchBool;
				}
				else 
				{ // dependencies met, continue with construction
					subtractResAmount('metal', metalSum, planet);
					subtractResAmount('crystal', crystalSum, planet);
					subtractResAmount('fuel', fuelSum, planet);
					currentResearchPlanet = planet.id;
					accountJSON.currentResearchPlanet = currentResearchPlanet;
					currentResearchId = btn.id;
					accountJSON.currentResearchId = currentResearchId;
					currentResearchType = researchType;
					accountJSON.currentResearchType = currentResearchType;
					currentResearchEl = researchEl;
					accountJSON.currentResearchEl = currentResearchEl;
						startResearch(currentResearch, currentResearch.getResearchTime(), planet, btn, researchEl);
				}
			}
		}
	}
}

function continueResearch(type, time, el, planet, btn) {
	if (researchIntv > 0) clearInterval(researchIntv);
	type = getResearch(type);
	el = document.getElementById(el);
	time = parseInt(time);
	planet = getPlanet(planet);
	btn = document.getElementById(btn);
	btn.value = 'Cancel';
	researchIntv = setInterval(function() {
		el.innerHTML = "Research Time: " + getTimeClock(time);
		time -= 1000;
		currentResearchTime = time;
		accountJSON.currentResearchTime = currentResearchTime;
		if (time < 0){
			clearInterval(researchIntv);
			researchIntv = null;
			finishResearch(type, planet, btn);
		}
	}, 1000);
}

function startResearch(research, time, planet, btn, el) {
	btn.value = 'Cancel';
	setResearchButtonColors(planet, btn);
	var element = document.getElementById(el);
	researchIntv = setInterval(function() {
		element.innerHTML = "Research time: " + getTimeClock(time);
		time -= 1000;
		currentResearchTime = time; 
		accountJSON.currentResearchTime = currentResearchTime;
		saveJSON(planet);
		if (time < 0){
			clearInterval(researchIntv);
			researchIntv = null;
			finishResearch(research, planet, btn);
		}
	}, 1000);
}

function finishResearch(research, planet, btn) {
	researchBool = false;
	accountJSON.researchBool = researchBool;
	currentResearchPlanet = undefined;
	accountJSON.currentResearchPlanet = currentResearchPlanet;
	currentResearchTime = undefined;
	accountJSON.currentResearchTime = currentResearchTime;
	currentResearchId = undefined;
	accountJSON.currentResearchId = currentResearchId;
	currentResearchType = undefined;
	accountJSON.currentResearchType = currentResearchType;
	currentResearchEl = undefined;
	accountJSON.currentResearchEl = currentResearchEl;
		research.levelUp();
		btn.value = 'Research';
		displayCurrentPlanet(planet);
	saveJSON(currentPlanet);
}

function cancelResearch(btn, research, planet, m, c, f) {
	clearInterval(researchIntv);
	researchIntv = null;
	researchBool = false;
	accountJSON.researchBool = researchBool;
	currentResearchPlanet = undefined;
	accountJSON.currentResearchPlanet = currentResearchPlanet;
	currentResearchTime = undefined;
	accountJSON.currentResearchTime = currentResearchTime;
	currentResearchId = undefined;
	accountJSON.currentResearchId = currentResearchId;
	currentResearchType = undefined;
	accountJSON.currentResearchType = currentResearchType;
	currentResearchEl = undefined;
	accountJSON.currentResearchEl = currentResearchEl;
	planet.metal.addAmount(m);
	planet.crystal.addAmount(c);
	planet.fuel.addAmount(f);
	btn.value = "Research";
	displayCurrentPlanet(planet);
	saveJSON(currentPlanet);
}

function getResearch(research) {
	switch(research) {
		case 'energy':
			return account.energyResearch;
			break;
		case 'laser':
			return account.laserResearch;
			break;
		case 'ion':
			return account.ionResearch;
			break;
		case 'plasma':
			return account.plasmaResearch;
			break;
		case 'espionage':
			return account.espionageResearch;
			break;
		case 'computer':
			return account.computerResearch;
			break;
		case 'hyperspaceTech':
			return account.hyperspaceTechResearch;
			break;
		case 'intergalactic':
			return account.intergalacticResearch;
			break;
		case 'graviton':
			return account.gravitonResearch;
			break;
		case 'astrophysics':
			return account.astrophysicsResearch;
			break;
		case 'combustion':
			return account.combustionResearch;
			break;
		case 'impulse':
			return account.impulseResearch;
			break;
		case 'hyperspaceDrive':
			return account.hyperspaceDriveResearch;
			break;
		case 'weapons':
			return account.weaponsResearch;
			break;
		case 'shielding':
			return account.shieldingResearch;
			break;
		case 'armor':
			return account.armorResearch;
			break;
		default: 
			alert("getResearch function -- something wrong in switch statement");
			break;
	}
}

function setResearchButtonColors(planet, btn) {
			/* this function is called with 'btn' undefined by the resource interval every second to check for requirements being met with resource increments. btn is NOT undefined when called by the "startConstruction" function, which specifies which button to turn red */
	
var researchEnergyU = document.getElementById('research-energy-upgrade'),
	researchLaserU = document.getElementById('research-laser-upgrade'),
	researchIonU = document.getElementById('research-ion-upgrade'),
	researchPlasmaU = document.getElementById('research-plasma-upgrade'),
	researchEspionageU = document.getElementById('research-espionage-upgrade'),
	researchComputerU = document.getElementById('research-computer-upgrade'),
	researchHyperspaceTechU = document.getElementById('research-hyperspaceTech-upgrade'),
	researchIntergalacticU = document.getElementById('research-intergalactic-upgrade'),
	researchGravitonU = document.getElementById('research-graviton-upgrade'),
	researchAstrophysicsU = document.getElementById('research-astrophysics-upgrade'),
	researchCombustionU = document.getElementById('research-combustion-upgrade'),
	researchImpulseU = document.getElementById('research-impulse-upgrade'),
	researchHyperspaceDriveU = document.getElementById('research-hyperspaceDrive-upgrade'),
	researchWeaponsU = document.getElementById('research-weapons-upgrade'),
	researchShieldingU = document.getElementById('research-shielding-upgrade'),
	researchArmorU = document.getElementById('research-armor-upgrade');
	
	if (btn == undefined) { 
		researchEnergyU.style.backgroundColor = account.energyResearch.dependenciesMet(planet) && account.energyResearch.hasResources(planet) ? 'green' : 'gray';
		researchLaserU.style.backgroundColor = account.laserResearch.dependenciesMet(planet) && account.laserResearch.hasResources(planet)? 'green' : 'gray';
		researchIonU.style.backgroundColor = account.ionResearch.dependenciesMet(planet) && account.ionResearch.hasResources(planet) ? 'green' : 'gray';
		researchPlasmaU.style.backgroundColor = account.plasmaResearch.dependenciesMet(planet) && account.plasmaResearch.hasResources(planet) ? 'green' : 'gray';
		researchEspionageU.style.backgroundColor = account.espionageResearch.dependenciesMet(planet) && account.espionageResearch.hasResources(planet) ? 'green' : 'gray';
		researchComputerU.style.backgroundColor = account.computerResearch.dependenciesMet(planet) && account.computerResearch.hasResources(planet) ? 'green' : 'gray';
		researchHyperspaceTechU.style.backgroundColor = account.hyperspaceTechResearch.dependenciesMet(planet) && account.hyperspaceTechResearch.hasResources(planet) ? 'green' : 'gray';
		researchIntergalacticU.style.backgroundColor = account.intergalacticResearch.dependenciesMet(planet) && account.intergalacticResearch.hasResources(planet) ? 'green' : 'gray';
		researchGravitonU.style.backgroundColor = account.gravitonResearch.dependenciesMet(planet) && account.gravitonResearch.hasResources(planet) ? 'green' : 'gray';
		researchAstrophysicsU.style.backgroundColor = account.astrophysicsResearch.dependenciesMet(planet) && account.astrophysicsResearch.hasResources(planet) ? 'green' : 'gray';
		researchCombustionU.style.backgroundColor = account.combustionResearch.dependenciesMet(planet) && account.combustionResearch.hasResources(planet) ? 'green' : 'gray';
		researchImpulseU.style.backgroundColor = account.impulseResearch.dependenciesMet(planet) && account.impulseResearch.hasResources(planet) ? 'green' : 'gray';
		researchHyperspaceDriveU.style.backgroundColor = account.hyperspaceDriveResearch.dependenciesMet(planet) && account.hyperspaceDriveResearch.hasResources(planet) ? 'green' : 'gray';
		researchWeaponsU.style.backgroundColor = account.weaponsResearch.dependenciesMet(planet) && account.weaponsResearch.hasResources(planet) ? 'green' : 'gray';
		researchShieldingU.style.backgroundColor = account.shieldingResearch.dependenciesMet(planet) && account.shieldingResearch.hasResources(planet) ? 'green' : 'gray';
		researchArmorU.style.backgroundColor = account.armorResearch.dependenciesMet(planet) && account.armorResearch.hasResources(planet) ? 'green' : 'gray';
	}
	else {
		researchEnergyU.style.backgroundColor = 'gray';
		researchLaserU.style.backgroundColor = 'gray';
		researchIonU.style.backgroundColor = 'gray';
		researchPlasmaU.style.backgroundColor = 'gray';
		researchEspionageU.style.backgroundColor = 'gray';
		researchComputerU.style.backgroundColor = 'gray';
		researchHyperspaceTechU.style.backgroundColor = 'gray';
		researchIntergalacticU.style.backgroundColor = 'gray';
		researchGravitonU.style.backgroundColor = 'gray';
		researchAstrophysicsU.style.backgroundColor = 'gray';
		researchCombustionU.style.backgroundColor = 'gray';
		researchImpulseU.style.backgroundColor = 'gray';
		researchHyperspaceDriveU.style.backgroundColor = 'gray';
		researchWeaponsU.style.backgroundColor = 'gray';
		researchShieldingU.style.backgroundColor = 'gray';
		researchArmorU.style.backgroundColor = 'gray';
		btn.style.backgroundColor = 'red';
	}
}

function displayResearch(planet, suspend) {
	if (suspend == undefined) suspend = false;
	//TODO: change all "planet" research objects (NOT BUILDING OBJECTS) to "account" objects
		var researchInfo = document.getElementById('research-info'),
				researchList = document.getElementById('research-list'),
			
				researchEnergy = document.getElementById('research-energy'),
				researchEnergyR = document.getElementById('research-energy-requirements'),
				researchEnergyD = document.getElementById('research-energy-dependencies'),
			
				researchLaser = document.getElementById('research-laser'),
				researchLaserR = document.getElementById('research-laser-requirements'),
				researchLaserD = document.getElementById('research-laser-dependencies'),
			
				researchIon = document.getElementById('research-ion'),
				researchIonR = document.getElementById('research-ion-requirements'),
				researchIonD = document.getElementById('research-ion-dependencies'),
			
				researchPlasma = document.getElementById('research-plasma'),
				researchPlasmaR = document.getElementById('research-plasma-requirements'),
				researchPlasmaD = document.getElementById('research-plasma-dependencies'),
			
				researchEspionage = document.getElementById('research-espionage'),
				researchEspionageR = document.getElementById('research-espionage-requirements'),
				researchEspionageD = document.getElementById('research-espionage-dependencies'),
			
				researchComputer = document.getElementById('research-computer'),
				researchComputerR = document.getElementById('research-computer-requirements'),
				researchComputerD = document.getElementById('research-computer-dependencies'),
			
				researchHyperspaceTech = document.getElementById('research-hyperspaceTech'),
				researchHyperspaceTechR = document.getElementById('research-hyperspaceTech-requirements'),
				researchHyperspaceTechD = document.getElementById('research-hyperspaceTech-dependencies'),
			
				researchIntergalactic = document.getElementById('research-intergalactic'),
				researchIntergalacticR = document.getElementById('research-intergalactic-requirements'),
				researchIntergalacticD = document.getElementById('research-intergalactic-dependencies'),
			
				researchGraviton = document.getElementById('research-graviton'),
				researchGravitonR = document.getElementById('research-graviton-requirements'),
				researchGravitonD = document.getElementById('research-graviton-dependencies'),
			
				researchAstrophysics = document.getElementById('research-astrophysics'),
				researchAstrophysicsR = document.getElementById('research-astrophysics-requirements'),
				researchAstrophysicsD = document.getElementById('research-astrophysics-dependencies'),
			
				researchCombustion = document.getElementById('research-combustion'),
				researchCombustionR = document.getElementById('research-combustion-requirements'),
				researchCombustionD = document.getElementById('research-combustion-dependencies'),
			
				researchImpulse = document.getElementById('research-impulse'),
				researchImpulseR = document.getElementById('research-impulse-requirements'),
				researchImpulseD = document.getElementById('research-impulse-dependencies'),
			
				researchHyperspaceDrive = document.getElementById('research-hyperspaceDrive'),
				researchHyperspaceDriveR = document.getElementById('research-hyperspaceDrive-requirements'),
				researchHyperspaceDriveD = document.getElementById('research-hyperspaceDrive-dependencies'),
			
				researchWeapons = document.getElementById('research-weapons'),
				researchWeaponsR = document.getElementById('research-weapons-requirements'),
				researchWeaponsD = document.getElementById('research-weapons-dependencies'),
			
				researchShielding = document.getElementById('research-shielding'),
				researchShieldingR = document.getElementById('research-shielding-requirements'),
				researchShieldingD = document.getElementById('research-shielding-dependencies'),
			
				researchArmor = document.getElementById('research-armor'),
				researchArmorR = document.getElementById('research-armor-requirements'),
				researchArmorD = document.getElementById('research-armor-dependencies');
				
		var researchEnergyU = document.getElementById('research-energy-upgrade'),
				researchLaserU = document.getElementById('research-laser-upgrade'),
				researchIonU = document.getElementById('research-ion-upgrade'),
				researchPlasmaU = document.getElementById('research-plasma-upgrade'),
				researchEspionageU = document.getElementById('research-espionage-upgrade'),
				researchComputerU = document.getElementById('research-computer-upgrade'),
				researchHyperspaceTechU = document.getElementById('research-hyperspaceTech-upgrade'),
				researchIntergalacticU = document.getElementById('research-intergalactic-upgrade'),
				researchGravitonU = document.getElementById('research-graviton-upgrade'),
				researchAstrophysicsU = document.getElementById('research-astrophysics-upgrade'),
				researchCombustionU = document.getElementById('research-combustion-upgrade'),
				researchImpulseU = document.getElementById('research-impulse-upgrade'),
				researchHyperspaceDriveU = document.getElementById('research-hyperspaceDrive-upgrade'),
				researchWeaponsU = document.getElementById('research-weapons-upgrade'),
				researchShieldingU = document.getElementById('research-shielding-upgrade'),
				researchArmorU = document.getElementById('research-armor-upgrade');
		var node;
		var buttonArray = [researchEnergyU, researchLaserU, researchIonU, researchPlasmaU, researchEspionageU, researchComputerU, researchHyperspaceTechU, researchIntergalacticU, researchGravitonU, researchAstrophysicsU, researchCombustionU, researchImpulseU, researchHyperspaceDriveU, researchWeaponsU, researchShieldingU, researchArmorU];
		
		if (planet.researchBuilding.level < 1) { //No research lab
			researchList.style.display = 'none';
			researchInfo.style.display = 'block';
			researchInfo.innerHTML = 'You must build a Research Lab.';
		}
		else { //Research lab is built
			researchList.style.display = 'block';
			researchInfo.style.display = 'none';
			
			researchEnergy.innerHTML = "Energy Technology (Level " + account.energyResearch.level + ')';
			researchEnergyR.innerHTML = "Cost: " + addCommas(account.energyResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.energyResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.energyResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.energyResearch.dependenciesMet(planet)) {// no dependencies left to acquire
				researchEnergyU.style.display = 'inline';
				researchEnergyD.innerHTML = '';
			}
			else {// dependencies required
				researchEnergyU.style.display = 'none';
				node = account.energyResearch.listDependencies(planet);
				while (researchEnergyD.firstChild != null)
					researchEnergyD.removeChild(researchEnergyD.firstChild);
				researchEnergyD.appendChild(node);
			}
			
			researchLaser.innerHTML = "Laser Technology (Level " + account.laserResearch.level + ')';
			researchLaserR.innerHTML = "Cost: " + addCommas(account.laserResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.laserResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.laserResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.laserResearch.dependenciesMet(planet)) {
				researchLaserU.style.display = 'inline';
				researchLaserD.innerHTML = ''; 
			}
			else {
				researchLaserU.style.display = 'none';
				node = account.laserResearch.listDependencies(planet);
				while (researchLaserD.firstChild != null)
					researchLaserD.removeChild(researchLaserD.firstChild);
				researchLaserD.appendChild(node);
			}
			
			researchIon.innerHTML = "Ion Technology (Level " + account.ionResearch.level + ')';
			researchIonR.innerHTML = "Cost: " + addCommas(account.ionResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.ionResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.ionResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.ionResearch.dependenciesMet(planet)) {
				researchIonU.style.display = 'inline';
				researchIonD.innerHTML = '';
			}
			else {
				researchIonU.style.display = 'none';
				node = account.ionResearch.listDependencies(planet);
				while (researchIonD.firstChild != null)
					researchIonD.removeChild(researchIonD.firstChild);
				researchIonD.appendChild(node);
			}
			
			researchPlasma.innerHTML = "Plasma Technology (Level " + account.plasmaResearch.level + ')';
			researchPlasmaR.innerHTML = "Cost: " + addCommas(account.plasmaResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.plasmaResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.plasmaResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.plasmaResearch.dependenciesMet(planet)) {
				researchPlasmaU.style.display = 'inline';
				researchPlasmaD.innerHTML = '';
			}
			else {
				researchPlasmaU.style.display = 'none';
				node = account.plasmaResearch.listDependencies(planet);
				while (researchPlasmaD.firstChild != null)
					researchPlasmaD.removeChild(researchPlasmaD.firstChild);
				researchPlasmaD.appendChild(node);
			}
			
			researchEspionage.innerHTML = "Espionage Technology (Level " + account.espionageResearch.level + ')';
			researchEspionageR.innerHTML = "Cost: " + addCommas(account.espionageResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.espionageResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.espionageResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.espionageResearch.dependenciesMet(planet)) {
				researchEspionageU.style.display = 'inline';
				researchEspionageD.innerHTML = '';
			}
			else {
				researchEspionageU.style.display = 'none';
				node = account.espionageResearch.listDependencies(planet);
				while (researchEspionageD.firstChild != null)
					researchEspionageD.removeChild(researchEspionageD.firstChild);
				researchEspionageD.appendChild(node);
			}
			
			researchComputer.innerHTML = "Computer Technology (Level " + account.computerResearch.level + ')';
			researchComputerR.innerHTML = "Cost: " + addCommas(account.computerResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.computerResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.computerResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.computerResearch.dependenciesMet(planet)) {
				researchComputerU.style.display = 'inline';
				researchComputerD.innerHTML = '';
			}
			else {
				researchComputerU.style.display = 'none';
				node = account.computerResearch.listDependencies(planet);
				while (researchComputerD.firstChild != null)
					researchComputerD.removeChild(researchComputerD.firstChild);
				researchComputerD.appendChild(node);
			}
			
			researchHyperspaceTech.innerHTML = "Hyperspace Technology (Level " + account.hyperspaceTechResearch.level + ')';
			researchHyperspaceTechR.innerHTML = "Cost: " + addCommas(account.hyperspaceTechResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.hyperspaceTechResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.hyperspaceTechResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.hyperspaceTechResearch.dependenciesMet(planet)) {
				researchHyperspaceTechU.style.display = 'inline';
				researchHyperspaceTechD.innerHTML = '';
				}
			else {
				researchHyperspaceTechU.style.display = 'none';
				node = account.hyperspaceTechResearch.listDependencies(planet);
				while (researchHyperspaceTechD.firstChild != null)
					researchHyperspaceTechD.removeChild(researchHyperspaceTechD.firstChild);
				researchHyperspaceTechD.appendChild(node);
			}
			
			researchIntergalactic.innerHTML = "Intergalactic Research Network (Level " + account.intergalacticResearch.level + ')';
			researchIntergalacticR.innerHTML = "Cost: " + addCommas(account.intergalacticResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.intergalacticResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.intergalacticResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.intergalacticResearch.dependenciesMet(planet)) {
				researchIntergalacticU.style.display = 'inline';
				researchIntergalacticD.innerHTML = '';
				}
			else {
				researchIntergalacticU.style.display = 'none';
				node = account.intergalacticResearch.listDependencies(planet);
				while (researchIntergalacticD.firstChild != null)
					researchIntergalacticD.removeChild(researchIntergalacticD.firstChild);
				researchIntergalacticD.appendChild(node);
			}
			
			researchGraviton.innerHTML = "Graviton Technology (Level " + account.gravitonResearch.level + ')';
			researchGravitonR.innerHTML = "Cost: " + addCommas(account.gravitonResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.gravitonResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.gravitonResearch.getCostPerLevel('fuel')) + " fuel, " + addCommas(account.gravitonResearch.getCostPerLevel('energy')) + " energy";
			if (account.gravitonResearch.dependenciesMet(planet)) {
				researchGravitonU.style.display = 'inline';
				researchGravitonD.innerHTML = '';
				}
			else {
				researchGravitonU.style.display = 'none';
				node = account.gravitonResearch.listDependencies(planet);
				while (researchGravitonD.firstChild != null)
					researchGravitonD.removeChild(researchGravitonD.firstChild);
				researchGravitonD.appendChild(node);
			}
			
			researchAstrophysics.innerHTML = "Astrophysics (Level " + account.astrophysicsResearch.level + ')';
			researchAstrophysicsR.innerHTML = "Cost: " + addCommas(account.astrophysicsResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.astrophysicsResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.astrophysicsResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.astrophysicsResearch.dependenciesMet(planet)) {
				researchAstrophysicsU.style.display = 'inline';
				researchAstrophysicsD.innerHTML = '';
				}
			else {
				researchAstrophysicsU.style.display = 'none';
				node = account.astrophysicsResearch.listDependencies(planet);
				while (researchAstrophysicsD.firstChild != null)
					researchAstrophysicsD.removeChild(researchAstrophysicsD.firstChild);
				researchAstrophysicsD.appendChild(node);
			}
			
			researchCombustion.innerHTML = "Combustion Drive (Level " + account.combustionResearch.level + ')';
			researchCombustionR.innerHTML = "Cost: " + addCommas(account.combustionResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.combustionResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.combustionResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.combustionResearch.dependenciesMet(planet)) {
				researchCombustionU.style.display = 'inline';
				researchCombustionD.innerHTML = '';
				}
			else {
				researchCombustionU.style.display = 'none';
				node = account.combustionResearch.listDependencies(planet);
				while (researchCombustionD.firstChild != null)
					researchCombustionD.removeChild(researchCombustionD.firstChild);
				researchCombustionD.appendChild(node);
			}
			
			researchImpulse.innerHTML = "Impulse Drive (Level " + account.impulseResearch.level + ')';
			researchImpulseR.innerHTML = "Cost: " + addCommas(account.impulseResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.impulseResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.impulseResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.impulseResearch.dependenciesMet(planet)) {
				researchImpulseU.style.display = 'inline';
				researchImpulseD.innerHTML = '';
				}
			else {
				researchImpulseU.style.display = 'none';
				node = account.impulseResearch.listDependencies(planet);
				while (researchImpulseD.firstChild != null)
					researchImpulseD.removeChild(researchImpulseD.firstChild);
				researchImpulseD.appendChild(node);
			}
			
			researchHyperspaceDrive.innerHTML = "Hyperspace Drive (Level " + account.hyperspaceDriveResearch.level + ')';
			researchHyperspaceDriveR.innerHTML = "Cost: " + addCommas(account.hyperspaceDriveResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.hyperspaceDriveResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.hyperspaceDriveResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.hyperspaceDriveResearch.dependenciesMet(planet)) {
				researchHyperspaceDriveU.style.display = 'inline';
				researchHyperspaceDriveD.innerHTML = '';
			}
			else {
				researchHyperspaceDriveU.style.display = 'none';
				node = account.hyperspaceDriveResearch.listDependencies(planet);
				while (researchHyperspaceDriveD.firstChild != null)
					researchHyperspaceDriveD.removeChild(researchHyperspaceDriveD.firstChild);
				researchHyperspaceDriveD.appendChild(node);
			}
			
			researchWeapons.innerHTML = "Weapons Technology (Level " + account.weaponsResearch.level + ')';
			researchWeaponsR.innerHTML = "Cost: " + addCommas(account.weaponsResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.weaponsResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.weaponsResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.weaponsResearch.dependenciesMet(planet)) {
				researchWeaponsU.style.display = 'inline';
				researchWeaponsD.innerHTML = '';
				}
			else {
				researchWeaponsU.style.display = 'none';
				node = account.weaponsResearch.listDependencies(planet);
				while (researchWeaponsD.firstChild != null)
					researchWeaponsD.removeChild(researchWeaponsD.firstChild);
				researchWeaponsD.appendChild(node);
			}
			
			researchShielding.innerHTML = "Shielding Technology (Level " + account.shieldingResearch.level + ')';
			researchShieldingR.innerHTML = "Cost: " + addCommas(account.shieldingResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.shieldingResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.shieldingResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.shieldingResearch.dependenciesMet(planet)) {
				researchShieldingU.style.display = 'inline';
				researchShieldingD.innerHTML = '';
				}
			else {
				researchShieldingU.style.display = 'none';
				node = account.shieldingResearch.listDependencies(planet);
				while (researchShieldingD.firstChild != null)
					researchShieldingD.removeChild(researchShieldingD.firstChild);
				researchShieldingD.appendChild(node);
			}
			
			researchArmor.innerHTML = "Armor Technology (Level " + account.armorResearch.level + ')';
			researchArmorR.innerHTML = "Cost: " + addCommas(account.armorResearch.getCostPerLevel('metal')) + " metal, " + addCommas(account.armorResearch.getCostPerLevel('crystal')) + " crystal, " + addCommas(account.armorResearch.getCostPerLevel('fuel')) + " fuel";
			if (account.armorResearch.dependenciesMet(planet)) {
				researchArmorU.style.display = 'inline';
				researchArmorD.innerHTML = '';
				}
			else {
				researchArmorU.style.display = 'none';
				node = account.armorResearch.listDependencies(planet);
				while (researchArmorD.firstChild != null)
					researchArmorD.removeChild(researchArmorD.firstChild);
				researchArmorD.appendChild(node);
			}
			if (!researchBool || planet.id == currentResearchPlanet)
				if (!researchBool)
					setResearchButtonColors(planet);
				else {
					var tmp = document.getElementById(currentResearchId);
					setResearchButtonColors(planet, tmp);
				}
			else {
				for (var i = 0; i < buttonArray.length; i++) 
					buttonArray[i].style.display = 'none';
				researchInfo.style.display = 'block';
				researchInfo.style.textAlign = 'center';
				researchInfo.innerHTML = "Research being conducted on planet " + (getPlanet(currentResearchPlanet)).name;
			}
			
		}
}
