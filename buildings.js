// Object global variables
var buildingIntv, currentBuildingTime; 
var buildingBool = false;
/* BUILDING CONSTRUCTOR */

function Building(type, level, baseCostMetal, baseCostCrystal, baseCostFuel) {
	this.type = type;
	this.level = level;
	this.baseCostMetal = baseCostMetal;
	this.baseCostCrystal = baseCostCrystal;
	this.baseCostFuel = baseCostFuel;
	this.objId = 'Building';
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
				// add class "green" for true, "red" for false
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
	this.getConstructionTime = function() {
		// in milliseconds
		/*
		For longer times identical to ogame, multiply by 1440 instead of 360:
		
		return Math.floor((((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 1440) / 1000 ) / Math.pow(2, currentPlanet.roboticsBuilding.level)) * 1000; 
		
		
		**** with nanite: ****
						return Math.floor(((((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 1440) / 1000 ) / (1 + currentPlanet.roboticsBuilding.level)) / Math.pow(2, currentPlanet.naniteBuilding.level)) * 1000; 
		*/ 
				return Math.floor(((((this.getCostPerLevel('metal') + this.getCostPerLevel('crystal')) * 360) / 1000 ) / (1 + currentPlanet.roboticsBuilding.level)) / Math.pow(2, currentPlanet.naniteBuilding.level)) * 1000; 

	};
	
	this.hasResources = function(planet) {
		var metalSum, crystalSum, fuelSum;
		metalSum = this.getCostPerLevel('metal');
		crystalSum = this.getCostPerLevel('crystal');
		fuelSum = this.getCostPerLevel('fuel');
		
		return checkResourceRequirements('metal', metalSum, planet) && checkResourceRequirements('crystal', crystalSum, planet) && checkResourceRequirements('fuel', fuelSum, planet);
	};
	
	this.getCostPerLevel = function(res) {
		switch(this.type) { 
			
		// ********** METAL MINE ********** //
		case 'metal':
			// fall-through to energy case
			
			// ********** FUEL MINE ********** //
		case 'fuel':
			// fall-through to energy case
			
		// ********** ENERGY PLANT ********** //
		case 'energy':
				if (res == 'metal') // return amount of each resource 
					return Math.round(this.baseCostMetal * (Math.pow(1.5, Number(this.level)))); 
				else if (res == "crystal") 
					return Math.round(this.baseCostCrystal * (Math.pow(1.5, Number(this.level))));
				else if (res == 'fuel')
					return Math.round(this.baseCostFuel * (Math.pow(1.5, Number(this.level))));
			break;		
			
				// ********** CRYSTAL MINE ********** //
			case 'crystal': // type of building
					if (res == 'metal') // return amount of each resource 
						return Math.round(this.baseCostMetal * (Math.pow(1.6, Number(this.level)))); 
					else if (res == "crystal") 
						return Math.round(this.baseCostCrystal * (Math.pow(1.6, Number(this.level))));
					else if (res == 'fuel')
						return Math.round(this.baseCostFuel * (Math.pow(1.6, Number(this.level))));
				break;
				
				// ********** ALL OTHER BUILDINGS ********** //
			default:
					if (res == 'metal') // return amount of each resource 
						return Math.round(this.baseCostMetal * (Math.pow(2, Number(this.level)))); 
					else if (res == "crystal") 
						return Math.round(this.baseCostCrystal * (Math.pow(2, Number(this.level))));
					else if (res == 'fuel')
						return Math.round(this.baseCostFuel * (Math.pow(2, Number(this.level))));
				break;
		}
	};	
}

