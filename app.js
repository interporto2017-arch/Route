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
// MICROFONO
// ==========================
const btnVoice = document.getElementById("btn-voice");
let recognition = null;

btnVoice.addEventListener("click", () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Microfono non supportato dal browser");
    return;
  }

  if (recognition) {
    recognition.stop();
    recognition = null;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "it-IT";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 Microfono attivo, parla ora...");
  };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    console.log("🎤 SENTITO:", text);

    // usa lo STESSO flusso della tastiera
    inputAddress.value = text;
    btnAdd.click();
  };

  recognition.onerror = (e) => {
    console.error("❌ Errore microfono:", e.error);
  };

  recognition.onend = () => {
    console.log("🎤 Microfono spento");
    recognition = null;
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
