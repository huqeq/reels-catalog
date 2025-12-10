// Общий скрипт для сайта

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const page = body.getAttribute("data-page");

  initScrollReveal();

  // ---------------- ГЛАВНАЯ СТРАНИЦА ----------------
  if (page === "home") {
    // Кнопка перехода к блогерам
    const goToBloggersButton = document.getElementById("goToBloggers");
    if (goToBloggersButton) {
      goToBloggersButton.addEventListener("click", () => {
        window.location.href = "bloggers.html";
      });
    }

    // Блок с рилсами
    initReelsSection();
  }

  // ---------------- СТРАНИЦА БЛОГЕРОВ ----------------
  if (page === "bloggers") {
    const grid = document.getElementById("bloggersGrid");
    if (grid && Array.isArray(window.bloggers)) {
      grid.innerHTML = "";
      window.bloggers.forEach((blogger) => {
        const card = document.createElement("article");
        card.className = "blogger-card";

        // Аватар
        const avatarWrapper = document.createElement("div");
        avatarWrapper.className = "blogger-avatar-wrapper";

        const avatarInner = document.createElement("div");
        avatarInner.className = "blogger-avatar-inner";

        const img = document.createElement("img");
        img.className = "blogger-avatar";
        img.src = blogger.photo;
        img.alt = blogger.name;

        avatarInner.appendChild(img);
        avatarWrapper.appendChild(avatarInner);

        // Информация
        const info = document.createElement("div");
        info.className = "blogger-info";

        const nameEl = document.createElement("div");
        nameEl.className = "blogger-name";
        nameEl.textContent = blogger.name;

        const desc = document.createElement("div");
        desc.className = "blogger-description";
        desc.textContent = blogger.description;

        const prices = document.createElement("div");
        prices.className = "blogger-prices";

        const reelsPill = document.createElement("div");
        reelsPill.className = "price-pill";
        reelsPill.innerHTML =
          '<span class="price-label">Reels:</span>' +
          `<span class="price-value">${blogger.reels}</span>`;

        const storiesPill = document.createElement("div");
        storiesPill.className = "price-pill";
        storiesPill.innerHTML =
          '<span class="price-label">Stories:</span>' +
          `<span class="price-value">${blogger.stories}</span>`;

        prices.appendChild(reelsPill);
        prices.appendChild(storiesPill);

        const footer = document.createElement("div");
        footer.className = "blogger-footer";

        // Кнопка Instagram
        const instaBtn = document.createElement("button");
        instaBtn.className = "blogger-cta insta-btn";
        instaBtn.type = "button";
        instaBtn.innerHTML = `<span>Instagram</span><span class="icon">↗</span>`;
        instaBtn.addEventListener("click", () => {
          if (!blogger.instagram) {
            alert("У этого блогера не указана ссылка на Instagram.");
            return;
          }
          window.open(blogger.instagram, "_blank");
        });

        // Кнопка "Узнать подробнее"
        const cta = document.createElement("button");
        cta.className = "blogger-cta";
        cta.type = "button";
        cta.innerHTML = `<span>Узнать подробнее</span><span class="icon">↗</span>`;
        cta.addEventListener("click", () => {
          alert(
            `Карточка блогера: ${blogger.name}\n\nReels: ${blogger.reels}\nStories: ${blogger.stories}`
          );
        });

        footer.appendChild(instaBtn);
        footer.appendChild(cta);

        info.appendChild(nameEl);
        info.appendChild(desc);
        info.appendChild(prices);
        info.appendChild(footer);

        card.appendChild(avatarWrapper);
        card.appendChild(info);

        grid.appendChild(card);
      });
    }
  }
});

// ----------------- ЛОГИКА РИЛСОВ НА ГЛАВНОЙ -----------------

function initReelsSection() {
  const videoEl = document.getElementById("reelVideo");
  const titleEl = document.getElementById("reelTitle");
  const descEl = document.getElementById("reelDescription");
  const durationEl = document.getElementById("reelDuration");
  const prevBtn = document.getElementById("reelPrev");
  const nextBtn = document.getElementById("reelNext");
  const muteBtn = document.getElementById("reelMute");
  const indicatorsContainer = document.getElementById("reelsIndicators");

  if (
    !videoEl ||
    !titleEl ||
    !descEl ||
    !durationEl ||
    !prevBtn ||
    !nextBtn ||
    !muteBtn ||
    !indicatorsContainer
  ) {
    return; // если секции нет на странице
  }

  // Демонстрационные данные – заменишь на свои ролики
  const reels = window.reelsData || [];

  let current = 0;
  let isMuted = true;
  videoEl.muted = true;

  // Индикаторы (точки)
  const indicators = reels.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "reels-dot";
    dot.type = "button";
    dot.addEventListener("click", () => {
      setReel(index, true);
    });
    indicatorsContainer.appendChild(dot);
    return dot;
  });

  function updateIndicators() {
    indicators.forEach((dot, idx) => {
      if (idx === current) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function setReel(index, autoplay = true) {
    current = (index + reels.length) % reels.length;
    const reel = reels[current];

    videoEl.src = reel.src;
    videoEl.currentTime = 0;

    titleEl.textContent = reel.title;
    descEl.textContent = reel.description;
    durationEl.textContent = reel.duration;

    updateIndicators();

    if (autoplay) {
      const playPromise = videoEl.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {});
      }
    }
  }

  // Навигация
  prevBtn.addEventListener("click", () => {
    setReel(current - 1);
  });

  nextBtn.addEventListener("click", () => {
    setReel(current + 1);
  });

  // Следующий ролик после окончания
  videoEl.addEventListener("ended", () => {
    setReel(current + 1);
  });

  // Включение / выключение звука
  function updateMuteLabel() {
    muteBtn.textContent = videoEl.muted ? "🔇 Без звука" : "🔊 Со звуком";
  }

  muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    videoEl.muted = isMuted;
    updateMuteLabel();
  });

  updateMuteLabel();
  setReel(0, true);
}

// -------- Scroll Reveal (плавное появление блоков при скролле) --------
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18
      }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    // старые браузеры: просто показываем всё
    elements.forEach((el) => el.classList.add("reveal-visible"));
  }
}

