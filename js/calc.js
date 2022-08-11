//Input
const input = {
    numpad: document.querySelector('.calc__numpad').children,
    operators: document.querySelector('.calc__operators').children,
    clear: document.querySelector('.calc__clear').children,
    memory: document.querySelector('.calc__memory').children,
    percent: document.querySelector('.calc__percent').children,
    sign: document.querySelector('.calc__sign').children,
    tax: document.querySelector('.calc__tax').children,
    margin: document.querySelector('.calc__margin').children,
    items: document.querySelector('.calc__items').children,
}

//Output
const output = {
    display: document.querySelector('.calc__digit'),
    tape: document.querySelector('.tape__list'),
    updateDisplay: function (data) {this.display.innerHTML = data},
    print: function (int, op) {
        const li = document.createElement('li');
        if (op === '-' || int < 0) {
            li.classList.add("tape__minus");
        };
        li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op;
        output.tape.appendChild(li);
    }
}

//Memory
let currentDigits = '0';
let currentSum = [];
let total = 0;
let grandTotal = 0;
let factor = 1;
let isMultiplicand = false;
let isDividend = false;

//Dealing with floats
const toInteger = float => Math.round(parseFloat(float) * 100);
const toDecimal = integer => integer / 100;

//Record number keys
for (let i = 0; i < input.numpad.length; i++) {
    input.numpad[i].addEventListener('click', e => {
        let id = input.numpad[i].id;
        if ((id.includes('0') && currentDigits === '0') || (id === '.' && currentDigits.includes('.'))) {
            output.updateDisplay(currentDigits);
        }
        else if (id === '.' && currentDigits === '0') {
            currentDigits = '0.'
            output.updateDisplay(currentDigits);
        }
        else if (currentDigits === '0') {
            currentDigits = id;
            output.updateDisplay(currentDigits);
        }
        else {
            currentDigits += id;
            if (currentDigits >= 999999999999) {
                currentDigits = 999999999999
            }
            output.updateDisplay(currentDigits);
        }
    })
};

//Arithmetic
for (let i = 0; i < input.operators.length; i++) {
    input.operators[i].addEventListener('click', e => {
        let currentOperator = input.operators[i].id;
        let integerDigits = toInteger(currentDigits)

        const addAndPrint = op => {
            if (currentDigits === '0') {
                //Do nothing
            }
            else {
                const roundDigits = integerDigits;
                output.print(roundDigits, op);
                currentDigits = '0';
                if (op === '+' || op === '-'){
                    total += parseInt(op+roundDigits);
                }
                else {
                    total += parseInt(roundDigits);
                }
                output.updateDisplay(toDecimal(total));
            }
        };

        const printProduct = op => {
            if (op === '='){
                output.print (integerDigits, op);
                output.updateDisplay(toDecimal(total));
            }
            else {
                output.print (factor, op);
            }
            currentDigits = '0';
            isMultiplicand = op === '×';
            isDividend = op === '÷';
        }

        if (currentOperator === '+' || currentOperator === '-') {
            if (isMultiplicand && currentOperator === '+') {
                total += (factor * integerDigits) / 100;
                printProduct('=');
                output.print(total, currentOperator);
            }
            else if (isDividend && currentOperator === '+') {
                total += (factor / integerDigits) * 100;
                printProduct('=');
                output.print(total, currentOperator);
            }
            else {
                addAndPrint(currentOperator)
            }
        }

        else if (currentOperator === '×' || currentOperator === '÷') {
            factor = integerDigits;
            if (total === 0 && currentDigits === '0') {
                //Do nothing
            }
            else if (isMultiplicand) {
                total = (factor * integerDigits) / 100;
                printProduct(currentOperator)
            }
            else if (isDividend) {
                total = (factor / integerDigits) * 100;
                printProduct(currentOperator);
            }
            else {
                isMultiplicand = currentOperator === '×';
                isDividend = currentOperator === '÷';
                if (currentDigits === '0') {
                    factor = total;
                    printProduct(currentOperator)
                    total = 0;
                }
                else {
                    printProduct(currentOperator)
                }
            }
        }
    })
};