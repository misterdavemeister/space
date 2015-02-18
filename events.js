// Object Global Variables
var MessageObj, EventObj, msgIntv;

/* EVENT CONSTRUCTOR */

function Event() {
	this.message = new Message("I am an object within an object", "white", false);
}

/* MESSAGE CONSTRUCTOR */

function Message(msg, RWG, animated) {
	var msg = msg, //the message
			RWG = RWG, //'red' for color red, 'white' for white, 'green' for green
			animated = animated; // true or false for fade animation, or permanent until message expires
	this.post = function() {
		var message = document.getElementById('messages');
		var spotNode = document.createElement('P');
		if (RWG == 'red') 
			RWG = 'rgb(128,0,0)';
		spotNode.style.color = RWG;
		var time = new Date();
		var messageNode = document.createTextNode(time + ": " + msg);
		spotNode.appendChild(messageNode);
		message.appendChild(spotNode);
		var curr = 0;
		msgIntv = setInterval(function() {
			curr += 1;
			if (curr == 3) {
				while (message.lastChild != null)
					message.removeChild(message.lastChild);
				clearInterval();
			}
		}, 1000);
	};
}

function makeEvent(type) {
	EventObj = new Event();
	EventObj.message.post();
	
	switch(type) {
		case 'benign':
			MessageObj = new Message("I am a message and I am green.", 'green', false);
			MessageObj.post();
			MessageObj = null; 
			break;
		case 'neutral':
			MessageObj = new Message("I am a message and I am white.", 'white', false);
			MessageObj.post();
			MessageObj = null; 
			break;
		case 'danger':
			MessageObj = new Message("I am a message and I am red.", 'red', false);
			MessageObj.post();
			MessageObj = null; 
			break;
	}
}

function getRandomNumber(chance) { // "chance" will be a number: the number of possible numbers return randomly
	return Math.floor((Math.random() * chance) + 1);
}