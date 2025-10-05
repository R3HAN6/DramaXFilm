tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'loading-dots': 'loadingDots 1.4s infinite ease-in-out both',
        'loading-ripple': 'loadingRipple 1.2s infinite ease-in-out',
        'bounce-in': 'bounceIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' }
        },
        loadingRipple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#2563eb',
        'accent': '#8b5cf6',
        'dark': '#0f172a',
        'dark-lighter': '#1e293b',
        'dark-lightest': '#334155',
      }
    }
  }
}

const proxyOptions = [
  "https://api.allorigins.win/raw?url=",
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.codetabs.com/v1/proxy?quest="
];

let currentProxyIndex = 0;
let currentSlide = 0;
let sliderInterval;
let sliderData = [];
let selectedEpisode = 1;

// DOM elements
const homeView = document.getElementById('homeView');
const searchView = document.getElementById('searchView');
const playerView = document.getElementById('playerView');
const searchResults = document.getElementById('searchResults');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const backBtn = document.getElementById('backBtn');
const episodeGrid = document.getElementById('episodeGrid');
const episodeCount = document.getElementById('episodeCount');
const mainPlayer = document.getElementById('mainPlayer');
const qualityBtn = document.getElementById('qualityBtn');
const qualityDropdown = document.getElementById('qualityDropdown');
const qualityOptions = document.getElementById('qualityOptions');
const currentQualityText = document.getElementById('currentQualityText');
const shareBtn = document.getElementById('shareBtn');
const protagonist = document.getElementById('protagonist');
const year = document.getElementById('year');
const qualityContainer = document.getElementById('qualityContainer');
const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const categoriesContainer = document.getElementById('categoriesContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const sliderInfoBtn = document.getElementById('sliderInfoBtn');
const developerModal = document.getElementById('developerModal');
const closeDeveloperModal = document.getElementById('closeDeveloperModal');

const videoContainer = document.getElementById('videoContainer');
const videoLoadingState = document.getElementById('videoLoadingState');
const videoErrorState = document.getElementById('videoErrorState');
const videoControlsOverlay = document.getElementById('videoControlsOverlay');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const retryVideoBtn = document.getElementById('retryVideoBtn');
const reportVideoBtn = document.getElementById('reportVideoBtn');

let currentBookId = null;
let currentDramaData = null;
let currentEpisodeData = null;
let currentQuality = '1080';
let availableQualities = [];
let apiDramas = [];
let categories = ['Romance', 'Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller'];
let isCategorySearch = false;
let videoRetryCount = 0;
const maxVideoRetries = 3;

// Utility functions
function showLoading() {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// FIXED Mobile menu functions
function openMobileMenu() {
  mobileMenu.classList.add('active');
  mobileMenuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenuFunc() {
  mobileMenu.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  openMobileMenu();
});

closeMobileMenu.addEventListener('click', (e) => {
  e.stopPropagation();
  closeMobileMenuFunc();
});

mobileMenuOverlay.addEventListener('click', (e) => {
  e.stopPropagation();
  closeMobileMenuFunc();
});

// Close mobile menu when clicking on menu items
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenuFunc();
  });
});

sliderInfoBtn.addEventListener('click', () => {
  developerModal.classList.remove('hidden');
});

closeDeveloperModal.addEventListener('click', () => {
  developerModal.classList.add('hidden');
});

developerModal.addEventListener('click', (e) => {
  if (e.target === developerModal) {
    developerModal.classList.add('hidden');
  }
});

qualityBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  qualityDropdown.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!qualityBtn.contains(e.target) && !qualityDropdown.contains(e.target)) {
    qualityDropdown.classList.add('hidden');
  }
});

