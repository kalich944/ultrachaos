// Экраны
const menuScreen = document.getElementById('menu-screen');
const rulesScreen = document.getElementById('rules-screen');
const botScreen = document.getElementById('bot-screen');
const galleryScreen = document.getElementById('gallery-screen');
const aboutScreen = document.getElementById('about-screen');
const closeButton = document.getElementById('closeButton');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

// Контейнеры
const imageContainer = document.getElementById('imageContainer');
const rulesContainer = document.getElementById('rulesContainer');
const aboutContainer = document.getElementById('aboutContainer');

// Элементы бота
const botContainer = document.getElementById('botContainer');
const botOpening = document.getElementById('bot-opening');
const botCrystal = document.getElementById('bot-crystal');
const botOption = document.getElementById('bot-option');

// Элементы галереи
const mainGallery = document.getElementById('main-gallery');
const pGallery = document.getElementById('p-gallery');
const aGallery = document.getElementById('a-gallery');
const wGallery = document.getElementById('w-gallery');

// Динамические массивы
let botCrystals = [];
let botOptions = [];

// Текущий экран
let currentScreen = 'menu';
let botFirstClick = true;
let pendingHash = null;
let showCrystalOnNextClick = false;

// ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ПРОВЕРКИ СУЩЕСТВОВАНИЯ ФАЙЛА ==========
function fileExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// ========== ЧТЕНИЕ ПАРАМЕТРОВ ИЗ TELEGRAM ==========
function getTelegramStartParam() {
  try {
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
      return window.Telegram.WebApp.initDataUnsafe.start_param;
    }
  } catch (e) {
    console.log('Не удалось прочитать start_param');
  }
  return null;
}

// ========== МЕНЮ ==========
function loadMenuImages() {
  if (!imageContainer) return;
  imageContainer.innerHTML = '';

  const firstVariants = ['menu (1a).jpg', 'menu (1b).jpg', 'menu (1c).jpg'];
  const randomFirst = firstVariants[Math.floor(Math.random() * firstVariants.length)];

  for (let i = 1; i <= 8; i++) {
    if (i === 1) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.display = 'block';

      const img = document.createElement('img');
      img.src = randomFirst;
      img.alt = 'Меню 1';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      wrapper.appendChild(img);

      const aboutImg = document.createElement('img');
      aboutImg.src = 'menu about.png';
      aboutImg.alt = 'О игре';
      aboutImg.style.position = 'absolute';
      aboutImg.style.top = '5%';
      aboutImg.style.right = '5%';
      aboutImg.style.width = '25%';
      aboutImg.style.height = 'auto';
      aboutImg.style.cursor = 'pointer';
      aboutImg.classList.add('floating');
      aboutImg.addEventListener('click', (e) => {
        e.stopPropagation();
        showAbout();
      });
      wrapper.appendChild(aboutImg);

      imageContainer.appendChild(wrapper);
      continue;
    }

    if (i === 2) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';

      const imgA = document.createElement('img');
      imgA.src = 'menu (2a).jpg';
      imgA.alt = 'Меню 2a';
      imgA.style.width = '100%';
      imgA.style.height = 'auto';
      imgA.style.display = 'block';
      imgA.style.cursor = 'pointer';

      const imgB = document.createElement('img');
      imgB.src = 'menu (2b).jpg';
      imgB.alt = 'Меню 2b';
      imgB.style.width = '100%';
      imgB.style.height = 'auto';
      imgB.style.display = 'none';
      imgB.style.cursor = 'pointer';

      let showA = true;
      const toggle = function() {
        if (showA) {
          imgA.style.display = 'none';
          imgB.style.display = 'block';
        } else {
          imgA.style.display = 'block';
          imgB.style.display = 'none';
        }
        showA = !showA;
      };

      imgA.addEventListener('click', toggle);
      imgB.addEventListener('click', toggle);

      wrapper.appendChild(imgA);
      wrapper.appendChild(imgB);
      imageContainer.appendChild(wrapper);
      continue;
    }

    const img = document.createElement('img');
    img.src = `menu (${i}).jpg`;
    img.alt = `Меню ${i}`;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    if (i === 3) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showBot());
    } else if (i === 4) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        window.open('https://www.avito.ru/brands/63979153b8bf07d6eb232ea8836f16b9/all/sport_i_otdyh?gdlkerfdnwq=101&page_from=from_item_card&iid=7826045800&sellerId=de3d7e1794b05276f5e69732a9ebbd1c', '_blank');
      });
    } else if (i === 5) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showRules());
    } else if (i === 6) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showGallery());
    } else if (i === 7) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        window.open('https://t.me/ultrachaosAKB', '_blank');
      });
    }

    imageContainer.appendChild(img);
  }
}

