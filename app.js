console.log("Route Planner avviato");

/*
  Aggiunge frecce su/giù a ogni tappa
  Funziona sia con <li> che con <div>
*/
function aggiungiFrecceAlleTappe() {
  const tappe = document.querySelectorAll(
    "#right li, #right .tappa, #right div"
  );

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

// aspetta che la pagina sia caricata
window.addEventListener("load", () => {
  const timer = setInterval(() => {
    aggiungiFrecceAlleTappe();
  }, 500);

  setTimeout(() => clearInterval(timer), 10000);
});

// service worker DISATTIVATO (ok così per ora)
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/Route/sw.js");
// }

// ==========================
// AGGIUNTA INDIRIZZO
// ==========================
function aggiungiIndirizzo(testo) {
  const lista = document.getElementById("addresses");
  if (!lista) return;

  const div = document.createElement("div");
  div.className = "item";
  div.textContent = testo;

  lista.appendChild(div);
}

// ==========================
// MICROFONO (FIX DEFINITIVO)
// ==========================
const btnVoice = document.getElementById("btn-voice");
let recognition = null;

btnVoice.addEventListener("click", () => {
  console.log("👉 CLICK MIC");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("Microfono non supportato");
    return;
  }

  // chiude eventuale sessione precedente
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
