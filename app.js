console.log("Route Planner avviato");

// ==========================
// STATO
// ==========================
let pianificazioneAttiva = false;
let indirizzi = []; // UNICA fonte di verità
const MAX_INDIRIZZI = 50;

// ==========================
// RENDER LISTA
// ==========================
function renderLista() {
  const list = document.getElementById("list");
  const info = document.getElementById("addresses");
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

  // contatore visivo
  if (info) {
    info.innerHTML = `
      <b>Indirizzi:</b> ${indirizzi.length} / ${MAX_INDIRIZZI}
      ${
        indirizzi.length >= 45
          ? "<span style='color:red'> ⚠️ quasi pieno</span>"
          : ""
      }
    `;
  }
}

// ==========================
// AGGIUNTA SICURA (TASTIERA + VOCE)
// ==========================
function aggiungiIndirizzo(testo) {
  if (!testo) return;

  const pulito = testo.trim();
  if (!pulito) return;

  // limite massimo
  if (indirizzi.length >= MAX_INDIRIZZI) {
    alert("Hai raggiunto il limite massimo di 50 indirizzi");
    return;
  }

  // no duplicati
  if (indirizzi.some((v) => v.toLowerCase() === pulito.toLowerCase())) {
    alert("Indirizzo già presente");
    return;
  }

  indirizzi.push(pulito);
  renderLista();
}

// ==========================
// INPUT + AGGIUNGI (TASTIERA)
// ==========================
const inputSearch = document.getElementById("search");
const btnAdd = document.getElementById("add");

btnAdd.onclick = (event) => {
  if (event) event.preventDefault();

  aggiungiIndirizzo(inputSearch.value);
  inputSearch.value = "";
};

// ==========================
// MICROFONO (STABILE)
// ==========================
const btnVoice = document.getElementById("btn-voice");
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;

btnVoice.onclick = () => {
  if (!SR) {
    alert("Il tuo browser non supporta il riconoscimento vocale.");
    return;
  }

  // se già attivo, fermalo
  if (rec) {
    rec.stop();
    rec = null;
  }

  rec = new SR();
  rec.lang = "it-IT";
  rec.continuous = false;
  rec.interimResults = false;

  // feedback visivo
  btnVoice.style.backgroundColor = "#ff4d4d";
  btnVoice.style.color = "white";

  rec.onresult = (e) => {
    const testo = e.results[0][0].transcript;
    console.log("Voce:", testo);
    aggiungiIndirizzo(testo);
    inputSearch.value = "";
  };

  rec.onend = () => {
    btnVoice.style.backgroundColor = "";
    btnVoice.style.color = "";
    rec = null;
    console.log("Microfono spento");
  };

  rec.onerror = (e) => {
    console.error("Errore microfono:", e.error);
    btnVoice.style.backgroundColor = "";
    btnVoice.style.color = "";
    rec = null;
  };

  rec.start();
};

// ==========================
// PIANIFICA (placeholder)
// ==========================
const btnPlan = document.getElementById("plan");
btnPlan.onclick = () => {
  pianificazioneAttiva = true;
  console.log("Pianificazione attiva:", pianificazioneAttiva);
};