// ========== УНИВЕРСАЛЬНАЯ ЗАГРУЗКА ==========
function loadImages(container, baseName, startNumber = 1, clickMap = null) {
  if (!container) return;
  container.innerHTML = '';

  let i = startNumber;
  let loadedCount = 0;

  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    const imgPath = `${baseName} (${currentIndex}).png`;

    img.onload = function() {
      img.alt = `${baseName} ${currentIndex}`;
      img.id = `${baseName}-${currentIndex}`;

      if (clickMap && clickMap[currentIndex]) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', clickMap[currentIndex]);
      }

      container.appendChild(img);
      loadedCount++;
      i++;
      loadNext();
    };

    img.onerror = function() {
      console.log(`Загружено ${loadedCount} изображений ${baseName}`);
      if (pendingHash) {
        handleDeepLink(pendingHash);
        pendingHash = null;
      }
    };

    img.src = imgPath;
  }

  loadNext();
}

// ========== ГАЛЕРЕЯ (МГНОВЕННАЯ, ПОЛНОСТЬЮ ПАРАЛЛЕЛЬНАЯ) ==========
function addCardWithCorner(container, imageUrl, detailUrl, alt) {
  const cardDiv = document.createElement('div');
  cardDiv.style.position = 'relative';
  cardDiv.style.display = 'inline-block';
  cardDiv.style.width = '100%';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = alt;
  img.className = 'card-image';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';

  if (detailUrl) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      fullscreenImg.src = detailUrl;
      fullscreen.classList.remove('hidden');
    });

    const cornerImg = document.createElement('img');
    cornerImg.src = 'gallery/corner.jpg';
    cornerImg.alt = 'подробности';
    cornerImg.style.position = 'absolute';
    cornerImg.style.top = '0';
    cornerImg.style.right = '0';
    cornerImg.style.width = '12.5%';
    cornerImg.style.height = 'auto';
    cornerImg.style.pointerEvents = 'none';
    cardDiv.appendChild(cornerImg);
  }

  cardDiv.appendChild(img);
  container.appendChild(cardDiv);
}