// Quality selection functions
function populateQualityOptions(qualities) {
  qualityOptions.innerHTML = '';
  
  if (!qualities || qualities.length === 0) {
    qualities = ['1080', '720', '540'];
  }
  
  qualities.sort((a, b) => parseInt(b) - parseInt(a));
  
  qualities.forEach(quality => {
    const option = document.createElement('div');
    option.className = 'quality-option px-3 py-2 cursor-pointer hover:bg-slate-700 transition-all flex items-center justify-between';
    option.dataset.quality = quality;
    
    const qualityLabel = document.createElement('span');
    qualityLabel.textContent = `${quality}p`;
    
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fas fa-check text-blue-500 text-xs';
    checkIcon.style.display = quality === currentQuality ? 'block' : 'none';
    
    option.appendChild(qualityLabel);
    option.appendChild(checkIcon);
    
    option.addEventListener('click', () => {
      changeVideoQuality(quality);
      qualityDropdown.classList.add('hidden');
    });
    
    qualityOptions.appendChild(option);
  });
}

function updateQualitySelection(quality) {
  document.querySelectorAll('.quality-option').forEach(option => {
    const checkIcon = option.querySelector('.fa-check');
    if (option.dataset.quality === quality) {
      option.classList.add('bg-slate-700');
      checkIcon.style.display = 'block';
    } else {
      option.classList.remove('bg-slate-700');
      checkIcon.style.display = 'none';
    }
  });
}

// Video player functions
function showVideoLoading() {
  videoLoadingState.classList.remove('hidden');
  videoErrorState.classList.add('hidden');
  mainPlayer.style.display = 'none';
  videoControlsOverlay.style.display = 'none';
}

function showVideoError(message = 'Video tidak dapat diputar') {
  videoLoadingState.classList.add('hidden');
  videoErrorState.classList.remove('hidden');
  mainPlayer.style.display = 'none';
  videoControlsOverlay.style.display = 'none';
  console.error('Video error:', message);
}

function showVideoPlayer() {
  videoLoadingState.classList.add('hidden');
  videoErrorState.classList.add('hidden');
  mainPlayer.style.display = 'block';
  videoControlsOverlay.style.display = 'block';
}

function loadVideoWithFallback(videoUrl, posterUrl = null) {
  showVideoLoading();
  videoRetryCount = 0;
  
  if (posterUrl) {
    mainPlayer.poster = posterUrl;
  }
  
  mainPlayer.innerHTML = '';
  mainPlayer.load();
  
  attemptVideoLoad(videoUrl);
}

function attemptVideoLoad(videoUrl) {
  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = getVideoMimeType(videoUrl);
  mainPlayer.appendChild(source);
  
  mainPlayer.load();
  
  mainPlayer.addEventListener('loadstart', handleVideoLoadStart, { once: true });
  mainPlayer.addEventListener('canplay', handleVideoCanPlay, { once: true });
  mainPlayer.addEventListener('error', handleVideoError, { once: true });
}

function handleVideoLoadStart() {
  showVideoLoading();
}

function handleVideoCanPlay() {
  showVideoPlayer();
  mainPlayer.play().catch(err => {
    console.log('Autoplay prevented:', err);
  });
}

function handleVideoError(e) {
  console.error('Video error:', e);
  videoRetryCount++;
  
  if (videoRetryCount < maxVideoRetries) {
    setTimeout(() => {
      retryVideoLoad();
    }, 1000 * videoRetryCount);
  } else {
    showVideoError('Gagal memuat video setelah beberapa percobaan');
  }
}

function retryVideoLoad() {
  if (!currentEpisodeData || !currentEpisodeData.videos) return;
  
  const currentIndex = availableQualities.indexOf(currentQuality);
  const nextIndex = (currentIndex + 1) % availableQualities.length;
  const nextQuality = availableQualities[nextIndex];
  
  const video = currentEpisodeData.videos.find(v => v.quality == nextQuality);
  if (video) {
    currentQuality = nextQuality;
    currentQualityText.textContent = nextQuality + 'p';
    updateQualitySelection(nextQuality);
    
    const proxyUrl = proxyOptions[currentProxyIndex] + encodeURIComponent(video.videoPath);
    attemptVideoLoad(proxyUrl);
  }
}

