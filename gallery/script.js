const gallery = document.getElementById('gallery');

// Подгружаем карты (1.jpg, 2.jpg и т.д.)
const loadImages = () => {
  for (let i = 1; i <= 100; i++) {
    const img = document.createElement('img');
    img.src = `${i}.jpg`;
    img.alt = `Карта ${i}`;
    img.loading = 'lazy';
    img.onerror = () => img.remove(); // Удаляем, если файла нет
    gallery.appendChild(img);
  }
};

// Загружаем изображения при загрузке страницы
loadImages();