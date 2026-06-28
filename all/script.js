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
  
  const firstVariants = ['menu (1a).png', 'menu (1b).png', 'menu (1c).png'];
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
    
    const img = document.createElement('img');
    img.src = `menu (${i}).png`;
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

// ========== ГАЛЕРЕЯ ==========
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
  
  console.log('Загрузка галереи...');
  mainGallery.innerHTML = '';
  pGallery.innerHTML = '';
  aGallery.innerHTML = '';
  wGallery.innerHTML = '';
  
  const galleryPath = 'gallery/';
  
  try {
    for (let i = 1; i <= 200; i++) {
      const baseUrl = `${galleryPath}${i}.jpg`;
      const aUrl = `${galleryPath}${i}a.jpg`;
      const bUrl = `${galleryPath}${i}b.jpg`;
      const cUrl = `${galleryPath}${i}c.jpg`;
      
      const [hasBase, hasA, hasB, hasC] = await Promise.all([
        fileExists(baseUrl),
        fileExists(aUrl),
        fileExists(bUrl),
        fileExists(cUrl)
      ]);
      
      if (!hasBase && !hasA && !hasB && !hasC) continue;
      
      if (hasBase) {
        const detailUrl = `${galleryPath}d${i}.jpg`;
        const hasDetail = await fileExists(detailUrl);
        addCardWithCorner(mainGallery, baseUrl, hasDetail ? detailUrl : null, `Карта ${i}`);
      }
      
      for (let [url, letter] of [[aUrl, 'a'], [bUrl, 'b'], [cUrl, 'c']]) {
        if (await fileExists(url)) {
          const detailUrl = `${galleryPath}d${i}${letter}.jpg`;
          const hasDetail = await fileExists(detailUrl);
          addCardWithCorner(mainGallery, url, hasDetail ? detailUrl : null, `Карта ${i}${letter}`);
        }
      }
    }
    
    const series = [
      { prefix: 'p', gallery: pGallery, max: 100 },
      { prefix: 'a', gallery: aGallery, max: 100 },
      { prefix: 'w', gallery: wGallery, max: 100 }
    ];
    
    for (let s of series) {
      for (let i = 1; i <= s.max; i++) {
        const url = `${galleryPath}${s.prefix}${i}.jpg`;
        const exists = await fileExists(url);
        if (!exists) break;
        const detailUrl = `${galleryPath}d${s.prefix}${i}.jpg`;
        const hasDetail = await fileExists(detailUrl);
        addCardWithCorner(s.gallery, url, hasDetail ? detailUrl : null, `Карта ${s.prefix}${i}`);
      }
    }
    
    console.log('Галерея загружена');
  } catch (error) {
    console.error('Ошибка загрузки галереи:', error);
  }
  
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
      // Исключаем кристалл номер 9 из общего массива
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
  // Выбираем случайные изображения для старта (кристалл не 9)
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
  
  // Показываем заставку, скрываем кристалл и опцию
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
  showCrystalOnNextClick = false;
}

function handleBotClick() {
  // Принудительно скрываем заставку при любом клике (если она ещё видна)
  botOpening.style.display = 'none';
  
  // Эффект дрожания
  botContainer.classList.remove('shake');
  void botContainer.offsetWidth;
  botContainer.classList.add('shake');
  setTimeout(() => {
    botContainer.classList.remove('shake');
  }, 300);
  
  // Если это первый клик (только что скрыли заставку)
  if (botFirstClick) {
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;
    
    // Проверяем, не является ли текущая опция 4
    const currentOption = botOption.src;
    if (currentOption.includes('bot (4).jpg')) {
      // Если опция 4, показываем кристалл 9
      botCrystal.src = 'bot crys (9).JPG';
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = true;
    } else {
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
    return;
  }
  
  // Если ожидается показ кристалла (опция 4 без смены)
  if (showCrystalOnNextClick) {
    if (botCrystals.length > 0) {
      // Выбираем случайный кристалл (не 9, т.к. 9 исключён из массива)
      const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
      botCrystal.src = randomCrystal;
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
    return;
  }
  
  // Обычный клик: меняем и кристалл, и опцию случайно
  if (botCrystals.length > 0 && botOptions.length > 0) {
    const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
    const randomOption = botOptions[Math.floor(Math.random() * botOptions.length)];
    botCrystal.src = randomCrystal;
    botOption.src = randomOption;
    botCrystal.style.display = 'block';
    
    if (randomOption.includes('bot (4).jpg')) {
      // Если выпала опция 4, ставим кристалл 9 и устанавливаем флаг
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
  
  // Сбрасываем состояние перед загрузкой
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
  showCrystalOnNextClick = false;
  
  // Загружаем массивы
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