function getVideoMimeType(url) {
  const extension = url.split('.').pop().toLowerCase();
  const mimeTypes = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'm3u8': 'application/x-mpegURL',
    'mkv': 'video/x-matroska'
  };
  return mimeTypes[extension] || 'video/mp4';
}

function changeVideoQuality(quality) {
  if (!currentEpisodeData || !currentEpisodeData.videos) return;
  
  const video = currentEpisodeData.videos.find(v => v.quality == quality);
  if (video) {
    const currentTime = mainPlayer.currentTime;
    const wasPlaying = !mainPlayer.paused;
    
    loadVideoWithFallback(video.videoPath);
    
    mainPlayer.addEventListener('canplay', () => {
      mainPlayer.currentTime = currentTime;
      if (wasPlaying) {
        mainPlayer.play();
      }
    }, { once: true });
    
    currentQuality = quality;
    currentQualityText.textContent = quality + 'p';
    updateQualitySelection(quality);
  }
}

// Video controls event listeners
playPauseBtn.addEventListener('click', () => {
  if (mainPlayer.paused) {
    mainPlayer.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
  } else {
    mainPlayer.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play text-xl"></i>';
  }
});

mainPlayer.addEventListener('play', () => {
  playPauseBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
});

mainPlayer.addEventListener('pause', () => {
  playPauseBtn.innerHTML = '<i class="fas fa-play text-xl"></i>';
});

mainPlayer.addEventListener('timeupdate', () => {
  const current = mainPlayer.currentTime;
  const total = mainPlayer.duration;
  
  if (!isNaN(total)) {
    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(total);
    progressBar.style.width = `${(current / total) * 100}%`;
  }
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  if (mainPlayer.duration) {
    mainPlayer.currentTime = pos * mainPlayer.duration;
  }
});

volumeBtn.addEventListener('click', () => {
  if (mainPlayer.muted) {
    mainPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up text-xl"></i>';
  } else {
    mainPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute text-xl"></i>';
  }
});

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
    fullscreenBtn.innerHTML = '<i class="fas fa-compress text-xl"></i>';
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<i class="fas fa-expand text-xl"></i>';
  }
});

retryVideoBtn.addEventListener('click', () => {
  if (currentEpisodeData && currentEpisodeData.videos) {
    videoRetryCount = 0;
    const video = currentEpisodeData.videos.find(v => v.quality == currentQuality);
    if (video) {
      loadVideoWithFallback(video.videoPath);
    }
  }
});

reportVideoBtn.addEventListener('click', () => {
  showNotification('Terima kasih atas laporan Anda. Kami akan segera memeriksanya.', 'info');
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-4 glass px-6 py-4 rounded-lg z-50 notification-enter ${
    type === 'error' ? 'text-red-300' : 
    type === 'warning' ? 'text-yellow-300' : 
    'text-green-300'
  }`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="fas ${
        type === 'error' ? 'fa-exclamation-circle' : 
        type === 'warning' ? 'fa-exclamation-triangle' : 
        'fa-info-circle'
      } text-xl"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// API functions
async function tryFetch(url, useProxy = true) {
  try {
    const response = await fetch(url);
    return response;
  } catch (error) {
    if (useProxy) {
      for (let i = 0; i < proxyOptions.length; i++) {
        try {
          const proxyUrl = proxyOptions[i] + encodeURIComponent(url);
          const response = await fetch(proxyUrl);
          currentProxyIndex = i;
          return response;
        } catch (error) {
          continue;
        }
      }
    }
  }
  
  throw new Error('All fetch attempts failed');
}

function getProxyImageUrl(originalUrl) {
  return proxyOptions[currentProxyIndex] + encodeURIComponent(originalUrl);
}

async function loadImageWithFallback(imgElement, originalUrl) {
  imgElement.src = getProxyImageUrl(originalUrl);
  
  imgElement.onerror = async function() {
    for (let i = 0; i < proxyOptions.length; i++) {
      if (i === currentProxyIndex) continue;
      
      try {
        const testImg = new Image();
        testImg.src = proxyOptions[i] + encodeURIComponent(originalUrl);
        
        await new Promise((resolve, reject) => {
          testImg.onload = resolve;
          testImg.onerror = reject;
          setTimeout(reject, 3000);
        });
        
        currentProxyIndex = i;
        imgElement.src = proxyOptions[i] + encodeURIComponent(originalUrl);
        return;
      } catch (e) {
        continue;
      }
    }
    
    imgElement.src = `https://picsum.photos/seed/${originalUrl.split('/').pop()}/300/450.jpg`;
  };
}

