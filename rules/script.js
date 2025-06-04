const ruleImage = document.getElementById('ruleImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Определяем максимальный номер изображения (допустим, 10, настрой под себя)
const maxImageNumber = 10; // Измени на максимальный номер (например, 20, если у тебя 20 изображений)
let currentImage = 1;

// Функция для загрузки изображения
function loadImage(number) {
  const imageUrl = `https://kalich944.github.io/ultrachaos/rules/${number}.png`;
  ruleImage.src = imageUrl;
}

// Обработчики кнопок
prevBtn.addEventListener('click', () => {
  if (currentImage > 1) {
    currentImage--;
    loadImage(currentImage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentImage < maxImageNumber) {
    currentImage++;
    loadImage(currentImage);
  }
});

// Загружаем первое изображение при старте
loadImage(currentImage);