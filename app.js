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

  const pulito = testo.trim();
  if (!pulito) return;

  // ❌ evita duplicati
  const esiste = [...list.querySelectorAll(".text")].some(
    (el) => el.textContent.toLowerCase() === pulito.toLowerCase()
  );
  if (esiste) return;

  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <span class="num"></span>
    <span class="text">${pulito}</span>
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
  aggiungiIndirizzo(inputSearch.value);
  inputSearch.value = "";
};

// ==========================
// MICROFONO (CORRETTO)
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
    const res = e.results[e.results.length - 1];
    if (!res.isFinal) return;

    const text = res[0].transcript.trim();
    if (text.length < 2) return;

    aggiungiIndirizzo(text); // ✅ UNA SOLA VOLTA
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
