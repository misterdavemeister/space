// Object Global Variables


// interval global variables


/* ENERGY CONSTRUCTOR */

function Energy(level)
{
	var level = level,
			usedEnergy, totalUsedEnergy = 0;
	this.getOutput = function() {
		return Math.ceil((20 * level * Math.pow(1.1, level)) + Math.floor((160 / 6) * currentPlanet.satelliteShip.amount));
		//return Math.ceil((20 * level * Math.pow(1.1, level)) + Math.floor((**AVERAGE TEMP OF PLANET** + 160 / 6) * currentPlanet.satelliteShip.amount));
	};
	this.unconsumeEnergy = function(obj) {
		totalUsedEnergy -= obj.energyConsumption();
	};
	this.resetEnergyVariable = function() { //used for testing energy consumption prior to allowing resource increments
		usedEnergy = 0;
	};
	this.setTotalUsedEnergy = function() {
		totalUsedEnergy = usedEnergy; 
	};
	this.consumeEnergy = function(obj) {
		usedEnergy += obj.energyConsumption();
	};
	this.excessOutput = function() {
		return this.getOutput() - totalUsedEnergy;
	};
	this.checkAmount = function(am) {
		return this.excessOutput() >= am;
	};
	this.levelUp = function() {
		level += 1;
	};
	this.levelDown = function() {
		level -= 1;
	};
}

/* METAL & CRYSTAL & FUEL RESOURCE CONSTRUCTOR*/

function Resource(type, amount, level) 
{
	this.type = type;
	this.amount = amount;
	this.level = level;
	this.addAmount = function(res) {
		this.amount += res;
	};
	this.subAmount = function(res) {
		this.amount -= res;
	};
	this.checkAmount = function(am) {
		return this.amount >= am;
	};
	this.getAmount = function() {
		return Math.floor(this.amount);
	};
	this.levelUp = function() {
		this.level += 1;
	};
	this.levelDown = function() {
		this.level -= 1;
	};
	this.produce = function() {
		switch(this.type) 
		{
		case 'metal': // 30 - ogame
			if (this.level > 0)
				return (120 * this.level * Math.pow(1.1, this.level) / 60);
			else 
				return .5;
			break;
		case 'crystal': // 20 - ogame
			if (this.level > 0)
				return (80 * this.level * Math.pow(1.1, this.level) / 60);
			else 
				return .25
			break;
		case 'fuel': // 10 - ogame
			if (this.level > 0)
				return (40 * this.level * Math.pow(1.1, this.level) / 60);
			else 
				return 0;
			break;
		default:
			alert("produce function -- something is wrong with switch statement");
			break;
		}
	};
	this.produceLowEnergy = function() {
		switch(this.type) 
		{
		case 'metal':
			return .5;
			break;
		case 'crystal':
			return .25;
			break;
		case 'fuel':
			return 0;
			break;
		default: 
			alert("energyConsumption function -- something is wrong with switch statement");
			break;
		}
	};
	this.energyConsumption = function() {
		switch(this.type) 
		{
		case 'metal':
			return Math.round(10 * this.level * Math.pow(1.1, this.level));
			break;
		case 'crystal':
			return Math.round(10 * this.level * Math.pow(1.1, this.level));
			break;
		case 'fuel':
			return Math.ceil(20 * this.level * Math.pow(1.1, this.level));
			break;
		default: 
			alert("energyConsumption function -- something is wrong with switch statement");
			break;
		}
	};
	this.energyConsumptionUpgrade = function() {
		switch(this.type) 
		{
		case 'metal':
			return (Math.round(10 * (this.level + 1) * Math.pow(1.1, (this.level + 1)))) - (Math.round(10 * this.level * Math.pow(1.1, this.level)));
			break;
		case 'crystal':
			return (Math.round(10 * (this.level + 1) * Math.pow(1.1, (this.level + 1)))) - (Math.round(10 * this.level * Math.pow(1.1, this.level)));
			break;
		case 'fuel':
			return (Math.ceil(20 * (this.level + 1) * Math.pow(1.1, (this.level + 1)))) - (Math.ceil(20 * this.level * Math.pow(1.1, this.level)));
			break;
		default: 
			alert("energyConsumption function -- something is wrong with switch statement");
			break;
		}
	};
}

function levelResourceUp(res, obj) 
{
	switch(res) 
	{
	case 'metal':
		obj.metal.levelUp();
		break;
	case 'crystal':
		obj.crystal.levelUp();
		break;
	case 'fuel':
		obj.fuel.levelUp();
		break;
	case 'energy':
		obj.energy.levelUp();
		break;
	default: 
		alert("levelResourceUp function -- something is wrong with switch statement");
		break;
	}
}

function levelResourceDown(res, obj) 
{
	switch(res) 
	{
	case 'metal':
		obj.metal.levelDown();
		break;
	case 'crystal':
		obj.crystal.levelDown();
		break;
	case 'fuel':
		obj.fuel.levelDown();
		break;
	case 'energy':
		obj.energy.levelDown();
		break;
	default: 
		alert("levelResourceDown function -- something is wrong with switch statement");
		break;
	}
}

function displayResourceAmount(obj) 
{
	// Document Elements
	var resMetal = document.getElementById('metal');
	var resCrystal = document.getElementById('crystal');
	var resFuel = document.getElementById('fuel');
	var resEnergy = document.getElementById('energy');
	
	resMetal.innerHTML = "Metal: " + addCommas(obj.metal.getAmount());
	resCrystal.innerHTML = "Crystal: " + addCommas(obj.crystal.getAmount());
	resFuel.innerHTML = "Fuel: " + addCommas(obj.fuel.getAmount());
	
	if (obj.energy.excessOutput() < 0) resEnergy.style.color = 'rgb(176, 0, 0)';
	else if (obj.energy.getOutput() == 0) resEnergy.style.color = 'gray';
	else resEnergy.style.color = 'rgb(0, 204, 0)';
	
	resEnergy.innerHTML = "Energy: " + addCommas(obj.energy.excessOutput()) + "/" + addCommas(obj.energy.getOutput());
}

function loseResAmount(type, amountToSub, planet) {
	//TODO: this is the function called when NOT spending res, like resources lost during a battle
}

function subtractResAmount(type, amountToSub, obj) {
	switch(type) { // type of resource
		case 'metal': 
			obj.metal.subAmount(amountToSub);
			break;
		case 'crystal':
			obj.crystal.subAmount(amountToSub);
			break;
		case 'fuel':
			obj.fuel.subAmount(amountToSub);
			break;
		default: 
			alert("levelResourceDown function -- something is wrong with switch statement");
			break;
	}
}

function checkResourceRequirements(type, amountToCheck, obj) {
	switch(type) { // type of resource
		case 'metal': 
			return obj.metal.checkAmount(amountToCheck);
			break;
		case 'crystal':
			return obj.crystal.checkAmount(amountToCheck);
			break;
		case 'fuel':
			return obj.fuel.checkAmount(amountToCheck);
			break;
		case 'energy':
			return obj.energy.checkAmount(amountToCheck);
			break;
		default: 
			alert("levelResourceDown function -- something is wrong with switch statement");
			break;
	}
}