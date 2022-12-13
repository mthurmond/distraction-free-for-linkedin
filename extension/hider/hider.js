// declare stylesheet variable globally so it can be referenced in show/hide function

let mainStylesheetElement
let switchStylesheetElement
let newsfeedStylesheetElement
let networkStylesheetElement
let jobsStylesheetElement

const checkForHead = setInterval(function () {

    if (document.head) {

        clearInterval(checkForHead);

        const mainStylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');
        mainStylesheetElement = document.createElement('link');
        mainStylesheetElement.rel = 'stylesheet';
        mainStylesheetElement.setAttribute('id', "dfl__main-stylesheet");
        mainStylesheetElement.setAttribute('href', mainStylesheetUrl);
        document.head.appendChild(mainStylesheetElement);

        const switchStylesheetUrl = chrome.runtime.getURL('hider/hider-switch.css');
        switchStylesheetElement = document.createElement('link');
        switchStylesheetElement.rel = 'stylesheet';
        switchStylesheetElement.setAttribute('id', "dfl__switch-stylesheet");
        switchStylesheetElement.setAttribute('href', switchStylesheetUrl);
        document.head.appendChild(switchStylesheetElement);

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
        && showDfl //user wants to DFL on, and therefore wants to see this button
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
        && showDfl //user wants to DFL on, and therefore wants to see this button
    ) {
        addNetworkToggleButton();
    }

    // if button is loaded and hidden, and suggestions element is loaded, make button visible
    if (
        document.getElementById('dfl_network-toggle-button')
        && (document.getElementById('dfl_network-toggle-button').style.visibility == 'hidden')
        && document.querySelector('.artdeco-card.mb4.overflow-hidden:first-of-type')
        && showDfl //user wants to DFL on, and therefore wants to see this button
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
        && showDfl //user wants to DFL on, and therefore wants to see this button
    ) {
        addJobsToggleButton();
        toggleResultsButton()
    }
}, 50);

let masterSwitch
let showDfl = true

function toggleMasterSwitch() {
    console.log('master switch toggled')

    document.getElementById('dfl_master-switch-label').textContent = showDfl ? 'DFL on' : 'DFL off'
    
    if (showDfl) {
        // enable stylesheets
        mainStylesheetElement.removeAttribute('disabled')
        newsfeedStylesheetElement.removeAttribute('disabled')
        networkStylesheetElement.removeAttribute('disabled')
        jobsStylesheetElement.removeAttribute('disabled')
        // add buttons back
        if (newsfeedToggleButton) {
            newsfeedToggleButton.style.display = "block";
        }
        if (networkToggleButton) {
            networkToggleButton.style.display = "block";
        }
        if (jobsToggleButton) {
            jobsToggleButton.style.display = "block";
        }
    } else {
        // disable stylesheets
        mainStylesheetElement.setAttribute('disabled', true)
        newsfeedStylesheetElement.setAttribute('disabled', true)
        networkStylesheetElement.setAttribute('disabled', true)
        jobsStylesheetElement.setAttribute('disabled', true)
        // remove buttons
        if (newsfeedToggleButton) {
            newsfeedToggleButton.style.display = "none";
        }
        if (networkToggleButton) {
            networkToggleButton.style.display = "none";
        }
        if (jobsToggleButton) {
            jobsToggleButton.style.display = "none";
        }
        // set flags to false since these elements are being hidden; this ensures correct settings when the user turns DFL back on
        showNewsfeed = false
        showNetwork = false
        showJobs = false
    }
}

function addMasterToggleSwitch() {
    console.log('master switch added')

    masterSwitch = document.createElement('div')
    masterSwitch.id = 'dfl_master-switch'
    masterSwitch.classList.add('artdeco-toggle', 'artdeco-toggle--toggled')
    
    const input = document.createElement('input')
    input.classList.add('artdeco-toggle__button', 'input')
    input.id = 'dfl_master-switch-input'

    const label = document.createElement('label')
    label.classList.add('artdeco-toggle__text')
    label.id = 'dfl_master-switch-label'
    label.textContent = showDfl ? 'DFL on' : 'DFL off'
    
    masterSwitch.appendChild(input)
    masterSwitch.appendChild(label)

    // add click event listener to div
    masterSwitch.addEventListener('click', function (evt) {
        console.log('switch clicked')
        masterSwitch.classList.toggle('artdeco-toggle--toggled')
        showDfl = !showDfl
        toggleMasterSwitch()
    })
    
    const mainNavSearch = document.getElementById('global-nav-search')
    mainNavSearch.insertAdjacentElement('afterend', masterSwitch)
}


const checkForNav = setInterval(function () {
    if (
        document.getElementById('global-nav-search')
        && !document.getElementById('dfl_master-switch')
    ) {
        addMasterToggleSwitch()
    }
}, 50);