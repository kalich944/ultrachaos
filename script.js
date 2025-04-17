const crystals = Array.from({length: 8}, (_, i) => `c${i+1}.JPG`);
const options = Array.from({length: 19}, (_, i) => `${i+1}.jpg`);

const crystalImg = document.getElementById('crystal');
const optionImg = document.getElementById('option');
const container = document.getElementById('container');

container.addEventListener('click', function() {
  // Скрываем изображения
  crystalImg.classList.add('hidden');
  optionImg.classList.add('hidden');

  // Меняем изображения через 300ms (длительность анимации)
  setTimeout(() => {
    const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
    const randomOption = options[Math.floor(Math.random() * options.length)];
    crystalImg.src = randomCrystal;
    optionImg.src = randomOption;

    // Показываем изображения
    crystalImg.classList.remove('hidden');
    optionImg.classList.remove('hidden');
  }, 300);
});