(() => {
  "use strict";

  const config = window.EVENT_CONFIG;
  if (!config) {
    console.error("No se encontró EVENT_CONFIG. Revisa config.js.");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const setText = (id, value, fallback = "") => {
    const element = $(id);
    if (element) element.textContent = value || fallback;
  };

  // Datos de la invitación
  document.title = config.title || "Evelyn's Birthday";
  setText("eyebrow", config.eyebrow, "ESTÁS INVITADO A");
  setText("personName", config.name, "Evelyn");
  setText("eventTitle", config.eventTitle || config.title, "Evelyn's Birthday");
  setText("ageLine", config.age);
  setText("message", config.message);
  setText("eventDate", config.displayDate, "Por definir");
  setText("eventTime", config.displayTime, "Por definir");
  setText("venue", config.venue, "Por definir");
  setText("address", config.address);
  setText("dressCode", config.dressCode, "Todos de negro");
  setText("themeText", config.theme, "Disco Party");
  setText("moneyBox", config.moneyBox, "Habrá un buzón de dinero disponible durante el evento.");
  setText("consumption", config.consumption, "Cada invitado cubre su propio consumo.");
  setText("footerName", config.footer || config.title, "Evelyn's Birthday");

  // Fotografía
  const portraitWrap = $("portraitWrap");
  const portrait = $("portrait");
  if (config.showPortrait !== false && config.portrait) {
    portrait.src = config.portrait;
    portraitWrap.hidden = false;
    portrait.onerror = () => { portraitWrap.hidden = true; };
  } else {
    portraitWrap.hidden = true;
  }

  // Google Forms: único botón que requiere interacción
  const formButton = $("rsvpButton");
  const formUrl = config.googleFormUrl || "";
  if (/^https:\/\/\S+/.test(formUrl) && !formUrl.includes("PEGA_AQUI")) {
    formButton.href = formUrl;
  } else {
    formButton.addEventListener("click", (event) => {
      event.preventDefault();
      alert("El enlace del formulario todavía no está configurado.");
    });
  }

  // Botón de ubicación: conserva el enlace exacto de Google Maps.
  const mapsButton = $("mapsButton");
  if (mapsButton && config.mapsUrl) mapsButton.href = config.mapsUrl;

  // Cuenta regresiva
  const targetDate = new Date(config.dateTime).getTime();
  const countdownIds = ["days", "hours", "minutes", "seconds"];
  function updateCountdown() {
    if (!Number.isFinite(targetDate)) {
      countdownIds.forEach((id) => setText(id, "--"));
      setText("countdownLabel", "Fecha pendiente de configurar");
      return;
    }

    const distance = targetDate - Date.now();
    if (distance <= 0) {
      countdownIds.forEach((id) => setText(id, "00"));
      setText("countdownLabel", "¡Hoy celebramos!");
      return;
    }

    const values = [
      Math.floor(distance / 86400000),
      Math.floor((distance % 86400000) / 3600000),
      Math.floor((distance % 3600000) / 60000),
      Math.floor((distance % 60000) / 1000)
    ];
    countdownIds.forEach((id, index) => setText(id, String(values[index]).padStart(2, "0")));
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Presentación horizontal automática: no necesita flechas, gestos ni desplazamiento manual.
  const slides = Array.from(document.querySelectorAll(".slide"));
  const track = $("slides");
  const progress = $("progressBar");
  const slideDuration = 9000;
  let currentSlide = 0;
  let slideTimer = null;
  let progressFrame = null;
  let slideStartedAt = 0;

  function showSlide(index) {
    currentSlide = index % slides.length;
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentSlide);
      slide.setAttribute("aria-hidden", i === currentSlide ? "false" : "true");
    });
    slideStartedAt = performance.now();
    if (progress) progress.style.width = "0%";
  }

  function animateProgress(now) {
    const elapsed = now - slideStartedAt;
    const percent = Math.min((elapsed / slideDuration) * 100, 100);
    if (progress) progress.style.width = `${percent}%`;
    progressFrame = window.requestAnimationFrame(animateProgress);
  }

  function startPresentation() {
    if (slideTimer) window.clearInterval(slideTimer);
    if (progressFrame) window.cancelAnimationFrame(progressFrame);
    showSlide(currentSlide);
    progressFrame = window.requestAnimationFrame(animateProgress);
    slideTimer = window.setInterval(() => showSlide(currentSlide + 1), slideDuration);
  }

  // Las flechas permiten avanzar voluntariamente sin desactivar el modo automático.
  const previousButton = $("prevSlide");
  const nextButton = $("nextSlide");
  function moveManually(direction) {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    startPresentation();
  }
  previousButton?.addEventListener("click", () => moveManually(-1));
  nextButton?.addEventListener("click", () => moveManually(1));

  // También permite cambiar de pantalla con las teclas de flecha en computadora.
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") moveManually(1);
    if (event.key === "ArrowLeft") moveManually(-1);
  });

  // Se adapta si el navegador cambia el tamaño de pantalla.
  window.addEventListener("resize", () => {
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
  });
  startPresentation();

  // Pequeños destellos flotantes del fondo
  const starfield = $("starfield");
  for (let i = 0; i < 32; i++) {
    const star = document.createElement("span");
    star.className = "floating-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * -12}s`;
    star.style.animationDuration = `${7 + Math.random() * 9}s`;
    starfield.appendChild(star);
  }
  
  // =====================================================
  // REPRODUCTOR DE MÚSICA DE FONDO
  // Inicio automático en la primera interacción
  // =====================================================

  const backgroundMusic = $("backgroundMusic");
  const musicButton = $("musicButton");

  if (backgroundMusic && musicButton) {

    backgroundMusic.volume = 0.4;
    backgroundMusic.loop = true;

    let musicStarted = false;
    let playAttemptInProgress = false;

    function updateMusicButton(isPlaying) {
      if (isPlaying) {
        musicButton.innerHTML = "⏸ <span>PAUSAR MÚSICA</span>";
        musicButton.classList.add("playing");
        musicButton.setAttribute("aria-label", "Pausar música");
      } else {
        musicButton.innerHTML = "▶ <span>ACTIVAR MÚSICA</span>";
        musicButton.classList.remove("playing");
        musicButton.setAttribute("aria-label", "Activar música");
      }
    }

    async function startMusic() {

      if (playAttemptInProgress || !backgroundMusic.paused) {
        return;
      }

      playAttemptInProgress = true;

      try {
        await backgroundMusic.play();

        musicStarted = true;
        updateMusicButton(true);

        // Ya comenzó: no necesitamos detectar más interacciones.
        document.removeEventListener(
          "pointerdown",
          handleFirstInteraction,
          true
        );

        document.removeEventListener(
          "keydown",
          handleFirstInteraction,
          true
        );

      } catch (error) {

        console.warn(
          "No se pudo iniciar la música. Se intentará nuevamente.",
          error
        );

        updateMusicButton(false);

      } finally {
        playAttemptInProgress = false;
      }
    }

    // Primera interacción en cualquier parte de la invitación.
    function handleFirstInteraction(event) {

      // Evita que el botón de música inicie y pause
      // inmediatamente la canción en el mismo clic.
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("#musicButton")
      ) {
        return;
      }

      if (!musicStarted) {
        startMusic();
      }
    }

    // Detecta toques y clics.
    document.addEventListener(
      "pointerdown",
      handleFirstInteraction,
      true
    );

    // También permite iniciar mediante el teclado.
    document.addEventListener(
      "keydown",
      handleFirstInteraction,
      true
    );

    // Control manual del reproductor.
    musicButton.addEventListener("click", async () => {

      if (backgroundMusic.paused) {
        await startMusic();
      } else {
        backgroundMusic.pause();
        updateMusicButton(false);
      }

    });

    // Mantiene actualizado el botón si cambia el estado del audio.
    backgroundMusic.addEventListener("play", () => {
      updateMusicButton(true);
    });

    backgroundMusic.addEventListener("pause", () => {
      updateMusicButton(false);
    });

    updateMusicButton(false);
      }
})();