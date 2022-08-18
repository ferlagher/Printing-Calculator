const offBtn = document.querySelector('.offcanvas__btn');
const offMenu = document.querySelector('.offcanvas__menu');
const offSvg = document.querySelector('.offcanvas__svg');
const offBkg = document.querySelector('.offcanvas__bkg');

offBtn.addEventListener('click', () => {
    if (offMenu.classList.contains('offcanvas__menu--hidden')) {
        offMenu.classList.remove('offcanvas__menu--hidden');
        offSvg.classList.remove('offcanvas__svg--rotate');
        offBkg.classList.remove('offcanvas__bkg--hidden');
    }
    else {
        offMenu.classList.add('offcanvas__menu--hidden');
        offSvg.classList.add('offcanvas__svg--rotate');
        offBkg.classList.add('offcanvas__bkg--hidden');
    }
});