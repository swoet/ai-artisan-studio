// Main application logic for AI Artisan Studio

// State management
const state = {
  currentTab: 'logo',
  selectedProduct: 'tshirt',
  selectedLogoStyle: 'minimalist',
  selectedStyle: 'minimalist',
  selectedColors: 'monochrome',
  designHistory: [],
  latestImageDataUrl: null,
};

// DOM elements
const q = (sel) => document.querySelector(sel);
const logoPromptTextarea = q('#logoPrompt');
const mockupPromptTextarea = q('#mockupPrompt');
const productGrid = q('#productGrid');
const logoStyleGrid = q('#logoStyleGrid');
const mockupStyleGrid = q('#mockupStyleGrid');
const logoColorFlex = q('#logoColorFlex');
const mockupColorFlex = q('#mockupColorFlex');
const previewImage = q('#previewImage');
const generateLogoBtn = q('#generateLogoBtn');
const generateMockupBtn = q('#generateMockupBtn');
const logoBtnText = q('#logoBtnText');
const mockupBtnText = q('#mockupBtnText');
const logoLoadingArea = q('#logoLoadingArea');
const mockupLoadingArea = q('#mockupLoadingArea');
const mockupDisplayStyleSelect = q('#mockupDisplayStyle');
const downloadPng = q('#downloadPng');
const downloadJpg = q('#downloadJpg');
const historyGrid = q('#historyGrid');
const notification = q('#notification');

// Tab switching
function switchTab(tab) {
  state.currentTab = tab;
  
  document.getElementById('logoTab').className = tab === 'logo' ? 'tab-button active' : 'tab-button';
  document.getElementById('mockupTab').className = tab === 'mockup' ? 'tab-button active' : 'tab-button';
  
  document.getElementById('logoSection').className = tab === 'logo' ? '' : 'hidden';
  document.getElementById('mockupSection').className = tab === 'mockup' ? '' : 'hidden';
}

// Initialize controls
function initControls() {
  // Logo style buttons
  CONFIG.logoStyles.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card p-4 text-left focus-ring font-body transition-all duration-300 hover:card-elevated';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', s.id === state.selectedLogoStyle ? 'true' : 'false');
    btn.textContent = s.name;
    btn.addEventListener('click', () => selectLogoStyle(s.id, btn));
    logoStyleGrid.appendChild(btn);
    if (s.id === state.selectedLogoStyle) selectLogoStyle(s.id, btn, true);
  });

  // Design style buttons
  CONFIG.designStyles.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card p-4 text-left focus-ring font-body transition-all duration-300 hover:card-elevated';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', s.id === state.selectedStyle ? 'true' : 'false');
    btn.textContent = s.name;
    btn.addEventListener('click', () => selectStyle(s.id, btn));
    mockupStyleGrid.appendChild(btn);
    if (s.id === state.selectedStyle) selectStyle(s.id, btn, true);
  });

  // Product cards
  CONFIG.productTypes.forEach((p) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card p-4 text-left flex items-center gap-4 focus-ring font-body transition-all duration-300 hover:card-elevated';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', p.id === state.selectedProduct ? 'true' : 'false');
    btn.innerHTML = `<div class="text-3xl">${p.emoji}</div><div><div class="font-semibold text-text-primary">${p.name}</div><div class="text-xs text-text-secondary">${p.prompt_modifier}</div></div>`;
    btn.addEventListener('click', () => selectProduct(p.id, btn));
    productGrid.appendChild(btn);
    if (p.id === state.selectedProduct) selectProduct(p.id, btn, true);
  });

  // Color swatches
  CONFIG.colorSchemes.forEach((c) => {
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'color-swatch focus-ring';
    sw.title = c.name;
    sw.setAttribute('aria-label', c.name);
    sw.setAttribute('role', 'radio');
    sw.style.background = c.gradient;
    sw.addEventListener('click', () => selectLogoColor(c.id, sw));
    logoColorFlex.appendChild(sw);
    if (c.id === state.selectedColors) selectLogoColor(c.id, sw, true);
  });

  CONFIG.colorSchemes.forEach((c) => {
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'color-swatch focus-ring';
    sw.title = c.name;
    sw.setAttribute('aria-label', c.name);
    sw.setAttribute('role', 'radio');
    sw.style.background = c.gradient;
    sw.addEventListener('click', () => selectMockupColor(c.id, sw));
    mockupColorFlex.appendChild(sw);
    if (c.id === state.selectedColors) selectMockupColor(c.id, sw, true);
  });

  mockupDisplayStyleSelect.value = CONFIG.displayStyles[0].name;
}

