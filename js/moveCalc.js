const calcBtns = document.querySelector('.calc__buttons');
const calcResizer = document.getElementById('calc__checkbox');
const calcSvg = document.querySelector('.calc__svg');

calcResizer.addEventListener('click', () => {
    if (calcResizer.checked) {
        calcBtns.classList.remove('calc__buttons--hidden');
        calcSvg.classList.remove('calc__svg--rotate');
    }
    else {
        calcBtns.classList.add('calc__buttons--hidden');
        calcSvg.classList.add('calc__svg--rotate');
    }
});