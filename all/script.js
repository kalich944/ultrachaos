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
let showCrystalOnNextClick = false; // флаг для опции 23

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
      
      // Кнопка "about" (menu about.png) — кликабельная
      const aboutImg = document.createElement('img');
      aboutImg.src = 'menu about.png';
      aboutImg.alt = 'О игре';
      aboutImg.style.position = 'absolute';
      aboutImg.style.top = '5%';      // отступ сверху
      aboutImg.style.right = '5%';    // отступ справа
      aboutImg.style.width = '25%';   // четверть ширины
      aboutImg.style.height = 'auto';
      aboutImg.style.cursor = 'pointer';
      aboutImg.addEventListener('click', (e) => {
        e.stopPropagation(); // предотвращаем всплытие, если вдруг
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

// ========== ГАЛЕРЕЯ (оптимизированная, с уголками) ==========

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

// Оптимизированная загрузка галереи (параллельная)
function loadGallery() {
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
  
  // Функция проверки существования файла (параллельная)
  function checkFileExists(url, callback) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }
  
  // Загружаем основную галерею (1.jpg, 1a.jpg, 1b.jpg, 1c.jpg)
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${galleryPath}${i}.jpg`;
    checkFileExists(baseUrl, (exists) => {
      if (exists) {
        const detailUrl = `${galleryPath}d${i}.jpg`;
        checkFileExists(detailUrl, (hasDetail) => {
          addCardWithCorner(mainGallery, baseUrl, hasDetail ? detailUrl : null, `Карта ${i}`);
        });
      }
    });
    
    // Варианты a, b, c
    for (let letter of ['a', 'b', 'c']) {
      const variantUrl = `${galleryPath}${i}${letter}.jpg`;
      checkFileExists(variantUrl, (exists) => {
        if (exists) {
          const detailUrl = `${galleryPath}d${i}${letter}.jpg`;
          checkFileExists(detailUrl, (hasDetail) => {
            addCardWithCorner(mainGallery, variantUrl, hasDetail ? detailUrl : null, `Карта ${i}${letter}`);
          });
        }
      });
    }
  }
  
  // Загружаем серии p, a, w
  const series = [
    { prefix: 'p', gallery: pGallery },
    { prefix: 'a', gallery: aGallery },
    { prefix: 'w', gallery: wGallery }
  ];
  
  for (let s of series) {
    for (let i = 1; i <= 100; i++) {
      const url = `${galleryPath}${s.prefix}${i}.jpg`;
      checkFileExists(url, (exists) => {
        if (exists) {
          const detailUrl = `${galleryPath}d${s.prefix}${i}.jpg`;
          checkFileExists(detailUrl, (hasDetail) => {
            addCardWithCorner(s.gallery, url, hasDetail ? detailUrl : null, `Карта ${s.prefix}${i}`);
          });
        }
      });
    }
  }
  
  console.log('Галерея начала загрузку');
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
  showCrystalOnNextClick = false;
}

function handleBotClick() {
  // Если первый клик (заставка)
  if (botFirstClick) {
    botOpening.style.display = 'none';
    botCrystal.style.display = 'block';
    botOption.style.display = 'block';
    botFirstClick = false;
    
    // Проверяем текущую опцию (первая загруженная)
    const currentOption = botOption.src;
    if (currentOption.includes('bot (23).jpg')) {
      // Принудительно ставим bot crys (9).JPG
      botCrystal.src = 'bot crys (9).JPG';
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = true; // следующий клик сменит кристалл случайно
    } else {
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false;
    }
    return;
  }
  
  // Если опция 23 и ещё не меняли кристалл (первый клик после появления 23)
  if (showCrystalOnNextClick) {
    // Меняем кристалл на случайный, оставляя опцию
    if (botCrystals.length > 0) {
      const randomCrystal = botCrystals[Math.floor(Math.random() * botCrystals.length)];
      botCrystal.src = randomCrystal;
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = false; // сбрасываем, чтобы следующий клик был обычным
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
    
    // Проверяем, является ли новая опция 23
    if (randomOption.includes('bot (23).jpg')) {
      // Если да, ставим bot crys (9).JPG и ставим флаг для следующего клика
      botCrystal.src = 'bot crys (9).JPG';
      botCrystal.style.display = 'block';
      showCrystalOnNextClick = true;
    } else {
      // Иначе показываем случайный кристалл и сбрасываем флаг
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
