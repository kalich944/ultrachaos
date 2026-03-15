const imageContainer = document.getElementById('imageContainer');

// Текущий экран: 'menu' или 'rules'
let currentScreen = 'menu';

// Показываем меню
function showMenu() {
  currentScreen = 'menu';
  imageContainer.innerHTML = ''; // Очищаем
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i; // Сохраняем текущее значение i для этого изображения
    img.src = `menu (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `Меню ${currentIndex}`;
      
      // Третья картинка ведёт в правила
      if (currentIndex === 3) {
        img.addEventListener('click', function() {
          showRules(); // Вызываем showRules, а не открываем ссылку
        });
        img.style.cursor = 'pointer';
      }
      
      imageContainer.appendChild(img);
      i++;
      loadNext(); // Загружаем следующую
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} пунктов меню`);
    };
  }
  
  loadNext();
}

// Показываем правила
function showRules() {
  console.log('Переход к правилам'); // Для отладки
  currentScreen = 'rules';
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
