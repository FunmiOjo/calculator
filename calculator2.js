"use strict"
var numberInput = "";
var expressions = [];
var displayText = "";
var answer;


document.getElementById("keypad").addEventListener("click", function(e) {
	if (e.target.tagName === "BUTTON") {
		reactToButtons(e.target.innerText);
	}
}, false);


function reactToButtons(buttonValue) {
	if (isPartOfNumber(buttonValue)) {
		numberInput = numberInput.concat(buttonValue);
		displayText = displayText.concat(buttonValue);
		updateDisplay(displayText);
	}
	
	if (isNegativeSign(buttonValue)) {
		numberInput = numberInput.concat(buttonValue);
		displayText = displayText.concat(buttonValue);
		updateDisplay(displayText);
	}

	if (isOperator(buttonValue)) {
		//the numbers entered before the operator is pushed to expressions array 
		//only after the operator button is clicked 		
		expressions.push(numberInput); 
		expressions.push(buttonValue);
		displayText = displayText.concat(" " + buttonValue + " ");
		updateDisplay(displayText);
		numberInput = "";
	}
		
	if (buttonValue === "=") {
		//same as deal as in isOperator with pushing numbers
		expressions.push(numberInput);
		//converts number inputs in "123" format to 123
		expressions = convertNumberStringsToNumbers(expressions);
		answer = doAllOperations(expressions).toString();
		expressions = [];
		numberInput = answer;
		displayText = answer;
		updateDisplay(displayText);
		
	}	

	if (buttonValue === "Ans") {
		if (answer !== undefined) {
			//in this calculator the answer button simply tacks on the previous
			//answer to the existing input
			numberInput = numberInput.concat(answer);
			displayText = displayText.concat(answer);
			updateDisplay(displayText);
		}
	}

	if (buttonValue === "CE") {
		if (numberInput.length > 0) {
			numberInput = numberInput.slice(0, -1);
			displayText = displayText.slice(0, -1);
			updateDisplay(displayText);
		}
		else {
			expressions.pop();
			//takes off a bigger slice than numbers b/c operators are padded with
			//a space on both sides in display
			displayText = displayText.slice(-3);
			updateDisplay(displayText);
		}
	}

	if (buttonValue === "AC") {
			numberInput = "";
			expressions = [];
			displayText = "";
			updateDisplay(displayText);
	}	
}


function doAllOperations(expressions) {
	//functions called in order of operations
	expressions = doOperationType(expressions, "^");
	expressions = doOperationType(expressions, "*");
	expressions = doOperationType(expressions, "/");
	expressions = doOperationType(expressions, "+");
	expressions = doOperationType(expressions, "-");
	//math.format from math js library to take care of float rounding errors
	if (isNaN(expressions[0]) || !isFinite(expressions[0])) {
		return "Error";
	}
	else {
		return math.format(expressions[0], {precision: 14});
	}
}


function doOperationType(expressions, sign) {
	//replaces each number-sign-number triplet with its calculated value
	var i;
	var count = arrayCount(expressions, sign);
	for (i = 0; i < count; i++) {
		expressions.splice(expressions.indexOf(sign) - 1, 3, 
		operationsResult(sign, expressions.indexOf(sign), expressions));		
	}
	return expressions;
}


function operationsResult(sign, signIndex, expressions) {
	//returns value of number-sign-number triplet
	switch(sign) {
		case "^":
			return Math.pow(expressions[signIndex - 1], 
			expressions[signIndex + 1]);
		case "*":
			return expressions[signIndex - 1] * 
			expressions[signIndex + 1];
		case "/":
			return expressions[signIndex - 1] / 
			expressions[signIndex + 1];
		case "+":
			return expressions[signIndex - 1] + 
			expressions[signIndex + 1];
		case "-":
			return expressions[signIndex - 1] - 
			expressions[signIndex + 1];
	}
}


//helper functions
function isPartOfNumber(buttonValue) {
	return /\d/.test(Number(buttonValue)) || buttonValue === ".";
}


function isOperator(buttonValue) {
	return (/[+\-*\/\^]/.test(buttonValue) && numberInput !== "-");
}


function isNegativeSign(buttonValue) {
	return (buttonValue === "-" && numberInput === "");
}


function convertNumberStringsToNumbers(expressions) {
	var i;
	for (i = 0; i < expressions.length; i++) {
		if (!isNaN(Number(expressions[i]))){
			expressions[i] = Number(expressions[i]);
		}
	}
	return expressions;
}


function arrayCount(arr, item) {
	var count = 0;
	var i;
	
	for (i = 0; i < arr.length; i++) {
		if (arr[i] === item) {
			count++;
		}
	}
	return count; 
}


function updateDisplay(displayText) {
	document.getElementById("display").textContent = displayText;
}