// Selection handlers
function selectLogoStyle(id, el, initial=false) {
  state.selectedLogoStyle = id;
  logoStyleGrid.querySelectorAll('button').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  if (el) { el.classList.add('selected'); el.setAttribute('aria-checked', 'true'); if (!initial) el.focus(); }
}

function selectStyle(id, el, initial=false) {
  state.selectedStyle = id;
  mockupStyleGrid.querySelectorAll('button').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  if (el) { el.classList.add('selected'); el.setAttribute('aria-checked', 'true'); if (!initial) el.focus(); }
}

function selectProduct(id, el, initial=false) {
  state.selectedProduct = id;
  productGrid.querySelectorAll('button').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  if (el) { el.classList.add('selected'); el.setAttribute('aria-checked', 'true'); if (!initial) el.focus(); }
}

function selectLogoColor(id, el, initial=false) {
  state.selectedColors = id;
  logoColorFlex.querySelectorAll('button').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  if (el) { el.classList.add('selected'); el.setAttribute('aria-checked', 'true'); if (!initial) el.focus(); }
}

function selectMockupColor(id, el, initial=false) {
  state.selectedColors = id;
  mockupColorFlex.querySelectorAll('button').forEach((b) => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  if (el) { el.classList.add('selected'); el.setAttribute('aria-checked', 'true'); if (!initial) el.focus(); }
}

// Prompt building
function buildLogoPrompt() {
  const userInput = logoPromptTextarea.value.trim();
  const style = CONFIG.logoStyles.find((s) => s.id === state.selectedLogoStyle);
  const color = CONFIG.colorSchemes.find((c) => c.id === state.selectedColors);

  const qualityModifiers = 'high-resolution, print-ready, clean edges, vector-friendly composition, centered layout, transparent background';
  const base = userInput || `A professional logo design`;

  const parts = [
    base,
    style.prompt_modifier,
    color.prompt_modifier,
    qualityModifiers,
    '1:1 aspect ratio, suitable for merchandise printing',
  ];

  return parts.filter(Boolean).join(', ');
}

function buildMockupPrompt() {
  const userInput = mockupPromptTextarea.value.trim();
  const product = CONFIG.productTypes.find((p) => p.id === state.selectedProduct);
  const style = CONFIG.designStyles.find((s) => s.id === state.selectedStyle);
  const color = CONFIG.colorSchemes.find((c) => c.id === state.selectedColors);
  const displayName = mockupDisplayStyleSelect.value;

  const qualityModifiers = 'high-resolution, print-ready, clean edges, vector-friendly composition, centered layout';
  const base = userInput || `A professional ${product.name.toLowerCase()} design`;

  const parts = [
    base,
    product.prompt_modifier,
    style.prompt_modifier,
    color.prompt_modifier,
    displayName === 'Flat Design (Vector)' ? 'vector-friendly, crisp lines' : (displayName === '3D Product Mockup' ? 'highly realistic 3D mockup' : 'lifestyle scene, natural setting'),
    qualityModifiers,
    'transparent background if suitable, 1:1 aspect ratio',
  ];

  return parts.filter(Boolean).join(', ');
}

// Notifications
function showNotification(message, type = 'info', ttl = 4000) {
  notification.classList.remove('hidden');
  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✨' : '💡';
  const color = type === 'error' ? 'text-error' : type === 'success' ? 'text-success' : 'text-text-primary';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="flex items-center gap-3">
        <span class="text-lg">${icon}</span>
        <span class="font-body ${color}">${message}</span>
      </div>
    </div>
  `;
  clearTimeout(showNotification._t);
  showNotification._t = setTimeout(() => { notification.classList.add('hidden'); }, ttl);
}

// History management
function loadHistory() {
  try {
    const raw = localStorage.getItem('shopify-design-history');
    if (!raw) return;
    state.designHistory = JSON.parse(raw);
    renderHistory();
  } catch (e) { console.warn('Failed to read history', e); }
}

function saveHistory() {
  try {
    localStorage.setItem('shopify-design-history', JSON.stringify(state.designHistory.slice(0, 12)));
  } catch (e) { console.warn('Failed to save history', e); }
}

function addToHistory(dataUrl, meta) {
  const id = Date.now().toString(36);
  state.designHistory.unshift({ id, dataUrl, meta });
  state.designHistory = state.designHistory.slice(0, 12);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyGrid.innerHTML = '';
  state.designHistory.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'border rounded-md overflow-hidden relative group';
    card.innerHTML = `
      <img src="${item.dataUrl}" alt="recent design" class="w-full h-28 object-cover"/>
      <div class="p-2 text-xs text-gray-600 line-clamp-2">${(item.meta && item.meta.summary) ? item.meta.summary : ''}</div>
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60">
        <button data-id="${item.id}" class="bg-white px-3 py-1 rounded-md border reload-btn focus-ring">Reload</button>
      </div>
    `;
    historyGrid.appendChild(card);
  });

  historyGrid.querySelectorAll('.reload-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const found = state.designHistory.find((d) => d.id === id);
      if (found) {
        previewImage.src = found.dataUrl;
        state.latestImageDataUrl = found.dataUrl;
        showNotification('Design reloaded into preview', 'success', 1800);
      }
    });
  });
}

// Download functionality
async function downloadImage(format = 'png') {
  if (!state.latestImageDataUrl) {
    showNotification('No image to download', 'error', 3000);
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = state.latestImageDataUrl;
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

  const size = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (format === 'jpg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size); } else { ctx.clearRect(0, 0, size, size); }

  const ratio = Math.min(size / img.width, size / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(img, x, y, w, h);

  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpg' ? 0.92 : undefined;
  const dataUrl = canvas.toDataURL(mime, quality);

  const a = document.createElement('a');
  a.href = dataUrl;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const type = state.currentTab === 'logo' ? 'logo' : 'mockup';
  a.download = `ai-artisan-${type}-${ts}.${format === 'jpg' ? 'jpg' : 'png'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// API integration
async function callGeminiImagen(promptText, attempt = 0) {
  const maxAttempts = 5;
  const backoffBase = 700;

  try {
    const resp = await fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText }),
    });

    if (resp.status === 429) {
      if (attempt < maxAttempts) {
        const delay = backoffBase * Math.pow(2, attempt) + Math.random() * 200;
        await new Promise((r) => setTimeout(r, delay));
        return callGeminiImagen(promptText, attempt + 1);
      }
      throw new Error('Rate limited repeatedly. Try again later.');
    }

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || `API error ${resp.status}`);
    }

    const json = await resp.json();
    
    if (!json.image) {
      throw new Error('No image found in API response');
    }

    return json.image;
  } catch (err) { throw err; }
}

