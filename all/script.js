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
    img.src = `menu (${i}).png`;
    
    img.onload = function() {
      img.alt = `Меню ${i}`;
      
      // Третья картинка ведёт в правила
      if (i === 3) {
        img.addEventListener('click', showRules);
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
  currentScreen = 'rules';
  imageContainer.innerHTML = ''; // Очищаем
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    img.src = `rules (${i}).png`;
    
    img.onload = function() {
      img.alt = `Правило ${i}`;
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
