const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : 'https://fullstack-project-back.onrender.com/api'; 

// DOM Elements
const appLayout = document.getElementById('app-layout');
const authView = document.getElementById('view-auth');
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('main.content-area .view-section');

// Auth DOM
const authForm = document.getElementById('auth-form');
const authName = document.getElementById('auth-name');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
const nameGroup = document.getElementById('name-group');
const authSubmitBtn = document.getElementById('auth-submit-btn');

const headerLoginBtn = document.getElementById('header-login-btn');
const headerAuthSection = document.getElementById('header-auth-section');
const headerUserSection = document.getElementById('header-user-section');
const userAvatar = document.getElementById('user-avatar');
const profileDropdown = document.getElementById('profile-dropdown');
const btnUploadAvatar = document.getElementById('btn-upload-avatar');
const avatarUploadInput = document.getElementById('avatar-upload-input');
const btnToggleDarkMode = document.getElementById('btn-toggle-dark-mode');
const btnLogout = document.getElementById('btn-logout');
const dropdownUserName = document.getElementById('dropdown-user-name');

let isLoginMode = false;

// Translation DOM
const sourceText = document.getElementById('source-text');
const targetText = document.getElementById('target-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const swapLangBtn = document.getElementById('swap-lang-btn');
const charCount = document.getElementById('char-count');
const loadingIndicator = document.getElementById('loading-indicator');
const contextualBlock = document.getElementById('contextual-block');
const contextList = document.getElementById('context-list');
const micBtn = document.getElementById('mic-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileUploadInput = document.getElementById('file-upload-input');
const keyboardBtn = document.getElementById('keyboard-btn');
const copyBtn = document.getElementById('copy-btn');
const savePhraseBtn = document.getElementById('save-phrase-btn');

// Search DOM
const globalSearch = document.getElementById('global-search');

// ==========================================
// ROUTING & AUTH STATE
// ==========================================
const phraseGrid = document.getElementById('phrase-grid');

// Community DOM
const communityPostInput = document.getElementById('community-post-input');
const communityPostBtn = document.getElementById('community-post-btn');
const communityFeedItems = document.getElementById('community-feed-items');
const communityUserAvatar = document.getElementById('community-user-avatar');

// ==========================================
// ROUTING & AUTH STATE
// ==========================================

function checkAuth() {
  const token = localStorage.getItem('translator_token');
  const user = JSON.parse(localStorage.getItem('translator_user'));

  if (token) {
    // Logged in
    authView.classList.add('hidden');
    appLayout.classList.remove('hidden');
    headerAuthSection.classList.add('hidden');
    headerUserSection.classList.remove('hidden');
    
    if (user && dropdownUserName) {
      dropdownUserName.textContent = user.name || "User";
      if (user.avatar) {
        updateAvatarUI(user.avatar);
      }
    }

    // Load initial data
    loadHistory();
    loadPhrasebook();
  } else {
    // Not logged in
    appLayout.classList.add('hidden');
    authView.classList.remove('hidden');
  }
}

function navigateTo(viewId) {
  // Update nav UI
  navItems.forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle sections
  viewSections.forEach(sec => {
    if (sec.id === viewId) {
      sec.classList.remove('hidden');
    } else {
      sec.classList.add('hidden');
    }
  });

  // View specific loads
  if (viewId === 'view-community') {
    loadCommunityPosts();
  }
}

// Sidebar Clicks
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const viewId = item.dataset.view;
    navigateTo(viewId);
  });
});

userAvatar.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
  profileDropdown.classList.remove('show');
});

profileDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
});

btnLogout.addEventListener('click', () => {
  if(confirm("Do you want to logout?")) {
    localStorage.removeItem('translator_token');
    localStorage.removeItem('translator_user');
    checkAuth();
  }
});

// Dark Mode Toggle
btnToggleDarkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('translator_dark_mode', isDark);
  
  const icon = btnToggleDarkMode.querySelector('span');
  icon.textContent = isDark ? 'light_mode' : 'dark_mode';
});

