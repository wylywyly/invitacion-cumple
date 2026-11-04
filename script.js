
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
  document.title = c.title || "Evelyn's Birthday";

  $("eyebrow").textContent = c.eyebrow || "";
  $("personName").textContent = c.name || "Evelyn";
  $("eventTitle").textContent = c.eventTitle || c.title || "Evelyn's Birthday";
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

  mapsButton.href = c.mapsUrl || "https://maps.google.com/";
  mapsButton.target = "_blank";
  mapsButton.rel = "noopener noreferrer";

  // Informacion de la fiesta
  $("dressCode").textContent = c.dressCode || "Todos de negro";

  $("themeText").textContent = c.theme || "Disco Party";

  $("moneyBox").textContent =
    c.moneyBox || "Habra un buzon de dinero disponible durante el evento.";

  $("consumption").textContent =
    c.consumption || "Cada invitado cubre su propio consumo.";

  // Mensajes
  $("rsvpMessage").textContent =
    c.rsvpMessage || "Ayudame confirmando si podras acompañarme.";

  $("footerName").textContent =
    c.footer || c.title || "Evelyn's Birthday";

  // Fotografia de Evelyn
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
  const artworkSection = $("artworkSection");
  const invitationImage = $("invitationImage");

  if (c.showPng && c.invitationPng) {
    artworkSection.hidden = false;
    invitationImage.src = c.invitationPng;

    invitationImage.onerror = () => {
      console.error("No se pudo cargar la imagen adicional.");
      artworkSection.hidden = true;
    };

  } else {
    artworkSection.hidden = true;
  }

  // Google Forms
  const formUrl = c.googleFormUrl || "";
  const rsvpButton = $("rsvpButton");

  const validForm =
    /^https:\/\/\S+/.test(formUrl) &&
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

  const countdownIds = [
    "days",
    "hours",
    "minutes",
    "seconds"
  ];

  const updateCountdown = () => {

    // Verificar que la fecha sea valida
    if (!Number.isFinite(target)) {

      countdownIds.forEach((id) => {
        $(id).textContent = "--";
      });

      $("countdownLabel").textContent =
        "Configura la fecha del evento";

      return;
    }

    const distance = target - Date.now();

    // Cuando llega el dia del evento
    if (distance <= 0) {

      countdownIds.forEach((id) => {
        $(id).textContent = "00";
      });

      $("countdownLabel").textContent =
        "¡Hoy celebramos!";

      return;
    }

    // Calcular tiempo restante
    const days = Math.floor(distance / 86400000);

    const hours = Math.floor(
      (distance % 86400000) / 3600000
    );

    const minutes = Math.floor(
      (distance % 3600000) / 60000
    );

    const seconds = Math.floor(
      (distance % 60000) / 1000
    );

    // Mostrar resultados
    $("days").textContent =
      String(days).padStart(2, "0");

    $("hours").textContent =
      String(hours).padStart(2, "0");

    $("minutes").textContent =
      String(minutes).padStart(2, "0");

    $("seconds").textContent =
      String(seconds).padStart(2, "0");
  };

  // Iniciar cuenta regresiva
  updateCountdown();

  // Actualizar cada segundo
  window.setInterval(updateCountdown, 1000);
  
/* ==========================================
   PARTICULAS FLOTANTES PLATEADAS
   ========================================== */

(function createSilverParticles() {
  const particleCount = 35;

  const container = document.createElement("div");

  container.id = "silver-particles";

  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "0"
  });

  document.body.appendChild(container);

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.className = "silver-particle";

    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * -15;

    Object.assign(particle.style, {
      position: "absolute",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      width: size + "px",
      height: size + "px",
      borderRadius: "50%",
      background: "#ffffff",
      opacity: "0",
      boxShadow: "0 0 10px #ffffff",
      animation: `particleFloat ${duration}s ${delay}s linear infinite`
    });

    container.appendChild(particle);
  }

  const style = document.createElement("style");

  style.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translate3d(0, 0, 0) scale(.5);
        opacity: 0;
      }

      15% {
        opacity: .8;
      }

      50% {
        transform: translate3d(35px, -100px, 0) scale(1);
        opacity: .65;
      }

      85% {
        opacity: .5;
      }

      100% {
        transform: translate3d(-20px, -220px, 0) scale(.3);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(style);
})();


})();
