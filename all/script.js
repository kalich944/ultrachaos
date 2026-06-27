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
let showCrystalOnNextClick = false; // флаг для опции 4

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

// ========== МЕНЮ: загружаем menu (1)...(7) с кликами, первое случайное ==========
function loadMenuImages() {
  if (!imageContainer) return;
  
  imageContainer.innerHTML = '';
  
  // Для первого изображения выбираем случайный вариант из трёх
  const firstVariants = ['menu (1a).png', 'menu (1b).png', 'menu (1c).png'];
  const randomFirst = firstVariants[Math.floor(Math.random() * firstVariants.length)];
  
  for (let i = 1; i <= 7; i++) {
    if (i === 1) {
      // Создаём обёртку для первого изображения и кнопки "about"
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = '100%';
      wrapper.style.display = 'block';
      
      // Основное изображение
      const img = document.createElement('img');
      img.src = randomFirst;
      img.alt = `Меню 1`;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      wrapper.appendChild(img);
      
      // Кнопка "about" (menu about.png) — кликабельная, с анимацией
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
    
    // Остальные изображения (2..7)
    const img = document.createElement('img');
    img.src = `menu (${i}).png`;
    img.alt = `Меню ${i}`;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    
    // Назначаем обработчики кликов по номерам (кроме 7)
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
    }
    // Для i === 7 — без клика
    
    imageContainer.appendChild(img);
  }
}

// ========== УНИВЕРСАЛЬНАЯ ЗАГРУЗКА ПОСЛЕДОВАТЕЛЬНЫХ ИЗОБРАЖЕНИЙ С ПОДДЕРЖКОЙ КЛИКОВ ==========
function loadImages(container, baseName, startNumber = 1, clickMap = null) {
  if (!container) {
    console.error('Контейнер не найден:', baseName);
    return;
  }
  
  container.innerHTML = '';
  console.log(`Загрузка ${baseName}...`);
  
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

// ========== ГАЛЕРЕЯ (быстрая загрузка с сохранением порядка) ==========

// Функция добавления карты с уголком, если есть детальная версия
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
  
  // Клик для зума
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    fullscreenImg.src = detailUrl || imageUrl;
    fullscreen.classList.remove('hidden');
  });
  
  cardDiv.appendChild(img);
  
  // Если есть детальная версия — добавляем уголок
  if (detailUrl) {
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
  
  container.appendChild(cardDiv);
}

