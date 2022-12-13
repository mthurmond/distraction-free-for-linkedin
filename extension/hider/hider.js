// declare stylesheet variable globally so it can be referenced in show/hide function

let newsfeedStylesheetElement
let networkStylesheetElement
let jobsStylesheetElement
let mainStylesheetElement

const checkForHead = setInterval(function () {

    if (document.head) {

        clearInterval(checkForHead);

        const mainStylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');
        mainStylesheetElement = document.createElement('link');
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

        const networkStylesheetUrl = chrome.runtime.getURL('hider/hider-network.css');
        networkStylesheetElement = document.createElement('link');
        networkStylesheetElement.rel = 'stylesheet';
        networkStylesheetElement.setAttribute('id', "dfl__network-stylesheet");
        networkStylesheetElement.setAttribute('href', networkStylesheetUrl);
        document.head.appendChild(networkStylesheetElement);

        const jobsStylesheetUrl = chrome.runtime.getURL('hider/hider-jobs.css');
        jobsStylesheetElement = document.createElement('link');
        jobsStylesheetElement.rel = 'stylesheet';
        jobsStylesheetElement.setAttribute('id', "dfl__jobs-stylesheet");
        jobsStylesheetElement.setAttribute('href', jobsStylesheetUrl);
        document.head.appendChild(jobsStylesheetElement);

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


// let user toggle newsfeed
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
        && !document.querySelector('div.org-admin') //set to false if on company admin page
    ) {
        addNewsfeedToggleButton();
    }

}, 50);


// let user toggle network suggestions
let networkToggleButton;
let showNetwork = false;

function toggleNetwork(showNetwork) {

    networkToggleButton.innerHTML = showNetwork ? 'Hide suggestions' : 'Show suggestions';

    if (showNetwork) {
        networkStylesheetElement.setAttribute('disabled', true);
    } else {
        networkStylesheetElement.removeAttribute('disabled');
    }

}

function addNetworkToggleButton() {
    networkToggleButton = document.createElement('button');
    networkToggleButton.id = 'dfl_network-toggle-button';
    networkToggleButton.classList.add('artdeco-button', 'mb2');
    networkToggleButton.innerHTML = showNetwork ? 'Hide suggestions' : 'Show suggestions';
    // hide button by default so it appears on page before network suggestions do
    networkToggleButton.style.visibility = 'hidden';
    networkToggleButton.addEventListener('click', function (evt) {
        networkToggleButton.blur();
        showNetwork = !showNetwork;
        toggleNetwork(showNetwork);

    });

    let mainNetworkBox = document.getElementsByClassName('mn-invitations-preview')[0];
    mainNetworkBox.insertAdjacentElement('afterend', networkToggleButton);

}

const checkForNetwork = setInterval(function () {

    // if top element in section appears and button not loaded, load button
    if (
        document.getElementsByClassName('mn-invitations-preview')[0]
        && !document.getElementById('dfl_network-toggle-button')
    ) {
        addNetworkToggleButton();
    }

    // if button is loaded and hidden, and suggestions element is loaded, make button visible
    if (
        document.getElementById('dfl_network-toggle-button')
        && (document.getElementById('dfl_network-toggle-button').style.visibility == 'hidden')
        && document.querySelector('.artdeco-card.mb4.overflow-hidden:first-of-type')
    ) {
        document.getElementById('dfl_network-toggle-button').style.visibility = 'visible';
    }

}, 50);

// let user toggle job recommendations
let jobsToggleButton;
let showJobs = false;

function toggleJobs() {
    jobsToggleButton.innerHTML = showJobs ? 'Hide recommendations' : 'Show recommendations';
    if (showJobs) {
        jobsStylesheetElement.setAttribute('disabled', true);
    } else {
        jobsStylesheetElement.removeAttribute('disabled');
    }
}

// toggle 'show more results' button on jobs page. should be hidden when jobs are hidden. 
function toggleResultsButton() {
    const jobPageSpans = document.querySelectorAll('span.artdeco-button__text')
    // find 'show results' span then hide parent button
    for (let i = 0; i < jobPageSpans.length; i++) {
        if (jobPageSpans[i].textContent == '\n    Show more results\n') {
            const showResultsButton = jobPageSpans[i].parentElement
            const buttonVisibility = showJobs ? 'visible' : 'hidden';
            showResultsButton.style.visibility = buttonVisibility
            break
        }
    }
}

function addJobsToggleButton() {
    jobsToggleButton = document.createElement('button');
    jobsToggleButton.id = 'dfl_jobs-toggle-button';
    jobsToggleButton.classList.add('artdeco-button', 'mb2');
    jobsToggleButton.innerHTML = showJobs ? 'Hide recommendations' : 'Show recommendations';
    jobsToggleButton.addEventListener('click', function (evt) {
        jobsToggleButton.blur();
        showJobs = !showJobs;
        toggleJobs();
        toggleResultsButton()
    });
    let mainJobsBox = document.getElementsByClassName('jobs-home-recent-searches')[0];
    mainJobsBox.insertAdjacentElement('afterend', jobsToggleButton);
}

const checkForJobs = setInterval(function () {
    if (
        document.getElementsByClassName('jobs-home-recent-searches')[0]
        && !document.getElementById('dfl_jobs-toggle-button')
    ) {
        addJobsToggleButton();
        toggleResultsButton()
    }
}, 50);

let masterToggleButton
let showDfl = true

function addMasterToggleButton() {
    console.log('master button added')
    masterToggleButton = document.createElement('button')
    masterToggleButton.id = 'dfl_master-toggle-button'
    masterToggleButton.classList.add('artdeco-button', 'mb2')
    masterToggleButton.innerHTML = showDfl ? 'Turn DFL off' : 'Turn DFL on'
    masterToggleButton.addEventListener('click', function (evt) {
        masterToggleButton.blur()
        showDfl = !showDfl
        toggleMasterButton()
        // removeDflElements()
        // removeDflStles()
    });
    let mainNavSearch = document.getElementById('global-nav-search')
    mainNavSearch.insertAdjacentElement('afterend', masterToggleButton)
}

function toggleMasterButton() {
    console.log('master button toggled')
    masterToggleButton.innerHTML = showDfl ? 'Turn DFL off' : 'Turn DFL on'
    if (showDfl) {
        mainStylesheetElement.removeAttribute('disabled')
        jobsStylesheetElement.removeAttribute('disabled')
        newsfeedStylesheetElement.removeAttribute('disabled')
        networkStylesheetElement.removeAttribute('disabled')
        // add buttons back
    } else {
        mainStylesheetElement.setAttribute('disabled', true)
        jobsStylesheetElement.setAttribute('disabled', true)
        newsfeedStylesheetElement.setAttribute('disabled', true)
        networkStylesheetElement.setAttribute('disabled', true)
        // remove buttons back
    }
}

const checkForNav = setInterval(function () {
    if (
        document.getElementById('global-nav-search')
        && !document.getElementById('dfl_master-toggle-button')
    ) {
        addMasterToggleButton()
        // toggleMasterButton()
    }
}, 50);