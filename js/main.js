/* ============================================================
   Team Week — Lisbon 2026
   Small, dependency-free front-end.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     1. Phrasebook data → rendered grid
     ---------------------------------------------------------- */
  var VESSELS = [
    "v-bowl",
    "v-jug",
    "v-krater",
    "v-amphora",
    "v-kylix",
    "v-hydria",
  ];

  var PHRASES = [
    ["Hello", "oh-LAH", "Olá"],
    ["Thanks", "oh-bree-GAH-doo", "Obrigado"],
    ["Good morning", "bong DEE-ah", "Bom dia"],
    ["Good evening", "BOH-ah TAR-de", "Boa tarde"],
    ["Good night", "BOH-ah NOY-te", "Boa noite"],
    ["How are you?", "KOH-moo shtah", "Como está?"],
    ["I’m hungry", "TEH-nyoo FOH-me", "Tenho fome"],
    ["I’m thirsty", "TEH-nyoo SEH-de", "Tenho sede"],
    [
      "A beer, please",
      "OO-ma eem-pe-ree-AL, por fa-VOR",
      "Uma imperial, por favor",
    ],
    [
      "A glass of wine, please",
      "oong KOH-poo de VEE-nyoo",
      "Um copo de vinho, por favor",
    ],
    [
      "One round of ginjinha",
      "OO-ma ho-DAH-da de zheen-ZHEE-nya",
      "Uma rodada de ginjinha",
    ],
    ["Cheers", "sah-OO-de", "Saúde"],
    [
      "I’m fine with overtime",
      "nowng me eem-POR-too",
      "Não me importo de fazer horas extra",
    ],
    ["My friend!", "meh-oo ah-MEE-goo", "Meu amigo!"],
    [
      "I love deploy Fridays",
      "AH-doo-roo SESH-tas de de-PLOY",
      "Adoro sextas-feiras de deploy",
    ],
    [
      "I tracked my hours",
      "he-zhish-TAY as MEE-nyas OH-rash",
      "Registei as minhas horas",
    ],
  ];

  function playIcon() {
    return '<svg viewBox="0 0 8 10" aria-hidden="true"><use href="#ico-play"></use></svg>';
  }

  var grid = document.getElementById("phrases");
  if (grid) {
    var html = "";
    PHRASES.forEach(function (p, i) {
      var vessel = VESSELS[i % VESSELS.length];
      html +=
        '<div class="phrase">' +
        '<svg class="phrase__vessel" viewBox="0 0 120 160" aria-hidden="true"><use href="#' +
        vessel +
        '"></use></svg>' +
        '<div class="phrase__body">' +
        '<p class="phrase__en">' +
        p[0] +
        "</p>" +
        '<p class="phrase__line">' +
        '<button class="play" data-say="' +
        p[2] +
        '" data-lang="pt-PT" aria-label="Hear ' +
        p[0] +
        ' — approximation">' +
        playIcon() +
        "</button>" +
        "<span>" +
        p[1] +
        "</span>" +
        "</p>" +
        '<p class="phrase__line">' +
        '<button class="play" data-say="' +
        p[2] +
        '" data-lang="pt-PT" aria-label="Hear ' +
        p[0] +
        ' in Portuguese">' +
        playIcon() +
        "</button>" +
        "<span>" +
        p[2] +
        "</span>" +
        "</p>" +
        "</div>" +
        "</div>";
    });
    grid.innerHTML = html;
  }

  /* ----------------------------------------------------------
     2. Play buttons — speak with the browser voice
     ---------------------------------------------------------- */
  var muted = false;
  var current = null;

  function stopAll() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    document
      .querySelectorAll(".play.is-playing, .medallion__play.is-playing")
      .forEach(function (b) {
        b.classList.remove("is-playing");
      });
    current = null;
  }

  function speak(btn, text, lang) {
    if (current === btn) {
      stopAll();
      return;
    }
    stopAll();
    btn.classList.add("is-playing");
    current = btn;

    if (muted || !("speechSynthesis" in window)) {
      window.setTimeout(function () {
        if (current === btn) {
          btn.classList.remove("is-playing");
          current = null;
        }
      }, 1400);
      return;
    }

    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang || "pt-PT";
    u.rate = 0.92;
    u.pitch = 1;
    u.onend = u.onerror = function () {
      btn.classList.remove("is-playing");
      if (current === btn) current = null;
    };
    window.speechSynthesis.speak(u);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".play");
    if (!btn) return;
    speak(btn, btn.getAttribute("data-say"), btn.getAttribute("data-lang"));
  });

  var reel = document.getElementById("reelPlay");
  if (reel) {
    reel.addEventListener("click", function () {
      speak(
        reel,
        "Lisboa, catorze a dezassete de Maio. Vamos a isso!",
        "pt-PT",
      );
    });
  }

  var muteBtn = document.getElementById("reelMute");
  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      muted = !muted;
      muteBtn.setAttribute("aria-pressed", String(muted));
      muteBtn.style.opacity = muted ? "0.45" : "1";
      if (muted) stopAll();
    });
  }

  /* ----------------------------------------------------------
     3. FAQ accordion
     ---------------------------------------------------------- */
  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.parentElement;
      var open = item.classList.contains("is-open");

      item.parentElement
        .querySelectorAll(".faq__item.is-open")
        .forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        });

      if (!open) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ----------------------------------------------------------
     4. Reveal on scroll
     ---------------------------------------------------------- */
  var targets = document.querySelectorAll(".reveal, .visual");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (t) {
      t.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    targets.forEach(function (t) {
      io.observe(t);
    });
  }

  /* Staggered children inside a revealed block */
  var style = document.createElement("style");
  var rules = "";
  for (var i = 1; i <= 16; i++) {
    rules +=
      ".packing__row:nth-child(" + i + "){transition-delay:" + i * 28 + "ms}";
    rules +=
      ".agenda__item:nth-child(" + i + "){transition-delay:" + i * 60 + "ms}";
  }
  style.textContent = rules;
  document.head.appendChild(style);
})();
