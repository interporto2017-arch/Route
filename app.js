if (window.__APP_INIT__) {
  console.warn("app.js già inizializzato, esco");
  return;
}
window.__APP_INIT__ = true;

console.log("Route Planner avviato");

console.log("Route Planner avviato");

// ==========================
// STATO
// ==========================
let pianificazioneAttiva = false;

// ==========================
// AGGIUNTA INDIRIZZO (SINISTRA)
// ==========================
function aggiungiIndirizzo(testo) {
  const list = document.getElementById("list");
  if (!list) {
    console.error("❌ #list non trovato");
    return;
  }

  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <span class="num"></span>
    <span class="text">${testo}</span>
    <button class="del">🗑️</button>
  `;

  div.querySelector(".del").addEventListener("click", () => {
    div.remove();
    rinumera();
  });

  list.appendChild(div);
  rinumera();
}

// ==========================
// RINUMERAZIONE
// ==========================
function rinumera() {
  const items = document.querySelectorAll("#list .item");
  items.forEach((item, index) => {
    const num = item.querySelector(".num");
    if (num) num.textContent = index + 1 + ".";
  });
}

// ==========================
// INPUT + AGGIUNGI (TASTIERA)
// ==========================
const inputSearch = document.getElementById("search");
const btnAdd = document.getElementById("add");

btnAdd.addEventListener("click", () => {
  const testo = inputSearch.value.trim();
  if (!testo) return;

  aggiungiIndirizzo(testo);
  inputSearch.value = "";
});

// ==========================
// MICROFONO
// ==========================
const btnVoice = document.getElementById("btn-voice");
let recognition = null;

btnVoice.addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  recognition = new SR();
  recognition.lang = "it-IT";
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    inputSearch.value = text;
    btnAdd.click();
  };

  recognition.start();
});

// ==========================
// PIANIFICA
// ==========================
const btnPlan = document.getElementById("plan");

btnPlan.addEventListener("click", () => {
  console.log("🧭 Pianifica cliccato");
  pianificazioneAttiva = true;
});
