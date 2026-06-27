// ========== ГАЛЕРЕЯ (стабильная, с сохранением порядка) ==========

// Функция добавления карты с уголком, если есть детальная версия
function addCardWithCorner(container, imageUrl, detailUrl, alt) {
  const cardDiv = document.createElement('div');
  cardDiv.style.position = 'relative';
  cardDiv.style.display = 'inline-block';
  cardDiv.style.width = '100%';
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = alt;
  img.className = 'card-image';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  
  // Клик для зума
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    fullscreenImg.src = detailUrl || imageUrl;
    fullscreen.classList.remove('hidden');
  });
  
  cardDiv.appendChild(img);
  
  // Если есть детальная версия — добавляем уголок
  if (detailUrl) {
    const cornerImg = document.createElement('img');
    cornerImg.src = 'gallery/corner.jpg';
    cornerImg.alt = 'подробности';
    cornerImg.style.position = 'absolute';
    cornerImg.style.top = '0';
    cornerImg.style.right = '0';
    cornerImg.style.width = '12.5%';
    cornerImg.style.height = 'auto';
    cornerImg.style.pointerEvents = 'none';
    cardDiv.appendChild(cornerImg);
  }
  
  container.appendChild(cardDiv);
}

async function loadGallery() {
  if (!mainGallery || !pGallery || !aGallery || !wGallery) {
    console.error('Элементы галереи не найдены');
    return;
  }
  
  console.log('Загрузка галереи (стабильная)...');
  
  mainGallery.innerHTML = '';
  pGallery.innerHTML = '';
  aGallery.innerHTML = '';
  wGallery.innerHTML = '';
  
  const galleryPath = 'gallery/';
  
  // Проверка существования файла
  const fileExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };
  
  // Загружаем основную галерею (1.jpg, 1a.jpg, 1b.jpg, 1c.jpg)
  for (let i = 1; i <= 200; i++) {
    // Проверяем все варианты для текущего номера параллельно
    const baseUrl = `${galleryPath}${i}.jpg`;
    const aUrl = `${galleryPath}${i}a.jpg`;
    const bUrl = `${galleryPath}${i}b.jpg`;
    const cUrl = `${galleryPath}${i}c.jpg`;
    
    const [hasBase, hasA, hasB, hasC] = await Promise.all([
      fileExists(baseUrl),
      fileExists(aUrl),
      fileExists(bUrl),
      fileExists(cUrl)
    ]);
    
    // Если нет ни одного файла — переходим к следующему номеру (но продолжаем до 200)
    if (!hasBase && !hasA && !hasB && !hasC) {
      continue;
    }
    
    // Добавляем base, если есть
    if (hasBase) {
      const detailUrl = `${galleryPath}d${i}.jpg`;
      const hasDetail = await fileExists(detailUrl);
      addCardWithCorner(mainGallery, baseUrl, hasDetail ? detailUrl : null, `Карта ${i}`);
    }
    
    // Добавляем a, b, c, если есть
    for (let [url, letter] of [[aUrl, 'a'], [bUrl, 'b'], [cUrl, 'c']]) {
      if (await fileExists(url)) {
        const detailUrl = `${galleryPath}d${i}${letter}.jpg`;
        const hasDetail = await fileExists(detailUrl);
        addCardWithCorner(mainGallery, url, hasDetail ? detailUrl : null, `Карта ${i}${letter}`);
      }
    }
  }
  
  // Загружаем серии p, a, w
  const series = [
    { prefix: 'p', gallery: pGallery, max: 100 },
    { prefix: 'a', gallery: aGallery, max: 100 },
    { prefix: 'w', gallery: wGallery, max: 100 }
  ];
  
  for (let s of series) {
    for (let i = 1; i <= s.max; i++) {
      const url = `${galleryPath}${s.prefix}${i}.jpg`;
      const exists = await fileExists(url);
      if (!exists) {
        // Если файл не найден, прекращаем загрузку этой серии (предполагаем, что дальше тоже нет)
        break;
      }
      const detailUrl = `${galleryPath}d${s.prefix}${i}.jpg`;
      const hasDetail = await fileExists(detailUrl);
      addCardWithCorner(s.gallery, url, hasDetail ? detailUrl : null, `Карта ${s.prefix}${i}`);
    }
  }
  
  console.log('Галерея загружена (стабильная)');
  if (pendingHash && pendingHash.startsWith('#gallery-')) {
    handleDeepLink(pendingHash);
    pendingHash = null;
  }
}
