const checkForBody = setInterval(function () {

    if (document.body) {

        clearInterval(checkForBody);
        const stylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');    
        const stylesheetElement = document.createElement('link');
        stylesheetElement.rel = 'stylesheet';
        stylesheetElement.setAttribute('href', stylesheetUrl);
        stylesheetElement.setAttribute('id', "hider__main-stylesheet");
        document.body.appendChild(stylesheetElement);

    }

}, 100);

const checkForTitle = setInterval(function () {

    if (
        document.title
    ) {

        document.title = 'LinkedIn';

        //activate the mutation observer
        titleObserver = new MutationObserver(function(mutations) {
            if (document.title != 'LinkedIn') {
                document.title = 'LinkedIn';
            } 
        });
    
        titleObserver.observe(
            document.querySelector('title'),
            { characterData: true, childList: true }
        );

    }

}, 100);