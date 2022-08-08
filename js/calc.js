const numpad = document.querySelector('.calc__numpad').children;
const operators = document.querySelector('.calc__operators').children;
const clear = document.querySelector('.calc__clear').children;
const memory = document.querySelector('.calc__memory').children;
const percent = document.querySelector('.calc__percent').children;
const sign = document.querySelector('.calc__sign').children;
const tax = document.querySelector('.calc__tax').children;
const margin = document.querySelector('.calc__margin').children;
const print = document.querySelector('.calc__print').children;
const display = document.querySelector('.calc__digit')

const displayNums = keys => {
    let currentDigits = ''
    for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener('click', e => {
            let id = keys[i].id;
            if ((id.includes('0') && currentDigits === '') || (id === '.' && currentDigits.includes('.'))) {
                //Do nothing
            }
            else if (id === '.' && currentDigits === '') {
                currentDigits = '0.'
                display.innerHTML = currentDigits;
            }
            else {
                currentDigits += id;
                display.innerHTML = currentDigits;
                console.log(currentDigits)
            }
        })
    }
}

displayNums(numpad)