// Slider functions
function initSlider(data) {
  sliderData = data.slice(0, 5);
  renderSlider();
  startAutoSlide();
}

function renderSlider() {
  sliderTrack.innerHTML = '';
  sliderDots.innerHTML = '';
  
  sliderData.forEach((drama, index) => {
    const slide = document.createElement('div');
    slide.className = 'min-w-full relative';
    slide.innerHTML = `
      <img src="" alt="${drama.bookName}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      <div class="absolute bottom-0 left-0 p-4 md:p-8">
        <h2 class="text-xl md:text-2xl lg:text-3xl font-bold mb-2">${drama.bookName}</h2>
        <p class="text-sm md:text-lg text-gray-300 mb-4 line-clamp-2">${drama.introduction || 'Temukan drama terpopuler dan terbaru hanya di DramaBox'}</p>
        <div class="flex flex-wrap gap-3">
          <button class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all flex items-center gap-2 transform hover:scale-105 pulse-button" onclick="showPlayerView('${drama.bookId}', '${drama.bookName}', '${drama.coverWap}', {chapterCount: ${drama.chapterCount || 0}})">
            <i class="fas fa-play"></i>Mulai Menonton
          </button>
          <button class="glass border border-white hover:bg-white hover:text-black px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all flex items-center gap-2 pulse-button" onclick="followDrama('${drama.bookId}')">
            <i class="fas fa-user-plus"></i>Follow Me
          </button>
        </div>
      </div>
    `;
    sliderTrack.appendChild(slide);
    
    const imgElement = slide.querySelector('img');
    loadImageWithFallback(imgElement, drama.coverWap);
    
    const dot = document.createElement('div');
    dot.className = `w-3 h-3 rounded-full bg-white/30 cursor-pointer transition-all ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8 rounded-full' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    sliderDots.appendChild(dot);
  });
}

function followDrama(dramaId) {
  showLoading();
  setTimeout(() => {
    showNotification(`Anda mengikuti drama ini!`, 'info');
    hideLoading();
  }, 500);
}
function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}
function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll('#sliderDots > div').forEach((dot, index) => {
  if (index === currentSlide) {
    dot.className = `
      w-4 h-4 rounded-full 
      border-[3px] border-transparent 
      bg-[rgb(255,60,60)] 
      shadow-[0_0_8px_rgb(255,60,60,0.7)] 
      transition-all duration-300
    `;
  } else {
    dot.className = `
      w-3 h-3 rounded-full 
      border-[2px] border-[rgb(255,60,60,0.4)] 
      bg-transparent 
      transition-all duration-300
    `;
  }
});
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % sliderData.length;
  updateSlider();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + sliderData.length) % sliderData.length;
  updateSlider();
}

function startAutoSlide() {
  sliderInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(sliderInterval);
}

sliderPrev.addEventListener('click', () => {
  prevSlide();
  stopAutoSlide();
  startAutoSlide();
});

sliderNext.addEventListener('click', () => {
  nextSlide();
  stopAutoSlide();
  startAutoSlide();
});

sliderTrack.addEventListener('mouseenter', stopAutoSlide);
sliderTrack.addEventListener('mouseleave', startAutoSlide);

// Categories functions
function initCategories() {
  categoriesContainer.innerHTML = '';
  
  categories.forEach(category => {
    const categoryTag = document.createElement('button');
    categoryTag.className = 'glass hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105';
    categoryTag.textContent = category;
    categoryTag.addEventListener('click', () => {
      showLoading();
      setTimeout(() => {
        isCategorySearch = true;
        searchDrama(category);
      }, 300);
    });
    categoriesContainer.appendChild(categoryTag);
  });
}

// Home data loading
async function loadHomeData() {
  showLoading();
  
  try {
    const apiUrl = `https://api-dramabox.vercel.app/api/dramabox/home`;
    const res = await tryFetch(apiUrl);
    
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();
    
    if (data.data && data.data.columnVoList) {
      const firstColumn = data.data.columnVoList[0];
      if (firstColumn && firstColumn.bookList) {
        initSlider(firstColumn.bookList);
        createDramaCards('latestDramas', firstColumn.bookList);
      }
      
      if (data.data.columnVoList.length > 1) {
        const secondColumn = data.data.columnVoList[1];
        if (secondColumn && secondColumn.bookList) {
          createDramaCards('popularDramas', secondColumn.bookList);
        }
      }
      
      if (data.data.columnVoList.length > 2) {
        const thirdColumn = data.data.columnVoList[2];
        if (thirdColumn && thirdColumn.bookList) {
          const additionalSection = document.createElement('section');
          additionalSection.className = 'mb-10';
          additionalSection.innerHTML = `
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-2xl md:text-3xl font-bold">Rekomendasi Lainnya</h2>
              <button class="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2">
                <span>Lihat Semua</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
            <div id="additionalDramas" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"></div>
          `;
          homeView.appendChild(additionalSection);
          createDramaCards('additionalDramas', thirdColumn.bookList);
        }
      }
    }
    
    hideLoading();
  } catch (err) {
    console.error('Failed to load home data:', err);
    loadFallbackDramas();
    hideLoading();
  }
}

function loadFallbackDramas() {
  const fallbackDramas = [
    { bookId: '1', bookName: 'The Hacker\'s Revenge', coverWap: 'https://picsum.photos/seed/drama1/300/450.jpg', chapterCount: 10 },
    { bookId: '2', bookName: 'Love in Seoul', coverWap: 'https://picsum.photos/seed/drama2/300/450.jpg', chapterCount: 15 },
    { bookId: '3', bookName: 'CEO\'s Secret', coverWap: 'https://picsum.photos/seed/drama3/300/450.jpg', chapterCount: 20 },
    { bookId: '4', bookName: 'Sweet Revenge', coverWap: 'https://picsum.photos/seed/drama4/300/450.jpg', chapterCount: 12 },
    { bookId: '5', bookName: 'My Destiny', coverWap: 'https://picsum.photos/seed/drama5/300/450.jpg', chapterCount: 8 }
  ];
  
  initSlider(fallbackDramas);
  createDramaCards('latestDramas', fallbackDramas);
  createDramaCards('popularDramas', fallbackDramas);
}

function createDramaCards(containerId, dramas) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (dramas.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-center col-span-full">Tidak ada drama tersedia</div>';
    return;
  }
  
  dramas.forEach((drama, index) => {
    const card = document.createElement('div');
    card.className = 'drama-card glass rounded-xl overflow-hidden cursor-pointer';
    card.dataset.bookId = drama.bookId;
    card.dataset.bookName = drama.bookName;
    card.dataset.cover = drama.coverWap;
    card.dataset.chapterCount = drama.chapterCount || 0;
    
    card.innerHTML = `
      <div class="relative">
        <div class="aspect-[2/3] relative overflow-hidden">
          <img src="" alt="${drama.bookName}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full transform scale-0 hover:scale-100 transition-transform duration-300">
              <i class="fas fa-play text-white ml-1"></i>
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-white font-medium text-sm line-clamp-2 mb-2">${drama.bookName}</h3>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400">${drama.chapterCount || 0} Episode</span>
            ${drama.playCount ? `<span class="text-xs text-gray-400">${drama.playCount}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    
    const imgElement = card.querySelector('img');
    loadImageWithFallback(imgElement, drama.coverWap);
    
    card.addEventListener('click', () => {
      showLoading();
      setTimeout(() => {
        showPlayerView(drama.bookId, drama.bookName, drama.coverWap, drama);
      }, 300);
    });
    
    container.appendChild(card);
  });
}

