const imageContainer = document.getElementById('imageContainer');
// Определяем максимальный номер изображения
const maxImageNumber = 9; // Теперь 9 изображений

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

// --- Добавленный код для прокрутки к конкретному изображению ---
// Получаем параметр startapp из URL
const urlParams = new URLSearchParams(window.location.search);
const startapp = urlParams.get('startapp'); // например, "3"

if (startapp) {
  // Пытаемся преобразовать в число
  const imageNumber = parseInt(startapp, 10);
  // Проверяем, что это число и в допустимом диапазоне
  if (!isNaN(imageNumber) && imageNumber >= 1 && imageNumber <= maxImageNumber) {
    // Индекс в DOM (нумерация с 0)
    const index = imageNumber - 1;
    // Получаем все изображения внутри контейнера
    const images = imageContainer.querySelectorAll('img');
    if (images.length > index) {
      const targetImage = images[index];
      // Плавная прокрутка к элементу
      targetImage.scrollIntoView({ behavior: 'smooth' });
    }
  }
}