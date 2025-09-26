const accordionBtns = document.querySelectorAll('.accordion-btn');

accordionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.parentElement;
    card.classList.toggle('open'); // Ouvre ou ferme le panel
  });
});
