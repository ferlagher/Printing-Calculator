//Input
const numpad = document.querySelector('.calc__numpad').children;
const operators = document.querySelector('.calc__operators').children;
const clear = document.querySelector('.calc__clear').children;
const memory = document.querySelector('.calc__memory').children;
const percent = document.querySelector('.calc__percent').children;
const sign = document.querySelector('.calc__sign').children;
const tax = document.querySelector('.calc__tax').children;
const margin = document.querySelector('.calc__margin').children;
const print = document.querySelector('.calc__print').children;

//Output
const display = document.querySelector('.calc__digit');
const tape = document.querySelector('.tape__list');

//Memory
let currentDigits = '0';
let currentSum = [];
let total = 0;
let grandTotal = 0;

for (let i = 0; i < numpad.length; i++) {
    numpad[i].addEventListener('click', e => {
        let id = numpad[i].id;
        if ((id.includes('0') && currentDigits === '0') || (id === '.' && currentDigits.includes('.'))) {
            //Do nothing
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

for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener('click', e => {
        let currentOperator = operators[i].id;
        const li = document.createElement('li');
        const addingMachine = op => {
            const roundDigits = parseFloat(currentDigits).toFixed(2);
            li.innerHTML = roundDigits + ' ' + op;
            tape.appendChild(li);
            total += parseFloat(op + currentDigits);
            currentDigits = '0';
            display.innerHTML = total;
        }
        if (currentOperator === '+') {
            addingMachine(currentOperator)
        }
        else if (currentOperator === '-') {
            li.classList.add("tape__minus");
            addingMachine(currentOperator)
        }
    })
};

