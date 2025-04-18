const cards = Array.from({length: 20}, (_, i) => i + 1);
const gallery = document.getElementById('gallery');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

// Инициализация Telegram Mini App
window.Telegram.WebApp.ready();

// Проверка существования файла
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Создание галереи
cards.forEach(async (num) => {
  const card = document.createElement('div');
  card.className = 'card';
  const img = document.createElement('img');
  img.src = `${num}.jpg`;
  img.alt = `Карта ${num}`;
  card.appendChild(img);

  // Проверяем наличие dN.jpg
  const detailImage = `d${num}.jpg`;
  const exists = await checkImageExists(detailImage);
  console.log(`Карта ${num}: d${num}.jpg существует? ${exists}`);

  if (exists) {
    card.addEventListener('click', () => {
      fullscreenImg.src = detailImage;
      fullscreen.classList.remove('hidden');
    });
  } else {
    card.className = 'card disabled';
  }

  gallery.appendChild(card);
});

// Закрытие полноэкранного изображения
fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});