// Generation functions
async function generateLogo() {
  try {
    logoBtnText.textContent = 'Generating...';
    generateLogoBtn.disabled = true;
    logoLoadingArea.classList.remove('hidden');

    const prompt = buildLogoPrompt();

    try {
      const serverCheck = await fetch('/api/generate', { method: 'HEAD' });
      if (!serverCheck.ok) {
        throw new Error('Server not available');
      }
    } catch (err) {
      const placeholder = svgPlaceholder(prompt, 'logo');
      state.latestImageDataUrl = placeholder;
      previewImage.src = placeholder;
      addToHistory(placeholder, { summary: prompt, type: 'logo' });
      showNotification('Server not available. Make sure to run "npm start" and set up your API key in .env file.', 'info', 5000);
      return;
    }

    const dataUrl = await callGeminiImagen(prompt);
    state.latestImageDataUrl = dataUrl;
    previewImage.src = dataUrl;
    addToHistory(dataUrl, { summary: prompt, type: 'logo' });
    showNotification('Logo generated and added to history', 'success', 2500);
  } catch (err) {
    console.error('Generation error', err);
    showNotification(`Generation failed: ${err.message}`, 'error', 6000);
  } finally {
    logoBtnText.textContent = 'Craft Logo Design';
    generateLogoBtn.disabled = false;
    logoLoadingArea.classList.add('hidden');
  }
}

