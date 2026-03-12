const imageContainer = document.getElementById('imageContainer');
const maxImageNumber = 9; // количество изображений

// Функция загрузки всех изображений, возвращает Promise, который резолвится, когда все img загружены
function loadImages() {
  const promises = [];
  for (let i = 1; i <= maxImageNumber; i++) {
    const img = document.createElement('img');
    img.src = `${i}.png`;
    img.alt = `Правило ${i}`;
    imageContainer.appendChild(img);

    // Создаём промис на загрузку каждого изображения
    const promise = new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = resolve;
        img.onerror = resolve; // даже если ошибка, продолжаем (чтобы не зависнуть)
      }
    });
    promises.push(promise);
  }
  return Promise.all(promises);
}

// Стартуем загрузку и после полной отрисовки проверяем параметр
loadImages().then(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const startapp = urlParams.get('startapp'); // например, "3"

  if (startapp) {
    const imageNumber = parseInt(startapp, 10);
    if (!isNaN(imageNumber) && imageNumber >= 1 && imageNumber <= maxImageNumber) {
      const images = imageContainer.querySelectorAll('img');
      const targetImage = images[imageNumber - 1];
      if (targetImage) {
        // Мгновенная прокрутка (без анимации)
        targetImage.scrollIntoView({ block: 'start' });
      }
    }
  }
});