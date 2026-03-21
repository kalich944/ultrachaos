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

// ========== МЕНЮ: загружаем menu (1)...(8) с кликами ==========
function loadMenuImages() {
  if (!imageContainer) return;
  
  imageContainer.innerHTML = '';
  
  for (let i = 1; i <= 8; i++) {
    const img = document.createElement('img');
    img.src = `menu (${i}).png`;
    img.alt = `Меню ${i}`;
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    
    // Назначаем обработчики кликов по номерам
    if (i === 3) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showBot());
    } else if (i === 5) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showRules());
    } else if (i === 6) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showGallery());
    } else if (i === 7) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => showAbout());
    }
    
    imageContainer.appendChild(img);
  }
}

// ========== УНИВЕРСАЛЬНАЯ ЗАГРУЗКА ПОСЛЕДОВАТЕЛЬНЫХ ИЗОБРАЖЕНИЙ ==========
function loadImages(container, baseName, startNumber = 1) {
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
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
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
  
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${galleryPath}${i}.jpg`;
    if (await checkImageExists(baseUrl)) {
      const img = document.createElement('img');
      img.src = baseUrl;
      img.alt = `Карта ${i}`;
      img.className = 'card-image';
      img.loading = 'lazy';
      
      const detailUrl = `${galleryPath}d${i}.jpg`;
      if (await checkImageExists(detailUrl)) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
          fullscreenImg.src = detailUrl;
          fullscreen.classList.remove('hidden');
        });
      }
      
      mainGallery.appendChild(img);
    }
    
    for (let letter of ['a', 'b', 'c']) {
      const variantUrl = `${galleryPath}${i}${letter}.jpg`;
      if (await checkImageExists(variantUrl)) {
        const img = document.createElement('img');
        img.src = variantUrl;
        img.alt = `Карта ${i}${letter}`;
        img.className = 'card-image';
        img.loading = 'lazy';
        
        const detailUrl = `${galleryPath}d${i}${letter}.jpg`;
        if (await checkImageExists(detailUrl)) {
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => {
            fullscreenImg.src = detailUrl;
            fullscreen.classList.remove('hidden');
          });
        }
        
        mainGallery.appendChild(img);
      }
    }
  }
  
  const series = [
    { prefix: 'p', gallery: pGallery },
    { prefix: 'a', gallery: aGallery },
    { prefix: 'w', gallery: wGallery }
  ];
  
  for (let s of series) {
    for (let i = 1; i <= 100; i++) {
      const url = `${galleryPath}${s.prefix}${i}.jpg`;
      if (await checkImageExists(url)) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Карта ${s.prefix}${i}`;
        img.className = 'card-image';
        img.loading = 'lazy';
        
        const detailUrl = `${galleryPath}d${s.prefix}${i}.jpg`;
        if (await checkImageExists(detailUrl)) {
          img.style.cursor = 'pointer';
          img.addEventListener('click', () => {
            fullscreenImg.src = detailUrl;
            fullscreen.classList.remove('hidden');
          });
        }
        
        s.gallery.appendChild(img);
      } else {
        break;
      }
    }
  }
  
  console.log('Галерея загружена');
  
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
      botCrystals.push(imgPath);
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
}

function handleBotClick() {
  if (botFirstClick) {
    botOpening.style.display = 'none';
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;
  }
  
  if (botCrystals.length > 0 && botOptions.length > 0) {
    const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
    const randomOption = botOptions[Math.floor(Math.random() * botOptions.length)];
    botCrystal.src = randomCrystal;
    botOption.src = randomOption;
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

function showRules() {
  console.log('Показ правил');
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'flex';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  aboutScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  loadImages(rulesContainer, 'rules');
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
  
  loadImages(aboutContainer, 'about');
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
