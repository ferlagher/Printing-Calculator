const offBtn = document.querySelector('.offcanvas__btn');
const offMenu = document.querySelector('.offcanvas__menu');
const offSvg = document.querySelector('.offcanvas__svg');
const offBkg = document.querySelector('.offcanvas__bkg');

offBtn.addEventListener('click', () => {
    if (offMenu.classList.contains('offcanvas__menu--show')) {
        offMenu.classList.remove('offcanvas__menu--show');
        offSvg.classList.remove('offcanvas__svg--rotate');
        offBkg.classList.remove('offcanvas__bkg--show');
        document.addEventListener('keydown', keyboard);
    }
    else {
        offMenu.classList.add('offcanvas__menu--show');
        offSvg.classList.add('offcanvas__svg--rotate');
        offBkg.classList.add('offcanvas__bkg--show');
        document.removeEventListener('keydown', keyboard);
    }
});

const offItem = document.querySelectorAll('.offcanvas__item')
const close = document.querySelectorAll('.btn--close')

offItem.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.id.slice(6);
        const modal = document.getElementById(`modal__${id}`)
        
        modal.classList.add('modal--show')
        offBkg.classList.add('offcanvas__bkg--modal');
    })
})

close.forEach(btn => {
    btn.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal')

        modals.forEach(modal => modal.classList.remove('modal--show'));
        offBkg.classList.remove('offcanvas__bkg--modal');
    })
})