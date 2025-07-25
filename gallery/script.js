const gallery = document.getElementById('gallery');
const pGallery = document.getElementById('p-gallery');
const aGallery = document.getElementById('a-gallery');
const wGallery = document.getElementById('w-gallery');
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

async function loadMainGallery() {
  for (let i = 1; i <= 200; i++) {
    const baseUrl = `${i}.jpg`;
    if (await checkImageExists(baseUrl)) {
      createCard(baseUrl, `d${i}.jpg`, gallery);
    }
    for (let letter of ['a', 'b', 'c']) {
      const variantUrl = `${i}${letter}.jpg`;
      if (await checkImageExists(variantUrl)) {
        createCard(variantUrl, `d${i}${letter}.jpg`, gallery);
      } else {
        break;
      }
    }
  }
}

function createCard(url, detailUrl, parentGallery) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';

  const img = document.createElement('img');
  img.src = url;
  img.alt = `Карта`;
  img.className = 'card-image';
  img.loading = 'lazy';

  checkImageExists(detailUrl).then((exists) => {
    if (exists) {
      const cornerImg = document.createElement('img');
      cornerImg.src = 'corner.jpg';
      cornerImg.alt = 'Уголок';
      cornerImg.className = 'corner-image';
      cardContainer.appendChild(cornerImg);

      img.addEventListener('click', () => {
        fullscreenImg.src = detailUrl;
        fullscreen.classList.remove('hidden');
      });
    }
  });

  img.onerror = () => cardContainer.remove();
  cardContainer.appendChild(img);
  parentGallery.appendChild(cardContainer);
}

async function loadSeriesGallery(prefix, galleryId) {
  const seriesGallery = document.getElementById(galleryId);
  for (let i = 1; i <= 100; i++) {
    const url = `${prefix}${i}.jpg`;
    const detailUrl = `d${prefix}${i}.jpg`;
    if (await checkImageExists(url)) {
      createCard(url, detailUrl, seriesGallery);
    } else {
      break;
    }
  }
}

loadMainGallery();
loadSeriesGallery('p', 'p-gallery');
loadSeriesGallery('a', 'a-gallery');
loadSeriesGallery('w', 'w-gallery');

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});
