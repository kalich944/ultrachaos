const crystals = Array.from({length: 8}, (_, i) => `c${i+1}.JPG`);
const options = Array.from({length: 20}, (_, i) => `${i+1}.jpg`);

// Инициализация Telegram Mini App
window.Telegram.WebApp.ready();

// Проверяем, принял ли пользователь условия
const hasAcceptedTerms = localStorage.getItem('ultrachaos_terms_accepted');
if (!hasAcceptedTerms) {
  localStorage.setItem('ultrachaos_terms_accepted', 'true');
  console.log('Terms accepted');
}

document.getElementById('container').addEventListener('click', function() {
  const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
  const randomOption = options[Math.floor(Math.random() * options.length)];
  document.getElementById('crystal').src = randomCrystal;
  document.getElementById('option').src = randomOption;
});