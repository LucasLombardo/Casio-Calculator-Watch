window.onload = function(){
	toggleWatch(true);
	keyInit();
	sideButtonInit();
};

//-------------------------------------------
// ======[Button/Event Listener Logic]=======
//-------------------------------------------

//preload images
var unpressed=new Image(),
	pressedMode=new Image(),
	pressedClr=new Image();
	unpressed.src="https://imageshack.com/a/img923/746/ffntD3.jpg";
	pressedMode.src="https://imageshack.com/a/img922/2200/vT6SrO.jpg";
	pressedClr.src="https://imageshack.com/a/img924/6596/z1DSuW.jpg";

function sideButtonInit(){
	//Select buttons
	var modeBtn = document.querySelector("#mode"),
		clrBtn  = document.querySelector("#clear");
	//set up event listeners for img switch animation
	addSideAnimation(modeBtn, pressedMode.src, unpressed.src);
	addSideAnimation(clrBtn, pressedClr.src, unpressed.src);
	//add click listeners for functionality
	modeBtn.addEventListener("click", function(){
		changeMode();
	});
	clrBtn.addEventListener("click", function(){
		if(mode===0) changeMode();
		clearCalc();
	});
}

function addSideAnimation(btn, img1, img2){
	//adds side button event listener logic for img switch animation
	btn.addEventListener("mousedown", function(){
		document.querySelector("#background").style.backgroundImage = "url('"+img1+"')";
	});
	btn.addEventListener("mouseup", function(){
		document.querySelector("#background").style.backgroundImage = "url('"+img2+"')";
	});
}

function keyInit(){
	//add click listeners to numpad keys
	var keys = document.querySelectorAll(".key");
	for(i=0; i<keys.length; i++){
		keys[i].addEventListener("click", function(){
			handleInput(this.textContent);
		});
	}
}

//-------------------------------------------
//============[Mode Switch Logic]============
//-------------------------------------------

var mode = 0; 	// mode 0: watch mode, mode 1: calculator mode

function changeMode(){
	if(mode===0){
		//switch from watch to calc
		mode = 1;
		document.querySelector("#amPm-text").textContent = "";
		document.querySelector("#day-text").textContent = "";
		toggleWatch(false);
		updateScreen();
	} else if(mode===1){
		//switch from calc to watch
		mode = 0;
		clearCalc();
		toggleWatch(true);
	}
}

//-------------------------------------------
//==============[Watch Logic]================
//-------------------------------------------

var clockInterval;

function toggleWatch(bool){
	//if true turn watch interval on, else turn watch interval off
	bool? clockInterval = setInterval(setTime, 1000) : clearInterval(clockInterval);
}

function setTime(){
	//get current time and update the watch display
	var currTime    =  getTime();
	var displayTime = currTime.hours + ":" + currTime.minutes + " " + currTime.seconds;
	document.querySelector("#day-text").textContent = currTime.weekday;
	document.querySelector("#display-text").textContent = displayTime;
	document.querySelector("#amPm-text").textContent = currTime.period;
}

function getTime(){
	//returns object with local time and date
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


//-------------------------------------------
//============[Calculator Logic]=============
//-------------------------------------------

var value 			= "",
	display 		= "",
	operator		= "+",
	activeDecimal 	= "",
	overflow		= false,
	state 			= 0;
	// 5 states: 	0 - clear (display blank, value blank)
	// 				1 - result (value equal to display, num input will clear, operator input will chain)
	// 				2 - numpartial clear (display active, value equal to display, not in a current calculation)
	// 				3 - operating, total in display (operator set, waiting for number input)
	// 				4 - operating, numpartial in display (operator set and new num in display, waiting for num or operator input)

//=============[Input Handlers]==============

function handleInput(key){
	if(mode===0) changeMode();
	if(!isNaN(key)){
		handleNumbers(Number(key));
	} else if (".".indexOf(key) !== -1){
		handleDecimals();
	} else if ("+-x÷".indexOf(key) !== -1){
		handleOperators(key);
	//handle cmdkeys
	} else{
		//on equal, only operate if in states 3 or 4;
		if(state > 2) value = operate(), display = value, state = 1;
	} 
	value 	= roundToEight(value);
	display = roundToEight(display);
	updateScreen();
}

function handleNumbers(n){
	var neg = display === "-"? "-" : "";
	switch(state){
		case 0: 
		case 1: value = neg+n, display = value, state = 2;
			break;
		case 2: value = appendNum(display, n), display = value;
			break;
		case 3: display = n, state = 4;
			break;
		case 4: display = appendNum(display, n);
	}
}

function handleDecimals(){
	//check if theres already a decimal, if so don't do anything
	if(String(display).indexOf(".")===-1 && !activeDecimal){
		//add 0 if there is no number in display yet
		state < 2 || display===0? activeDecimal = "0." : activeDecimal = ".";
		//clear value and display if in result state
		if(state==1) value = "", display = "", activeDecimal = "0.";
		//if not in operating numpartial state, switch to state 2
		if(state!==4) state = 2;
	}
}

function handleOperators(key){
	activeDecimal = "";
	switch(state){
		case 0: if("-".indexOf(key) !== -1) display="-";
			break;
		case 1:
		case 2: operator = key, state = 3;
			break;
		case 3: operator = key;
			break;
		case 4: value = operate(), display = value, operator = key, state = 3;
	}
}

//============[Helper Functions]=============

function operate(){
	//operates on the value and display, based on what operator was set
	var operatorCalcs = {
	"+": function(a, b){ return a+b },
	"-": function(a, b){ return a-b },
	"÷": function(a, b){ return a/b },
	"x": function(a, b){ return a*b }
	}
	return operatorCalcs[operator](value, display);
}

function appendNum(num1, num2){
	//appends a number to the end of another number, return num1 if max length reached
	result = String(num1).replace(/./,"").length<8 ? Number(String(num1)+activeDecimal+String(num2)) : num1;
	num2 === 0 && activeDecimal? activeDecimal+="0" : activeDecimal="";
	return result;
}

function roundToEight(n){
	//rounds a number to 8 digits, caps at 99,999,999
	console.log("round to 8 executed");
	var str = String(n);
	if(n>99999999){
		overflow=true;
		return 99999999;
	}
	if(n<-9999999){
		overflow=true;
		return -9999999;
	}
	if(str.length<9) return n;
	str = str.slice(0,9);
	var multiplier = Math.pow(10, 8-str.indexOf("."));
	return Math.round(n*multiplier)/multiplier;
}

//==========[Screen/Value Updaters]==========

function clearCalc(){
	value = "", display = "", activeDecimal = "", state=0;
	updateScreen();
}

function updateScreen(){
	//updates the calculator screen
	var displayScreen = document.querySelector("#display-text");
	if(display===0 && activeDecimal){
		displayScreen.textContent = activeDecimal;
	} else if(overflow){
		overflow = false;
		displayScreen.textContent = String(display).slice(0,7)+"E";
	} else {
		displayScreen.textContent = display + activeDecimal;
	}
}