async function loadGallery() {
  if (!mainGallery || !pGallery || !aGallery || !wGallery) {
    console.error('Элементы галереи не найдены');
    return;
  }

  console.log('Загрузка галереи (мгновенная)...');
  mainGallery.innerHTML = '';
  pGallery.innerHTML = '';
  aGallery.innerHTML = '';
  wGallery.innerHTML = '';

  const galleryPath = 'gallery/';

  // Собираем все URL и сразу проверяем существование и наличие деталей
  const allItems = [];

  // Основная галерея
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${galleryPath}${i}.jpg`;
    const aUrl = `${galleryPath}${i}a.jpg`;
    const bUrl = `${galleryPath}${i}b.jpg`;
    const cUrl = `${galleryPath}${i}c.jpg`;
    allItems.push({ url: baseUrl, type: 'base', index: i });
    allItems.push({ url: aUrl, type: 'a', index: i });
    allItems.push({ url: bUrl, type: 'b', index: i });
    allItems.push({ url: cUrl, type: 'c', index: i });
  }

  // Серии p, a, w
  const seriesTypes = ['p', 'a', 'w'];
  for (let s of seriesTypes) {
    for (let i = 1; i <= 100; i++) {
      allItems.push({ url: `${galleryPath}${s}${i}.jpg`, type: `series_${s}`, index: i });
    }
  }

  // Параллельно проверяем все файлы
  const checkPromises = allItems.map(item => 
    fileExists(item.url).then(exists => ({ ...item, exists }))
  );
  const results = await Promise.all(checkPromises);
  const existing = results.filter(r => r.exists);

  // Теперь для каждого существующего файла проверяем деталь параллельно
  const detailPromises = existing.map(item => {
    const detailUrl = item.url.replace(/(\d+)([a-c]?)\.jpg$/, (match, num, letter) => {
      return `d${num}${letter}.jpg`;
    });
    return fileExists(detailUrl).then(hasDetail => ({ ...item, detailUrl, hasDetail }));
  });
  const itemsWithDetail = await Promise.all(detailPromises);

  // Группируем по типу
  const baseItems = itemsWithDetail.filter(r => r.type === 'base').sort((a, b) => a.index - b.index);
  const aItems = itemsWithDetail.filter(r => r.type === 'a').sort((a, b) => a.index - b.index);
  const bItems = itemsWithDetail.filter(r => r.type === 'b').sort((a, b) => a.index - b.index);
  const cItems = itemsWithDetail.filter(r => r.type === 'c').sort((a, b) => a.index - b.index);

  // Добавляем все карты в правильном порядке с помощью DocumentFragment для скорости
  const fragment = document.createDocumentFragment();

  const addToFragment = (container, item) => {
    const cardDiv = document.createElement('div');
    cardDiv.style.position = 'relative';
    cardDiv.style.display = 'inline-block';
    cardDiv.style.width = '100%';

    const img = document.createElement('img');
    img.src = item.url;
    img.alt = `Карта ${item.index}`;
    img.className = 'card-image';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    if (item.hasDetail) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        fullscreenImg.src = item.detailUrl;
        fullscreen.classList.remove('hidden');
      });

      const cornerImg = document.createElement('img');
      cornerImg.src = 'gallery/corner.jpg';
      cornerImg.alt = 'подробности';
      cornerImg.style.position = 'absolute';
      cornerImg.style.top = '0';
      cornerImg.style.right = '0';
      cornerImg.style.width = '12.5%';
      cornerImg.style.height = 'auto';
      cornerImg.style.pointerEvents = 'none';
      cardDiv.appendChild(cornerImg);
    }

    cardDiv.appendChild(img);
    container.appendChild(cardDiv);
  };

  // Добавляем в mainGallery в порядке: base, a, b, c для каждого индекса
  for (let i = 1; i <= 200; i++) {
    const base = baseItems.find(r => r.index === i);
    if (base) addToFragment(mainGallery, base);
    const a = aItems.find(r => r.index === i);
    if (a) addToFragment(mainGallery, a);
    const b = bItems.find(r => r.index === i);
    if (b) addToFragment(mainGallery, b);
    const c = cItems.find(r => r.index === i);
    if (c) addToFragment(mainGallery, c);
  }

  // Серии
  for (let s of seriesTypes) {
    const container = s === 'p' ? pGallery : (s === 'a' ? aGallery : wGallery);
    const seriesItems = itemsWithDetail.filter(r => r.type === `series_${s}`).sort((a, b) => a.index - b.index);
    for (let item of seriesItems) {
      addToFragment(container, item);
    }
  }

  console.log('Галерея загружена (мгновенная)');
  if (pendingHash && pendingHash.startsWith('#gallery-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}

// ========== ГЛУБОКИЕ ССЫЛКИ ==========
function handleDeepLink(hash) {
  if (!hash || hash === '#') return;
  const target = hash.startsWith('#') ? hash.substring(1) : hash;

  if (target.startsWith('rules-')) showRules();
  else if (target.startsWith('gallery-')) showGallery();
  else if (target === 'bot') showBot();
  else if (target === 'about') showAbout();
  else if (target === 'menu') showMenu();
}

// ========== БОТ ==========
function loadBotCrystals() {
  botCrystals = [];
  let i = 1;

  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    const imgPath = `bot crys (${currentIndex}).JPG`;

    img.onload = function() {
      if (currentIndex !== 9) {
        botCrystals.push(imgPath);
      }
      i++;
      loadNext();
    };

    img.onerror = function() {
      console.log(`Загружено кристаллов: ${botCrystals.length}`);
      loadBotOptions();
    };

    img.src = imgPath;
  }

  loadNext();
}

function loadBotOptions() {
  botOptions = [];
  let i = 1;

  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    const imgPath = `bot (${currentIndex}).jpg`;

    img.onload = function() {
      botOptions.push(imgPath);
      i++;
      loadNext();
    };

    img.onerror = function() {
      console.log(`Загружено опций: ${botOptions.length}`);
      showBotReady();
    };

    img.src = imgPath;
  }

  loadNext();
}

function showBotReady() {
  let randomCrystal = botCrystals[0];
  if (botCrystals.length > 0) {
    const filtered = botCrystals.filter(src => !src.includes('bot crys (9).JPG'));
    if (filtered.length > 0) {
      randomCrystal = filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      randomCrystal = botCrystals[0];
    }
  }
  const randomOption = botOptions.length > 0 ? botOptions[Math.floor(Math.random() * botOptions.length)] : '';

  botCrystal.src = randomCrystal;
  botOption.src = randomOption;

  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
  showCrystalOnNextClick = false;
}

function handleBotClick() {
  botOpening.style.display = 'none';

  botContainer.classList.remove('shake');
  void botContainer.offsetWidth;
  botContainer.classList.add('shake');
  setTimeout(() => {
    botContainer.classList.remove('shake');
  }, 300);

  if (botFirstClick) {
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;

    const currentOption = botOption.src;
    if (currentOption.includes('bot (4).jpg')) {
      botCrystal.src = 'bot crys (9).JPG';
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = true;
    } else {
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
    return;
  }

  if (showCrystalOnNextClick) {
    if (botCrystals.length > 0) {
      const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
      botCrystal.src = randomCrystal;
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
    return;
  }

  if (botCrystals.length > 0 && botOptions.length > 0) {
    const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
    const randomOption = botOptions[Math.floor(Math.random() * botOptions.length)];
    botCrystal.src = randomCrystal;
    botOption.src = randomOption;
    botCrystal.style.display = 'block';

    if (randomOption.includes('bot (4).jpg')) {
      botCrystal.src = 'bot crys (9).JPG';
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = true;
    } else {
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
  }
}

// ========== ПОКАЗ ЭКРАНОВ ==========
function showMenu() {
  console.log('Показ меню');
  currentScreen = 'menu';
  menuScreen.style.display = 'flex';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  aboutScreen.style.display = 'none';
  closeButton.style.display = 'none';
  loadMenuImages();
}

async function showRules() {
  console.log('Показ правил');
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'flex';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  aboutScreen.style.display = 'none';
  closeButton.style.display = 'block';

  rulesContainer.innerHTML = '';
  let i = 1;
  let hasAny = true;

  while (hasAny) {
    const plainFile = `rules (${i}).jpg`;
    const fileA = `rules (${i}a).jpg`;
    const fileB = `rules (${i}b).jpg`;

    const existsPlain = await fileExists(plainFile);
    const existsA = await fileExists(fileA);
    const existsB = await fileExists(fileB);

    if (!existsPlain && !existsA && !existsB) {
      hasAny = false;
      break;
    }

    const addClickHandler = (imgElement, num) => {
      if (num === 2) {
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', showAbout);
      } else if (num === 18) {
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', showBot);
      }
    };

    if (existsA && existsB) {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';

      const imgA = document.createElement('img');
      imgA.src = fileA;
      imgA.alt = `Правило ${i}a`;
      imgA.style.width = '100%';
      imgA.style.height = 'auto';
      imgA.style.display = 'block';
      imgA.style.cursor = 'pointer';
      addClickHandler(imgA, i);

      const imgB = document.createElement('img');
      imgB.src = fileB;
      imgB.alt = `Правило ${i}b`;
      imgB.style.width = '100%';
      imgB.style.height = 'auto';
      imgB.style.display = 'none';
      imgB.style.cursor = 'pointer';
      addClickHandler(imgB, i);

      let showA = true;
      const toggle = function() {
        if (showA) {
          imgA.style.display = 'none';
          imgB.style.display = 'block';
        } else {
          imgA.style.display = 'block';
          imgB.style.display = 'none';
        }
        showA = !showA;
      };

      imgA.addEventListener('click', toggle);
      imgB.addEventListener('click', toggle);

      wrapper.appendChild(imgA);
      wrapper.appendChild(imgB);
      rulesContainer.appendChild(wrapper);
    }
    else if (existsPlain) {
      const img = document.createElement('img');
      img.src = plainFile;
      img.alt = `Правило ${i}`;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      addClickHandler(img, i);
      rulesContainer.appendChild(img);
    }
    else if (existsA) {
      const img = document.createElement('img');
      img.src = fileA;
      img.alt = `Правило ${i}a`;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      addClickHandler(img, i);
      rulesContainer.appendChild(img);
    }
    else if (existsB) {
      const img = document.createElement('img');
      img.src = fileB;
      img.alt = `Правило ${i}b`;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      addClickHandler(img, i);
      rulesContainer.appendChild(img);
    }

    i++;
  }

  if (pendingHash && pendingHash.startsWith('#rules-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}

function showAbout() {
  console.log('Показ "Об игре"');
  currentScreen = 'about';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  aboutScreen.style.display = 'flex';
  closeButton.style.display = 'block';

  const aboutClickMap = {
    8: () => showBot(),
    9: () => showRules(),
    10: () => {
      window.open('https://www.avito.ru/brands/63979153b8bf07d6eb232ea8836f16b9/all/sport_i_otdyh?gdlkerfdnwq=101&page_from=from_item_card&iid=7826045800&sellerId=de3d7e1794b05276f5e69732a9ebbd1c', '_blank');
    }
  };

  loadImages(aboutContainer, 'about', 1, aboutClickMap);
}

function showBot() {
  console.log('Показ бота');
  currentScreen = 'bot';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'flex';
  galleryScreen.style.display = 'none';
  aboutScreen.style.display = 'none';
  closeButton.style.display = 'block';

  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
  showCrystalOnNextClick = false;

  loadBotCrystals();
}

function showGallery() {
  console.log('Показ галереи');
  currentScreen = 'gallery';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'block';
  aboutScreen.style.display = 'none';
  closeButton.style.display = 'block';

  loadGallery();
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
console.log('Приложение запущено');

const startParam = getTelegramStartParam();
if (startParam) {
  console.log('Start param:', startParam);
  pendingHash = '#' + startParam;
}

showMenu();