// Search functions
async function searchDrama(keyword) {
  if (!keyword) { 
    showNotification("Silakan masukkan kata kunci pencarian.", "warning");
    return; 
  }
  
  showLoading();
  
  homeView.classList.add('hidden');
  searchView.classList.remove('hidden');
  
  searchResults.innerHTML = `
    <div class="flex justify-center items-center col-span-full py-20">
      <div class="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `;
  
  try {
    const apiUrl = `https://dramabox-apix.vercel.app/api/search?query=${keyword}`;
    
    const res = await tryFetch(apiUrl);
    
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();
    
    let results = [];
    if (Array.isArray(data)) {
      results = data;
    } else if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        results = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        results = data.results;
      }
    }
    
    if (isCategorySearch && results.length > 0) {
      const detailedResults = await Promise.all(
        results.map(async (drama) => {
          const detailedDrama = await getDramaDetails(drama.bookId);
          return detailedDrama || drama;
        })
      );
      renderSearchResults(detailedResults);
    } else {
      renderSearchResults(results);
    }
    
    hideLoading();
  } catch (err) {
    searchResults.innerHTML = `
      <div class="col-span-full glass text-red-300 p-6 rounded-xl text-center">
        <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
        <h3 class="font-semibold text-lg">Terjadi Kesalahan</h3>
        <p class="text-sm mt-1">Gagal mengambil data. (${err.message})</p>
        <button class="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors" onclick="location.reload()">
          <i class="fas fa-redo mr-2"></i>Coba Lagi
        </button>
      </div>
    `;
    hideLoading();
  }
}

