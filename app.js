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
  if (!list) return;

  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <span class="num"></span>
    <span class="text">${testo}</span>
    <button class="del">🗑️</button>
  `;

  div.querySelector(".del").onclick = () => {
    div.remove();
    rinumera();
  };

  list.appendChild(div);
  rinumera();
}

// ==========================
// RINUMERAZIONE
// ==========================
function rinumera() {
  document.querySelectorAll("#list .item").forEach((item, i) => {
    item.querySelector(".num").textContent = i + 1 + ".";
  });
}

// ==========================
// INPUT + AGGIUNGI (TASTIERA)
// ==========================
const inputSearch = document.getElementById("search");
const btnAdd = document.getElementById("add");

btnAdd.onclick = () => {
  const testo = inputSearch.value.trim();
  if (!testo) return;

  aggiungiIndirizzo(testo);
  inputSearch.value = "";
};

// ==========================
// MICROFONO (MINIMO, STABILE)
// ==========================
const btnVoice = document.getElementById("btn-voice");

btnVoice.onclick = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("SpeechRecognition non supportato");
    return;
  }

  const rec = new SR();
  rec.lang = "it-IT";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    if (text.length < 2) return;

    inputSearch.value = text;
    btnAdd.click();
  };

  rec.onerror = (e) => {
    console.error("ERRORE MIC:", e.error);
  };

  rec.start();
};

// ==========================
// PIANIFICA
// ==========================
const btnPlan = document.getElementById("plan");

btnPlan.onclick = () => {
  pianificazioneAttiva = true;
  console.log("🧭 Pianifica cliccato");
};
