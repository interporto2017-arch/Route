console.log("Route Planner avviato");
let listaIndirizzi = [];
let pianificazioneAttiva = false;

/*
  Aggiunge frecce su/giù SOLO alle tappe (a destra)
  VIENE CHIAMATA SOLO DOPO LA PIANIFICAZIONE
*/
function aggiungiFrecceAlleTappe() {
  if (!pianificazioneAttiva) return;

  const tappe = document.querySelectorAll("#right li, #right .tappa");

  tappe.forEach((tappa) => {
    if (tappa.querySelector(".frecce")) return;

    const frecce = document.createElement("span");
    frecce.className = "frecce";
    frecce.style.marginLeft = "8px";
    frecce.style.whiteSpace = "nowrap";

    frecce.innerHTML = `
      <button class="freccia su">⬆️</button>
      <button class="freccia giu">⬇️</button>
    `;

    tappa.appendChild(frecce);
  });
}

// AGGIUNTA INDIRIZZO (SINISTRA)
// ==========================
function aggiungiIndirizzo(testo) {
  const list = document.getElementById("list");
  if (!list) {
    console.error("❌ #list non trovato");
    return;
  }

  const div = document.createElement("div");
  div.textContent = testo;

  list.appendChild(div);

  console.log("✅ aggiunto:", testo);
}

// ==========================
// MICROFONO
// ==========================
const btnVoice = document.getElementById("btn-voice");
let recognition = null;

btnVoice.addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Microfono non supportato");
    return;
  }

  if (recognition) {
    recognition.stop();
    recognition = null;
  }

  recognition = new SR();
  recognition.lang = "it-IT";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;

    // scrive nel campo di input
    document.querySelector('input[placeholder="Cerca indirizzo..."]').value =
      text;

    // simula il click su "Aggiungi"
    document.querySelector("button").click();
  };

  recognition.start();
});
const btnPlan = document.getElementById("plan");

btnPlan.addEventListener("click", () => {
  console.log("🧭 Pianifica cliccato");
  pianificazioneAttiva = true;
});
