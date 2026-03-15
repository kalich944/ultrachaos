// Экраны
const menuScreen = document.getElementById('menu-screen');
const rulesScreen = document.getElementById('rules-screen');
const botScreen = document.getElementById('bot-screen');
const galleryScreen = document.getElementById('gallery-screen');
const closeButton = document.getElementById('closeButton');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

// Контейнеры
const imageContainer = document.getElementById('imageContainer');
const rulesContainer = document.getElementById('rulesContainer');

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
let allRulesImages = [];
let allGalleryCards = [];

// Флаги загрузки (сбрасываем при старте)
let menuLoaded = false;
let rulesLoaded = false;
let galleryLoaded = false;

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

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ ==========
function loadImages(container, baseName, startNumber = 1, onClick = null, collectInArray = null) {
  // КРИТИЧНО ВАЖНО: очищаем контейнер и массив
  if (container) {
    container.innerHTML = '';
  }
  if (collectInArray) {
    collectInArray.length = 0;
  }
  
  let i = startNumber;
  let loadedCount = 0;
  let isLoading = true;
  
  function loadNext() {
    if (!isLoading) return;
    
    const img = new Image();
    const currentIndex = i;
    img.src = `${baseName} (${currentIndex}).png`;
    
    img.onload = function() {
      if (!isLoading) return;
      
      img.alt = `${baseName} ${currentIndex}`;
      img.id = `${baseName}-${currentIndex}`;
      img.setAttribute('data-index', currentIndex);
      
      if (collectInArray) collectInArray.push(img);
      
      if (onClick) {
        const handler = onClick(currentIndex);
        if (handler) {
          img.addEventListener('click', handler);
          img.style.cursor = 'pointer';
        }
      }
      
      if (container) {
        container.appendChild(img);
      }
      
      loadedCount++;
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      if (!isLoading) return;
      
      isLoading = false;
      console.log(`Загружено ${loadedCount} изображений ${baseName}`);
      
      // Устанавливаем флаг загрузки
      if (baseName === 'menu') menuLoaded = true;
      if (baseName === 'rules') rulesLoaded = true;
      
      // Проверяем отложенную навигацию
      if (pendingHash) {
        handleDeepLink(pendingHash);
        pendingHash = null;
      }
    };
  }
  
  loadNext();
}

// ========== ФУНКЦИИ ГАЛЕРЕИ ==========
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function createCard(url, detailUrl, parentGallery, cardId) {
  // Проверяем, нет ли уже такой карточки
  if (document.getElementById(cardId)) {
    return;
  }
  
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  cardContainer.id = cardId;

  const img = document.createElement('img');
  img.src = `gallery/${url}`;
  img.alt = `Карта`;
  img.className = 'card-image';
  img.loading = 'lazy';
  img.style.cursor = 'default';

  checkImageExists(`gallery/${detailUrl}`).then((exists) => {
    if (exists) {
      const cornerImg = document.createElement('img');
      cornerImg.src = 'gallery/corner.jpg';
      cornerImg.alt = 'Уголок';
      cornerImg.className = 'corner-image';
      cardContainer.appendChild(cornerImg);

      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        fullscreenImg.src = `gallery/${detailUrl}`;
        fullscreen.classList.remove('hidden');
      });
    }
  });

  img.onerror = () => {
    if (cardContainer.parentNode) {
      cardContainer.remove();
    }
  };
  
  cardContainer.appendChild(img);
  parentGallery.appendChild(cardContainer);
  allGalleryCards.push(cardContainer);
}