function displayBuildings(planet) {
	var mBuilding = document.getElementById('building-metal'),
			mBuildingR = document.getElementById('building-metal-requirements'),
			mBuildingD = document.getElementById('building-metal-dependencies'),
			cBuilding = document.getElementById('building-crystal'),
			cBuildingR = document.getElementById('building-crystal-requirements'),
			cBuildingD = document.getElementById('building-crystal-dependencies'),
			fBuilding = document.getElementById('building-fuel'),
			fBuildingR = document.getElementById('building-fuel-requirements'),
			fBuildingD = document.getElementById('building-fuel-dependencies'),
			eBuilding = document.getElementById('building-energy'),
			eBuildingR = document.getElementById('building-energy-requirements');			
			eBuildingD = document.getElementById('building-energy-dependencies'),
			roBuilding = document.getElementById('building-robotics'),
			roBuildingR = document.getElementById('building-robotics-requirements');
			roBuildingD = document.getElementById('building-robotics-dependencies'),
			sBuilding = document.getElementById('building-shipyard'),
			sBuildingR = document.getElementById('building-shipyard-requirements');
			sBuildingD = document.getElementById('building-shipyard-dependencies'),
			reBuilding = document.getElementById('building-research'),
			reBuildingR = document.getElementById('building-research-requirements'),
			reBuildingD = document.getElementById('building-research-dependencies'),
			nBuilding = document.getElementById('building-nanite'),
			nBuildingR = document.getElementById('building-nanite-requirements'),
			nBuildingD = document.getElementById('building-nanite-dependencies');
	var mBuildingU = document.getElementById('metalUpgrade'),
			cBuildingU = document.getElementById('crystalUpgrade'),
			fBuildingU = document.getElementById('fuelUpgrade'),
			eBuildingU = document.getElementById('energyUpgrade'),
			roBuildingU = document.getElementById('roboticsUpgrade'),
			sBuildingU = document.getElementById('shipyardUpgrade'),
			reBuildingU = document.getElementById('researchUpgrade'),
			nBuildingU = document.getElementById('naniteUpgrade');
	var node;
	
	mBuilding.innerHTML = "Metal Mine (Level " + planet.metalBuilding.getLevel() + ")";
	mBuildingR.innerHTML = "Cost: " + addCommas(planet.metalBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.metalBuilding.getCostPerLevel('crystal')) + " crystal, " + planet.metal.energyConsumptionUpgrade() + " energy";
	if (planet.metalBuilding.dependenciesMet(planet)) {
		mBuildingU.style.display = 'inline';
		mBuildingU.value = planet.metalBuilding.level > 0 ? 'Upgrade' : 'Build';
		mBuildingD.innerHTML = '';
	}
	else {// dependencies required
				mBuildingU.style.display = 'none';
				node = planet.metalBuilding.listDependencies(planet);
				while (mBuildingD.firstChild != null)
					mBuildingD.removeChild(mBuildingD.firstChild);
				mBuildingD.appendChild(node);
			}
	
	cBuilding.innerHTML = "Crystal Mine (Level " + planet.crystalBuilding.getLevel() + ")";
	cBuildingR.innerHTML = "Cost: " + addCommas(planet.crystalBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.crystalBuilding.getCostPerLevel('crystal')) + " crystal, " + planet.crystal.energyConsumptionUpgrade() + " energy";
	if (planet.crystalBuilding.dependenciesMet(planet)) {
		cBuildingU.style.display = 'inline';
		cBuildingU.value = planet.crystalBuilding.level > 0 ? 'Upgrade' : 'Build';
		cBuildingD.innerHTML = '';
	}
	else {// dependencies required
				cBuildingU.style.display = 'none';
				node = planet.crystalBuilding.listDependencies(planet);
				while (cBuildingD.firstChild != null)
					cBuildingD.removeChild(cBuildingD.firstChild);
				cBuildingD.appendChild(node);
			}
	
	fBuilding.innerHTML = "Fuel Mine (Level " + planet.fuelBuilding.getLevel() + ")";
	fBuildingR.innerHTML = "Cost: " + addCommas(planet.fuelBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.fuelBuilding.getCostPerLevel('crystal')) + " crystal, " + planet.fuel.energyConsumptionUpgrade() + " energy";
	if (planet.fuelBuilding.dependenciesMet(planet)) {
		fBuildingU.style.display = 'inline';
		fBuildingU.value = planet.fuelBuilding.level > 0 ? 'Upgrade' : 'Build';
		fBuildingD.innerHTML = '';
	}
	else {// dependencies required
				fBuildingU.style.display = 'none';
				node = planet.fuelBuilding.listDependencies(planet);
				while (fBuildingD.firstChild != null)
					fBuildingD.removeChild(fBuildingD.firstChild);
				fBuildingD.appendChild(node);
			}
	
	eBuilding.innerHTML = "Energy Plant (Level " + planet.energyBuilding.getLevel() + ")";
	eBuildingR.innerHTML = "Cost: " + addCommas(planet.energyBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.energyBuilding.getCostPerLevel('crystal')) + " crystal";
	if (planet.energyBuilding.dependenciesMet(planet)) {
		eBuildingU.style.display = 'inline';
		eBuildingU.value = planet.energyBuilding.level > 0 ? 'Upgrade' : 'Build';
		eBuildingD.innerHTML = '';
	}
	else {// dependencies required
				eBuildingU.style.display = 'none';
				node = planet.energyBuilding.listDependencies(planet);
				while (eBuildingD.firstChild != null)
					eBuildingD.removeChild(eBuildingD.firstChild);
				eBuildingD.appendChild(node);
			}
	
	roBuilding.innerHTML = "Robotics Factory (Level " + planet.roboticsBuilding.getLevel() + ")";
	roBuildingR.innerHTML = "Cost: " + addCommas(planet.roboticsBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.roboticsBuilding.getCostPerLevel('crystal')) + " crystal, " + addCommas(planet.roboticsBuilding.getCostPerLevel('fuel')) + " fuel";
	if (planet.roboticsBuilding.dependenciesMet(planet)) {
		roBuildingU.style.display = 'inline';
		roBuildingU.value = planet.roboticsBuilding.level > 0 ? 'Upgrade' : 'Build';
		roBuildingD.innerHTML = '';
	}
	else {// dependencies required
				roBuildingU.style.display = 'none';
				node = planet.roboticsBuilding.listDependencies(planet);
				while (roBuildingD.firstChild != null)
					roBuildingD.removeChild(roBuildingD.firstChild);
				roBuildingD.appendChild(node);
			}
	
	sBuilding.innerHTML = "Shipyard (Level " + planet.shipyardBuilding.getLevel() + ")";
	sBuildingR.innerHTML = "Cost: " + addCommas(planet.shipyardBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.shipyardBuilding.getCostPerLevel('crystal')) + " crystal, " + addCommas(planet.shipyardBuilding.getCostPerLevel('fuel')) + " fuel";
	if (planet.shipyardBuilding.dependenciesMet(planet)) {
		sBuildingU.style.display = 'inline';
		sBuildingU.value = planet.shipyardBuilding.level > 0 ? 'Upgrade' : 'Build';
		sBuildingD.innerHTML = '';
		}
	else {// dependencies required
				sBuildingU.style.display = 'none';
				node = planet.shipyardBuilding.listDependencies(planet);
				while (sBuildingD.firstChild != null)
					sBuildingD.removeChild(sBuildingD.firstChild);
				sBuildingD.appendChild(node);
			}
	
	reBuilding.innerHTML = "Research Lab (Level " + planet.researchBuilding.getLevel() + ")";
	reBuildingR.innerHTML = "Cost: " + addCommas(planet.researchBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.researchBuilding.getCostPerLevel('crystal')) + " crystal, " + addCommas(planet.researchBuilding.getCostPerLevel('fuel')) + " fuel";
	if (planet.researchBuilding.dependenciesMet(planet)) {
		reBuildingU.style.display = 'inline';
		reBuildingU.value = planet.researchBuilding.level > 0 ? 'Upgrade' : 'Build';
		reBuildingD.innerHTML = '';
		}
	else {// dependencies required
				reBuildingU.style.display = 'none';
				node = planet.researchBuilding.listDependencies(planet);
				while (reBuildingD.firstChild != null)
					reBuildingD.removeChild(reBuildingD.firstChild);
				reBuildingD.appendChild(node);
			}
	
	nBuilding.innerHTML = "Nanite Factory (Level " + planet.naniteBuilding.getLevel() + ")";
	nBuildingR.innerHTML = "Cost: " + addCommas(planet.naniteBuilding.getCostPerLevel('metal')) + " metal, " + addCommas(planet.naniteBuilding.getCostPerLevel('crystal')) + " crystal, " + addCommas(planet.naniteBuilding.getCostPerLevel('fuel')) + " fuel";
	if (planet.naniteBuilding.dependenciesMet(planet)) {
		nBuildingU.style.display = 'inline';
		nBuildingU.value = planet.naniteBuilding.level > 0 ? 'Upgrade' : 'Build';
		nBuildingD.innerHTML = '';
		}
	else {// dependencies required
				nBuildingU.style.display = 'none';
				node = planet.naniteBuilding.listDependencies(planet);
				while (nBuildingD.firstChild != null)
					nBuildingD.removeChild(nBuildingD.firstChild);
				nBuildingD.appendChild(node);
			}
	
	setButtonColors(planet);
}