// Быстрая параллельная загрузка с сохранением порядка
async function loadGallery() {
  if (!mainGallery || !pGallery || !aGallery || !wGallery) {
    console.error('Элементы галереи не найдены');
    return;
  }
  
  console.log('Загрузка галереи (быстрая)...');
  
  mainGallery.innerHTML = '';
  pGallery.innerHTML = '';
  aGallery.innerHTML = '';
  wGallery.innerHTML = '';
  
  const galleryPath = 'gallery/';
  
  // Собираем все URL-ы для загрузки в правильном порядке
  const imageUrls = [];
  const containers = [];
  
  // 1. Основная галерея: 1.jpg, 1a.jpg, 1b.jpg, 1c.jpg, 2.jpg, 2a.jpg, ...
  for (let i = 1; i <= 200; i++) {
    imageUrls.push({ url: `${galleryPath}${i}.jpg`, container: mainGallery, alt: `Карта ${i}` });
    // Варианты a, b, c
    for (let letter of ['a', 'b', 'c']) {
      imageUrls.push({ url: `${galleryPath}${i}${letter}.jpg`, container: mainGallery, alt: `Карта ${i}${letter}` });
    }
  }
  
  // 2. Серии p, a, w
  const series = [
    { prefix: 'p', gallery: pGallery },
    { prefix: 'a', gallery: aGallery },
    { prefix: 'w', gallery: wGallery }
  ];
  for (let s of series) {
    for (let i = 1; i <= 100; i++) {
      imageUrls.push({ url: `${galleryPath}${s.prefix}${i}.jpg`, container: s.gallery, alt: `Карта ${s.prefix}${i}` });
    }
  }
  
  // Функция загрузки одного изображения с проверкой существования
  const loadImage = (entry) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ success: true, entry, element: img });
      img.onerror = () => resolve({ success: false, entry });
      img.src = entry.url;
    });
  };
  
  // Загружаем все параллельно
  const results = await Promise.all(imageUrls.map(entry => loadImage(entry)));
  
  // Обрабатываем результаты в том же порядке (сохраняем очередность)
  for (const result of results) {
    if (result.success) {
      const img = result.element;
      img.alt = result.entry.alt;
      img.className = 'card-image';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      
      // Проверяем наличие детальной версии (d...)
      const detailUrl = result.entry.url.replace(/(\d+)([a-c]?)\.jpg$/, (match, num, letter) => {
        return `d${num}${letter}.jpg`;
      });
      const hasDetail = await fileExists(detailUrl);
      if (hasDetail) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          fullscreenImg.src = detailUrl;
          fullscreen.classList.remove('hidden');
        });
      } else {
        // Если нет детальной, открываем ту же картинку
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          fullscreenImg.src = result.entry.url;
          fullscreen.classList.remove('hidden');
        });
      }
      
      // Добавляем в контейнер (без уголка, т.к. проверка детали уже есть)
      // Но уголок добавляем только если есть деталь
      if (hasDetail) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        wrapper.appendChild(img);
        
        const cornerImg = document.createElement('img');
        cornerImg.src = 'gallery/corner.jpg';
        cornerImg.alt = 'подробности';
        cornerImg.style.position = 'absolute';
        cornerImg.style.top = '0';
        cornerImg.style.right = '0';
        cornerImg.style.width = '12.5%';
        cornerImg.style.height = 'auto';
        cornerImg.style.pointerEvents = 'none';
        wrapper.appendChild(cornerImg);
        
        result.entry.container.appendChild(wrapper);
      } else {
        result.entry.container.appendChild(img);
      }
    }
  }
  
  console.log('Галерея загружена (быстрая)');
  if (pendingHash && pendingHash.startsWith('#gallery-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}

// ========== ГЛУБОКИЕ ССЫЛКИ ==========
function handleDeepLink(hash) {
  if (!hash || hash === '#') return;
  
  console.log('Обработка ссылки:', hash);
  
  const target = hash.startsWith('#') ? hash.substring(1) : hash;
  
  if (target.startsWith('rules-')) {
    showRules();
  }
  else if (target.startsWith('gallery-')) {
    showGallery();
  }
  else if (target === 'bot') {
    showBot();
  }
  else if (target === 'about') {
    showAbout();
  }
  else if (target === 'menu') {
    showMenu();
  }
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
  if (botCrystals.length > 0) {
    botCrystal.src = botCrystals[0];
  }
  if (botOptions.length > 0) {
    botOption.src = botOptions[0];
  }
  
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
  showCrystalOnNextClick = false;
}

function handleBotClick() {
  if (botFirstClick) {
    botOpening.style.display = 'none';
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
    
    // Если нет ни одного файла для этого номера — прекращаем
    if (!existsPlain && !existsA && !existsB) {
      hasAny = false;
      break;
    }
    
    // Функция для добавления обработчика клика на изображение (если номер 2 или 18)
    const addClickHandler = (imgElement, num) => {
      if (num === 2) {
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', showAbout);
      } else if (num === 18) {
        imgElement.style.cursor = 'pointer';
        imgElement.addEventListener('click', showBot);
      }
    };
    
    // Если есть и A, и B — делаем переключалку
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
    // Иначе если есть обычный файл — показываем его
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
    // Если есть только A (без B) — показываем A как статичное
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
    // Если есть только B (без A) — показываем B как статичное
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
  
  // Обновлённые номера: (8) -> бот, (9) -> правила, (10) -> Avito
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
