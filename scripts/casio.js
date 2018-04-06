window.onload = function(){

};

var value 		= "",
	display 	= "",
	operator	= "",
	state 		= 0;
	// 5 states: 	0 - clear (display blank, value blank)
	// 				1 - numpartial clear (display active, value equal to display)
	// 				2 - operating, total in display (operator set, waiting for num input)
	// 				3 - operating, numpartial in display (operator set, waiting for num or operator input)
	// 				4 - result (value equal to display, num input => clear/ state 0, operator input => state 2)


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
}

function numPush(n){
	//appends a num 0-9 to the display, updates value if in state 1

}