// Initialize Theme
const savedDarkMode = localStorage.getItem('translator_dark_mode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
  const icon = btnToggleDarkMode.querySelector('span');
  if (icon) icon.textContent = 'light_mode';
}

// Avatar Upload
btnUploadAvatar.addEventListener('click', () => {
  avatarUploadInput.click();
});

avatarUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const dataUrl = event.target.result;
    
    // Update UI immediately
    updateAvatarUI(dataUrl);

    // Save to Backend
    try {
      const token = localStorage.getItem('translator_token');
      const res = await fetch(`${API_URL}/auth/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: dataUrl })
      });

      if (res.ok) {
        // Update local user object too
        const user = JSON.parse(localStorage.getItem('translator_user'));
        user.avatar = dataUrl;
        localStorage.setItem('translator_user', JSON.stringify(user));
        localStorage.setItem('translator_avatar', dataUrl);
      }
    } catch (err) {
      console.error("Failed to sync avatar with database", err);
    }
  };
  reader.readAsDataURL(file);
});

function updateAvatarUI(dataUrl) {
  const avatarHtml = `<img src="${dataUrl}" alt="Avatar">`;
  if (userAvatar) userAvatar.innerHTML = avatarHtml;
  if (communityUserAvatar) communityUserAvatar.innerHTML = avatarHtml;
}

// Initialize Avatar
const savedAvatar = localStorage.getItem('translator_avatar');
if (savedAvatar) {
  updateAvatarUI(savedAvatar);
}

headerLoginBtn.addEventListener('click', () => {
    localStorage.removeItem('translator_token');
    checkAuth();
});

// ==========================================
// AUTHENTICATION
// ==========================================

toggleAuthModeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  if (isLoginMode) {
    nameGroup.classList.add('hidden');
    authSubmitBtn.textContent = 'Login';
    document.querySelector('.auth-card h2').textContent = 'Welcome back';
    document.querySelector('.auth-card .subtitle').textContent = 'Enter your details to access your account.';
    toggleAuthModeBtn.textContent = 'Create an account';
    toggleAuthModeBtn.parentElement.childNodes[0].nodeValue = "Don't have an account? ";
  } else {
    nameGroup.classList.remove('hidden');
    authSubmitBtn.textContent = 'Create Account';
    document.querySelector('.auth-card h2').textContent = 'Create your account';
    document.querySelector('.auth-card .subtitle').textContent = 'Start your 14-day premium trial today. No credit card required.';
    toggleAuthModeBtn.textContent = 'Login here';
    toggleAuthModeBtn.parentElement.childNodes[0].nodeValue = "Already have an account? ";
  }
});

authForm.addEventListener('submit', async (e) => {
  console.log('Auth form submit triggered');
  e.preventDefault();
  authError.classList.add('hidden');
  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = 'Processing...';

  const email = authEmail.value;
  const password = authPassword.value;
  const name = authName.value;

  const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
  const body = isLoginMode ? { email, password } : { name, email, password };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    localStorage.setItem('translator_token', data.token);
    localStorage.setItem('translator_user', JSON.stringify(data.user));
    
    checkAuth();
    navigateTo('view-translation-hub');
  } catch (err) {
    console.error('Auth error:', err);
    authError.textContent = err.message;
    authError.classList.remove('hidden');
  } finally {
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = isLoginMode ? 'Login' : 'Create Account';
  }
});

// Social login handlers removed

// ==========================================
// TRANSLATION HUB
// ==========================================

sourceText.addEventListener('input', () => {
  const count = sourceText.value.length;
  charCount.textContent = `${count} / 5000 CHARACTERS`;
});

swapLangBtn.addEventListener('click', () => {
  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;

  const tempText = sourceText.value;
  sourceText.value = targetText.textContent || targetText.value || '';
  targetText.textContent = tempText;
  targetText.style.display = 'block';
  
  sourceText.dispatchEvent(new Event('input'));
});

copyBtn.addEventListener('click', () => {
  if (targetText.textContent) {
    navigator.clipboard.writeText(targetText.textContent).then(() => {
      const icon = copyBtn.querySelector('span');
      icon.textContent = 'check';
      setTimeout(() => { icon.textContent = 'content_copy'; }, 2000);
    });
  }
});

// Speech to Text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  
  micBtn.addEventListener('click', () => {
    recognition.lang = sourceLang.value;
    recognition.start();
    micBtn.style.color = 'red';
  });

  recognition.onresult = (event) => {
    sourceText.value = event.results[0][0].transcript;
    sourceText.dispatchEvent(new Event('input'));
    micBtn.style.color = 'inherit';
  };
  recognition.onend = () => micBtn.style.color = 'inherit';
}

// File Upload Logic
uploadBtn.addEventListener('click', () => {
  fileUploadInput.click();
});

fileUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    sourceText.value = event.target.result;
    sourceText.dispatchEvent(new Event('input'));
    // Optionally trigger translation immediately
    performTranslation();
  };
  reader.onerror = () => {
    alert("Failed to read file");
  };
  reader.readAsText(file);
});

// Keyboard Focus Logic
keyboardBtn.addEventListener('click', () => {
  sourceText.focus();
});

document.querySelectorAll('.header-right .btn-primary').forEach(btn => {
  btn.addEventListener('click', performTranslation);
});

savePhraseBtn.addEventListener('click', async () => {
  const originalPhrase = sourceText.value.trim();
  const genericMeaning = targetText.textContent.trim();
  const language = sourceLang.value;
  
  if (!originalPhrase || !genericMeaning) {
    alert("Please translate something first before saving.");
    return;
  }

  try {
    const token = localStorage.getItem('translator_token');
    const res = await fetch(`${API_URL}/phrases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        originalPhrase,
        genericMeaning,
        language,
        region: 'IN' // Default region
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    const icon = savePhraseBtn.querySelector('span');
    icon.textContent = 'check';
    savePhraseBtn.style.backgroundColor = 'var(--success)';
    
    setTimeout(() => {
      icon.textContent = 'bookmark';
      savePhraseBtn.style.backgroundColor = '';
    }, 2000);

    loadPhrasebook(); // Refresh phrasebook view

  } catch (err) {
    alert("Error saving phrase: " + err.message);
  }
});

