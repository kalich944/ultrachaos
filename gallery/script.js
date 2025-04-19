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
  });
}

const loadImages = async () => {
  for (let i = 1; i <= 100; i++) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const img = document.createElement('img');
    img.src = `${i}.jpg`;
    img.alt = `Карта ${i}`;
    img.loading = 'lazy';

    const detailSrc = `d${i}.jpg`;
    const exists = await checkImageExists(detailSrc);

    if (exists) {
      img.addEventListener('click', () => {
        fullscreenImg.src = detailSrc;
        fullscreen.classList.remove('hidden');
      });

      const corner = document.createElement('img');
      corner.src = 'corner.jpg';
      corner.alt = 'Уголок';
      corner.className = 'corner-icon';
      cardWrapper.appendChild(corner);
    }

    img.onerror = () => cardWrapper.remove();
    cardWrapper.appendChild(img);
    gallery.appendChild(cardWrapper);
  }
};

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});

loadImages();
