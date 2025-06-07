const imageContainer = document.getElementById('imageContainer');
// Определяем максимальный номер изображения
const maxImageNumber = 10; // Теперь 9 изображений

// Функция для добавления изображений
function loadImages() {
  for (let i = 1; i <= maxImageNumber; i++) {
    const img = document.createElement('img');
    img.src = `${i}.png`; // Путь относительный, так как изображения в той же папке
    img.alt = `Правило ${i}`;
    imageContainer.appendChild(img);
  }
}

// Загружаем изображения при старте
loadImages();
