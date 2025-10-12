// Add stylesheet to top frame
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

// Add stylesheet to preload frame
const checkForPreload = setInterval(() => {
    const preloadIframe = [...document.querySelectorAll('iframe')].find(f => f.src.includes('/preload/'));
    const preloadDoc = preloadIframe?.contentDocument;

    if (preloadDoc && !preloadDoc.getElementById('dfl__main-stylesheet-preload')) {
        const mainStylesheetUrl = chrome.runtime.getURL('hider/hider.css');
        const mainStylesheetElement = document.createElement('link');
        mainStylesheetElement.rel = 'stylesheet';
        mainStylesheetElement.id = 'dfl__main-stylesheet-preload';
        mainStylesheetElement.href = mainStylesheetUrl;
        preloadDoc.head.appendChild(mainStylesheetElement);
    }
}, 100);

// Remove message count from title
const checkForTitle = setInterval(() => {
    if (document.title) {
        clearInterval(checkForTitle);
        document.title = 'LinkedIn';

        const titleObserver = new MutationObserver(() => {
            if (document.title !== 'LinkedIn') {
                document.title = 'LinkedIn';
            }
        });

        titleObserver.observe(document.querySelector('title'), {
            characterData: true,
            childList: true
        });
    }
}, 100);

// Swap favicon for no-message version
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

        faviconObserver.observe(favicon, {
            characterData: true,
            attributes: true
        });
    }
}, 100);

// Master switch toggle
let showDfl = true;

function toggleMasterSwitch() {
    const topStylesheet = document.getElementById('dfl__main-stylesheet-top');
    const preloadStylesheet = document.querySelector('iframe[src*="/preload/"]')?.contentDocument?.getElementById('dfl__main-stylesheet-preload');

    if (showDfl) {
        topStylesheet?.removeAttribute('disabled');
        preloadStylesheet?.removeAttribute('disabled');
    } else {
        topStylesheet?.setAttribute('disabled', true);
        preloadStylesheet?.setAttribute('disabled', true);
    }
}

// Add master switch toggle
setInterval(() => {
    if (!document.getElementById('dfl-toggle-container')) {
        const container = document.createElement('div');
        container.id = 'dfl-toggle-container';
        container.style.position = 'fixed';
        container.style.top = '16px';
        container.style.left = '16px';
        container.style.zIndex = '2147483647';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';
        container.style.fontFamily = '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
        container.style.background = '#e8f4f8';
        container.style.padding = '8px 12px';
        container.style.borderRadius = '20px';
        container.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
        container.style.userSelect = 'none';
        container.style.cursor = 'grab';

        const dragHandle = document.createElement('div');
        dragHandle.style.width = '4px';
        dragHandle.style.height = '16px';
        dragHandle.style.background = '#ddd';
        dragHandle.style.borderRadius = '2px';
        dragHandle.style.marginRight = '4px';
        dragHandle.style.position = 'relative';
        dragHandle.innerHTML = '<div style="position:absolute;top:0;left:0;width:100%;height:4px;background:#ddd;border-radius:2px;"></div><div style="position:absolute;top:6px;left:0;width:100%;height:4px;background:#ddd;border-radius:2px;"></div><div style="position:absolute;top:12px;left:0;width:100%;height:4px;background:#ddd;border-radius:2px;"></div>';

        const label = document.createElement('span');
        label.id = 'dfl-label';
        label.textContent = 'DFL on';
        label.style.fontSize = '13px';
        label.style.fontWeight = '600';
        label.style.color = '#333';
        label.style.transition = 'color 0.3s ease';
        label.style.cursor = 'pointer';

        const toggle = document.createElement('div');
        toggle.id = 'dfl-toggle';
        toggle.style.width = '44px';
        toggle.style.height = '24px';
        toggle.style.background = '#10b981';
        toggle.style.borderRadius = '12px';
        toggle.style.position = 'relative';
        toggle.style.cursor = 'pointer';
        toggle.style.transition = 'background 0.3s ease';
        toggle.style.flexShrink = '0';

        const slider = document.createElement('div');
        slider.id = 'dfl-slider';
        slider.style.width = '20px';
        slider.style.height = '20px';
        slider.style.background = 'white';
        slider.style.borderRadius = '50%';
        slider.style.position = 'absolute';
        slider.style.top = '2px';
        slider.style.left = '2px';
        slider.style.transition = 'left 0.3s ease';
        slider.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

        toggle.appendChild(slider);
        container.appendChild(dragHandle);
        container.appendChild(label);
        container.appendChild(toggle);

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

        // Drag functionality
        let isDragging = false;
        let hasMoved = false;
        let dragStartX, dragStartY, startX, startY;

        container.onmousedown = function (e) {
            // Don't start drag if clicking on toggle or label
            if (e.target === toggle || e.target === slider || e.target === label) {
                return;
            }
            isDragging = true;
            hasMoved = false;
            container.style.cursor = 'grabbing';
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            startX = container.offsetLeft;
            startY = container.offsetTop;
            e.preventDefault();
        };

        document.onmousemove = function (e) {
            if (isDragging) {
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                    hasMoved = true;
                }

                // Calculate new position with boundaries
                let newLeft = startX + deltaX;
                let newTop = startY + deltaY;

                // Get container dimensions
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;

                // Constrain to viewport
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - containerWidth));
                newTop = Math.max(0, Math.min(newTop, window.innerHeight - containerHeight));

                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
            }
        };

        document.onmouseup = function () {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
            }
        };

        // Toggle clicks
        toggle.onclick = toggleDfl;
        label.onclick = toggleDfl;

        document.body.appendChild(container);
    }
}, 100);