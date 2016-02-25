//need to split into more functions
var operations = [];
var num = "";
var calc;
var displayText = "";
var ans;



document.getElementById("keypad").addEventListener("click", function(e) {
	//console.log(e);
	if (e.target.tagName === "BUTTON") {
		handleInput(e.target.innerText);
		document.getElementById("display").innerHTML = displayText;
	}
}, false);


//function takes array of operations in operations format,
//performs calculations and returns total
function parseoperations(input) {
	function operatorLogic(a, b, operator) {
		if (operator == "+") {
			return a + b;
		}
		if (operator == "-") {
			return a - b;
		}
		
		if (operator == "*") {
			return a * b;
		}
		
		if (operator == "/") {
			if (b == 0) {
				return "Error";
			}
			else {
				return a / b;
			}
		}
		
		if (operator == "^") {
			return Math.pow(a, b);
		}
		
		else {
			return "Invalid operator";
		}
	}
	
	var numbers = [];
	var operators = [];
	var output = [];
	var operator;
	var a;
	var b;
	
	if (input.length >= 3) {
		for (var i = 0; i < input.length; i++) {
			if (!isNaN(Number(input[i]))) {
				numbers.push(Number(input[i]));
			}
			else {
				operators.push(input[i]);
			}
		}
		
		while (operators.length > 0) {
			while (output.length < 2) {
				output.push(numbers.pop());
			}
			
			a = output.pop();
			b = output.pop();
			operator = operators.shift();
			output.push(operatorLogic(a, b, operator));
		}
		
		return output[0];
	}
}


function handleInput(input) {
//function takes input from user in form of numbers and operators,
//appends them to an array
//and assigns result of calculation, performed in parseoperations, to a variable
	
	var numberRe = /\d/;
	var operatorRe = /[+\-*\/%\^]/;
	var numConversion = Number(input);
	
	if (numberRe.test(Number(input)) || input === ".") {
		num = num.concat(input);
		var lastDigit = displayText.slice(-1);
		if (numberRe.test(lastDigit) || lastDigit === ".") {
			displayText = displayText + input;
		}
		else {
			displayText = displayText + " " + input;
		}		
	}
	
	if (input === "Ans" && ans !== undefined) {
		num = num.concat(ans);
		if (numberRe.test(displayText.slice(-1))) {
			displayText = displayText + ans;
		}
		else {
			displayText = displayText + " " + ans;
		}
	}
	
	if (operatorRe.test(input)) {
		if (num.length === 0 && input === "-") {
			num = num.concat(input);
		}
		else {
			operations.push(num);
			num = "";
			operations.push(input);
			displayText = operations.join(" ");
		}
	}
	
	if (input === "=") {
		if (num.length > 0 && operations.length > 0) {
			operations.push(num);
			calc = parseoperations(operations);
			
			if (!isNaN(calc)) {
				displayText = ans = calc.toString();
				num = calc.toString();
			}
			
			else {
				displayText = "Error";
			}
			operations = [];
		}
	}
	
	if (input === "CE") {
		if (num.length > 0) {
			num = num.slice(0, -1);
			displayText = num;
		}
		else {
			operations.pop();
		}
	}
	
	if (input === "AC") {
		num = "";
		operations = [];
		displayText = "";
	}
}
