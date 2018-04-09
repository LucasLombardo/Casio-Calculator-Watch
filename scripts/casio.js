window.onload = function(){
	var clockInterval;
	startWatch();
	keyInit();
};

//==========[Mode Switch Logic]==========

var mode = 0; 	// mode 0 - watch mode, mode 1 - calculator mode

function changeMode(){
	console.log("changeMode executed")
	//switch from calc to watch
	if(mode===0){
		mode = 1;
		//hide watch display
		document.querySelector(".clock").style.display = "none";
		stopWatch();
		//unhide calc display
		document.querySelector("#calc-display").style.display = "block";
	} else if(mode===1){
		mode = 0;
		//hide calc display
		document.querySelector("#calc-display").style.display = "none";
		//clear calc memory
		value = "", display = "", state = 0;
		startWatch();
		//unhide watch display
		document.querySelector(".clock").style.display = "block";
	} else {
		console.log("Error: Mode not defined");
	}
}

//==========[Watch Logic]================

function startWatch(){
	clockInterval = setInterval(setTime, 1000);
}

function stopWatch(){
	clearInterval(clockInterval);
}

function setTime(){
	//get current time and update the DOM
	var currTime    =  getTime();
	var displayTime = currTime.hours + ":" + currTime.minutes + "  " + currTime.seconds;
	document.querySelector("#week-day").textContent = currTime.weekday;
	document.querySelector("#time").textContent = displayTime;
	document.querySelector("#period").textContent = currTime.period;
}

function getTime(){
	//returns array of am/pm, hours, minutes, seconds, day of week
	var d = new Date();
	var twelveHourClock = d.getHours()>12 ? d.getHours()-12: d.getHours();
	if(twelveHourClock === 0) twelveHourClock = 12;
	return { 
		"period"  : (d.getHours()>=12 && d.getHours() !== 24) ? "PM" : "AM",
		"hours"   : twelveHourClock,
		"minutes" : d.getMinutes()>9 ? d.getMinutes() : "0" + d.getMinutes(), 
		"seconds" : d.getSeconds()>9 ? d.getSeconds() : "0" + d.getSeconds(), 
		"weekday" : ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()]
	}
}

//==========[Calculator Logic]===========


var value 			= "",
	display 		= "",
	operator		= "+",
	activeDecimal 	= "",
	state 			= 0;
	// 5 states: 	0 - clear (display blank, value blank)
	// 				1 - result (value equal to display, num input => clear/ state 0, operator input => state 2)
	// 				2 - numpartial clear (display active, value equal to display)
	// 				3 - operating, total in display (operator set, waiting for num input)
	// 				4 - operating, numpartial in display (operator set, waiting for num or operator input)



function keyInit(){
	//add click listeners to all buttons
	var keys = document.querySelectorAll(".key");
	for(i=0; i<keys.length; i++){
		keys[i].addEventListener("click", function(){
			handleInput(this.textContent);
		});
	}
}

function handleInput(key){
	//handle numbers
	if(!isNaN(key)){
		if(mode===0) changeMode();
		var n = Number(key);
		switch(state){
			case 0: 
			case 1: value = n, display = n, state = 2;
				break;
			case 2: value = appendNum(display, n), display = value;
				break;
			case 3: display = n, state = 4;
				break;
			case 4: display = appendNum(display, n);
				break;
			default: console.log("Error: State not defined, number input");
		}
	//handle decimals
	} else if (".".indexOf(key) !== -1){
		if(mode===0) changeMode();
		//check if theres already a decimal, if so don't do anything
		if(String(display).indexOf(".")===-1 && !activeDecimal){
			state < 2 || display===0? activeDecimal = "0." : activeDecimal = ".";
			if(state==1) value = "", display = "", activeDecimal = "0.";
			state == 4? state = 4: state = 2;
		}
	//handle operators		
	} else if ("+-x÷".indexOf(key) !== -1){
		if(mode===0) changeMode();
		activeDecimal = "";
		switch(state){
			case 0: ; 			//add negative functionality in later?
				break;
			case 1:
			case 2: operator = key, state = 3;
				break;
			case 3: operator = key;
				break;
			case 4: value = operate(), display = value, operator = key, state = 3;
				break;
			default: console.log("Error: State not defined, operator input");
		}
	//handle cmdkeys
	} else if("=CEClearMode".indexOf(key) !== -1){

		if(key === "CE" || key ==="Clear"){
			if(mode===0) changeMode();
			value = "", display = "", activeDecimal = "", state = 0;
		} else if(key === "Mode"){
			changeMode();
		} else {
			//on equal, only operate if in states 3 or 4;
			if(mode===0) changeMode();
			if(state > 2) value = operate(), display = value, state = 1; //|| "err" removed from value statement
		}
	//log error if key is not recognized
	} else {
		console.log("Error: Key not recognized");
	}
	
	// //logs for debugging
	// 	console.log("state after handleInput = "+state);
	// 	console.log("value 			= "+value);
	// 	console.log("display 		= "+display);
	// 	console.log("operator 		= "+operator);
	// 	console.log("activeDecimal 	= "+activeDecimal);
	// 	console.log("================================");

	//round numbers if necessary
	value 	= roundToEight(value);
	display = roundToEight(display);
	updateScreen();
}

function operate(){
	//operates on the value and display, based on what operator was set
	var operatorCalcs = {
	"+": function(a, b){ return a+b },
	"-": function(a, b){ return a-b },
	"÷": function(a, b){ return a/b },
	"x": function(a, b){ return a*b }
	}
	if(isNaN(value)) console.log("Error: Operate failed, value isNaN");
	if(isNaN(display)) console.log("Error: Operate failed, display isNaN");
	return operatorCalcs[operator](value, display);
}

function updateScreen(){
	//updates the calculator screen
	var displayScreen = document.querySelector("#calc-display");
	if(display===0 && activeDecimal){
		displayScreen.textContent = activeDecimal;
	} else {
		displayScreen.textContent = display + activeDecimal;
	}
}

function appendNum(num1, num2){
	//appends a number to the end of another number, return num1 if max length reached
	result = String(num1).replace(/./,"").length<8 ? Number(String(num1)+activeDecimal+String(num2)) : num1;
	num2 === 0 && activeDecimal? activeDecimal+="0" : activeDecimal="";
	return result;
}

function roundToEight(n){
	//rounds a number to 8 digits, caps at 99,999,999
	var str = String(n);
	if(n>99999999) return 99999999;
	if(str.length<9 || str.length<10 && str.indexOf(".") !== -1) return n;
	str = str.slice(0,9);
	var multiplier = Math.pow(10, 8-str.indexOf("."));
	return Math.round(n*multiplier)/multiplier;
}