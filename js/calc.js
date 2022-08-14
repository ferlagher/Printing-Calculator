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
    screen: document.querySelector('.calc__digit'),
    tape: document.querySelector('.tape__list'),
    display: function (number) {
        if (number > 999999999999) {
            number = Error
        }
        else if (String(number).replace('.', '').length > 12) {
            excedent = 12 - String(number).replace('.', '').length;
            number = String(number).slice(0, excedent);
        }
        this.screen.innerHTML = number;
    },
    print: function (int, op) {
        const li = document.createElement('li');
        if ((op.includes('-') && !(op.includes('%') || op.includes('T'))) ||int < 0) {
            li.classList.add('tape__minus');
        }
        li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op.padEnd(2, ' ');
        output.tape.appendChild(li);
        li.scrollIntoView();
    },
    total: function (int, op) {
        const li = document.createElement('li');
        li.classList.add('tape__total')
        if ((op.includes('-') && !(op.includes('%') || op.includes('T'))) ||int < 0) {
            li.classList.add('tape__minus');
        }
        li.innerHTML = toDecimal(int).toFixed(2) + ' ' + op.padEnd(2, ' ');
        output.tape.appendChild(li);
        li.scrollIntoView();

    },
    clear: function() {
        const li = document.createElement('li');
        li.classList.add('tape__clear');
        li.innerHTML = '····0····';
        output.tape.appendChild(li);
        li.scrollIntoView();

    },
    items: function(arr) {
        const li = document.createElement('li');
        li.classList.add('tape__items');
        li.innerHTML = String(arr.length).padStart(3, '0').padEnd(16, '·');
        output.tape.appendChild(li);
        li.scrollIntoView();
    },
    separator: function() {
        const li = document.createElement('li');
        li.classList.add('tape__total')
        li.innerHTML = ''.padStart(19, '·');
        output.tape.appendChild(li);
        li.scrollIntoView();
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
const numpad = key => {
    if ((key.includes('0') && (digits === '0')) || (key === '.' && digits.includes('.'))) {
        output.display(digits);
    }
    else if (key === '.' && (digits === '0' || digits === '')) {
        digits = '0.'
        output.display(digits);
    }
    else if (digits === '0' || digits === '') {
        if (key === '00') {
            digits = '0'
        }
        else {
            digits = key;
        }
        output.display(digits);
    }
    else {
        digits += key;
        if (digits >= 999999999999) {
            digits = '999999999999'
        }
        output.display(digits);
    }
}

//Arithmetic
const arithmetics = key => {
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
            output.display(toDecimal(total));
        }
    };

    const printProduct = op => {
        if (op === '='){
            output.print (integerDigits, op);
            output.display(toDecimal(total));
        }
        else {
            output.print (factor, op);
        }
        digits = '';
        isMultiplicand = op === '×';
        isDividend = op === '÷';
    }

    if (key === '+' || key === '-') {
        if (isMultiplicand && integerDigits) {
            if (Array.isArray(factor)) {
                factor.forEach(x => sum.push((x * integerDigits) / 100));
                product = sum.reduce((x, y) => x + y, 0);
            }
            else {
                sum.push(parseInt(key + 1) * (factor * integerDigits) / 100);
                product = (factor * integerDigits) / 100
            }
            printProduct('=');
            output.print(product, key);
            output.display(toDecimal(product))
            total = sum.reduce((x, y) => x + y, 0);
        }
        else if (isDividend && integerDigits) {
            if (Array.isArray(factor)) {
                factor.forEach(x => sum.push((x / integerDigits) * 100))
                quotient = sum.reduce((x, y) => x + y, 0);
            }
            else {
                sum.push(parseInt(key + 1) * (factor / integerDigits) * 100);
                quotient = (factor / integerDigits) * 100;
            }
            printProduct('=');
            output.print(quotient, key);
            output.display(toDecimal(quotient))
            total = sum.reduce((x, y) => x + y, 0);
        }
        else if (isPercent) {
            digits = toDecimal(factor + parseInt(key+1) * percent);
            output.total(toInteger(digits), key + '%');
            output.display(digits);
            percent = 0;
            isPercent = false;
        }
        else if (integerDigits) {
            addAndPrint(key)
        }
    }

    else if (key === '×' || key === '÷') {
        factor = integerDigits;
        if (total === 0 && digits === '') {
            //Do nothing
        }
        else if (isMultiplicand) {
            total = (factor * integerDigits) / 100;
            printProduct(key)
        }
        else if (isDividend) {
            total = (factor / integerDigits) * 100;
            printProduct(key);
        }
        else {
            isMultiplicand = key === '×';
            isDividend = key === '÷';
            if (digits === '') {
                factor = total;
                printProduct(key)
                factor = sum;
                sum = [];
            }
            else {
                printProduct(key)
            }
        }
    }

    else if (key === '*') {
        output.items(sum);
        output.total(total, key);
        output.display(toDecimal(total));
        grandSum.push(total);
        digits = '';
        sum = [];
        total = 0;
    }

    else if (key === 'G*') {
        if (sum.length){
            output.items(sum);
            output.total(total, '*');
            output.display(toDecimal(total));
            grandSum.push(total);
            digits = '';
            sum = [];
            total = 0;
        }
        grandTotal = grandSum.reduce((x, y) => x + y, 0);
        output.items(grandSum);
        output.total(grandTotal, '*');
        output.separator()
        output.display(toDecimal(grandTotal));
        digits = '';
        grandSum = [];
        grandTotal = 0;
    }
}

