const imageContainer = document.getElementById('imageContainer');
// Определяем максимальный номер изображения
const maxImageNumber = 12; // Теперь 12 изображений

// Функция для добавления изображений
function loadImages() {
  for (let i = 1; i <= maxImageNumber; i++) {
    const img = document.createElement('img');
    img.src = `${i}.png`; // Путь относительный, так как изображения в той же папке
    img.alt = `Правило ${i}`;
    
    // Добавляем обработчик события для 11-го изображения
    if (i === 11) {
      img.addEventListener('click', () => {
        window.open('https://t.me/UCrules_bot?startapp', '_blank');
      });
      // Меняем курсор, чтобы показать, что изображение кликабельно
      img.style.cursor = 'pointer';
    }
    
    imageContainer.appendChild(img);
  }
}

// Загружаем изображения при старте
loadImages();