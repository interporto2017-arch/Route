console.log("Route Planner avviato");

/*
  Aggiunge frecce su/giù a ogni tappa
  Funziona sia con <li> che con <div>
*/
function aggiungiFrecceAlleTappe() {
  // prende sia li che div dentro il pannello destro
  const tappe = document.querySelectorAll(
    "#right li, #right .tappa, #right div"
  );

  tappe.forEach((tappa) => {
    // evita di aggiungere le frecce due volte
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
  // ritenta più volte perché le tappe arrivano dopo
  const timer = setInterval(() => {
    aggiungiFrecceAlleTappe();
  }, 500);

  // stop dopo 10 secondi
  setTimeout(() => clearInterval(timer), 10000);
});
//if ("serviceWorker" in navigator) {
//navigator.serviceWorker.register("/Route/sw.js");
//}
function aggiungiIndirizzo(testo) {
  console.log("🎤 Riconosciuto:", testo);

  const lista = document.getElementById("addresses"); // ⚠️ vedi nota sotto
  if (!lista) {
    console.error("❌ Lista indirizzi non trovata");
    return;
  }

  const div = document.createElement("div");
  div.className = "item";
  div.textContent = testo;

  lista.appendChild(div);
}

const btnVoice = document.getElementById("btn-voice");

btnVoice.addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert("SpeechRecognition non supportato");
    return;
  }

  const recognition = new SR();
  recognition.lang = "it-IT";

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    aggiungiIndirizzo(text);
  };

  recognition.onerror = (e) => {
    console.error("Speech error", e);
  };

  recognition.start();
});
