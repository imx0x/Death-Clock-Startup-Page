console.clear();

// Sound Control
const tickSound = document.getElementById('tick-sound');
const soundToggle = document.getElementById('sound-toggle');

// Initialize sound state from localStorage or default to muted
let isMuted = localStorage.getItem('isMuted') === 'false' ? false : true;

tickSound.volume = 0.2;
updateSoundState();

function updateSoundState() {
  soundToggle.setAttribute('data-muted', isMuted);
  if (isMuted) {
    tickSound.pause();
  } else {
    tickSound.volume = 0.2;
    tickSound.play().catch(e => console.log('Audio play failed:', e));
  }
  localStorage.setItem('isMuted', isMuted);
}

soundToggle.addEventListener('click', () => {
  isMuted = !isMuted;
  updateSoundState();
});

document.addEventListener('click', () => {
  if (!isMuted) {
    tickSound.volume = 0.2;
    tickSound.play().catch(e => console.log('Audio play failed:', e));
  }
}, { once: true });

// Clock and Language Functionality
const languageFlags = [
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
  { code: 'cs-CZ', name: 'Czech (Czech Republic)', flag: '🇨🇿' },
  { code: 'da-DK', name: 'Danish (Denmark)', flag: '🇩🇰' },
  { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
  { code: 'el-GR', name: 'Greek (Greece)', flag: '🇬🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'fi-FI', name: 'Finnish (Finland)', flag: '🇫🇮' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'he-IL', name: 'Hebrew (Israel)', flag: '🇮🇱' },
  { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
  { code: 'hu-HU', name: 'Hungarian (Hungary)', flag: '🇭🇺' },
  { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱' },
  { code: 'no-NO', name: 'Norwegian (Norway)', flag: '🇳🇴' },
  { code: 'pl-PL', name: 'Polish (Poland)', flag: '🇵🇱' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ro-RO', name: 'Romanian (Romania)', flag: '🇷🇴' },
  { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
  { code: 'sv-SE', name: 'Swedish (Sweden)', flag: '🇸🇪' },
  { code: 'th-TH', name: 'Thai (Thailand)', flag: '🇹🇭' },
  { code: 'tr-TR', name: 'Turkish (Turkey)', flag: '🇹🇷' },
  { code: 'vi-VN', name: 'Vietnamese (Vietnam)', flag: '🇻🇳' },
  { code: 'zh-CN', name: 'Chinese (Simplified, China)', flag: '🇨🇳' },
];

const RADIUS = 140;

const defaultRegions = languageFlags.reduce((map, lang) => {
  const baseLang = lang.code.split('-')[0];
  if (!map[baseLang]) {
    map[baseLang] = lang.code;
  }
  return map;
}, {});

function getLocale() {
  let language = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
  if (language.length === 2) {
    language = defaultRegions[language] || `${language}-${language.toUpperCase()}`;
  }
  return language;
}

let locale = getLocale();

const currentLangDisplay = document.getElementById('current-lang');
const languageDialog = document.getElementById('language-dialog');
const languageOptionsContainer = document.getElementById('language-options');
const closeButton = document.getElementById('btn-dialog-close');

let deathYear = null;
const deathYearDialog = document.getElementById('death-year-dialog');
const deathYearInput = document.getElementById('death-year');
const submitDeathYear = document.getElementById('submit-death-year');
const btnDeathDialogClose = document.getElementById('btn-death-dialog-close');
const countdownTimer = document.getElementById('countdown-timer');

// Existing Page Elements
const greetingElement = document.getElementById('greeting');
const currentDateElement = document.getElementById('current-date');
const quoteTextElement = document.querySelector('.quote-text');
const quoteAuthorElement = document.querySelector('.quote-author');

// Update greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }
  greetingElement.textContent = greeting;
}

// Update current date
function updateDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString(locale, options);
  currentDateElement.textContent = currentDate;
}

// Fetch daily quote
async function fetchDailyQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    quoteTextElement.textContent = data.content;
    quoteAuthorElement.textContent = `- ${data.author}`;
  } catch (error) {
    console.error('Error fetching quote:', error);
    quoteTextElement.textContent = 'The future belongs to those who believe in the beauty of their dreams.';
    quoteAuthorElement.textContent = '- Eleanor Roosevelt';
  }
}

// Clock Functions
function drawClockFaces() {
  const clockFaces = document.querySelectorAll('.clock-face');
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentWeekday = currentDate.getDay();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentSeconds = currentDate.getSeconds();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2021, 0, i + 3))
  );
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2021, i))
  );

  clockFaces.forEach(clockFace => {
    clockFace.innerHTML = '';
    const clockType = clockFace.getAttribute('data-clock');
    const numbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
    const RADIUS = (clockFace.offsetWidth / 2) - 20;
    const center = clockFace.offsetWidth / 2;

    let valueSet;
    let currentValue;

    switch (clockType) {
      case 'seconds':
        valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
        currentValue = String(currentSeconds).padStart(2, '0');
        break;
      case 'minutes':
        valueSet = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
        currentValue = String(currentMinutes).padStart(2, '0');
        break;
      case 'hours':
        valueSet = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
        currentValue = String(currentHours).padStart(2, '0');
        break;
      case 'days':
        valueSet = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
        currentValue = currentDay;
        break;
      case 'months':
        valueSet = monthNames;
        currentValue = currentMonth;
        break;
      case 'years':
        valueSet = Array.from({ length: 101 }, (_, i) => 2000 + i);
        currentValue = currentYear;
        break;
      case 'day-names':
        valueSet = weekdayNames;
        currentValue = currentWeekday;
        break;
      default:
        return;
    }

    valueSet.forEach((value, i) => {
      const angle = (i * (360 / numbers));
      const x = center + RADIUS * Math.cos((angle * Math.PI) / 180);
      const y = center + RADIUS * Math.sin((angle * Math.PI) / 180);

      const element = document.createElement('span');
      element.classList.add('number');
      if (clockType === 'years' && deathYear && parseInt(value) >= deathYear) {
        element.classList.add('dead');
      }
      element.textContent = value;
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      clockFace.appendChild(element);
    });

    const currentIndex = valueSet.indexOf(
      typeof valueSet[0] === 'string' ? String(currentValue) : currentValue
    );
    const rotationAngle = -((currentIndex / numbers) * 360);
    clockFace.style.transform = `rotate(${rotationAngle}deg)`;
  });
}

