// declare stylesheet variable globally so it can be referenced in show/hide function

let newsfeedStylesheetElement; 

const checkForHead = setInterval(function () {

    if (document.head) {

        clearInterval(checkForHead);

        const mainStylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');
        const mainStylesheetElement = document.createElement('link');
        mainStylesheetElement.rel = 'stylesheet';
        mainStylesheetElement.setAttribute('id', "dfl__main-stylesheet");
        mainStylesheetElement.setAttribute('href', mainStylesheetUrl);
        document.head.appendChild(mainStylesheetElement);

        const newsfeedStylesheetUrl = chrome.runtime.getURL('hider/hider-newsfeed.css');
        newsfeedStylesheetElement = document.createElement('link');
        newsfeedStylesheetElement.rel = 'stylesheet';
        newsfeedStylesheetElement.setAttribute('id', "dfl__newsfeed-stylesheet");
        newsfeedStylesheetElement.setAttribute('href', newsfeedStylesheetUrl);
        document.head.appendChild(newsfeedStylesheetElement);

    }

}, 100);

//remove message count from title
const checkForTitle = setInterval(function () {

    if (document.title) {

        clearInterval(checkForTitle);

        document.title = 'LinkedIn';

        //activate the mutation observer
        titleObserver = new MutationObserver(function (mutations) {
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
        faviconObserver = new MutationObserver(function (mutations) {
            if (document.querySelector('link[rel*="icon"]').href != noMessageFavicon) {
                document.querySelector('link[rel*="icon"]').href = noMessageFavicon;
            }
        });

        //set mutation observer that swaps the "no message" favicon back in if it's ever changed while messages are hidden. 
        faviconObserver.observe(
            document.querySelector('link[rel*="icon"]'),
            { characterData: true, attributes: true }
        );

    }

}, 100);



let newsfeedToggleButton;
let showNewsfeed = false;

function toggleNewsfeed(showNewsfeed) {

    newsfeedToggleButton.innerHTML = showNewsfeed ? 'Hide newsfeed' : 'Show newsfeed';

    if (showNewsfeed) {
        newsfeedStylesheetElement.setAttribute('disabled', true);
    } else {
        newsfeedStylesheetElement.removeAttribute('disabled');
    }

}

function addNewsfeedToggleButton() {
    newsfeedToggleButton = document.createElement('button');
    newsfeedToggleButton.id = 'dfl_newsfeed-toggle-button';
    newsfeedToggleButton.classList.add('artdeco-button', 'mb2');
    newsfeedToggleButton.innerHTML = showNewsfeed ? 'Hide newsfeed' : 'Show newsfeed';
    
    newsfeedToggleButton.addEventListener('click', function (evt) {
       
        newsfeedToggleButton.blur();
        showNewsfeed = !showNewsfeed;
        toggleNewsfeed(showNewsfeed);

    });

    let mainNewsfeedBox = document.getElementsByClassName('share-box-feed-entry__closed-share-box')[0];
    mainNewsfeedBox.insertAdjacentElement('afterend', newsfeedToggleButton);

}

const checkForNewsfeed = setInterval(function () {

    if (
        document.getElementsByClassName('share-box-feed-entry__closed-share-box')[0]
        && !document.getElementById('dfl_newsfeed-toggle-button')
    ) {
        addNewsfeedToggleButton();
    }

}, 50);










// let networkSuggestionsToggleButton; 
// let showPeopleYouKnowElement;

// function getPeopleYouKnowElement() {
//     let peopleYouKnowChild = document.getElementsByClassName('discover-cohort-view--list-item')[0];
//     let peopleYouKnowParent = peopleYouKnowChild.parentNode
//     return peopleYouKnowParent;

// }

// function getMoreSuggestionsElement() {
//     let moreSuggestionsElement = document.querySelector('div[data-launchpad-scroll-anchor="pymk"]');
//     return moreSuggestionsElement;

// }

// function changeNetworkSuggestionsDisplay(desiredDisplay) {

//     let peopleYouKnowElement = getPeopleYouKnowElement();
//     peopleYouKnowElement.style.display = desiredDisplay;

//     let moreSuggestionsElement = getMoreSuggestionsElement();
//     moreSuggestionsElement.style.display = desiredDisplay;

// }

// function toggleSuggestedPeople(showSuggestedPeople) {

//     networkSuggestionsToggleButton.innerHTML = showSuggestedPeople ? 'Hide suggestions' : 'Show suggestions';
//     const displayValue = showSuggestedPeople ? 'block' : 'none';
//     changeNetworkSuggestionsDisplay(displayValue);

// }

// function addSuggestionsToggleButton() {

//     networkSuggestionsToggleButton = document.createElement('button');
//     networkSuggestionsToggleButton.id = 'dfl_network-suggestions-toggle';
//     networkSuggestionsToggleButton.classList.add('artdeco-button', 'mb2');
//     networkSuggestionsToggleButton.innerHTML = 'Show suggestions';
//     showPeopleYouKnowElement = false;

//     networkSuggestionsToggleButton.addEventListener('click', function (evt) {

//         networkSuggestionsToggleButton.blur();
//         showPeopleYouKnowElement = !showPeopleYouKnowElement;
//         toggleSuggestedPeople(showPeopleYouKnowElement);

//     });

//     let peopleYouKnowElement = getPeopleYouKnowElement();

//     peopleYouKnowElement.insertAdjacentElement('beforebegin', networkSuggestionsToggleButton);

// }

// const checkForNetworkSuggestions = setInterval(function () {

//     if (
//     document.getElementsByClassName('discover-cohort-view--list-item')[0]
//     && !document.getElementById('dfl_network-suggestions-toggle') 
//     ) {

//         changeNetworkSuggestionsDisplay('none');
//         addSuggestionsToggleButton();

//     }

// }, 200);