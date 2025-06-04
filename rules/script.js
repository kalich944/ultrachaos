const imageContainer = document.getElementById('imageContainer');
// Определяем максимальный номер изображения (настрой под себя)
const maxImageNumber = 10; // Измени на максимальный номер (например, 20, если у тебя 20 изображений)

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