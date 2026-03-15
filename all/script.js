const imageContainer = document.getElementById('imageContainer');
const closeButton = document.getElementById('closeButton');

// Текущий экран: 'menu' или 'rules'
let currentScreen = 'menu';

// Обработчик для крестика
closeButton.addEventListener('click', function() {
  showMenu();
});

// Показываем меню
function showMenu() {
  currentScreen = 'menu';
  closeButton.style.display = 'none'; // Прячем крестик в меню
  imageContainer.innerHTML = ''; // Очищаем
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `menu (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `Меню ${currentIndex}`;
      
      // Третья картинка ведёт в правила
      if (currentIndex === 3) {
        img.addEventListener('click', function() {
          showRules();
        });
        img.style.cursor = 'pointer';
      }
      
      imageContainer.appendChild(img);
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} пунктов меню`);
    };
  }
  
  loadNext();
}

// Показываем правила
function showRules() {
  console.log('Переход к правилам');
  currentScreen = 'rules';
  closeButton.style.display = 'block'; // Показываем крестик
  imageContainer.innerHTML = ''; // Очищаем
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `rules (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `Правило ${currentIndex}`;
      imageContainer.appendChild(img);
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} правил`);
    };
  }
  
  loadNext();
}

// Запускаем меню
showMenu();
