const checkForBody = setInterval(function () {

    if (
        document.body
    ) {
        clearInterval(checkForBody);
        const stylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');    
        const stylesheetElement = document.createElement('link');
        stylesheetElement.rel = 'stylesheet';
        stylesheetElement.setAttribute('href', stylesheetUrl);
        stylesheetElement.setAttribute('id', "hider__main-stylesheet");
        document.body.appendChild(stylesheetElement);
    }

}, 100);