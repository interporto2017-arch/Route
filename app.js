const MAX = 50;
let map,
  autocomplete,
  directionsService,
  directionsRenderer,
  userMarker = null;
let addresses = JSON.parse(localStorage.getItem("addresses") || "[]");

// ELEMENTI
const input = document.getElementById("search");
const list = document.getElementById("list");
const counter = document.getElementById("counter");

// MAPPA
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 45.46, lng: 9.19 },
    zoom: 6,
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });
  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address"],
  });
  autocomplete.addListener("place_changed", () => {
    const p = autocomplete.getPlace();
    if (p.formatted_address) {
      addAddress(p.formatted_address);
      input.value = "";
    }
  });
  render();
}

// RENDER
function render() {
  list.innerHTML = "";
  addresses.forEach((a, i) => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `<span>${i + 1}. ${a}</span><button>🗑</button>`;
    d.querySelector("button").onclick = () => {
      addresses.splice(i, 1);
      save();
      render();
    };
    list.appendChild(d);
  });
  counter.textContent = `Indirizzi: ${addresses.length} / ${MAX}`;
}

// LOGICA
function addAddress(v) {
  if (!v) return;
  v = v.trim();
  if (!v || addresses.length >= MAX) return;
  if (addresses.some((x) => x.toLowerCase() === v.toLowerCase())) return;
  addresses.push(v);
  save();
  render();
}
function save() {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}

// BOTTONI
document.getElementById("add").onclick = () => {
  addAddress(input.value);
  input.value = "";
};
document.getElementById("clear").onclick = () => {
  addresses = [];
  save();
  directionsRenderer.set("directions", null);
  render();
};

// PIANIFICA
document.getElementById("plan").onclick = () => {
  if (addresses.length < 2) return alert("Minimo 2 indirizzi");
  directionsService.route(
    {
      origin: addresses[0],
      destination: addresses[addresses.length - 1],
      waypoints: addresses
        .slice(1, -1)
        .map((a) => ({ location: a, stopover: true })),
      optimizeWaypoints: true,
      travelMode: "DRIVING",
    },
    (r, s) => {
      if (s === "OK") directionsRenderer.setDirections(r);
      else alert(s);
    }
  );
};

// GPS
document.getElementById("gps").onclick = () => {
  navigator.geolocation.getCurrentPosition(
    (p) => {
      const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
      if (userMarker) userMarker.setMap(null);
      userMarker = new google.maps.Marker({ position: pos, map });
      map.setCenter(pos);
      map.setZoom(14);
    },
    () => alert("GPS negato")
  );
};

// VOCE
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
document.getElementById("voice").onclick = () => {
  if (!SR) return alert("Non supportato");
  if (rec) {
    rec.stop();
    rec = null;
  }
  rec = new SR();
  rec.lang = "it-IT";
  rec.onresult = (e) => addAddress(e.results[0][0].transcript);
  rec.onend = () => (rec = null);
  rec.start();
};

// PDF
document.getElementById("pdf").onclick = () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  addresses.forEach((a, i) => pdf.text(`${i + 1}. ${a}`, 10, 10 + i * 8));
  pdf.save("itinerario.pdf");
};

// SALVA / PERCORSI
function getRoutes() {
  return JSON.parse(localStorage.getItem("routes") || "[]");
}
function setRoutes(r) {
  localStorage.setItem("routes", JSON.stringify(r));
}

document.getElementById("save").onclick = () => {
  const name = prompt("Nome percorso");
  if (!name) return;
  const r = getRoutes();
  r.push({ name, addresses: [...addresses] });
  setRoutes(r);
};

document.getElementById("routes").onclick = () => {
  const r = getRoutes();
  if (!r.length) return alert("Nessun percorso");
  const n = prompt(r.map((x, i) => `${i + 1}) ${x.name}`).join("\n"));
  const i = parseInt(n) - 1;
  if (!r[i]) return;
  addresses = [...r[i].addresses];
  save();
  render();
};