async function loadMainGallery() {
  // Очищаем всё перед загрузкой
  if (mainGallery) {
    mainGallery.innerHTML = '';
  }
  allGalleryCards = [];
  
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${i}.jpg`;
    if (await checkImageExists(`gallery/${baseUrl}`)) {
      createCard(baseUrl, `d${i}.jpg`, mainGallery, `gallery-card-${i}`);
    }
    
    for (let letter of ['a', 'b', 'c']) {
      const variantUrl = `${i}${letter}.jpg`;
      if (await checkImageExists(`gallery/${variantUrl}`)) {
        createCard(variantUrl, `d${i}${letter}.jpg`, mainGallery, `gallery-card-${i}${letter}`);
      } else {
        break;
      }
    }
  }
  
  galleryLoaded = true;
  
  if (pendingHash && pendingHash.startsWith('#gallery-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}

async function loadSeriesGallery(prefix, galleryElement, seriesName) {
  if (!galleryElement) return;
  
  // Очищаем перед загрузкой
  galleryElement.innerHTML = '';
  
  for (let i = 1; i <= 100; i++) {
    const url = `${prefix}${i}.jpg`;
    const detailUrl = `d${prefix}${i}.jpg`;
    if (await checkImageExists(`gallery/${url}`)) {
      createCard(url, detailUrl, galleryElement, `gallery-${seriesName}-${i}`);
    } else {
      break;
    }
  }
}

// ========== ГЛУБОКИЕ ССЫЛКИ ==========
function handleDeepLink(hash) {
  if (!hash || hash === '#') return;
  
  console.log('Обработка ссылки:', hash);
  
  const target = hash.startsWith('#') ? hash.substring(1) : hash;
  
  if (target.startsWith('rules-')) {
    showRules();
    
    // Ждём загрузки и скроллим
    const checkExist = setInterval(() => {
      const targetImg = document.getElementById(`rules-${target.replace('rules-', '')}`);
      if (targetImg) {
        targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearInterval(checkExist);
      }
    }, 100);
  }
  
  else if (target.startsWith('gallery-')) {
    showGallery();
    
    const checkExist = setInterval(() => {
      const targetCard = document.getElementById(target);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearInterval(checkExist);
      }
    }, 100);
  }
  
  else if (target === 'bot') {
    showBot();
  }
  
  else if (target === 'menu') {
    showMenu();
  }
}

// ========== ЗАГРУЗКА КРИСТАЛЛОВ ==========
function loadBotCrystals() {
  botCrystals = [];
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `bot crys (${currentIndex}).JPG`;
    
    img.onload = function() {
      botCrystals.push(`bot crys (${currentIndex}).JPG`);
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено кристаллов: ${botCrystals.length}`);
      loadBotOptions();
    };
  }
  
  loadNext();
}

// ========== ЗАГРУЗКА ОПЦИЙ ==========
function loadBotOptions() {
  botOptions = [];
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `bot (${currentIndex}).jpg`;
    
    img.onload = function() {
      botOptions.push(`bot (${currentIndex}).jpg`);
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено опций: ${botOptions.length}`);
      showBotReady();
    };
  }
  
  loadNext();
}

// ========== ФУНКЦИИ БОТА ==========
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
  if (currentScreen === 'menu') return;
  
  currentScreen = 'menu';
  menuScreen.style.display = 'block';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'none';
  
  // Принудительно загружаем меню при первом входе
  if (!menuLoaded) {
    loadImages(imageContainer, 'menu', 1, function(index) {
      if (index === 3) return showRules;
      if (index === 4) return showBot;
      if (index === 5) return showGallery;
      return null;
    });
  }
}

function showRules() {
  if (currentScreen === 'rules') return;
  
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'block';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  if (!rulesLoaded) {
    loadImages(rulesContainer, 'rules', 1, null, allRulesImages);
  }
}

function showBot() {
  if (currentScreen === 'bot') return;
  
  currentScreen = 'bot';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'block';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  
  // Бот всегда перезагружает данные
  loadBotCrystals();
}

function showGallery() {
  if (currentScreen === 'gallery') return;
  
  currentScreen = 'gallery';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'block';
  closeButton.style.display = 'block';
  
  // Принудительно очищаем и загружаем галерею
  galleryLoaded = false;
  loadMainGallery();
  loadSeriesGallery('p', pGallery, 'p');
  loadSeriesGallery('a', aGallery, 'a');
  loadSeriesGallery('w', wGallery, 'w');
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========
// Сбрасываем флаги при старте
menuLoaded = false;
rulesLoaded = false;
galleryLoaded = false;

const startParam = getTelegramStartParam();
if (startParam) {
  pendingHash = '#' + startParam;
}

// Запускаем меню
showMenu();
