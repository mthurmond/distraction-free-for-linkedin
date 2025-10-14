// --- Add stylesheet to top frame ---
const checkForTopHead = setInterval(() => {
  if (document.head && !document.getElementById('dfl__main-stylesheet-top')) {
    const mainStylesheetUrl = chrome.runtime.getURL('hider/hider.css');
    const mainStylesheetElement = document.createElement('link');
    mainStylesheetElement.rel = 'stylesheet';
    mainStylesheetElement.id = 'dfl__main-stylesheet-top';
    mainStylesheetElement.href = mainStylesheetUrl;
    document.head.appendChild(mainStylesheetElement);
  }
}, 100);

// --- Add stylesheet to preload frame (robust, no polling) ---
(function watchPreloadIframe() {
  const CSS_ID = 'dfl__main-stylesheet-preload';
  const CSS_URL = chrome.runtime.getURL('hider/hider.css');

  function tryInjectInto(iframe) {
    const doc = iframe?.contentDocument;
    if (!doc || !doc.head || doc.getElementById(CSS_ID)) return;
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.id = CSS_ID;
    link.href = CSS_URL;
    doc.head.appendChild(link);
  }

  // Fast path for an existing preload iframe
  const existing = [...document.querySelectorAll('iframe')].find(f => f.src?.includes('/preload/'));
  if (existing) {
    existing.addEventListener('load', () => tryInjectInto(existing), { once: true });
    tryInjectInto(existing);
  }

  // Observe future iframe creates/attribute changes (src swaps)
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      // New iframes added
      m.addedNodes?.forEach((n) => {
        if (n.tagName === 'IFRAME' && n.src?.includes('/preload/')) {
          n.addEventListener('load', () => tryInjectInto(n), { once: true });
          tryInjectInto(n);
        }
      });
      // Attribute changes to iframes
      if (m.type === 'attributes' && m.target?.tagName === 'IFRAME') {
        const f = m.target;
        if (f.src?.includes('/preload/')) {
          f.addEventListener('load', () => tryInjectInto(f), { once: true });
          tryInjectInto(f);
        }
      }
    }
  });
  obs.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src']
  });
})();

// --- Remove message count from title ---
const checkForTitle = setInterval(() => {
  if (document.title) {
    clearInterval(checkForTitle);
    document.title = 'LinkedIn';

    const titleEl = document.querySelector('title');
    if (!titleEl) return;
    const titleObserver = new MutationObserver(() => {
      if (document.title !== 'LinkedIn') {
        document.title = 'LinkedIn';
      }
    });
    titleObserver.observe(titleEl, { characterData: true, childList: true });
  }
}, 100);

// --- Swap favicon for no-message version ---
const noMessageFavicon = chrome.runtime.getURL('/hider/favicon-no-messages.ico');
const checkForFavicon = setInterval(() => {
  const favicon = document.querySelector('link[rel*="icon"]');
  if (favicon) {
    clearInterval(checkForFavicon);
    favicon.href = noMessageFavicon;

    const faviconObserver = new MutationObserver(() => {
      if (favicon.href !== noMessageFavicon) {
        favicon.href = noMessageFavicon;
      }
    });
    faviconObserver.observe(favicon, { attributes: true });
  }
}, 100);

// --- Master switch toggle state/behavior ---
let showDfl = true;
function toggleMasterSwitch() {
  const topStylesheet = document.getElementById('dfl__main-stylesheet-top');
  const preloadStylesheet = document.querySelector('iframe[src*="/preload/"]')
    ?.contentDocument?.getElementById('dfl__main-stylesheet-preload');

  if (showDfl) {
    topStylesheet?.removeAttribute('disabled');
    preloadStylesheet?.removeAttribute('disabled');
  } else {
    topStylesheet?.setAttribute('disabled', 'true');
    preloadStylesheet?.setAttribute('disabled', 'true');
  }
}

// --- Ensure master switch toggle exists (recreate on SPA changes; no polling) ---
(function ensureToggle() {
  function buildIfMissing() {
    if (document.getElementById('dfl-toggle-container')) return;

    // === UI construction ===
    const container = document.createElement('div');
    container.id = 'dfl-toggle-container';
    container.style.cssText = `
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: #e8f4f8;
      padding: 8px 12px;
      border-radius: 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      user-select: none;
      transition: left .25s ease, right .25s ease;
    `;

    // Side management (click-to-hop)
    const PADDING = 16;
    const SIDE_KEY = 'dfl_side'; // 'left' | 'right'
    let currentSide = localStorage.getItem(SIDE_KEY) === 'right' ? 'right' : 'left';

    function applySide(side) {
      currentSide = side;
      if (side === 'right') {
        container.style.left = '';
        container.style.right = PADDING + 'px';
      } else {
        container.style.right = '';
        container.style.left = PADDING + 'px';
      }
      localStorage.setItem(SIDE_KEY, side);
      updateArrow();
    }

    const dragHandle = document.createElement('div');
    dragHandle.id = 'dfl-drag-handle';
    dragHandle.style.cssText = `
      width: 20px;
      height: 20px;
      margin-right: 4px;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 16px;
      line-height: 1;
    `;
    function updateArrow() {
      dragHandle.innerHTML = currentSide === 'left' ? '⇨' : '⇦';
      dragHandle.title = currentSide === 'left' ? 'Move to right side' : 'Move to left side';
    }

    const label = document.createElement('span');
    label.id = 'dfl-label';
    label.textContent = showDfl ? 'DFL on' : 'DFL off';
    label.style.cssText = `font-size: 13px; font-weight: 600; color: #333; cursor: pointer;`;

    const toggle = document.createElement('div');
    toggle.id = 'dfl-toggle';
    toggle.style.cssText = `
      width: 44px;
      height: 24px;
      background: ${showDfl ? '#10b981' : '#666'};
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background 0.3s ease;
      flex-shrink: 0;
    `;

    const slider = document.createElement('div');
    slider.id = 'dfl-slider';
    slider.style.cssText = `
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: ${showDfl ? '2px' : '22px'};
      transition: left 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    toggle.appendChild(slider);

    container.appendChild(dragHandle);
    container.appendChild(label);
    container.appendChild(toggle);
    document.body.appendChild(container);

    // Apply initial side (from localStorage; defaults to left)
    applySide(currentSide);

    // Toggle function
    function toggleDfl() {
      showDfl = !showDfl;
      if (showDfl) {
        slider.style.left = '2px';
        toggle.style.background = '#10b981';
        label.textContent = 'DFL on';
      } else {
        slider.style.left = '22px';
        toggle.style.background = '#666';
        label.textContent = 'DFL off';
      }
      toggleMasterSwitch();
    }

    // Click-to-hop arrow
    dragHandle.addEventListener('click', (e) => {
      e.preventDefault();
      applySide(currentSide === 'left' ? 'right' : 'left');
    });

    // Toggle clicks
    toggle.addEventListener('click', toggleDfl);
    label.addEventListener('click', toggleDfl);
    // === end UI construction ===
  }

  // Build once now (or on DOM ready), then auto-rebuild if removed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildIfMissing, { once: true });
  } else {
    buildIfMissing();
  }

  // If LinkedIn removes/rebuilds parts of the page, put the toggle back without polling
  const obs = new MutationObserver(() => buildIfMissing());
  // Guard body presence (rare on early load)
  const target = document.body || document.documentElement;
  obs.observe(target, { childList: true, subtree: true });
})();