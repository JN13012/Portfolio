const texts = ["Cybersécurité", "Blockchain", "IA", "IT en général"];
const el = document.getElementById("typewriter");
let i = 0, j = 0;
let currentText = "";
let isDeleting = false;

function typeWriterLoop() {
  if (!isDeleting && j < texts[i].length) {
    currentText += texts[i][j];
    el.textContent = currentText;
    j++;
    setTimeout(typeWriterLoop, 150);
  } else if (!isDeleting && j === texts[i].length) {
    isDeleting = true;
    setTimeout(typeWriterLoop, 1200);
  } else if (isDeleting && j > 0) {
    currentText = currentText.slice(0, -1);
    el.textContent = currentText;
    j--;
    setTimeout(typeWriterLoop, 80);
  } else {
    isDeleting = false;
    i = (i + 1) % texts.length;
    setTimeout(typeWriterLoop, 500);
  }
}

typeWriterLoop();
