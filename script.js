/* =========================================================
   1. الوضع الداكن / الفاتح (Dark / Light Mode)
   ========================================================= */
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  body.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
  const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* =========================================================
   2. قائمة الملاحة للموبايل (Mobile Nav Toggle)
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// إغلاق القائمة عند الضغط على أي رابط
navMenu.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   3. زر العودة للأعلى (Back to Top)
   ========================================================= */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 480);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   4. معرض الصور — إظهار الكابشن باللمس على الموبايل
   ========================================================= */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;
    const wasActive = item.classList.contains('is-active');
    galleryItems.forEach(i => i.classList.remove('is-active'));
    if (!wasActive) item.classList.add('is-active');
  });
});

/* =========================================================
   5. مشغل الموسيقى (Custom Music Player)
   ========================================================= */
const playlist = [
  {
    title: 'Sweet',
    artist: 'CAS',
    cover: 'images/MOUSIC_PHOTO2.jpeg',
    src: 'music/Sweet(MP3_160K).mp3'
  },
  {
    title: 'Dreaming of you',
    artist: 'CAS',
    cover: 'images/MUSIC_PHOTO.jpeg',
    src: 'music/Dreaming of You(MP3_160K).mp3'
  },
  {
    title: 'That Never Goes Out',
    artist: 'THE SMITHS',
    cover: 'images/MOUSIC_PHOTO3.png',
    src: 'music/There Is a Light That Never Goes Out (2011 Remaster)(MP3_160K).mp3'
  },
  {
    title: 'LET IT HAPPEN',
    artist: 'TAME IMPALA',
    cover: 'images/LET_IT_HABBEN.png',
    src: 'music/Let It Happen(MP3_160K).mp3'
  }
];

const audio          = document.getElementById('audio');
const playerEl        = document.querySelector('.player');
const playerCover     = document.getElementById('playerCover');
const playerTitle     = document.getElementById('playerTitle');
const playerArtist    = document.getElementById('playerArtist');
const playBtn         = document.getElementById('playBtn');
const playIcon        = document.getElementById('playIcon');
const prevBtn         = document.getElementById('prevBtn');
const nextBtn         = document.getElementById('nextBtn');
const progressBar     = document.getElementById('progressBar');
const currentTimeEl   = document.getElementById('currentTime');
const durationTimeEl  = document.getElementById('durationTime');
const volumeBar       = document.getElementById('volumeBar');
const playlistEl      = document.getElementById('playlist');

let currentTrack = 0;
let isPlaying = false;

function renderPlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.dataset.index = index;
    li.innerHTML = `
      <span class="playlist-item__index">${String(index + 1).padStart(2, '0')}</span>
      <div class="playlist-item__info">
        <h5>${track.title}</h5>
        <span>${track.artist}</span>
      </div>
      <span class="playlist-item__duration"><i class="fa-solid fa-play"></i></span>
    `;
    li.addEventListener('click', () => loadTrack(index, true));
    playlistEl.appendChild(li);
  });
}

function updateActivePlaylistItem() {
  document.querySelectorAll('.playlist-item').forEach((item, index) => {
    item.classList.toggle('is-active', index === currentTrack);
  });
}

function loadTrack(index, autoplay = false) {
  currentTrack = (index + playlist.length) % playlist.length;
  const track = playlist[currentTrack];

  audio.src = track.src;
  playerCover.src = track.cover;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;

  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationTimeEl.textContent = '0:00';

  updateActivePlaylistItem();

  if (autoplay) {
    playTrack();
  } else {
    pauseTrack();
  }
}

function playTrack() {
  audio.play().catch(() => {});
  isPlaying = true;
  playIcon.classList.remove('fa-play');
  playIcon.classList.add('fa-pause');
  playBtn.setAttribute('aria-label', 'إيقاف مؤقت');
  playerEl.classList.add('is-playing');
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playIcon.classList.remove('fa-pause');
  playIcon.classList.add('fa-play');
  playBtn.setAttribute('aria-label', 'تشغيل');
  playerEl.classList.remove('is-playing');
}

function togglePlay() {
  isPlaying ? pauseTrack() : playTrack();
}

function nextTrack() { loadTrack(currentTrack + 1, true); }
function prevTrack() { loadTrack(currentTrack - 1, true); }

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

audio.addEventListener('loadedmetadata', () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!isFinite(audio.duration) || audio.duration === 0) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = percent;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
  if (!isFinite(audio.duration)) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

audio.addEventListener('ended', nextTrack);

volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value;
});

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

renderPlaylist();
loadTrack(0, false);

/* =========================================================
   6. تأثير الاحتفال (Confetti Effect) عند الإرسال الصحيح
   ========================================================= */
function triggerConfetti() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const colors = ['#5EEAD4', '#F0B429', '#4ADE80', '#60A5FA', '#F4715C', '#A78BFA'];

  for (let i = 0; i < 70; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 8 + 6 + 'px';
    particle.style.height = Math.random() * 8 + 6 + 'px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.left = '50%';
    particle.style.top = '50%';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 120;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 120;
    const rot = Math.random() * 720 - 360;

    particle.animate([
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 180}px)) scale(0.1) rotate(${rot}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 1000 + 1300,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      fill: 'forwards'
    });

    container.appendChild(particle);
  }

  setTimeout(() => container.remove(), 2600);
}

/* =========================================================
   7. نموذج التواصل — تحقق واحتفال عند النجاح
   ========================================================= */
const contactForm  = document.getElementById('contactForm');
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');
const formSuccess  = document.getElementById('formSuccess');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(input, errorId, message) {
  const errorEl = document.getElementById(errorId);
  const group = input.closest('.form-group');
  if (message) {
    group.classList.add('has-error');
    errorEl.textContent = message;
    return false;
  }
  group.classList.remove('has-error');
  errorEl.textContent = '';
  return true;
}

function validateForm() {
  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    setError(nameInput, 'nameError', 'يرجى إدخال اسمك الكامل.');
    isValid = false;
  } else {
    setError(nameInput, 'nameError', '');
  }

  if (!emailPattern.test(emailInput.value.trim())) {
    setError(emailInput, 'emailError', 'يرجى إدخال بريد إلكتروني صحيح.');
    isValid = false;
  } else {
    setError(emailInput, 'emailError', '');
  }

  if (messageInput.value.trim().length < 10) {
    setError(messageInput, 'messageError', 'الرسالة قصيرة جدًا، يرجى كتابة تفاصيل أكثر.');
    isValid = false;
  } else {
    setError(messageInput, 'messageError', '');
  }

  return isValid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('is-visible');

  if (!validateForm()) return;

  // إطلاق تأثير الاحتفال
  triggerConfetti();

  formSuccess.classList.add('is-visible');
  contactForm.reset();

  setTimeout(() => formSuccess.classList.remove('is-visible'), 6000);
});

[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    if (input.closest('.form-group').classList.contains('has-error')) validateForm();
  });
});

/* =========================================================
   8. السنة الحالية في الفوتر
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();