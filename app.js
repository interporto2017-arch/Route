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

  const index = lista.children.length + 1;

  const div = document.createElement("div");
  div.className = "item";

  div.innerHTML = `
    <span class="num">${index}.</span>
    <span class="text">${testo}</span>
    <button class="del">🗑️</button>
  `;

  div.querySelector(".del").addEventListener("click", () => {
    div.remove();
    rinumera();
  });

  lista.appendChild(div);
}
function rinumera() {
  document.querySelectorAll("#addresses .num").forEach((el, i) => {
    el.textContent = i + 1 + ".";
  });
}

// ==========================
// MICROFONO (FIX DEFINITIVO)
// ==========================
const btnVoice = document.getElementById("btn-voice");
let recognition = null;

btnVoice.addEventListener("click", () => {
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
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    aggiornaNumeri();
  }
});
