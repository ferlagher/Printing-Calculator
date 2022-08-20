const radio = document.querySelectorAll('[name="theme"]');
const body = document.querySelector('body');
const span = document.getElementById('theme__span')
let theme = body.getAttribute('data-theme');

radio.forEach(option => option.addEventListener('click', () => {
    if (option.checked) {
        body.setAttribute('data-theme', option.value);
        span.innerHTML = option.value;
        localStorage.setItem('theme', option.value);
    }
}));

const preference = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (preference) {
    body.setAttribute('data-theme', preference);
    span.innerHTML = preference;
    radio.forEach(option => {
        if (option.value === preference) {
            option.checked = true;
        }
    })
}