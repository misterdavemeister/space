var hwShipyardIntv, c1ShipyardIntv, c2ShipyardIntv, c3ShipyardIntv, c4ShipyardIntv, c5ShipyardIntv, c6ShipyardIntv, c7ShipyardIntv, c8ShipyardIntv, currentShipTime, shipyardIntv;
//var reloadBool = false;
//var shipyardBool = false;
function Queue(array, planet, queueDiv) 
{
	this.planet = planet;
	this.queueDiv = queueDiv;
	var t = document.getElementById(this.queueDiv);
	while (t.firstChild != null)
	{
		console.log('0. Automatic Queue loading.');
		console.log('0... deleting queueDiv.firstChild');
		t.removeChild(t.firstChild);
	}
	if (array == undefined) 
	{ //first time loading Queue/new game
		console.log('0... array == undefined');
		this.array = [];
	}
	else { //loading from JSON
		console.log('0... array != undefined');
		this.addCount = 0;
		if (array.length > 0) 
		{
			console.log('0...array.length > 0');
			this.array = [];
			for (var i = 0; i < array.length; i += 2) 
			{
				console.log('0...part 1: adding contents to this.array');
				this.array.push(array[i]);
				for (var p in array[i])
				{
					console.log('0...part 2: adding ships to this.array');
					this.array.push(getShip(p, this.planet));
				}
			}
			//saveJSON(planet);
			console.log('0... moving to runShipyard()');
			runShipyard(this.array.slice(0), this.planet, this.queueDiv);
			if (this.array.length > 2)
			{
				console.log('0...this.array > 2 ... displaying rest of this.array in display Queue');
				displayQueue(this.array.slice(2), this.addCount, false, planet, this.queueDiv);
			}
		}
		else 
		{
			console.log('array.length is NOT > 0'); 
			this.array = [];
		}
	}
	this.addCount = 0;
	this.addShip = function(ship, amount) 
	{
		console.log('1. adding ship');
		this.shipyard = {};
		this.shipyard[ship.type] = amount;
		this.array.push(this.shipyard, ship);
		saveJSON(this.planet);
		if (!this.planet.shipyardBool) 
		{
			console.log('1...shipyardBool is false, running shipyard with div: ', this.queueDiv);
			runShipyard(this.array.slice(0), this.planet, this.queueDiv);
		}
		else 
		{
			console.log('1...shipyardBool is true');
			console.log('1... on planet: ',  this.planet.name);
			this.addCount++;
			displayQueue(this.array.slice(2), this.addCount, true, this.planet, this.queueDiv);
		}
	};
	this.deleteShip = function() 
	{
		console.log('5. deleting ship');
		this.array.shift();
		this.array.shift();
	};
}

function runShipyard(array, p, div) 
{
	console.log('2. shipyard running for planet: ', p.name, ' on div: ', div);
	//array[0] == shipyard['Small Cargo'] = 10
	//array[1] == planet.scargo (object)
	p.shipyardBool = true;
	var arr = array[0], sh = array[1];
	if (p.reloadBool == true) 
	{
		console.log('2...reloadBool is true');
		buildShip(arr, sh, p, div); 
	}
	else
	{ 
		console.log('2...reloadBool is false');
		buildShip(arr, sh, p, div);
	}
}

function shipyardFinished(plan, div) {
	console.log('4. shipyard finished');
	var el = document.getElementById(div);
	plan.queue.deleteShip();
	saveJSON(plan);
	if (plan.queue.array.length > 0) {
		console.log('4...more ships in array, restarting shipyard');
		plan.reloadBool = true;
		plan.queue.addCount -= 1;
		runShipyard(plan.queue.array, plan, div);
	}
	else {
		console.log('4...no more ships in array');
		while (el.firstChild != null) {
			console.log('4...removing firstChild until != null');
			el.removeChild(el.firstChild);
		}
		plan.queue.addCount = 0;
	}
}

function displayQueue(array, count, manual, plane, div) 
{
	console.log('?. displaying Queue');
	var tmpCount = parseInt(count);
	var el = document.getElementById(div),
			node, textnode, tmpnode;
	
	if (manual) 
	{
		console.log('?...manual is true');
		for (var i = 0; i < tmpCount - 1; i++)
		{
			console.log('?...removing lastChild ', tmpCount, ' times');
			el.removeChild(el.lastChild);
		}
	}
	for (i = 0; i < array.length; i += 2) 
	{
	var tmp = array[i];
	node = document.createElement('P');
	for (var p in tmp)
		tmpnode = p + ' (' + addCommas(tmp[p]) + ')';
	textnode = document.createTextNode(tmpnode);
	node.appendChild(textnode);
	tmpnode = document.createElement('BR');
	node.appendChild(tmpnode);
	el.appendChild(node);
	}
}

function buildShip(array, ship, plan, div) 
{
	console.log('3. building ship');
	console.log("3...div sent to buildShip: ", div);
	var mainel = document.getElementById(div);
	var el = document.createElement('P');
	mainel.appendChild(el);
	var time = currentShipTime || ship.getConstructionTime();
	var msg, amount;
	for (var p in array) 
	{
		amount = array[p];
		msg = p + ' (' + addCommas(amount) + ') ';
	}
	if (shipyardIntv > 0) clearInterval(shipyardIntv);
		shipyardIntv = setInterval(function()
		{
			console.log('inside plan.shipyardIntv...:', shipyardIntv);
			var date = new Date();
			console.log("planet running shipyardIntv: ", plan.name, " :" + date);
			if (plan.reloadBool) 
			{
				/*this function called with 'reload' undefined by runShipyard()
					when no nodes need to be deleted in queue display*/
				while(mainel.firstChild != null) 
				{
					mainel.removeChild(mainel.firstChild);
					console.log('3...removed firstChild (reload) on planet: ', plan.name);
				}
				mainel.appendChild(el);
				if (plan.queue.array.length > 2)
				{
					console.log('3...array.length > 2, displaying Queue...');
					displayQueue(plan.queue.array.slice(2), plan.queue.addCount, false, plan, div);
				}
			}
			var node = document.createElement('BR');	
			el.innerHTML = msg + getTimeClock(time);
			el.appendChild(node);
			time -= 1000;
			currentShipTime = time;
			localStorage['currentShipTime'] = currentShipTime;
			if (time < 0) 
			{
				console.log('3...finishing ship construction');
				clearInterval(shipyardIntv);
				shipyardIntv = undefined;
				ship.addAmount(1);
				saveJSON(plan);
				console.log("3...for ship: ", ship.type);
				if (plan.name == currentPlanet.name) 
				{
					console.log('3...plan.name == currentPlanet.name');
					//prevent showing on other planets' shipyard screen
					// only needed until bug is fixed
					displayShips(plan);
				//currentShipTime = undefined;
				//localStorage['currentShipTime'] = undefined;
			}
				if (amount > 1)
				{
					console.log('3...more ships to build, restarting');
					for (var p in array)
						array[p] -= 1;
					plan.reloadBool = true;
					saveJSON(plan);
					buildShip(array, ship, plan, div);
				}
				else 
				{
					console.log('3...no more ships to build');
					el.innerHTML = '';
					plan.shipyardBool = false;
					saveJSON(plan);
					shipyardFinished(plan, div);
				}
			}
		}, 1000);
}