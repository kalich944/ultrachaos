const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close');

// Подгружаем карты (1.jpg, 2.jpg и т.д.)
const loadImages = () => {
  // Карты лежат прямо в gallery/
  for (let i = 1; i <= 100; i++) {
    const img = document.createElement('img');
    img.src = `${i}.jpg`;
    img.alt = `Карта ${i}`;
    img.loading = 'lazy';
    img.onerror = () => img.remove(); // Удаляем, если файла нет
    img.onclick = () => {
      modalImage.src = img.src;
      modal.style.display = 'flex';
    };
    gallery.appendChild(img);
  }
};

// Закрытие модального окна
closeModal.onclick = () => {
  modal.style.display = 'none';
};

// Закрытие по клику вне изображения
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

// Загружаем изображения при загрузке страницы
loadImages();