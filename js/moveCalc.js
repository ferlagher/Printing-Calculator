const moveCalc = btns => {
    const buttons = document.querySelector(btns);
    const resizer = document.querySelector('.calc__resizer');
    const maxh =  parseInt(window.getComputedStyle(buttons).height);

    let y ;
    let h ;

    //Touch events
    const touchStart = e => {
        y = e.touches[0].clientY;
        h = parseInt(window.getComputedStyle(buttons).height);
        
        document.addEventListener('touchmove', touchMove);
        document.addEventListener('touchend', touchEnd);
    };

    const touchMove = e => {
        const dy = e.touches[0].clientY - y;
        
        if (h - dy <= maxh){
            buttons.style.height = `${h - dy}px`;
        };
    }

    const touchEnd = () => {
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('touchend', touchEnd);
    }

    resizer.addEventListener('touchstart', touchStart);
}

moveCalc('.calc__buttons')