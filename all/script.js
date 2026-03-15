const imageContainer = document.getElementById('imageContainer');

function loadImages() {
  let i = 1;
  
  function tryLoadNext() {
    const img = new Image();
    const imgPath = `menu (${i}).png`; // Ищем menu (1).png, menu (2).png и т.д.
    
    img.onload = function() {
      img.alt = `Меню ${i}`;
      
      // Добавляем обработчик клика только для ТРЕТЬЕГО изображения (i === 3)
      if (i === 3) {
        img.addEventListener('click', () => {
          window.open('https://kalich944.github.io/ultrachaos/all/rules/', '_blank');
        });
        img.style.cursor = 'pointer'; // Меняем курсор, чтобы было видно, что это ссылка
      }
      
      imageContainer.appendChild(img);
      i++;
      tryLoadNext(); // Пробуем загрузить следующее
    };
    
    img.onerror = function() {
      // Как только картинка не нашлась, прекращаем
      console.log(`Загружено ${i-1} изображений меню`);
    };
    
    img.src = imgPath;
  }
  
  tryLoadNext();
}

loadImages();