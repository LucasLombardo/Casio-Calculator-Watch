window.onload = function(){
	keyInit();
};

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
	} else if("=CE".indexOf(key) !== -1){
		if(key === "CE"){
			value = "", display = "", state = 0;
		} else {
			if(state !== 1) value = operate() || "", display = value, state = 1;			
		}
	//log error if key is not recognized
	} else {
		console.log("Error: Key not recognized")
	}
	
	//logs for debugging
	console.log("state after handleInput = "+state);
	console.log("value 		= "+value);
	console.log("display 	= "+display);
	console.log("operator 	= "+operator);
	console.log("================================");

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
	var result = operatorCalcs[operator](value, display);
	return Math.round(result*1000)/1000;
}

function updateScreen(){
	//updates the calculator screen
	var displayScreen = document.querySelector("#display-screen");
	displayScreen.textContent = display;
}

function appendNum(num1, num2){
	//appends a number to the end of another number, max 8 
	return Number(String(num1)+String(num2));
}