
(() => {
  "use strict";

  // Obtener la configuracion
  const c = window.EVENT_CONFIG;

  // Verificar que exista la configuracion
  if (!c) {
    console.error("No se encontro EVENT_CONFIG. Revisa config.js.");
    alert("Error al cargar la configuracion de la invitacion.");
    return;
  }

  // Funcion para seleccionar elementos HTML
  const $ = (id) => document.getElementById(id);

  // Datos principales
  document.title = c.title || "Invitacion digital";

  $("eyebrow").textContent = c.eyebrow || "";
  $("personName").textContent = c.name || "Festejado";
  $("ageLine").textContent = c.age || "";
  $("message").textContent = c.message || "";

  // Fecha y hora
  $("eventDate").textContent = c.displayDate || "Por definir";
  $("eventTime").textContent = c.displayTime || "Por definir";

  // Lugar y direccion
  $("venue").textContent = c.venue || "Por definir";
  $("address").textContent = c.address || "";

  // Google Maps
  const mapsButton = $("mapsButton");
  const mapsUrl = c.mapsUrl || "https://maps.google.com/";

  mapsButton.href = mapsUrl;
  mapsButton.target = "_blank";
  mapsButton.rel = "noopener noreferrer";

  // Mensajes
  $("rsvpMessage").textContent =
    c.rsvpMessage || "Confirma tu asistencia.";

  $("footerName").textContent = c.footer || c.name || "";

  // Fotografia del festejado
  const portraitWrap = $("portraitWrap");
  const portrait = $("portrait");

  if (c.showPortrait !== false && c.portrait) {
    portrait.src = c.portrait;
    portraitWrap.hidden = false;

    portrait.onerror = () => {
      console.error("No se pudo cargar la fotografia:", c.portrait);
      portraitWrap.hidden = true;
    };
  } else {
    portraitWrap.hidden = true;
  }

  // Imagen adicional de invitacion
  if (c.showPng && c.invitationPng) {
    $("artworkSection").hidden = false;
    $("invitationImage").src = c.invitationPng;
  } else {
    $("artworkSection").hidden = true;
  }

  // Google Forms
  const formUrl = c.googleFormUrl || "";
  const rsvpButton = $("rsvpButton");

  const validForm =
    formUrl.startsWith("https://") &&
    !formUrl.includes("PEGA_AQUI");

  if (validForm) {
    rsvpButton.href = formUrl;
    rsvpButton.target = "_blank";
    rsvpButton.rel = "noopener noreferrer";
  } else {
    rsvpButton.href = "#";

    rsvpButton.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Falta configurar el enlace de Google Forms.");
    });
  }

  // Cuenta regresiva
  const target = new Date(c.dateTime).getTime();

  const updateCountdown = () => {
    const distance = target - Date.now();

    if (!Number.isFinite(target)) {
      ["days", "hours", "minutes", "seconds"].forEach((id) => {
        $(id).textContent = "--";
      });

      $("countdownLabel").textContent =
        "Configura la fecha del evento";

      return;
    }

    if (distance <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach((id) => {
        $(id).textContent = "00";
      });

      $("countdownLabel").textContent =
        "¡Hoy celebramos!";

      return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

})();
