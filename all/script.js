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

// Данные для бота (исправлено на .JPG для кристаллов)
const botCrystals = Array.from({length: 8}, (_, i) => `bot crys (${i+1}).JPG`);
const botOptions = Array.from({length: 20}, (_, i) => `bot (${i+1}).jpg`);

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

// ========== ФУНКЦИИ БОТА ==========
function initBot() {
  botFirstClick = true;
  botOpening.style.display = 'block';
  botCrystal.style.display = 'none';
  botOption.style.display = 'none';
  // Устанавливаем начальные изображения
  botCrystal.src = 'bot crys (1).JPG';
  botOption.src = 'bot (1).jpg';
}

function handleBotClick() {
  if (botFirstClick) {
    botOpening.style.display = 'none';
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;
  }
  
  const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
  const randomOption = botOptions[Math.floor(Math.random() * botOptions.length)];
  botCrystal.src = randomCrystal;
  botOption.src = randomOption;
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
    if (index === 4) return showBot;
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
  
  initBot();
}

// ========== СОБЫТИЯ ==========
closeButton.addEventListener('click', showMenu);
botContainer.addEventListener('click', handleBotClick);

// ========== СТАРТ ==========
showMenu();
