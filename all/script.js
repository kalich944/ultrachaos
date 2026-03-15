// Экраны
const menuScreen = document.getElementById('menu-screen');
const rulesScreen = document.getElementById('rules-screen');
const botScreen = document.getElementById('bot-screen');
const closeButton = document.getElementById('closeButton');

// Контейнеры
const imageContainer = document.getElementById('imageContainer');
const rulesContainer = document.getElementById('rulesContainer');

// Элементы бота
const botContainer = document.getElementById('botContainer');
const botOpening = document.getElementById('bot-opening');
const botCrystal = document.getElementById('bot-crystal');
const botOption = document.getElementById('bot-option');

// Динамические массивы
let botCrystals = [];
let botOptions = [];

// Текущий экран
let currentScreen = 'menu';
let botFirstClick = true; // true = обложка ещё не убрана

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
      loadBotOptions(); // После кристаллов грузим опции
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
      // Показываем бота после загрузки всего
      showBotReady();
    };
  }
  
  loadNext();
}

// ========== ФУНКЦИИ БОТА ==========
function showBotReady() {
  // Устанавливаем начальные изображения
  if (botCrystals.length > 0) {
    botCrystal.src = botCrystals[0];
  }
  if (botOptions.length > 0) {
    botOption.src = botOptions[0];
  }
  
  // Скрываем кристалл и опцию, показываем только обложку
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  botFirstClick = true;
}

function handleBotClick() {
  // Первый клик — убираем обложку, показываем кристалл и опцию
  if (botFirstClick) {
    botOpening.style.display = 'none';
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;
  }
  
  // Все последующие клики — только меняем кристалл и опцию (обложка не участвует!)
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
  closeButton.style.display = 'none';
  
  loadImages(imageContainer, 'menu', 1, function(index) {
    if (index === 3) return showRules;
    if (index === 4) return function() {
      // При переходе в бота начинаем загрузку данных
      showBot();
    };
    return null;
  });
}

function showRules() {
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'block';
  botScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  loadImages(rulesContainer, 'rules');
}

function showBot() {
  currentScreen = 'bot';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'block';
  closeButton.style.display = 'block';
  
  // Очищаем и показываем заглушку
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  
  // Загружаем актуальные списки файлов
  loadBotCrystals();
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

// ========== СТАРТ ==========
showMenu();