function setButtonColors(planet, btn) {
			/* this function is called with 'btn' undefined by the resource interval every second to check for requirements being met with resource increments. btn is NOT undefined when called by the "startConstruction" function, which specifies which button to turn red */
	
var mBuildingU = document.getElementById('metalUpgrade'),
		cBuildingU = document.getElementById('crystalUpgrade'),
		fBuildingU = document.getElementById('fuelUpgrade'),
		eBuildingU = document.getElementById('energyUpgrade'),
		roBuildingU = document.getElementById('roboticsUpgrade'),
		sBuildingU = document.getElementById('shipyardUpgrade'),
		reBuildingU = document.getElementById('researchUpgrade'),
		nBuildingU = document.getElementById('naniteUpgrade');
	if (btn == undefined) { 
	mBuildingU.style.backgroundColor = planet.metalBuilding.dependenciesMet(planet) && planet.metalBuilding.hasResources(planet) ? 'green' : 'gray';
	cBuildingU.style.backgroundColor = planet.crystalBuilding.dependenciesMet(planet) && planet.crystalBuilding.hasResources(planet) ? 'green' : 'gray';
	fBuildingU.style.backgroundColor = planet.fuelBuilding.dependenciesMet(planet) && planet.fuelBuilding.hasResources(planet) ? 'green' : 'gray';
	eBuildingU.style.backgroundColor = planet.energyBuilding.dependenciesMet(planet) && planet.energyBuilding.hasResources(planet) ? 'green' : 'gray';
	roBuildingU.style.backgroundColor = planet.roboticsBuilding.dependenciesMet(planet) && planet.roboticsBuilding.hasResources(planet) ? 'green' : 'gray';
	sBuildingU.style.backgroundColor = planet.shipyardBuilding.dependenciesMet(planet) && planet.shipyardBuilding.hasResources(planet) ? 'green' : 'gray';
	reBuildingU.style.backgroundColor = planet.researchBuilding.dependenciesMet(planet) && planet.researchBuilding.hasResources(planet) ? 'green' : 'gray';
		nBuildingU.style.backgroundColor = planet.naniteBuilding.dependenciesMet(planet) && planet.naniteBuilding.hasResources(planet) ? 'green' : 'gray';
	}
	else {
		mBuildingU.style.backgroundColor = 'gray';
		cBuildingU.style.backgroundColor = 'gray';
		fBuildingU.style.backgroundColor = 'gray';
		eBuildingU.style.backgroundColor = 'gray';
		roBuildingU.style.backgroundColor = 'gray';
		sBuildingU.style.backgroundColor = 'gray';
		reBuildingU.style.backgroundColor = 'gray';
		nBuildingU.style.backgroundColor = 'gray';
		btn.style.backgroundColor = 'red';
	}
}

