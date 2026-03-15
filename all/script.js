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
let allRulesImages = []; // Для хранения всех изображений правил
let allGalleryCards = []; // Для хранения всех карт галереи

// Текущий экран
let currentScreen = 'menu';
let botFirstClick = true;
let pendingHash = null; // Для отложенной навигации

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ ==========
function loadImages(container, baseName, startNumber = 1, onClick = null, collectInArray = null) {
  container.innerHTML = '';
  if (collectInArray) collectInArray.length = 0; // Очищаем массив
  
  let i = startNumber;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `${baseName} (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `${baseName} ${currentIndex}`;
      img.id = `${baseName}-${currentIndex}`; // Добавляем ID для навигации
      
      if (collectInArray) collectInArray.push(img); // Сохраняем в массив
      
      if (onClick) {
        const handler = onClick(currentIndex);
        if (handler) {
          img.addEventListener('click', handler);
          img.style.cursor = 'pointer';
        }
      }
      
      container.appendChild(img);
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-startNumber} изображений ${baseName}`);
      
      // После загрузки проверяем, есть ли ожидаемая навигация
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
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  cardContainer.id = cardId; // Уникальный ID для навигации

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

  img.onerror = () => cardContainer.remove();
  cardContainer.appendChild(img);
  parentGallery.appendChild(cardContainer);
  
  // Сохраняем в общий массив для навигации
  allGalleryCards.push(cardContainer);
  
  return cardContainer;
}

async function loadMainGallery() {
  mainGallery.innerHTML = '';
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
  
  // После загрузки проверяем навигацию
  if (pendingHash && pendingHash.startsWith('#gallery-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}

async function loadSeriesGallery(prefix, galleryElement, seriesName) {
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
  
  // Правила: #rules-5
  if (hash.startsWith('#rules-')) {
    const ruleNumber = hash.replace('#rules-', '');
    showRules();
    
    // Ждём загрузки правил и скроллим
    setTimeout(() => {
      const targetImg = document.getElementById(`rules-${ruleNumber}`);
      if (targetImg) {
        targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
  }
  
  // Галерея: #gallery-card-123 или #gallery-p-42
  else if (hash.startsWith('#gallery-')) {
    showGallery();
    
    // Ждём загрузки галереи и скроллим
    setTimeout(() => {
      const targetCard = document.getElementById(hash.substring(1)); // убираем #
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 1000); // Галерея грузится дольше
  }
  
  // Бот: #bot
  else if (hash === '#bot') {
    showBot();
  }
  
  // Меню: #menu или ничего
  else if (hash === '#menu' || hash === '#') {
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
      
      // После загрузки бота проверяем навигацию
      if (pendingHash === '#bot') {
        pendingHash = null;
      }
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
  currentScreen = 'menu';
  menuScreen.style.display = 'block';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'none';
  
  loadImages(imageContainer, 'menu', 1, function(index) {
    if (index === 3) return showRules;
    if (index === 4) return showBot;
    if (index === 5) return showGallery;
    return null;
  });
  
  // Меняем hash без перезагрузки
  window.location.hash = 'menu';
}

function showRules() {
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'block';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  loadImages(rulesContainer, 'rules', 1, null, allRulesImages);
  window.location.hash = 'rules';
}

function showBot() {
  currentScreen = 'bot';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'block';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  
  loadBotCrystals();
  window.location.hash = 'bot';
}

function showGallery() {
  currentScreen = 'gallery';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'block';
  closeButton.style.display = 'block';
  
  // Загружаем все галереи
  loadMainGallery();
  loadSeriesGallery('p', pGallery, 'p');
  loadSeriesGallery('a', aGallery, 'a');
  loadSeriesGallery('w', wGallery, 'w');
  
  window.location.hash = 'gallery';
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

// Закрытие полноэкранного режима
fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});

// Обработка глубоких ссылок при загрузке
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    // Если есть hash, запоминаем и обработаем после загрузки меню
    pendingHash = hash;
  }
});

// Слушаем изменения hash (если пользователь меняет вручную)
window.addEventListener('hashchange', () => {
  handleDeepLink(window.location.hash);
});

// ========== СТАРТ ==========
showMenu();
