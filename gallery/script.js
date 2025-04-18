const cards = Array.from({ length: 20 }, (_, i) => i + 1);
const gallery = document.getElementById('gallery');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

// Инициализация Telegram Mini App
window.Telegram.WebApp.ready();

// Проверка существования файла с таймаутом
function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => resolve(false), 5000);
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = url;
    console.log(`Проверяем: ${url}`);
  });
}

// Создание галереи
cards.forEach(async (num) => {
  const card = document.createElement('div');
  card.className = 'card';
  const img = document.createElement('img');
  img.src = `gallery/${num}.jpg`; // <== исправлено
  img.alt = `Карта ${num}`;
  card.appendChild(img);

  const detailImage = `gallery/d${num}.jpg`; // <== исправлено
  const exists = await checkImageExists(detailImage);
  console.log(`Карта ${num}: ${detailImage} существует? ${exists}`);

  if (exists) {
    card.addEventListener('click', () => {
      checkImageExists(detailImage).then((stillExists) => {
        if (stillExists) {
          fullscreenImg.src = detailImage;
          fullscreen.classList.remove('hidden');
          console.log(`Открыта: ${detailImage}`);
        } else {
          console.log(`Ошибка: ${detailImage} не найдена при клике`);
        }
      });
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
  console.log('Полноэкранный режим закрыт');
});