async function performTranslation() {
  const text = sourceText.value.trim();
  if (!text) return;

  targetText.style.display = 'none';
  loadingIndicator.classList.remove('hidden');
  contextualBlock.classList.add('hidden');

  try {
    const token = localStorage.getItem('translator_token');
    
    // In our UI, language values look like "en", but maybe they need region split. 
    // We will just pass default regions for now.
    const res = await fetch(`${API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text,
        sourceLanguage: sourceLang.value,
        targetLanguage: targetLang.value,
        sourceRegion: 'US'
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    targetText.textContent = data.data.translatedText;
    targetText.style.display = 'block';

    if (data.data.phrasesReplaced && data.data.phrasesReplaced.length > 0) {
      contextList.innerHTML = '';
      data.data.phrasesReplaced.forEach(phrase => {
        contextList.innerHTML += `
          <div class="context-item">
            <p><strong>${phrase.originalPhrase}</strong> → <em>${phrase.genericMeaning}</em></p>
            <span class="tag">Idiom Replaced</span>
          </div>
        `;
      });
      contextualBlock.classList.remove('hidden');
    }

    loadHistory(); // refresh history quietly

  } catch (err) {
    targetText.textContent = "Error: " + err.message;
    targetText.style.display = 'block';
  } finally {
    loadingIndicator.classList.add('hidden');
  }
}

// ==========================================
// HISTORY
// ==========================================

async function loadHistory() {
  const historyList = document.getElementById('history-list');
  const recentHistoryList = document.getElementById('recent-history-list');
  if (!historyList) return;

  try {
    const token = localStorage.getItem('translator_token');
    const res = await fetch(`${API_URL}/translate/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    if (res.ok) {
      if (data.data.length === 0) {
        historyList.innerHTML = '<div class="text-center p-5">No history yet. Start translating!</div>';
        if (recentHistoryList) recentHistoryList.innerHTML = '<li>No recent activity</li>';
        return;
      }

      // Populate Main History View
      historyList.innerHTML = '';
      data.data.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString(undefined, {
          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
        
        historyList.innerHTML += `
          <div class="date-group">
            <h4>${date.toUpperCase()}</h4>
            <div class="history-item">
              <div class="item-header">
                <div class="lang-path">
                  <span class="lang-badge">${item.sourceLanguage}</span>
                  <span class="material-symbols-outlined path-arrow">arrow_right_alt</span>
                  <span class="lang-badge">${item.targetLanguage}</span>
                </div>
                <div class="item-meta">
                  <span>${new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
              <div class="item-content">
                <div class="source-lang-text">${item.originalText}</div>
                <div class="target-lang-text">${item.translatedText}</div>
              </div>
            </div>
          </div>
        `;
      });

      // Populate Dashboard Recent List
      if (recentHistoryList) {
        recentHistoryList.innerHTML = '';
        data.data.slice(0, 5).forEach(item => {
          recentHistoryList.innerHTML += `<li>${item.originalText.substring(0, 30)}${item.originalText.length > 30 ? '...' : ''}</li>`;
        });
      }
    }
  } catch (e) {
    console.error("Failed to load history", e);
  }
}

// ==========================================
// PHRASEBOOK
// ==========================================

async function loadPhrasebook() {
  try {
    const res = await fetch(`${API_URL}/phrases`);
    const data = await res.json();
    
    const realPhrases = (data.data || []).map(p => ({
      region: p.region,
      phrase: p.originalPhrase,
      sub: p.language.toUpperCase(),
      lit: p.originalPhrase,
      fig: p.genericMeaning,
      tag: "Saved",
      tagClass: "business"
    }));

    phraseGrid.innerHTML = '';
    
    if (realPhrases.length === 0) {
      phraseGrid.innerHTML = '<div class="text-center p-5" style="grid-column: 1/-1;">Your phrasebook is empty. Use "Save to Phrasebook" during translation to add items!</div>';
      return;
    }

    realPhrases.forEach(p => {
      phraseGrid.innerHTML += `
        <div class="phrase-card">
          <div class="card-top">
            <span class="region-badge">${p.region}</span>
            <span class="material-symbols-outlined bookmark-icon" style="color: var(--primary)">bookmark</span>
          </div>
          <div class="phrase-title">${p.phrase}</div>
          <div class="phrase-sub">${p.sub}</div>
          
          <div class="meaning-section">
            <div class="meaning-label">LITERAL TRANSLATION</div>
            <div class="meaning-text"><em>${p.lit}</em></div>
          </div>
          <div class="meaning-section">
            <div class="meaning-label">FIGURATIVE MEANING</div>
            <div class="meaning-text">${p.fig}</div>
          </div>
          
          <div class="card-bottom">
            <div class="phrase-tag ${p.tagClass}">${p.tag}</div>
          </div>
        </div>
      `;
    });
  } catch (e) {
    console.error("Failed to load phrasebook", e);
  }
}

// ==========================================
// COMMUNITY LOGIC
// ==========================================

async function loadCommunityPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    
    if (res.ok) {
      communityFeedItems.innerHTML = '';
      data.data.forEach(post => {
        const avatar = post.userAvatar || `https://i.pravatar.cc/100?u=${post.user}`;
        communityFeedItems.innerHTML += `
          <div class="post-card">
            <div class="post-header">
              <img src="${avatar}" class="post-avatar" alt="User">
              <div class="post-meta">
                <div class="author">${post.userName} <span class="badge lang">CONTRIBUTOR</span></div>
                <div class="time">Posted recently • Cultural Question</div>
              </div>
              <button class="icon-btn"><span class="material-symbols-outlined">more_horiz</span></button>
            </div>
            <p class="post-body" style="font-size: 1.1rem; color: var(--text-main); margin: 1rem 0;">${post.content}</p>
            <div class="post-tags">
              ${post.tags.map(t => `<span class="tag">${t.toUpperCase()}</span>`).join('')}
            </div>
            <div class="post-reply">
              <div class="vote-col">
                <button class="icon-btn"><span class="material-symbols-outlined">arrow_upward</span></button>
                <span class="vote-count">${post.votes}</span>
                <button class="icon-btn"><span class="material-symbols-outlined">arrow_downward</span></button>
              </div>
              <div class="reply-content">
                <button class="btn btn-text-sm">Reply</button>
                <button class="btn btn-text-sm">Share</button>
              </div>
            </div>
          </div>
        `;
      });
    }
  } catch (e) {
    console.error("Failed to load community posts", e);
  }
}