function rotateClockFaces() {
  const clockFaces = document.querySelectorAll('.clock-face');
  const lastAngles = {};

  function updateRotations() {
    const now = new Date();
    const currentSecond = now.getSeconds();
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentWeekday = now.getDay();

    clockFaces.forEach(clockFace => {
      const clockType = clockFace.getAttribute('data-clock');
      const totalNumbers = parseInt(clockFace.getAttribute('data-numbers'), 10);
      let currentValue;

      switch (clockType) {
        case 'seconds':
          currentValue = currentSecond;
          break;
        case 'minutes':
          currentValue = currentMinute;
          break;
        case 'hours':
          currentValue = currentHour;
          break;
        case 'days':
          currentValue = currentDay - 1;
          break;
        case 'months':
          currentValue = currentMonth;
          break;
        case 'years':
          currentValue = currentYear - 2000;
          break;
        case 'day-names':
          currentValue = currentWeekday;
          break;
        default:
          return;
      }

      const targetAngle = (360 / totalNumbers) * currentValue;
      const clockId = clockFace.id || clockType;
      const lastAngle = lastAngles[clockId] || 0;
      const delta = targetAngle - lastAngle;
      const shortestDelta = ((delta + 540) % 360) - 180;
      const newAngle = lastAngle + shortestDelta;
      clockFace.style.transform = `rotate(${newAngle * -1}deg)`;
      lastAngles[clockId] = newAngle;

      const numbers = clockFace.querySelectorAll('.number');
      numbers.forEach((number, index) => {
        if (index === currentValue) {
          number.classList.add('active');
        } else {
          number.classList.remove('active');
        }
      });
    });
    requestAnimationFrame(updateRotations);
  }

  updateRotations();
}

