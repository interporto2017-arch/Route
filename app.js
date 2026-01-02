console.log("Route Planner avviato");

// ==========================
// STATO
// ==========================
let pianificazioneAttiva = false;
let indirizzi = []; // <-- UNICA fonte di verità

// ==========================
// RENDER LISTA
// ==========================
function renderLista() {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  indirizzi.forEach((testo, i) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span class="num">${i + 1}.</span>
      <span class="text">${testo}</span>
      <button class="del">🗑️</button>
    `;

    div.querySelector(".del").onclick = () => {
      indirizzi.splice(i, 1);
      renderLista();
    };

    list.appendChild(div);
  });
}

// ==========================
// AGGIUNTA SICURA
// ==========================
function aggiungiIndirizzo(testo) {
  const pulito = testo.trim();
  if (!pulito) return;

  // ❌ no duplicati
  if (indirizzi.some((v) => v.toLowerCase() === pulito.toLowerCase())) return;

  indirizzi.push(pulito);
  renderLista();
}

// ==========================
// INPUT + AGGIUNGI (TASTIERA)
// ==========================
const inputSearch = document.getElementById("search");
const btnAdd = document.getElementById("add");

btnAdd.onclick = (event) => {
  // Questo comando impedisce alla pagina di ricaricarsi
  if (event) event.preventDefault();

  aggiungiIndirizzo(inputSearch.value);
  inputSearch.value = "";
};

// ==========================
// MICROFONO
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

    aggiungiIndirizzo(res[0].transcript);
  };
  inputSearch.value = "";
  rec.start();
};

// ==========================
// PIANIFICA
// ==========================
const btnPlan = document.getElementById("plan");
btnPlan.onclick = () => {
  pianificazioneAttiva = true;
};
