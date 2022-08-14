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
};

//Dealing with floats
const toInteger = float => Math.round(parseFloat(float) * 100);
const toDecimal = integer => integer / 100;

//Output
const output = {
    display: document.querySelector('.calc__digit'),
    tape: document.querySelector('.tape__list'),
    updateDisplay: function (number) {
        if (number > 999999999999) {
            number = Error
        }
        else if (String(number).replace('.', '').length > 12) {
            excedent = 12 - String(number).replace('.', '').length;
            number = String(number).slice(0, excedent);
        }
        this.display.innerHTML = number;
    },
    print: function (int, op) {
        const li = document.createElement('li');
        if ((op.includes('-') && !(op.includes('%') || op.includes('T'))) ||int < 0) {
            li.classList.add('tape__minus');
        }
        if(op === '*' || (op.includes('M') && !op.includes('%')) || isPercent) {
            li.classList.add('tape__total')
        }
        li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op.padEnd(2, ' ');
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
    separator: function() {
        const li = document.createElement('li');
        li.classList.add('tape__total')
        li.innerHTML = ''.padStart(19, '·');
        output.tape.appendChild(li);
    },
};

//Memory
let digits = '';
let integerDigits = 0;

let sum = [];
let total = 0;
let grandSum = [];
let grandTotal = 0;

let memory = [];
let memoryTotal = 0;

let factor = 1;
let isMultiplicand = false;
let isDividend = false;

let percent = 0;
let isPercent = false;

let taxRate = 22;

let cost = 0;
let sell = 0;
let margin = 0;
let marginAmount = 0;

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
                digits = '999999999999'
            }
            output.updateDisplay(digits);
        }
    });
};

