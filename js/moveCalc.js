const moveCalc = btns => {
    const buttons = document.querySelector(btns);
    const resizer = document.querySelector('.calc__resizer');
    const maxh =  parseInt(window.getComputedStyle(buttons).height);

    let y ;
    let h ;

    //Mouse events

    const mouseDown = e => {
        y = e.clientY;
        h = parseInt(window.getComputedStyle(buttons).height);
        
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    };

    const mouseMove = e => {
        const dy = e.clientY - y;
        
        if (h - dy <= maxh){
            buttons.style.height = `${h - dy}px`;
        };
    }

    const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
    }

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

    resizer.addEventListener('mousedown', mouseDown);
    resizer.addEventListener('touchstart', touchStart);
}

moveCalc('.calc__buttons')