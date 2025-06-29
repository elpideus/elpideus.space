// === Cursor Handling ===
let isCustomSeek = false; // for overriding mousemove temporarily
const cursor = document.querySelector('.custom-cursor');

window.addEventListener('mousemove', ({ clientX, clientY }) => {
    if (!isCustomSeek) cursor.style.transform = `translate(calc(${clientX}px - 50%), calc(${clientY}px - 50%))`;
});

document.querySelectorAll('.make-cursor-smaller').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('small'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('small'));
});
