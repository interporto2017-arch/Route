console.log("Route Planner avviato");

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

// ==========================
// AGGIUNTA INDIRIZZO (SINISTRA)
// ==========================
function aggiungiIndirizzo(testo) {
  const lista = document.getElementById("addresses");
  if (!lista) return;

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

  lista.appendChild(div);
  rinumera();
}

function rinumera() {
  document.querySelectorAll("#addresses .num").forEach((el, i) => {
    el.textContent = i + 1 + ".";
  });
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
    aggiungiIndirizzo(text);
  };

  recognition.start();
});