communityPostBtn.addEventListener('click', async () => {
  const content = communityPostInput.value.trim();
  if (!content) return;

  try {
    const token = localStorage.getItem('translator_token');
    const avatar = localStorage.getItem('translator_avatar');
    
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        userAvatar: avatar,
        tags: ['General', 'Community'],
        languagePair: 'EN → JA' // Mocked pair
      })
    });

    if (res.ok) {
      communityPostInput.value = '';
      loadCommunityPosts();
    } else {
      const data = await res.json();
      alert("Error posting: " + data.error);
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
});

// ==========================================
// SEARCH LOGIC
// ==========================================

globalSearch.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  
  // Filter Community Posts
  const postCards = communityFeedItems.querySelectorAll('.post-card');
  postCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });

  // Filter History Items
  const historyItems = historyList.querySelectorAll('.history-item');
  historyItems.forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(query) ? '' : 'none';
  });
});

// ==========================================
// SETTINGS & NOTIFICATIONS
// ==========================================

const btnNotifications = document.getElementById('btn-notifications');
const notifDropdown = document.getElementById('notif-dropdown');
const notifBadge = document.getElementById('notif-badge');
const notifList = document.getElementById('notif-list');

const btnSettingsHeader = document.getElementById('btn-settings-header');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const saveSettings = document.getElementById('save-settings');
const btnSettingsDarkMode = document.getElementById('btn-settings-dark-mode');

