document.getElementById('burger-btn').addEventListener('click', function () {
  document.getElementById('nav-header').classList.toggle('open');
});

// Sélectionne tous les liens de la nav
const navLinks = document.querySelectorAll('.nav-header a');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // Empêche le comportement par défaut (saut direct)

    const targetId = this.getAttribute('href'); // récupère l'id de la section
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      // Scroll fluide jusqu'à la section
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Si menu burger ouvert, le refermer après clic (mobile)
    const nav = document.getElementById('nav-header');
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
    }
  });
});


const accordionBtns = document.querySelectorAll(".accordion-btn");

accordionBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.parentElement;
    card.classList.toggle("open");
    const panel = card.querySelector(".accordion-panel");
    if(card.classList.contains("open")) {
      panel.style.opacity = 0;
      setTimeout(() => { panel.style.opacity = 1; panel.style.transition = "opacity 0.5s ease-in"; }, 50);
    }
  });
});
