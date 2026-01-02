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
// MICROFONO (Versione 3.0: Feedback visivo e robustezza)
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
  rec.continuous = false; // Vogliamo un solo indirizzo per volta
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  // 1. Feedback Visivo: Inizia l'ascolto
  btnVoice.style.backgroundColor = "#ff4d4d"; // Rosso acceso
  btnVoice.style.color = "white";
  console.log("Microfono avviato, in ascolto...");

  rec.onresult = (e) => {
    // Quando riceve un risultato valido
    const trascrizione = e.results[0][0].transcript;
    aggiungiIndirizzo(trascrizione);
    console.log("Trascrizione:", trascrizione);

    // Pulisce l'input di testo per evitare confusione
    inputSearch.value = "";
  };

  rec.onend = () => {
    // 2. Feedback Visivo: Finisce l'ascolto (automaticamente o per errore)
    btnVoice.style.backgroundColor = ""; // Torna al colore originale
    btnVoice.style.color = "";
    console.log("Microfono spento.");
  };

  rec.onerror = (e) => {
    // Gestione errori specifici del browser
    console.error("Errore riconoscimento vocale:", e.error);
    alert("Errore microfono: " + e.error);
  };

  try {
    rec.start();
  } catch (err) {
    // Se l'utente clicca di nuovo mentre è già attivo
    console.warn("Riconoscimento già in corso, riavvio forzato.");
    rec.stop(); // Ferma il precedente e riprova
    rec.start();
  }
};

// ==========================
// PIANIFICA
// ==========================
const btnPlan = document.getElementById("plan");
btnPlan.onclick = () => {
  pianificazioneAttiva = true;
};