function upgradeBuilding(btn, building, planet, el) {
	var metalSum, crystalSum, fuelSum, potentialPoints = 0;
	var currentBuilding = getBuilding(building, planet);
			metalSum = currentBuilding.getCostPerLevel('metal');
			crystalSum = currentBuilding.getCostPerLevel('crystal');
			fuelSum = currentBuilding.getCostPerLevel('fuel');
			
	if (btn.value == 'Cancel') 
	{ //cancelling during upgrade
		cancelConstruction(btn, currentBuilding, planet, metalSum, crystalSum, fuelSum);
	} 
	else 
	{ // upgrading/building
		if (currentBuilding.hasResources(planet))
		{ // have enough resources
			if (buildingBool == false) 
			{ // no other buildings under construction
				buildingBool = true;
				if (!currentBuilding.dependenciesMet(planet))
				{ // dependencies not met
					buildingBool = false;
				}
				else 
				{ // dependencies met, continue with construction
					subtractResAmount('metal', metalSum, planet);
					subtractResAmount('crystal', crystalSum, planet);
					subtractResAmount('fuel', fuelSum, planet);
					potentialPoints += metalSum + crystalSum + fuelSum;
					//if (currentBuildingTime != undefined)
					startConstruction(currentBuilding, currentBuilding.getConstructionTime(), planet, btn, el, potentialPoints);
					//else
					//startConstruction(currentBuilding, currentBuildingTime, planet, btn, el, potentialPoints);	
				}
			}
		}
	}
}