async function generateMockup() {
  try {
    mockupBtnText.textContent = 'Generating...';
    generateMockupBtn.disabled = true;
    mockupLoadingArea.classList.remove('hidden');

    const prompt = buildMockupPrompt();

    try {
      const serverCheck = await fetch('/api/generate', { method: 'HEAD' });
      if (!serverCheck.ok) {
        throw new Error('Server not available');
      }
    } catch (err) {
      const placeholder = svgPlaceholder(prompt, 'mockup');
      state.latestImageDataUrl = placeholder;
      previewImage.src = placeholder;
      addToHistory(placeholder, { summary: prompt, type: 'mockup' });
      showNotification('Server not available. Make sure to run "npm start" and set up your API key in .env file.', 'info', 5000);
      return;
    }

    const dataUrl = await callGeminiImagen(prompt);
    state.latestImageDataUrl = dataUrl;
    previewImage.src = dataUrl;
    addToHistory(dataUrl, { summary: prompt, type: 'mockup' });
    showNotification('Product mockup generated and added to history', 'success', 2500);
  } catch (err) {
    console.error('Generation error', err);
    showNotification(`Generation failed: ${err.message}`, 'error', 6000);
  } finally {
    mockupBtnText.textContent = 'Craft Product Mockup';
    generateMockupBtn.disabled = false;
    mockupLoadingArea.classList.add('hidden');
  }
}

// SVG placeholder
function svgPlaceholder(promptText, type = 'design') {
  const safe = (promptText || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const title = type === 'logo' ? 'Logo Placeholder' : 'Product Mockup Placeholder';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <g transform="translate(600,600)">
      <circle r="360" fill="#f3f4f6" />
      <text x="0" y="-20" font-size="36" text-anchor="middle" fill="#111827" font-family="Inter,Arial">${title}</text>
      <text x="0" y="40" font-size="18" text-anchor="middle" fill="#6b7280" font-family="Inter,Arial">${safe.slice(0, 80)}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// Particle animation
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Event listeners
generateLogoBtn.addEventListener('click', generateLogo);
generateMockupBtn.addEventListener('click', generateMockup);
downloadPng.addEventListener('click', () => downloadImage('png'));
downloadJpg.addEventListener('click', () => downloadImage('jpg'));

logoPromptTextarea.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateLogo();
});

mockupPromptTextarea.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateMockup();
});

// Initialize
initControls();
loadHistory();
createParticles();

if (state.designHistory.length) {
  previewImage.src = state.designHistory[0].dataUrl;
  state.latestImageDataUrl = state.designHistory[0].dataUrl;
} else {
  previewImage.src = svgPlaceholder('No design yet. Enter a prompt and click Generate.', 'logo');
}

console.info('AI Artisan Studio - Where creativity meets artificial intelligence');