// Language Dialog Functions
function createLanguageOptions() {
  const centerX = languageOptionsContainer.offsetWidth / 2;
  const centerY = languageOptionsContainer.offsetHeight / 2;

  languageFlags.forEach((lang, index, arr) => {
    const angle = (index / arr.length) * 2 * Math.PI;
    const x = centerX + RADIUS * Math.cos(angle);
    const y = centerY + RADIUS * Math.sin(angle);

    const radioWrapper = document.createElement('label');
    radioWrapper.title = lang.name;
    radioWrapper.style.left = `${x}px`;
    radioWrapper.style.top = `${y}px`;

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'language';
    radioInput.value = lang.code;

    if (lang.code === locale) {
      radioInput.checked = true;
      radioWrapper.classList.add('active');
    }

    const flag = document.createElement('span');
    flag.classList.add('flag-icon');
    flag.innerText = lang.flag;

    radioWrapper.appendChild(radioInput);
    radioWrapper.appendChild(flag);
    languageOptionsContainer.appendChild(radioWrapper);

    radioWrapper.addEventListener('mouseover', () => showTitle(lang.name, radioWrapper));
    radioWrapper.addEventListener('mouseleave', () => hideTitle());

    radioInput.addEventListener('change', () => {
      locale = radioInput.value;
      setCurrentLangDisplay(lang);
      drawClockFaces();
      document.querySelector('label.active')?.classList.remove('active');
      radioWrapper.classList.add('active');
      closeDialog();
    });
  });
}

let titleDisplay = null;
function showTitle(languageName) {
  if (titleDisplay) {
    titleDisplay.remove();
  }
  titleDisplay = document.createElement('div');
  titleDisplay.classList.add('language-title');
  titleDisplay.textContent = languageName;
  languageOptionsContainer.appendChild(titleDisplay);
}

function hideTitle() {
  if (titleDisplay) {
    titleDisplay.textContent = '';
  }
}

function setCurrentLangDisplay(lang) {
  currentLangDisplay.textContent = lang.flag;
  currentLangDisplay.title = lang.name;
  showTitle(lang.name);
}

function openDialog() {
  languageDialog.showModal();
  createLanguageOptions();
  addDialogCloseListener();
}

function closeDialog() {
  languageDialog.close();
  removeLanguageOptions();
  removeDialogCloseListener();
}

function removeLanguageOptions() {
  languageOptionsContainer.innerHTML = '';
}

function addDialogCloseListener() {
  languageDialog.addEventListener('click', closeDialogOnClickOutside);
}

function removeDialogCloseListener() {
  languageDialog.removeEventListener('click', closeDialogOnClickOutside);
}

function closeDialogOnClickOutside(e) {
  if (e.target === languageDialog) {
    closeDialog();
  }
}

closeButton.addEventListener('click', closeDialog);
currentLangDisplay.addEventListener('click', openDialog);

