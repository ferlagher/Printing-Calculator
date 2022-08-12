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
            li.classList.add('tape__minus');
        }
        if(op === '*') {
            li.classList.add('tape__total')
        }
        li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op;
        output.tape.appendChild(li);
    },
    clear: function() {
        const li = document.createElement('li');
        li.classList.add('tape__clear');
        li.innerHTML = '····0····';
        output.tape.appendChild(li);
    },
    items: function(arr) {
        const li = document.createElement('li');
        li.classList.add('tape__items');
        li.innerHTML = String(arr.length).padStart(3, '0').padEnd(16, '·');
        output.tape.appendChild(li);
    },
    separator: function(op) {
        const li = document.createElement('li');
        li.classList.add('tape__total')
        li.innerHTML = ''.padStart(19, '·');
        output.tape.appendChild(li);
    },
}

//Memory
let digits = '';
let sum = [];
let total = 0;
let grandSum = [];
let grandTotal = 0;
let factor = 1;
let isMultiplicand = false;
let isDividend = false;

//Dealing with floats
const toInteger = float => Math.round(parseFloat(float) * 100);
const toDecimal = integer => integer / 100;

//Record number keys
for (let i = 0; i < input.numpad.length; i++) {
    input.numpad[i].addEventListener('click', () => {
        let id = input.numpad[i].id;
        if ((id.includes('0') && (digits === '0')) || (id === '.' && digits.includes('.'))) {
            output.updateDisplay(digits);
        }
        else if (id === '.' && (digits === '0' || digits === '')) {
            digits = '0.'
            output.updateDisplay(digits);
        }
        else if (digits === '0' || digits === '') {
            if (id === '00') {
                digits = '0'
            }
            else {
                digits = id;
            }
            output.updateDisplay(digits);
        }
        else {
            digits += id;
            if (digits >= 999999999999) {
                digits = 999999999999
            }
            output.updateDisplay(digits);
        }
    })
};

//Arithmetic
for (let i = 0; i < input.operators.length; i++) {
    input.operators[i].addEventListener('click', () => {
        let operator = input.operators[i].id;
        let integerDigits = toInteger(digits)

        const addAndPrint = op => {
            if (digits === '') {
                //Do nothing
            }
            else {
                output.print(integerDigits, op);
                digits = '';
                sum.push(parseInt(op+integerDigits));
                total = sum.reduce((x, y) => x + y, 0);
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
            digits = '';
            isMultiplicand = op === '×';
            isDividend = op === '÷';
        }

        if (operator === '+' || operator === '-') {
            if (isMultiplicand && operator === '+') {
                if (Array.isArray(factor)) {
                    factor.forEach(x => sum.push((x * integerDigits) / 100))
                }
                else {
                    sum.push((factor * integerDigits) / 100);
                }
                total = sum.reduce((x, y) => x + y, 0);
                printProduct('=');
                output.print(total, operator);
            }
            else if (isDividend && operator === '+') {
                total += (factor / integerDigits) * 100;
                printProduct('=');
                output.print(total, operator);
            }
            else {
                addAndPrint(operator)
            }
        }

        else if (operator === '×' || operator === '÷') {
            factor = integerDigits;
            if (total === 0 && digits === '') {
                //Do nothing
            }
            else if (isMultiplicand) {
                total = (factor * integerDigits) / 100;
                printProduct(operator)
            }
            else if (isDividend) {
                total = (factor / integerDigits) * 100;
                printProduct(operator);
            }
            else {
                isMultiplicand = operator === '×';
                isDividend = operator === '÷';
                if (digits === '') {
                    factor = total;
                    printProduct(operator)
                    factor = sum;
                    sum = [];
                }
                else {
                    printProduct(operator)
                }
            }
        }

        else if (operator === '*') {
            output.items(sum);
            output.print(total, operator);
            output.updateDisplay(toDecimal(total));
            grandSum.push(total);
            digits = '';
            sum = [];
            total = 0;
        }

        else if (operator === 'G*') {
            if (sum !== []){
                output.items(sum);
                output.print(total, '*');
                output.updateDisplay(toDecimal(total));
                grandSum.push(total);
                digits = '';
                sum = [];
                total = 0;
            }
            grandTotal = grandSum.reduce((x, y) => x + y, 0);
            output.items(grandSum);
            output.print(grandTotal, '*');
            output.separator()
            output.updateDisplay(toDecimal(grandTotal));
            digits = '';
            grandSum = [];
            grandTotal = 0;
        }
    })
};

//Clear
for (let i = 0; i < input.clear.length; i++) {
    input.clear[i].addEventListener('click', () => {
        let id = input.clear[i].id;

        if (id === 'CA') {
            digits = '';
            sum = [];
            total = 0;
            grandSum = [];
            grandTotal = 0;
            factor = 1;
            isMultiplicand = false;
            isDividend = false;
            output.clear();
            output.updateDisplay('0');
        }

        else if (id === 'C') {
            digits = '';
            output.updateDisplay('0');
        }

        else if (id === '>') {
            digits = digits.slice(0, -1);
            if (digits === '') {
                output.updateDisplay('0')
            }
            else {
                output.updateDisplay(digits)
            }
        }
    })
}