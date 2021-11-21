 //load stylesheet after body loads
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

//remove message count from title
const checkForTitle = setInterval(function () {

    if (document.title) {

        clearInterval(checkForTitle);

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

//always show no messages favicon
const noMessageFavicon = chrome.runtime.getURL('/hider/favicon-no-messages.ico');

const checkForFavicon = setInterval(function () {

    if (document.querySelector('link[rel*="icon"]').href) {

        clearInterval(checkForFavicon);
        
        document.querySelector('link[rel*="icon"]').href = noMessageFavicon;

        //activate the mutation observer
        faviconObserver = new MutationObserver(function(mutations) {
            if (document.querySelector('link[rel*="icon"]').href != noMessageFavicon) {
                document.querySelector('link[rel*="icon"]').href = noMessageFavicon;
            } 
        });
    
        //set mutation observer that swaps the "no message" favicon back in if it's ever changed while messages are hidden. 
        faviconObserver.observe(
            document.querySelector('link[rel*="icon"]'),
            {characterData: true, attributes: true}
        );

    }

}, 100);

let newsfeedToggleButton; 
let showNewsfeed = false;

function getNewsfeedControls() {
    let newsfeedControls = document.getElementById('ember61'); 
    return newsfeedControls;
}

function getNewsfeedUpdates() {
    let newsfeedUpdate = document.getElementsByClassName('feed-shared-update-v2')[0];
    let newsfeedUpdates = newsfeedUpdate.parentNode.parentNode;
    return newsfeedUpdates;
}

function changeNewsfeedVisibility(desiredVisibility) {

    let newsfeedControls = getNewsfeedControls();
    newsfeedControls.style.visibility = desiredVisibility;
    
    let newsfeedUpdates = getNewsfeedUpdates();
    newsfeedUpdates.style.visibility = desiredVisibility;
    
}

function toggleNewsfeed(showNewsfeed) {

    newsfeedToggleButton.innerHTML = showNewsfeed ? 'Hide newsfeed' : 'Show newsfeed';
    const visibilityValue = showNewsfeed ? 'visible' : 'hidden';
    changeNewsfeedVisibility(visibilityValue);

}

function addToggleButton() {
    newsfeedToggleButton = document.createElement('button');
    newsfeedToggleButton.id = 'dfl_newsfeed-toggle-button';
    newsfeedToggleButton.classList.add('artdeco-button', 'mb2');
    newsfeedToggleButton.innerHTML = 'Show newsfeed';

    // call "toggleNewsfeed" when button is clicked
    newsfeedToggleButton.addEventListener('click', function (evt) {
        // flip the showNewsfeed boolean to change the inbox state from it's prior state
        newsfeedToggleButton.blur();
        showNewsfeed = !showNewsfeed;
        toggleNewsfeed(showNewsfeed);

    });

    let newsfeedElementControls = getNewsfeedControls();

    newsfeedElementControls.insertAdjacentElement("beforebegin", newsfeedToggleButton);

}

//add button to hide/show newsfeed
const checkForNewsfeed = setInterval(function () {

    if (getNewsfeedUpdates()) {

        clearInterval(checkForNewsfeed);

        // initially hides newsfeed element
        changeNewsfeedVisibility('hidden');

        addToggleButton();

    }

}, 100);