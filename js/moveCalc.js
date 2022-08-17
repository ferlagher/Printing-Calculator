const buttons = document.querySelector('.calc__buttons');
const resizer = document.getElementById('calc__checkbox');
const svg = document.querySelector('.calc__svg');

resizer.addEventListener('click', () => {
    if (resizer.checked) {
        buttons.classList.remove('calc__buttons--hidden');
        svg.classList.remove('calc__svg--rotate');
    }
    else if (!resizer.checked) {
        buttons.classList.add('calc__buttons--hidden');
        svg.classList.add('calc__svg--rotate');
    }
});