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

// Текущий экран
let currentScreen = 'menu';
let botFirstClick = true;

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ ==========
function loadImages(container, baseName, startNumber = 1, onClick = null) {
  container.innerHTML = '';
  
  let i = startNumber;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `${baseName} (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `${baseName} ${currentIndex}`;
      
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

function createCard(url, detailUrl, parentGallery) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  const img = document.createElement('img');
  img.src = `gallery/${url}`;
  img.alt = `Карта`;
  img.className = 'card-image';
  img.loading = 'lazy';

  checkImageExists(`gallery/${detailUrl}`).then((exists) => {
    if (exists) {
      const cornerImg = document.createElement('img');
      cornerImg.src = 'gallery/corner.jpg';
      cornerImg.alt = 'Уголок';
      cornerImg.className = 'corner-image';
      cardContainer.appendChild(cornerImg);

      img.addEventListener('click', () => {
        fullscreenImg.src = `gallery/${detailUrl}`;
        fullscreen.classList.remove('hidden');
      });
    } else {
      img.addEventListener('click', () => {
        fullscreenImg.src = `gallery/${url}`;
        fullscreen.classList.remove('hidden');
      });
    }
  });

  img.onerror = () => cardContainer.remove();
  cardContainer.appendChild(img);
  parentGallery.appendChild(cardContainer);
}

async function loadMainGallery() {
  mainGallery.innerHTML = '';
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${i}.jpg`;
    if (await checkImageExists(`gallery/${baseUrl}`)) {
      createCard(baseUrl, `d${i}.jpg`, mainGallery);
    }
    for (let letter of ['a', 'b', 'c']) {
      const variantUrl = `${i}${letter}.jpg`;
      if (await checkImageExists(`gallery/${variantUrl}`)) {
        createCard(variantUrl, `d${i}${letter}.jpg`, mainGallery);
      } else {
        break;
      }
    }
  }
}

async function loadSeriesGallery(prefix, galleryElement) {
  galleryElement.innerHTML = '';
  for (let i = 1; i <= 100; i++) {
    const url = `${prefix}${i}.jpg`;
    const detailUrl = `d${prefix}${i}.jpg`;
    if (await checkImageExists(`gallery/${url}`)) {
      createCard(url, detailUrl, galleryElement);
    } else {
      break;
    }
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
}

function showRules() {
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'block';
  botScreen.style.display = 'none';
  galleryScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  loadImages(rulesContainer, 'rules');
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
  loadSeriesGallery('p', pGallery);
  loadSeriesGallery('a', aGallery);
  loadSeriesGallery('w', wGallery);
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

// Закрытие полноэкранного режима
fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});

// ========== СТАРТ ==========
showMenu();