function getBuilding(buildingToGet, planet) {
	switch(buildingToGet) {
		case 'metal':
			return planet.metalBuilding;
			break;
		case 'crystal':
			return planet.crystalBuilding;
			break;
		case 'fuel':
			return planet.fuelBuilding;
			break;
		case 'energy':
			return planet.energyBuilding;
			break;
		case 'robotics':
			return planet.roboticsBuilding;
			break;
		case 'shipyard':
			return planet.shipyardBuilding;
			break;
		case 'research':
			return planet.researchBuilding;
			break;
		case 'nanite':
			return planet.naniteBuilding;
			break;
		default: 
			alert('getBuilding function -- something wrong in switch case');
			break;
	}
}

function startConstruction(building, time, planet, btn, el, pPoints) {
	buildingBool = true;
	btn.value = 'Cancel';
	setButtonColors(planet, btn);
	var element = document.getElementById(el);

	buildingIntv = setInterval(function() {
		element.innerHTML = "Construction time: " + getTimeClock(time);
		time -= 1000;
	//	currentBuildingTime = time;
	//	localStorage['currentBuildingTime'] = currentBuildingTime;
		if (time < 0){
			clearInterval(buildingIntv);
			buildingIntv = null;
			finishConstruction(building, planet, btn, pPoints);
		}
	}, 1000);
}

function finishConstruction(building, planet, btn, pPoints) {
	buildingBool = false;
	//currentBuildingTime = undefined;
	//localStorage['currentBuildingTime'] = undefined;
	points += pPoints;
	building.levelUp();
	if (building.type == 'metal' || building.type == 'crystal' || building.type == 'fuel' || building.type == 'energy')
		levelResourceUp(building.type, planet);
	btn.value = 'Upgrade';
	displayCurrentPlanet(planet);
	saveJSON(currentPlanet);
}

function cancelConstruction(btn, building, planet, m, c, f) {
	clearInterval(buildingIntv);
	buildingIntv = null;
	buildingBool = false;
	//currentBuildingTime = undefined;
	//localStorage['currentBuildingTime'] = undefined;
	planet.metal.addAmount(m);
	planet.crystal.addAmount(c);
	planet.fuel.addAmount(f);
	if (building.level == 0)
		btn.value = "Build"; // previousValue undefined here
	else 
		btn.value = "Upgrade";
	displayCurrentPlanet(planet);
	saveJSON(currentPlanet);
}