function renderSearchResults(list) {
  searchResults.innerHTML = "";
  if (list.length === 0) {
    searchResults.innerHTML = `<p class="text-gray-500 col-span-full text-center py-16">Tidak ada hasil yang ditemukan untuk pencarian ini.</p>`;
    return;
  }
  
  list.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = "drama-card glass rounded-xl overflow-hidden cursor-pointer";
    card.dataset.bookId = item.bookId;
    card.dataset.bookName = item.bookName;
    card.dataset.cover = item.coverWap || item.cover;
    card.dataset.chapterCount = item.chapterCount || 0;
    card.innerHTML = `
      <div class="relative">
        <div class="aspect-[2/3] relative overflow-hidden">
          <img src="" alt="${item.bookName}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full transform scale-0 hover:scale-100 transition-transform duration-300">
              <i class="fas fa-play text-white ml-1"></i>
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-white font-medium text-sm line-clamp-2 mb-2">${item.bookName}</h3>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-400">${item.chapterCount || 0} Episode</span>
            ${item.playCount ? `<span class="text-xs text-gray-400">${item.playCount}</span>` : ''}
          </div>
        </div>
      </div>
    `;
    
    const imgElement = card.querySelector('img');
    loadImageWithFallback(imgElement, item.coverWap || item.cover);
    
    card.addEventListener('click', () => {
      showLoading();
      setTimeout(() => {
        showPlayerView(item.bookId, item.bookName, item.coverWap || item.cover, item);
      }, 300);
    });
    
    searchResults.appendChild(card);
  });
}

async function getDramaDetails(bookId) {
  try {
    const apiUrl = `https://dramabox-apix.vercel.app/api/search?query=${bookId}`;
    
    const res = await tryFetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();
    
    let results = [];
    if (Array.isArray(data)) {
      results = data;
    } else if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        results = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        results = data.results;
      }
    }
    
    const drama = results.find(item => item.bookId === bookId);
    return drama || null;
  } catch (err) {
    return null;
  }
}

