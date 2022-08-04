const btn = document.getElementById('theme');
const body = document.querySelector('body');
let theme = body.getAttribute('data-theme');

const changeTheme = () => {
    let theme = body.getAttribute('data-theme');
    if (theme === 'drk') {
        body.setAttribute('data-theme', 'lgt');
        localStorage.setItem('theme', 'lgt');
    }
    else {
        body.setAttribute('data-theme', 'drk');
        localStorage.setItem('theme', 'drk');
    }
}

btn.addEventListener('click', changeTheme);

const preference = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (preference) {
    body.setAttribute('data-theme', preference);
}