const crystals = Array.from({length: 8}, (_, i) => `c${i+1}.JPG`);
const options = Array.from({length: 19}, (_, i) => `${i+1}.jpg`);

document.getElementById('container').addEventListener('click', function() {
  const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
  const randomOption = options[Math.floor(Math.random() * options.length)];
  document.getElementById('crystal').src = randomCrystal;
  document.getElementById('option').src = randomOption;
});