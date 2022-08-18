const btn = document.getElementById('theme');
const body = document.querySelector('body');
const span = document.getElementById('theme__span')
let theme = body.getAttribute('data-theme');

const changeTheme = () => {
    let theme = body.getAttribute('data-theme');
    if (theme === 'Dark') {
        body.setAttribute('data-theme', 'Light');
        span.innerHTML = 'Light';
        localStorage.setItem('theme', 'Light');
    }
    else {
        body.setAttribute('data-theme', 'Dark');
        span.innerHTML = 'Dark';
        localStorage.setItem('theme', 'Dark');
    }
}

btn.addEventListener('click', changeTheme);

const preference = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (preference) {
    body.setAttribute('data-theme', preference);
    span.innerHTML = preference;
}