//Arithmetic
for (let i = 0; i < input.operators.length; i++) {
    input.operators[i].addEventListener('click', () => {
        let operator = input.operators[i].id;
        integerDigits = toInteger(digits);

        const addAndPrint = op => {
            if (digits === '') {
                //Do nothing
            }
            else {
                output.print(integerDigits, op);
                digits = '';
                sum.push(parseInt(op+1) * integerDigits);
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
                if (Array.isArray(factor)) {
                    factor.forEach(x => sum.push((x / integerDigits) * 100))
                }
                else {
                    sum.push((factor / integerDigits) * 100);
                }
                total = sum.reduce((x, y) => x + y, 0);
                printProduct('=');
                output.print(total, operator);
            }
            else if (isPercent) {
                digits = toDecimal(factor + parseInt(operator+1) * percent);
                output.print(toInteger(digits), operator + '%');
                output.updateDisplay(digits);
                percent = 0;
                isPercent = false;
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
            if (sum.length){
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
    });
};

//Clear
for (let i = 0; i < input.clear.length; i++) {
    input.clear[i].addEventListener('click', () => {
        let id = input.clear[i].id;

        if (id === 'CA') {
            digits = '';
            integerDigits = 0;
            sum = [];
            total = 0;
            grandSum = [];
            grandTotal = 0;
            memory = [];
            memoryTotal = 0;
            factor = 1;
            isMultiplicand = false;
            isDividend = false;
            percent = 0;
            isPercent = false;
            cost = 0;
            sell = 0;
            margin = 0;
            marginAmount = 0;
            output.clear();
            output.updateDisplay(0)
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
    });
};

//Memory
for (let i = 0; i < input.memory.length; i++) {
    input.memory[i].addEventListener('click', () => {
        let id = input.memory[i].id;
        integerDigits = toInteger(digits);

        const printMemory = (pr, sg, id) => {
            memory.push(parseInt(sg+1) * pr);
            output.print(integerDigits, '=')
            output.print(pr, id)
            output.updateDisplay(toDecimal(pr))
            isMultiplicand = false;
            isDividend = false;
            digits = ''
        }

        if ((id === 'M+' || id === 'M-') && integerDigits) {
            let sign = id.slice(1);
            let product;
            if (isMultiplicand) {
                product = (factor * integerDigits) / 100;
                printMemory(product, sign, id);
            }
            else if (isDividend) {
                product = (factor / integerDigits) * 100;
                printMemory(product, sign, id);
            }
        }

        else if (id === 'M♢') {
            output.items(memory);
            totalMemory = memory.reduce((x, y) => x + y, 0);
            output.print(totalMemory, id);
            output.updateDisplay(toDecimal(totalMemory));
        }

        else if (id === 'M*') {
            output.items(memory);
            totalMemory = memory.reduce((x, y) => x + y, 0);
            output.print(totalMemory, id);
            output.updateDisplay(toDecimal(totalMemory));
            output.separator();
            digits = '';
            memory = [];
            totalMemory = 0;
        }
    });
};

//Sign
input.sign[0].addEventListener('click', () => {
    if (digits) {
        digits = (-1 * digits).toString();
        output.updateDisplay(digits);
    }
});

//Percentages
for (let i = 0; i < input.percent.length; i++) {
    input.percent[i].addEventListener('click', () => {
        let id = input.percent[i].id;
        integerDigits = toInteger(digits);

        const printPercent = (op) => {
            output.print(integerDigits, op);
            if (id === '%M'){
                output.print(percent - factor, '·');
            }
            isPercent = true;
            output.print(percent, '·');
            output.updateDisplay(toDecimal(percent));
            isMultiplicand = false;
            isDividend = false;
            digits = '';
        }

        if (id === '%' &&  integerDigits) {
            if (isMultiplicand) {
                percent = (factor * digits) / 100;
                printPercent(id);
            }
            if (isDividend) {
                percent = (factor / digits) * 100;
                printPercent(id);
            }
        }

        else if (id === '%M' &&  integerDigits) {
            if (isMultiplicand) {
                percent = factor / (1 - digits / 100);
                printPercent(id);
            }
            if (isDividend) {
                percent = factor / (1 + digits / 100);
                printPercent(id);
                digits = toDecimal(percent);
                isPercent = false;
            }
        }
    });
};

//Tax calculations
for (let i = 0; i < input.tax.length; i++) {
    input.tax[i].addEventListener('click', () => {
        let id = input.tax[i].id;
        integerDigits = toInteger(digits);

        if (id === '+T' && (integerDigits || total)) {
            if (!integerDigits) {
                output.print(total, '*');
                factor = total;
                sum = [];
                total = 0;
            }
            else {
                factor = integerDigits;
            }
            output.print (factor, '-T');
            output.print (toInteger(taxRate), '%T');
            percent = (factor * taxRate) / 100;
            isPercent = true;
            output.print(percent, 'T');
            digits = toDecimal(factor + percent);
            output.print(toInteger(digits), id);
            isPercent = false;
            output.updateDisplay(digits);
            percent = 0;
        }

        if (id === '-T' && (integerDigits || total)) {
            if (!integerDigits) {
                output.print(total, '*');
                factor = total;
                sum = [];
                total = 0;
            }
            else {
                factor = integerDigits;
            }
            output.print (factor, '+T');
            output.print (toInteger(taxRate), '%T');
            percent = factor / (1 + taxRate / 100);
            isPercent = true;
            output.print(percent - factor, 'T');
            digits = toDecimal(percent);
            output.print(toInteger(digits), id);
            isPercent = false;
            output.updateDisplay(digits);
            percent = 0;
        } 
    });
};

//Cost, sell and margin
for (let i = 0; i < input.margin.length; i++) {
    input.margin[i].addEventListener('click', () => {
        let id = input.margin[i].id;
        integerDigits = toInteger(digits);

        if (id === '♢♢') {
            if (cost) {
                output.print(cost, id);
                output.updateDisplay(toDecimal(cost));
                digits = '';
                cost = 0;
            }
            else if (sell && integerDigits) {
                cost = integerDigits;
                output.print(cost, id);
                margin = toDecimal(toInteger(100 - 100 / (sell / cost)));
                output.print(toInteger(margin), '%M');
                output.updateDisplay(margin);
            }
            else if (integerDigits) {
                cost = integerDigits;
                output.print(cost, id);
                digits = '';
            }
        }

        else if (id === '**') {
            if (sell) {
                output.print(sell, id);
                output.updateDisplay(toDecimal(sell))
                digits = '';
                sell = 0;
            }
            else if (cost && !margin) {
                sell = integerDigits;
                output.print(sell, id);
                margin = toDecimal(toInteger(100 - cost / (sell / 100)));
                output.print(toInteger(margin), '%M');
                digits = '';
            }
            else if (integerDigits) {
                sell = integerDigits;
                output.print(sell, id);
                digits = '';
            }
        }

        else if (id === 'MT') {
            if (margin && marginAmount) {
                output.print(toInteger(margin), '%M');
                output.print(marginAmount, id);
                output.updateDisplay(toDecimal(marginAmount))
                digits = '';
                margin = 0;
                marginAmount = 0;
            }
            else if(margin && !marginAmount) {
                marginAmount = toDecimal(toInteger(sell * margin / 100));
                output.print(marginAmount, id);
                output.updateDisplay(toDecimal(marginAmount))
                digits = '';
                margin = 0;
                marginAmount = 0;
                cost = 0;
                sell = 0;
            }
            else if (cost && integerDigits) {
                margin = integerDigits / 100;
                output.print(toInteger(margin), '%M');
                sell = toDecimal(toInteger(cost / (1 - margin / 100)));
                marginAmount = toDecimal(toInteger(sell * margin / 100));
                output.print(sell, '**')
                output.updateDisplay(toDecimal(sell))
                digits = '';
            }
            else if (sell && integerDigits) {
                margin = integerDigits / 100;
                output.print(toInteger(margin), '%M')
                marginAmount = toDecimal(toInteger(sell * margin / 100));
                cost = sell - marginAmount;
                output.print(cost, '♢♢');
                output.updateDisplay(toDecimal(cost))
                digits = '';
            }
        }
        console.log(cost, sell, margin, marginAmount)
    });
};

//Items and average
for (let i = 0; i < input.items.length; i++) {
    input.items[i].addEventListener('click', () => {
        let id = input.items[i].id;

        if (id = '#') {

        }
        else if (id = '♢') {

        }
    });
};