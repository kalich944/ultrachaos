const gallery = document.getElementById('gallery');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

window.Telegram.WebApp.ready();

function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    console.log(`Проверяем: ${url}`);
  });
}

const loadImages = async () => {
  for (let i = 1; i <= 100; i++) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const img = document.createElement('img');
    img.src = `gallery/${i}.jpg`;
    img.alt = `Карта ${i}`;
    img.className = 'card-image';
    img.loading = 'lazy';

    const detailSrc = `gallery/d${i}.jpg`;
    const exists = await checkImageExists(detailSrc);
    console.log(`Карта ${i}: ${detailSrc} существует? ${exists}`);

    if (exists) {
      // Добавляем corner.jpg из папки gallery
      const cornerImg = document.createElement('img');
      cornerImg.src = 'gallery/corner.jpg';
      cornerImg.alt = 'Уголок';
      cornerImg.className = 'corner-image';
      cardContainer.appendChild(cornerImg);

      img.addEventListener('click', () => {
        fullscreenImg.src = detailSrc;
        fullscreen.classList.remove('hidden');
        console.log(`Открыта: ${detailSrc}`);
      });
    }

    img.onerror = () => {
      console.log(`Ошибка загрузки: gallery/${i}.jpg`);
      cardContainer.remove();
    };
    cardContainer.appendChild(img);
    gallery.appendChild(cardContainer);
  }
};

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
  console.log('Полноэкранный режим закрыт');
});

loadImages();