async function getEpisodeStream(bookId, episode) {
  try {
    const apiUrl = `https://dramabox-apix.vercel.app/api/link-stream?bookId=${bookId}&episode=${episode}`;
    
    const res = await tryFetch(apiUrl);
    
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
}

// Player view functions
async function showPlayerView(bookId, bookName, cover, dramaData = null) {
  showLoading();
  
  if (!mobileMenu.classList.contains('active')) {
    closeMobileMenuFunc();
  }
  
  homeView.classList.add('hidden');
  searchView.classList.add('hidden');
  playerView.classList.remove('hidden');
  window.scrollTo(0, 0);
  
  episodeGrid.innerHTML = `
    <div class="flex justify-center items-center col-span-full py-20">
      <div class="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  `;
  
  document.getElementById('dramaTitle').textContent = bookName;
  
  currentBookId = bookId;
  selectedEpisode = 1;
  
  try {
    if (!dramaData || !dramaData.chapterCount) {
      currentDramaData = await getDramaDetails(bookId);
    } else {
      currentDramaData = dramaData;
    }
    
    if (currentDramaData) {
      document.getElementById('dramaDescription').textContent = currentDramaData.introduction || 'Tidak ada deskripsi tersedia.';
      
      if (currentDramaData.protagonist && currentDramaData.protagonist.trim() !== '') {
        protagonist.textContent = currentDramaData.protagonist;
        protagonist.classList.remove('hidden');
      } else {
        protagonist.classList.add('hidden');
      }
      
      let bookYear = new Date().getFullYear();
      if (currentDramaData.bookId && currentDramaData.bookId.length >= 4) {
        const extractedYear = parseInt(currentDramaData.bookId.substring(0, 4));
        if (extractedYear >= 2000 && extractedYear <= bookYear) {
          bookYear = extractedYear;
        }
      }
      year.textContent = bookYear;
      year.classList.remove('hidden');
      
      const totalEpisodes = currentDramaData.chapterCount || 0;
      episodeCount.textContent = `${totalEpisodes} Episode`;
      
      const tagsContainer = document.getElementById('dramaTags');
      tagsContainer.innerHTML = '';
      if (currentDramaData.tagNames && currentDramaData.tagNames.length > 0) {
        currentDramaData.tagNames.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.className = 'glass border border-slate-700 px-3 py-1 rounded-full text-sm';
          tagElement.textContent = tag;
          tagsContainer.appendChild(tagElement);
        });
      }
    }
    
    const episodeData = await getEpisodeStream(bookId, 1);
    
    if (episodeData && episodeData.videos && episodeData.videos.length > 0) {
      currentEpisodeData = episodeData;
      
      availableQualities = episodeData.videos.map(video => video.quality.toString());
      populateQualityOptions(availableQualities);
      
      const highestQuality = episodeData.videos.reduce((prev, current) => 
        (parseInt(prev.quality) > parseInt(current.quality)) ? prev : current
      );
      
      currentQuality = highestQuality.quality.toString();
      currentQualityText.textContent = currentQuality + 'p';
      updateQualitySelection(currentQuality);
      
      loadVideoWithFallback(highestQuality.videoPath, cover);
      
      renderEpisodeList(currentDramaData?.chapterCount || 10);
    } else {
      showVideoError('Tidak ada video tersedia untuk episode ini');
      renderEpisodeList(currentDramaData?.chapterCount || 10);
    }
    
    hideLoading();
  } catch (err) {
    showVideoError('Gagal memuat episode. Silakan coba lagi nanti.');
    renderEpisodeList(currentDramaData?.chapterCount || 10);
    hideLoading();
  }
}

