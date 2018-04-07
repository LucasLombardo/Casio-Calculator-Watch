window.onload = function(){
	keyInit();
};

//==========[Mode Switch Logic]==========

var mode = 0; 	// mode 0 - watch mode, mode 1 - calculator mode



//==========[Watch Logic]================


//==========[Calculator Logic]===========




var value 		= "",
	display 	= "",
	operator	= "+",
	state 		= 0;
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
	//handle operators		
	} else if ("+-x÷".indexOf(key) !== -1){
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
			value = "", display = "", state = 0;
		} else if(key === "Mode"){
			changeMode();
		} else {
			//on equal, only operate if in states 3 or 4;
			if(state > 2) value = operate() || "err", display = value, state = 1;
		}
	//log error if key is not recognized
	} else {
		console.log("Error: Key not recognized");
	}
	
	//logs for debugging
	console.log("state after handleInput = "+state);
	console.log("value 		= "+value);
	console.log("display 	= "+display);
	console.log("operator 	= "+operator);
	console.log("================================");
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
	return operatorCalcs[operator](value, display);
}

function updateScreen(){
	//updates the calculator screen
	var displayScreen = document.querySelector("#display-screen");
	displayScreen.textContent = display;
}

function appendNum(num1, num2){
	//appends a number to the end of another number, return num1 if max length reached
	return String(num1).length<8 ? Number(String(num1)+String(num2)) : num1;
}

function roundToEight(n){
	//rounds a number to 8 digits, caps at 99,999,999
	var str = String(n);
	if(n>99999999) return 99999999;
	if(str.length<9 || str.length<10 && str.indexOf(".") !== -1) return n;
	str = str.slice(0,9);
	var decimals = Math.pow(10, 8-str.indexOf("."));
	return Math.round(n*decimals)/decimals;
}


//==========[Watch Logic]==========
