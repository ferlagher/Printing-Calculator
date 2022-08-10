//Input
const numpad = document.querySelector('.calc__numpad').children;
const operators = document.querySelector('.calc__operators').children;
const clear = document.querySelector('.calc__clear').children;
const memory = document.querySelector('.calc__memory').children;
const percent = document.querySelector('.calc__percent').children;
const sign = document.querySelector('.calc__sign').children;
const tax = document.querySelector('.calc__tax').children;
const margin = document.querySelector('.calc__margin').children;
const items = document.querySelector('.calc__items').children;

//Output
const display = document.querySelector('.calc__digit');
const tape = document.querySelector('.tape__list');

//Memory
let currentDigits = '0';
let currentSum = [];
let total = 0;
let grandTotal = 0;
let isMultiplicand = false;
let isDividend = false;

//Dealing with floats
const toInteger = float => Math.round(parseFloat(float) * 100);
const toDecimal = integer => integer / 100;

const print = (int, op) => {
    const li = document.createElement('li');
    if (op === '-' || int < 0) {
        li.classList.add("tape__minus");
    };
    li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op;
    tape.appendChild(li);
}

//Record number keys
for (let i = 0; i < numpad.length; i++) {
    numpad[i].addEventListener('click', e => {
        let id = numpad[i].id;
        if ((id.includes('0') && currentDigits === '0') || (id === '.' && currentDigits.includes('.'))) {
            display.innerHTML = currentDigits;
        }
        else if (id === '.' && currentDigits === '0') {
            currentDigits = '0.'
            display.innerHTML = currentDigits;
        }
        else if (currentDigits === '0') {
            currentDigits = id;
            display.innerHTML = currentDigits;
        }
        else {
            currentDigits += id;
            if (currentDigits >= 999999999999) {
                currentDigits = 999999999999
            }
            display.innerHTML = currentDigits;
        }
    })
};

//Arithmetic
for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener('click', e => {
        let currentOperator = operators[i].id;

        const addAndPrint = op => {
            if (currentDigits === '0') {
                if (isMultiplicand || isDividend) {
                    print(total, op);
                }
                else {
                    //Do nothing
                }
            }
            else {
                const roundDigits = toInteger(currentDigits);
                print(roundDigits, op);
                currentDigits = '0';
                if (op === '+' || op === '-'){
                    total += parseInt(op+roundDigits);
                }
                else {
                    total += parseInt(roundDigits);
                }
                display.innerHTML = toDecimal(total);
            }
        };

        const multAndDiv = op => {
            print (toInteger(currentDigits), op);
            display.innerHTML = toDecimal(total);
            currentDigits = '0';
            isMultiplicand = false;
            isDividend = false;
        };

        if (currentOperator === '+') {
            if (isMultiplicand) {
                total = (total * toInteger(currentDigits)) / 100;
                multAndDiv('=');
                print(total, '+');
            }
            else if (isDividend) {
                total = (total / toInteger(currentDigits)) * 100;
                multAndDiv('=');
                print(total, '+');
            }
            else {
                addAndPrint(currentOperator)
            }
        }

        else if (currentOperator === '-') {
            addAndPrint(currentOperator)
        }

        else if (currentOperator === '×') {
            if (total === 0 && currentDigits === '0') {
                //Do nothing
            }
            else {
                if (isMultiplicand) {
                    total = (total * toInteger(currentDigits)) / 100;
                    multAndDiv(currentOperator)
                    isMultiplicand = true;
                }
                else if (isDividend) {
                    total = (total / toInteger(currentDigits)) * 100;
                    multAndDiv(currentOperator);
                    isMultiplicand = true;
                }
                else {
                    isMultiplicand = true;
                    addAndPrint(currentOperator);
                }
            }
        }
        
        else if (currentOperator === '÷') {
            if (total === 0 && currentDigits === '0') {
                //Do nothing
            }
            else {
                if (isDividend) {
                    total = (total / toInteger(currentDigits)) * 100;
                    multAndDiv(currentOperator);
                    isDividend = true;
                }
                else if (isMultiplicand) {
                    total = (total * toInteger(currentDigits)) / 100;
                    multAndDiv(currentOperator);
                    isDividend = true;
                }
                else {
                    isDividend = true;
                    addAndPrint(currentOperator);
                }
            }
        }
    })
};

//Things to fix:
//1+1*2=4
//Sum and rest zero, yes or no?