function renderEpisodeList(totalEpisodes) {
  episodeGrid.innerHTML = '';
  
  for (let i = 1; i <= totalEpisodes; i++) {
    const item = document.createElement('div');
    item.className = 'episode-item glass rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 relative overflow-hidden group';
    item.dataset.episode = i;
    
    if (i === selectedEpisode) {
      item.classList.add('episode-selected');
    }
    
    item.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <span class="text-xs font-medium relative z-10 ${i === selectedEpisode ? 'text-white font-bold' : ''}">Ep ${i}</span>
    `;
    episodeGrid.appendChild(item);
  }
}

shareBtn.addEventListener('click', () => {
  showLoading();
  setTimeout(() => {
    if (navigator.share) {
      navigator.share({
        title: currentDramaData?.bookName || 'DramaBox',
        text: currentDramaData?.introduction || 'Tonton drama seru ini di DramaBox!',
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      showNotification('Link telah disalin ke clipboard!', 'info');
    }
    hideLoading();
  }, 300);
});

searchInput.addEventListener('keyup', e => { 
  if (e.key === 'Enter') {
    showLoading();
    setTimeout(() => {
      isCategorySearch = false;
      searchDrama(e.target.value.trim());
    }, 300);
  }
});

mobileSearchInput.addEventListener('keyup', e => { 
  if (e.key === 'Enter') {
    showLoading();
    setTimeout(() => {
      isCategorySearch = false;
      searchDrama(e.target.value.trim());
    }, 300);
  }
});

searchResults.addEventListener('click', e => {
  const card = e.target.closest('.drama-card');
  if (card) {
    showLoading();
    setTimeout(() => {
      const dramaData = {
        chapterCount: parseInt(card.dataset.chapterCount) || 0
      };
      showPlayerView(card.dataset.bookId, card.dataset.bookName, card.dataset.cover, dramaData);
    }, 300);
  }
});

backBtn.addEventListener('click', () => {
  showLoading();
  setTimeout(() => {
    playerView.classList.add('hidden');
    searchView.classList.add('hidden');
    homeView.classList.remove('hidden');
    isCategorySearch = false;
    
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenuFunc();
    }
    
    if (mainPlayer) {
      mainPlayer.pause();
      mainPlayer.src = "";
      mainPlayer.load();
    }
    
    hideLoading();
  }, 300);
});

episodeGrid.addEventListener('click', async e => {
  const item = e.target.closest('.episode-item');
  if (item) {
    showLoading();
    
    const episode = parseInt(item.dataset.episode);
    selectedEpisode = episode;
    
    document.querySelectorAll('.episode-item').forEach(el => {
      el.classList.remove('episode-selected');
      el.querySelector('span').classList.remove('text-white', 'font-bold');
    });
    
    item.classList.add('episode-selected');
    item.querySelector('span').classList.add('text-white', 'font-bold');
    
    episodeGrid.innerHTML = `
      <div class="flex justify-center items-center col-span-full py-20">
        <div class="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    `;
    
    try {
      const episodeData = await getEpisodeStream(currentBookId, episode);
      
      if (episodeData && episodeData.videos && episodeData.videos.length > 0) {
        currentEpisodeData = episodeData;
        
        availableQualities = episodeData.videos.map(video => video.quality.toString());
        populateQualityOptions(availableQualities);
        
        const highestQuality = episodeData.videos.reduce((prev, current) => 
          (parseInt(prev.quality) > parseInt(current.quality)) ? prev : current
        );
        
        currentQuality = highestQuality.quality.toString();
        currentQualityText.textContent = currentQuality + 'p';
        updateQualitySelection(currentQuality);
        
        loadVideoWithFallback(highestQuality.videoPath);
        
        renderEpisodeList(currentDramaData?.chapterCount || 10);
      } else {
        showVideoError(`Tidak ada video tersedia untuk episode ${episode}`);
        renderEpisodeList(currentDramaData?.chapterCount || 10);
      }
    } catch (err) {
      showVideoError(`Gagal memuat episode ${episode}. Silakan coba lagi.`);
      renderEpisodeList(currentDramaData?.chapterCount || 10);
    }
    
    hideLoading();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  showLoading();
  setTimeout(() => {
    loadHomeData();
    initCategories();
  }, 500);
});