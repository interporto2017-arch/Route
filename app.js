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
// PULSANTE AGGIUNGI (TASTIERA)
// ==========================
const btnAdd = document.getElementById("btn-add");
const inputAddress = document.getElementById("address");

btnAdd.addEventListener("click", () => {
  const testo = inputAddress.value.trim();
  if (!testo) return;

  aggiungiIndirizzo(testo);
  inputAddress.value = "";
});

// ==========================
// MICROFONO (ALLINEATO AI TUOI ID)
// ==========================
const btnVoice = document.getElementById("btn-voice");
const btnAdd = document.getElementById("add");
const inputSearch = document.getElementById("search");

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
