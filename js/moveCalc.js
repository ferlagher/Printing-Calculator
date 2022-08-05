const moveCalc = btns => {
    const buttons = document.querySelector(btns);
    const resizer = document.querySelector('.calc__resizer');
    const maxh =  parseInt(window.getComputedStyle(buttons).height);

    let y ;
    let h ;

    const mouseDown = ev => {
        y = ev.clientY;
        h = parseInt(window.getComputedStyle(buttons).height);
        
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stopMove);
    };

    const move = ev => {
        const dy = ev.clientY - y;
        
        if (h - dy <= maxh){
            buttons.style.height = `${h - dy}px`;
        };
    }

    const stopMove = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stopMove);
    }

    resizer.addEventListener('mousedown', mouseDown);
}

moveCalc('.calc__buttons')