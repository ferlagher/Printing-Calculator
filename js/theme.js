const radio = document.querySelectorAll('[name="theme"]');
const body = document.querySelector('body');
const span = document.getElementById('theme__span')
let theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'Dark';
body.setAttribute('data-theme', theme);
span.innerHTML = theme;
radio.forEach(option => {
    if (option.value === theme) {
        option.checked = true;
    }
})

radio.forEach(option => option.addEventListener('click', () => {
    if (option.checked) {
        body.setAttribute('data-theme', option.value);
        span.innerHTML = option.value;
        localStorage.setItem('theme', option.value);
    }
}));
