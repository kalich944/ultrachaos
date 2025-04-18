const cards = Array.from({ length: 20 }, (_, i) => i + 1);
const gallery = document.getElementById('gallery');
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreen-img');

window.Telegram.WebApp.ready();

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
  });
}

cards.forEach(async (num) => {
  const card = document.createElement('div');
  card.className = 'card';
  const img = document.createElement('img');
  img.src = `${num}.jpg`; // Картинки в этой же папке
  img.alt = `Карта ${num}`;
  card.appendChild(img);

  const detailImage = `d${num}.jpg`;
  const exists = await checkImageExists(detailImage);

  if (exists) {
    card.addEventListener('click', () => {
      checkImageExists(detailImage).then((stillExists) => {
        if (stillExists) {
          fullscreenImg.src = detailImage;
          fullscreen.classList.remove('hidden');
        }
      });
    });
  } else {
    card.classList.add('disabled');
  }

  gallery.appendChild(card);
});

fullscreen.addEventListener('click', () => {
  fullscreen.classList.add('hidden');
  fullscreenImg.src = '';
});
