const crystals = Array.from({length: 8}, (_, i) => `c${i+1}.JPG`);
const options = Array.from({length: 20}, (_, i) => `${i+1}.jpg`);

const container = document.getElementById('container');
const openingScreen = document.getElementById('opening-screen');
const crystalImg = document.getElementById('crystal');
const optionImg = document.getElementById('option');

let isFirstClick = true;

container.addEventListener('click', function() {
  if (isFirstClick) {
    // Первый клик: скрываем начальный экран, показываем кристалл и опцию
    openingScreen.style.display = 'none';
    crystalImg.style.display = 'block';
    optionImg.style.display = 'block';
    isFirstClick = false;
  }
  // Меняем кристалл и опцию (включая первый клик)
  const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
  const randomOption = options[Math.floor(Math.random() * options.length)];
  crystalImg.src = randomCrystal;
  optionImg.src = randomOption;
});