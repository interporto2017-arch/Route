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
  // Impedisce SEMPRE il refresh della pagina se c'è un <form>
  if (event) event.preventDefault();

  aggiungiIndirizzo(inputSearch.value);
  inputSearch.value = "";
};

// ==========================
// MICROFONO (Versione Finale)
// ==========================
const btnVoice = document.getElementById("btn-voice");

btnVoice.onclick = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Il tuo browser non supporta il riconoscimento vocale.");
    return;
  }

  const rec = new SR();
  rec.lang = "it-IT";
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  // Feedback Visivo: Inizia l'ascolto
  btnVoice.style.backgroundColor = "#ff4d4d"; // Rosso acceso
  btnVoice.style.color = "white";
  console.log("Microfono avviato, in ascolto...");

  rec.onresult = (e) => {
    // Logica corretta per ottenere il risultato finale
    const res = e.results[e.results.length - 1];
    if (!res.isFinal) return;

    const trascrizione = res.transcript;
    aggiungiIndirizzo(trascrizione);
    console.log("Trascrizione:", trascrizione);

    // Pulisce l'input di testo per evitare confusione
    inputSearch.value = "";
  };

  rec.onend = () => {
    // Feedback Visivo: Finisce l'ascolto
    btnVoice.style.backgroundColor = ""; // Torna al colore originale
    btnVoice.style.color = "";
    console.log("Microfono spento.");
  };

  rec.onerror = (e) => {
    console.error("Errore riconoscimento vocale:", e.error);
    alert("Errore microfono: " + e.error);
    // Assicurati che l'indicatore visivo si spenga anche in caso di errore
    btnVoice.style.backgroundColor = "";
    btnVoice.style.color = "";
  };

  try {
    rec.start();
  } catch (err) {
    console.warn("Riconoscimento già in corso o altro errore di avvio.");
  }
};

// ==========================
// PIANIFICA
// ==========================
const btnPlan = document.getElementById("plan");
btnPlan.onclick = () => {
  pianificazioneAttiva = true;
  console.log("Pianificazione attiva:", pianificazioneAttiva);
  alert("Pianificazione avviata!"); // Aggiungo un alert temporaneo per conferma visiva
};
