window.onload = function(){
	keyInit();
	// updateScreen();
};

var value 		= "",
	display 	= "",
	operator	= "",
	state 		= 0;
	// 5 states: 	0 - clear (display blank, value blank)
	// 				1 - result (value equal to display, num input => clear/ state 0, operator input => state 2)
	// 				2 - numpartial clear (display active, value equal to display)
	// 				3 - operating, total in display (operator set, waiting for num input)
	// 				4 - operating, numpartial in display (operator set, waiting for num or operator input)


function keyInit(){
	//add click listeners to all buttons
	var keys = document.querySelectorAll("key");
	for(i=0; i<keys.length; i++){
		keys[i].addEventListener("click", function(){
			alert(this.textContent);
			// handleInput(this.textContent);
		});
	}
}

function handleInput(key){
	console.log(key);
	//handle numbers
	if(!isNaN(key)){
		console.log("num");
		var n = Number(key);
		switch(state){
			case 0: 
			case 1: value = n, display = n, state = 1;
				break;
			case 2: value = appendNum(display, n), display = appendNum(display, n);
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
			case 4: value = operate(), display = operate(), operator = key, state = 3;
				break;
			default: console.log("Error: State not defined, operator input");
		}
	//handle cmdkeys
	} else if("=CE".indexOf(key) !== -1){
		if(key === "CE"){
			value = "", display = "", state = 0;
		} else {
			value = operate(), display = operate(), state = 1;
		}
	//log error if key is not recognized
	} else {
		console.log("Error: Key not recognized")
	}
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

function appendNum(n){
	//appends a num 0-9 to the display, updates value if in state 1

}