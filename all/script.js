const imageContainer = document.getElementById('imageContainer');

function loadImages() {
  let i = 1;
  
  function tryLoadNext() {
    const img = new Image();
    const imgPath = `rules (${i}).png`; // Ищем rules (1).png, rules (2).png...
    
    img.onload = function() {
      img.alt = `Правило ${i}`;
      imageContainer.appendChild(img);
      i++;
      tryLoadNext(); // Загружаем следующий номер
    };
    
    img.onerror = function() {
      console.log(`Загружено ${i-1} правил`);
      // Можно добавить скрытый текст или заглушку, если нужно
    };
    
    img.src = imgPath;
  }
  
  tryLoadNext();
}

loadImages();