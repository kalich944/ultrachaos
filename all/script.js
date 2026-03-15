// Экраны
const menuScreen = document.getElementById('menu-screen');
const rulesScreen = document.getElementById('rules-screen');
const botScreen = document.getElementById('bot-screen');
const closeButton = document.getElementById('closeButton');

// Контейнеры для изображений
const imageContainer = document.getElementById('imageContainer');
const rulesContainer = document.getElementById('rulesContainer');
const botContainer = document.getElementById('botContainer');

// Текущий экран
let currentScreen = 'menu';

// ========== УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЗАГРУЗКИ ==========
function loadImages(container, baseName, startNumber = 1, onClick = null) {
  container.innerHTML = ''; // Очищаем
  
  let i = startNumber;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `${baseName} (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `${baseName} ${currentIndex}`;
      
      // Если передана функция-обработчик клика
      if (onClick && onClick(currentIndex)) {
        img.addEventListener('click', onClick(currentIndex));
        img.style.cursor = 'pointer';
      }
      
      container.appendChild(img);
      i++;
      loadNext(); // Загружаем следующее
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-startNumber} изображений ${baseName}`);
    };
  }
  
  loadNext();
}

// ========== СПЕЦИАЛЬНАЯ ЗАГРУЗКА ДЛЯ БОТА ==========
function loadBotImages() {
  botContainer.innerHTML = '';
  
  // Сначала загружаем bot open.jpg
  const openImg = new Image();
  openImg.src = 'bot open.jpg';
  openImg.onload = function() {
    openImg.style.width = '100%';
    openImg.style.height = 'auto';
    openImg.style.display = 'block';
    botContainer.appendChild(openImg);
    
    // Затем пробуем загрузить bot crys (1).jpg, bot crys (2).jpg...
    let i = 1;
    
    function loadNextCrystal() {
      const crystalImg = new Image();
      crystalImg.src = `bot crys (${i}).jpg`;
      
      crystalImg.onload = function() {
        crystalImg.style.width = '100%';
        crystalImg.style.height = 'auto';
        crystalImg.style.display = 'block';
        botContainer.appendChild(crystalImg);
        i++;
        loadNextCrystal();
      };
      
      crystalImg.onerror = function() {
        console.log(`Загружено ${i-1} кристаллов`);
        
        // После кристаллов загружаем bot (1).jpg, bot (2).jpg...
        let j = 1;
        
        function loadNextOption() {
          const optionImg = new Image();
          optionImg.src = `bot (${j}).jpg`;
          
          optionImg.onload = function() {
            optionImg.style.width = '100%';
            optionImg.style.height = 'auto';
            optionImg.style.display = 'block';
            botContainer.appendChild(optionImg);
            j++;
            loadNextOption();
          };
          
          optionImg.onerror = function() {
            console.log(`Загружено ${j-1} опций боя`);
          };
        }
        
        loadNextOption();
      };
    }
    
    loadNextCrystal();
  };
}

// ========== ПОКАЗ ЭКРАНОВ ==========
function showMenu() {
  currentScreen = 'menu';
  menuScreen.style.display = 'block';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'none';
  closeButton.style.display = 'none';
  
  // Загружаем меню: menu (1).png, menu (2).png...
  loadImages(imageContainer, 'menu', 1, function(index) {
    if (index === 3) return function() { showRules(); };
    if (index === 4) return function() { showBot(); };
    return null;
  });
}

function showRules() {
  currentScreen = 'rules';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'block';
  botScreen.style.display = 'none';
  closeButton.style.display = 'block';
  
  // Загружаем правила: rules (1).png, rules (2).png...
  loadImages(rulesContainer, 'rules');
}

function showBot() {
  currentScreen = 'bot';
  menuScreen.style.display = 'none';
  rulesScreen.style.display = 'none';
  botScreen.style.display = 'block';
  closeButton.style.display = 'block';
  
  // Загружаем бота
  loadBotImages();
}

// ========== КРЕСТИК ==========
closeButton.addEventListener('click', showMenu);

// ========== СТАРТ ==========
showMenu();
