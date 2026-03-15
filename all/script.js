const imageContainer = document.getElementById('imageContainer');

// Функция для добавления изображений
async function loadImages() {
  let i = 1;
  let hasMoreImages = true;
  
  while (hasMoreImages) {
    // Пробуем загрузить изображение menu (i).png
    const imgPath = `all/menu (${i}).png`;
    
    try {
      // Создаём объект Image для проверки существования файла
      const img = new Image();
      
      // Ждём, пока загрузится или вызовет ошибку
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgPath;
      });
      
      // Если успешно — добавляем на страницу
      img.alt = `Меню ${i}`;
      imageContainer.appendChild(img);
      
      i++; // Переходим к следующему номеру
      
    } catch (error) {
      // Если изображение не нашлось — останавливаем цикл
      hasMoreImages = false;
    }
  }
}

// Загружаем изображения при старте
loadImages();