// Death Year and Countdown
function updateCountdownTimer() {
  if (!deathYear) return;
  const now = new Date();
  const deathDate = new Date(deathYear, 0, 1);
  const timeLeft = deathDate - now;

  if (timeLeft <= 0) {
    countdownTimer.textContent = 'Time\'s up!';
    return;
  }

  const years = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  countdownTimer.textContent = `Time left: ${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

submitDeathYear.addEventListener('click', () => {
  const year = parseInt(deathYearInput.value);
  if (year >= 2024 && year <= 2100) {
    deathYear = year;
    localStorage.setItem('deathYear', year.toString());
    deathYearDialog.close();
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);
  } else {
    alert('Please enter a year between 2024 and 2100');
  }
});

btnDeathDialogClose.addEventListener('click', () => {
  deathYearDialog.close();
});

// New Functionality

// Calendar Functionality
function generateCalendar() {
  const calendarSection = document.querySelector('.calendar-section');
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  let html = '<div class="calendar-header">' + date.toLocaleString('default', { month: 'long', year: 'numeric' }) + '</div>';
  html += '<div class="calendar-grid">';

  for (let i = 0; i < 7; i++) {
    html += `<div class="calendar-day-header">${new Date(2021, 0, i + 3).toLocaleDateString(locale, { weekday: 'short' })}</div>`;
  }

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasNote = localStorage.getItem(`notes-${dateKey}`) !== null;
    html += `<div class="calendar-day${hasNote ? ' has-note' : ''}" data-date="${dateKey}">${day}</div>`;
  }

  html += '</div>';
  calendarSection.innerHTML = html;

  document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
    day.addEventListener('click', () => openNotesDialog(day.dataset.date));
  });
}

function openNotesDialog(date) {
  const dialog = document.getElementById('calendar-notes-dialog');
  const notesDate = document.getElementById('notes-date');
  const nanuNote = document.querySelector('.nanu-note');
  const rohitNote = document.querySelector('.rohit-note');
  const saveNotesBtn = document.getElementById('save-notes');

  notesDate.textContent = date;
  const notes = JSON.parse(localStorage.getItem(`notes-${date}`)) || { nanu: '', rohit: '' };
  nanuNote.value = notes.nanu;
  rohitNote.value = notes.rohit;

  dialog.showModal();

  saveNotesBtn.onclick = () => {
    const updatedNotes = { nanu: nanuNote.value, rohit: rohitNote.value };
    localStorage.setItem(`notes-${date}`, JSON.stringify(updatedNotes));
    dialog.close();
    generateCalendar();
  };

  dialog.querySelector('.btn-dialog-close').onclick = () => dialog.close();
}

// Photo Functionality
document.querySelectorAll('.photo-upload').forEach(uploadInput => {
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      const photoDisplay = e.target.previousElementSibling;
      photoDisplay.innerHTML = `<img src="${dataURL}" alt="Photo">`;
      localStorage.setItem(`${e.target.parentElement.classList[1]}-photo`, dataURL);
    };
    reader.readAsDataURL(file);
  });
});

const video = document.getElementById('webcam-video');
const canvas = document.getElementById('photo-canvas');

document.querySelectorAll('.capture-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const photoCard = btn.parentElement;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();

        const captureButton = document.createElement('button');
        captureButton.textContent = 'Capture';
        photoCard.appendChild(captureButton);

        captureButton.onclick = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          const photoDisplay = photoCard.querySelector('.photo-display');
          photoDisplay.innerHTML = `<img src="${dataURL}" alt="Photo">`;
          localStorage.setItem(`${photoCard.classList[1]}-photo`, dataURL);
          stream.getTracks().forEach(track => track.stop());
          video.style.display = 'none';
          captureButton.remove();
        };
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  ['nanu', 'rohit'].forEach(user => {
    const photoData = localStorage.getItem(`${user}-photo`);
    if (photoData) {
      document.querySelector(`.${user}-photo .photo-display`).innerHTML = `<img src="${photoData}" alt="Photo">`;
    }
  });
});

document.querySelectorAll('.photo-display').forEach(display => {
  display.addEventListener('click', () => {
    const imgSrc = display.querySelector('img')?.src;
    if (imgSrc) {
      const dialog = document.getElementById('photo-zoom-dialog');
      const zoomedPhoto = document.getElementById('zoomed-photo');
      zoomedPhoto.src = imgSrc;
      dialog.showModal();
      dialog.querySelector('.btn-dialog-close').onclick = () => dialog.close();
    }
  });
});

// Chat Functionality
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

function displayChatMessages() {
  const chatLog = document.querySelector('.chat-log');
  chatLog.innerHTML = '';
  chatMessages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', msg.sender);
    msgDiv.textContent = `${msg.sender}: ${msg.message}`;
    chatLog.appendChild(msgDiv);
  });
  chatLog.scrollTop = chatLog.scrollHeight;
}

document.addEventListener('DOMContentLoaded', displayChatMessages);

const userRoleSelect = document.querySelector('.user-role');
const chatInput = document.querySelector('.chat-input input');
const sendBtn = document.querySelector('.send-btn');

sendBtn.addEventListener('click', () => {
  const sender = userRoleSelect.value;
  const message = chatInput.value.trim();
  if (message) {
    const newMsg = { sender, message, timestamp: new Date().toISOString() };
    chatMessages.push(newMsg);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    displayChatMessages();
    chatInput.value = '';
    new Audio('./sounds/notification.mp3').play();
  }
});

// Goal Inputs
const nanuGoalInput = document.querySelector('.nanu-goal .goal-input');
const rohitGoalInput = document.querySelector('.rohit-goal .goal-input');

function setupGoalInput(input, storageKey) {
  const savedGoal = localStorage.getItem(storageKey);
  if (savedGoal) {
    input.value = savedGoal;
  }

  let saveTimeout;
  input.addEventListener('input', () => {
    const goal = input.value;
    input.classList.add('saving');
    input.classList.remove('saved');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem(storageKey, goal);
      input.classList.remove('saving');
      input.classList.add('saved');
      setTimeout(() => input.classList.remove('saved'), 3000);
    }, 500);
  });

  input.addEventListener('blur', () => {
    localStorage.setItem(storageKey, input.value);
    input.classList.remove('saving');
    input.classList.add('saved');
    setTimeout(() => input.classList.remove('saved'), 3000);
  });
}

setupGoalInput(nanuGoalInput, 'nanuDailyGoal');
setupGoalInput(rohitGoalInput, 'rohitDailyGoal');

// Bank Balances
const nanuBalanceAmount = document.querySelector('.nanu-balance .balance-amount');
const rohitBalanceAmount = document.querySelector('.rohit-balance .balance-amount');
const nanuLastUpdated = document.querySelector('.nanu-balance .last-updated');
const rohitLastUpdated = document.querySelector('.rohit-balance .last-updated');
const nanuEditBtn = document.querySelector('.nanu-balance .edit-btn');
const rohitEditBtn = document.querySelector('.rohit-balance .edit-btn');
const nanuConversion = document.querySelector('.nanu-balance .balance-conversion-jpy');
const rohitConversion = document.querySelector('.rohit-balance .balance-conversion-inr');

let inrToJpyRate = 0;
let jpyToInrRate = 0;

async function fetchExchangeRates() {
  try {
    const responseInr = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    const dataInr = await responseInr.json();
    inrToJpyRate = dataInr.rates.JPY;

    const responseJpy = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
    const dataJpy = await responseJpy.json();
    jpyToInrRate = dataJpy.rates.INR;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    inrToJpyRate = 1.5; // Fallback rate
    jpyToInrRate = 0.67; // Fallback rate
  }
}

function updateConversions() {
  if (inrToJpyRate && jpyToInrRate) {
    const nanuBalance = parseFloat(nanuBalanceAmount.textContent) || 0;
    const rohitBalance = parseFloat(rohitBalanceAmount.textContent) || 0;
    nanuConversion.textContent = (nanuBalance * inrToJpyRate).toFixed(2);
    rohitConversion.textContent = (rohitBalance * jpyToInrRate).toFixed(2);
  }
}

function loadSavedBalances() {
  const savedNanuBalance = localStorage.getItem('nanuBalance') || '0.00';
  const savedRohitBalance = localStorage.getItem('rohitBalance') || '0.00';
  nanuBalanceAmount.textContent = savedNanuBalance;
  rohitBalanceAmount.textContent = savedRohitBalance;

  const savedNanuLastUpdated = localStorage.getItem('nanuLastUpdated');
  const savedRohitLastUpdated = localStorage.getItem('rohitLastUpdated');
  if (savedNanuLastUpdated) {
    nanuLastUpdated.textContent = `Last updated: ${savedNanuLastUpdated}`;
  }
  if (savedRohitLastUpdated) {
    rohitLastUpdated.textContent = `Last updated: ${savedRohitLastUpdated}`;
  }
}

function setupBalanceEditing(balanceAmount, lastUpdated, storageKey) {
  balanceAmount.addEventListener('blur', () => {
    const amount = parseFloat(balanceAmount.textContent) || 0;
    balanceAmount.textContent = amount.toFixed(2);
    const now = new Date().toLocaleString();
    lastUpdated.textContent = `Last updated: ${now}`;
    localStorage.setItem(storageKey, balanceAmount.textContent);
    localStorage.setItem(`${storageKey}LastUpdated`, now);
    updateConversions();
  });

  balanceAmount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      balanceAmount.blur();
    }
  });
}

setupBalanceEditing(nanuBalanceAmount, nanuLastUpdated, 'nanuBalance');
setupBalanceEditing(rohitBalanceAmount, rohitLastUpdated, 'rohitBalance');

nanuEditBtn.addEventListener('click', () => nanuBalanceAmount.focus());
rohitEditBtn.addEventListener('click', () => rohitBalanceAmount.focus());

// Initialize Everything
function initializeStartupPage() {
  updateGreeting();
  updateDate();
  fetchDailyQuote();
  setInterval(() => {
    updateGreeting();
    updateDate();
  }, 60000);
  setInterval(fetchDailyQuote, 24 * 60 * 60 * 1000);
}

window.addEventListener('load', async () => {
  initializeStartupPage();
  await fetchExchangeRates();
  loadSavedBalances();
  updateConversions();
  generateCalendar();
  drawClockFaces();
  rotateClockFaces();
  setCurrentLangDisplay(languageFlags.find(lang => lang.code === locale));

  const storedDeathYear = localStorage.getItem('deathYear');
  if (storedDeathYear) {
    deathYear = parseInt(storedDeathYear);
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);
  } else {
    deathYearDialog.showModal();
  }
});
