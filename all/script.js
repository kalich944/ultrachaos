const imageContainer = document.getElementById('imageContainer');
const closeButton = document.getElementById('closeButton');

let currentScreen = 'menu';

closeButton.addEventListener('click', function() {
  showMenu();
});

function showMenu() {
  currentScreen = 'menu';
  closeButton.style.display = 'none';
  imageContainer.innerHTML = '';
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `menu (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `Меню ${currentIndex}`;
      
      if (currentIndex === 3) {
        img.addEventListener('click', function() {
          showRules();
        });
        img.style.cursor = 'pointer';
      }
      
      // Оборачиваем каждое изображение в div с классом image-wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';
      wrapper.appendChild(img);
      imageContainer.appendChild(wrapper);
      
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} пунктов меню`);
    };
  }
  
  loadNext();
}

function showRules() {
  currentScreen = 'rules';
  closeButton.style.display = 'block';
  imageContainer.innerHTML = '';
  
  let i = 1;
  
  function loadNext() {
    const img = new Image();
    const currentIndex = i;
    img.src = `rules (${currentIndex}).png`;
    
    img.onload = function() {
      img.alt = `Правило ${currentIndex}`;
      
      // Оборачиваем каждое изображение в div с классом image-wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'image-wrapper';
      wrapper.appendChild(img);
      imageContainer.appendChild(wrapper);
      
      i++;
      loadNext();
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} правил`);
    };
  }
  
  loadNext();
}

showMenu();