// Notifications Toggle
if (btnNotifications) {
  btnNotifications.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('show');
    notifBadge.classList.add('hidden'); // Clear badge when opened
  });
}

document.addEventListener('click', () => {
  if (notifDropdown) notifDropdown.classList.remove('show');
});

// Settings Modal
if (btnSettingsHeader) {
  btnSettingsHeader.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });
}

if (closeSettings) {
  closeSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });
}

if (saveSettings) {
  saveSettings.addEventListener('click', () => {
    alert("Settings saved successfully!");
    settingsModal.classList.add('hidden');
  });
}

if (btnSettingsDarkMode) {
  btnSettingsDarkMode.addEventListener('click', () => {
    btnToggleDarkMode.click(); // Reuse existing dark mode logic
  });
}

// SIMULATE REAL-TIME NOTIFICATIONS
async function checkNewActivity() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    
    if (res.ok && data.data.length > 0) {
      const latestPost = data.data[0];
      
      // Update Notif List
      notifList.innerHTML = `
        <div class="notif-item">
          <strong>${latestPost.userName}</strong> shared a new post in Community.
          <div class="time">Just now</div>
        </div>
        <div class="notif-item">
          <strong>System</strong>: Your cloud sync is active.
          <div class="time">5 mins ago</div>
        </div>
      `;
      
      // Show Badge
      notifBadge.classList.remove('hidden');
    }
  } catch (e) {
    console.error("Notif check failed", e);
  }
}

// Initial check and then every 60s
checkNewActivity();
setInterval(checkNewActivity, 60000);

// Auto-refresh community feed every 30s
setInterval(() => {
  const commView = document.getElementById('view-community');
  if (commView && !commView.classList.contains('hidden')) {
    loadCommunityPosts();
  }
}, 30000);

// Init
checkAuth();