//Clear
const clear = key => {
    if (key === 'CA') {
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
        output.display(0)
    }

    else if (key === 'C') {
        digits = '';
        output.display('0');
    }

    else if (key === '>') {
        digits = digits.slice(0, -1);
        if (digits === '') {
            output.display('0')
        }
        else {
            output.display(digits)
        }
    }
}

//Memory
for (let i = 0; i < input.memory.length; i++) {
    input.memory[i].addEventListener('click', () => {
        let id = input.memory[i].id;
        integerDigits = toInteger(digits);

        const printMemory = (pr, sg, id) => {
            memory.push(parseInt(sg+1) * pr);
            output.print(integerDigits, '=')
            output.total(pr, id)
            output.display(toDecimal(pr))
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
            output.total(totalMemory, id);
            output.display(toDecimal(totalMemory));
        }

        else if (id === 'M*') {
            output.items(memory);
            totalMemory = memory.reduce((x, y) => x + y, 0);
            output.total(totalMemory, id);
            output.display(toDecimal(totalMemory));
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
        output.display(digits);
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
            output.total(percent, '·');
            output.display(toDecimal(percent));
            isMultiplicand = false;
            isDividend = false;
            digits = '';
        }

        if (id === '%' &&  integerDigits) {
            if (isMultiplicand) {
                percent = (factor * digits) / 100;
                printPercent(id);
                isPercent = true;
            }
            if (isDividend) {
                percent = (factor / digits) * 100;
                printPercent(id);
                isPercent = true;
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
            output.total(percent, 'T');
            digits = toDecimal(factor + percent);
            output.total(toInteger(digits), id);
            output.display(digits);
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
            output.total(percent - factor, 'T');
            digits = toDecimal(percent);
            output.total(toInteger(digits), id);
            output.display(digits);
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
                output.total(cost, id);
                output.display(toDecimal(cost));
                digits = '';
                cost = 0;
            }
            else if (sell && integerDigits) {
                cost = integerDigits;
                output.print(cost, id);
                margin = toDecimal(toInteger(100 - 100 / (sell / cost)));
                output.total(toInteger(margin), '%M');
                output.display(margin);
            }
            else if (integerDigits) {
                cost = integerDigits;
                output.print(cost, id);
                digits = '';
            }
        }

        else if (id === '**') {
            if (sell) {
                output.total(sell, id);
                output.display(toDecimal(sell))
                digits = '';
                sell = 0;
            }
            else if (cost && !margin) {
                sell = integerDigits;
                output.print(sell, id);
                margin = toDecimal(toInteger(100 - cost / (sell / 100)));
                output.total(toInteger(margin), '%M');
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
                output.total(marginAmount, id);
                output.display(toDecimal(marginAmount))
                digits = '';
                margin = 0;
                marginAmount = 0;
            }
            else if(margin && !marginAmount) {
                marginAmount = toDecimal(toInteger(sell * margin / 100));
                output.total(marginAmount, id);
                output.display(toDecimal(marginAmount))
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
                output.total(sell, '**')
                output.display(toDecimal(sell))
                digits = '';
            }
            else if (sell && integerDigits) {
                margin = integerDigits / 100;
                output.print(toInteger(margin), '%M')
                marginAmount = toDecimal(toInteger(sell * margin / 100));
                cost = sell - marginAmount;
                output.total(cost, '♢♢');
                output.display(toDecimal(cost))
                digits = '';
            }
        }
    });
};

//Items and average
for (let i = 0; i < input.items.length; i++) {
    input.items[i].addEventListener('click', () => {
        let id = input.items[i].id;

        if (id === '#') {
            let average = total / sum.length;
            output.items(sum);
            output.total(average, id);
            output.display(toDecimal(average))

        }
        else if (id === '♢') {
            output.items(sum);
            output.total(total, id);
            output.display(toDecimal(total))
        }
    });
};

//event Listeners
document.addEventListener('keydown', (e) => {
    const numKeys = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const opKeys = ['+', '-'];
    if (numKeys.includes(e.key)) {
        numpad(e.key);
    }
    else if (opKeys.includes(e.key)) {
        arithmetics(e.key);
    }
    else if (e.key === '*') {
        arithmetics('×')
    }
    else if (e.key === '/') {
        arithmetics('÷')
    }
    else if (e.key === 'Enter' && e.shiftKey) {
        arithmetics('G*')
    }
    else if (e.key === 'Enter' && (isMultiplicand || isDividend || isPercent)) {
        arithmetics('+')
    }
    else if (e.key === 'Enter') {
        arithmetics('*')
    }
    else if (e.key === 'Backspace' && e.shiftKey) {
        clear('CA')
    }
    else if (e.key === 'Backspace') {
        clear('>')
    }
});

for (let i = 0; i < input.numpad.length; i++) {
    input.numpad[i].addEventListener('click', () => {
        const key = input.numpad[i].id;
        numpad(key);
    });
};

for (let i = 0; i < input.operators.length; i++) {
    input.operators[i].addEventListener('click', () => {
        const key = input.operators[i].id;
        arithmetics(key);
    });
};

for (let i = 0; i < input.clear.length; i++) {
    input.clear[i].addEventListener('click', () => {
        let key = input.clear[i].id;
        clear(key)
    });
};