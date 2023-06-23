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

//store no messages favicon in variable
const noMessageFavicon = chrome.runtime.getURL('/hider/favicon-no-messages.ico');

// once favicon loads, swap it out for the no message favicon and activate the mutation observer to ensure favicon stays "no message" version
const checkForFavicon = setInterval(function () {

    // check if favicon exists
    if (document.querySelector('link[rel*="icon"]')) {

        // stock checking for the favicon to load
        clearInterval(checkForFavicon);
        // swap out favicon for no message favicon
        // note: multiple 'icon' elements matched this query; works ok now since browser using first one, but in future may need to be more specific
        document.querySelector('link[rel*="icon"]').href = noMessageFavicon;

        //activate the mutation observer to continually swap out favicon for no message favicon when needed
        faviconObserver = new MutationObserver(function (mutations) {
            if (document.querySelector('link[rel*="icon"]').href != noMessageFavicon) {
                document.querySelector('link[rel*="icon"]').href = noMessageFavicon;
            }
        });

        //set mutation observer
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
        // newsfeed elements exist
        document.getElementsByClassName('share-box-feed-entry__closed-share-box')[0]
        // button not already added
        && !document.getElementById('dfl_newsfeed-toggle-button')
        // not on group page
        && !document.querySelector('div#groups')
        // not on company admin page
        && !document.querySelector('div.org-admin')
        // extension is on
        && showDfl
    ) {
        addNewsfeedToggleButton();
    }

}, 50);


// let user toggle network suggestions
let networkToggleButton;
let showNetwork = false;

function toggleNetwork(showNetwork) {

    networkToggleButton.innerHTML = showNetwork ? 'Hide suggestions' : 'Show suggestions';
    
    // show/hide celebrations section if it exists
    const celebrationsLink = document.querySelector('a[href="https://www.linkedin.com/celebrations"]');
    if (celebrationsLink) {
        const celebrationsSection = celebrationsLink.parentNode;
        if (showNetwork) {
            celebrationsSection.style.visibility = 'visible';
        } else {
            celebrationsSection.style.visibility = 'hidden';
        }
    }

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
    if (
        // top element in section appears
        document.getElementsByClassName('mn-invitations-preview')[0]
        // button not yet loaded
        && !document.getElementById('dfl_network-toggle-button')
        // master toggle is on
        && showDfl
    ) {
        addNetworkToggleButton();
        // hide celebrations section if network is hidden and celebration section exists
        if (!showNetwork) {
            const celebrationsLink = document.querySelector('a[href="https://www.linkedin.com/celebrations"]')
            if (celebrationsLink) {
                const celebrationsSection = celebrationsLink.parentNode
                celebrationsSection.style.visibility = 'hidden'
            }
        }
    }
    if (
        // button is loaded
        document.getElementById('dfl_network-toggle-button')
        // button is hidden
        && (document.getElementById('dfl_network-toggle-button').style.visibility == 'hidden')
        // suggestions element is loaded
        && document.querySelector('.artdeco-card.mb4.overflow-hidden:first-of-type')
        // master toggle is on
        && showDfl
    ) {
        // make button visible
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
    
    // get main center element; appears on multiple pages but this function only runs on jobs page
    let mainCenterElement = document.querySelector('main.scaffold-layout__main');
    mainCenterElement.prepend(jobsToggleButton);
}

const checkForJobs = setInterval(function () {
    if (
        // on main jobs page
        document.querySelector('nav.jobs-home-scalable-nav')
        // center element loaded
        && document.querySelector('main.scaffold-layout__main')
        // button not loaded
        && !document.getElementById('dfl_jobs-toggle-button')
        // master switch on
        && showDfl 
    ) {
        addJobsToggleButton();
        toggleResultsButton()
    }
}, 50);

let masterSwitch
let showDfl = true

function toggleMasterSwitch() {
    masterSwitch.classList.toggle('artdeco-toggle--toggled')
    document.getElementById('dfl_master-switch-label').textContent = showDfl ? 'DFL on' : 'DFL off'
    
    if (showDfl) {
        // enable stylesheets
        mainStylesheetElement.removeAttribute('disabled')
        newsfeedStylesheetElement.removeAttribute('disabled')
        networkStylesheetElement.removeAttribute('disabled')
        jobsStylesheetElement.removeAttribute('disabled')
    } else {
        // disable stylesheets
        mainStylesheetElement.setAttribute('disabled', true)
        newsfeedStylesheetElement.setAttribute('disabled', true)
        networkStylesheetElement.setAttribute('disabled', true)
        jobsStylesheetElement.setAttribute('disabled', true)
        // remove dfl button from user's current page, if applicable
        if (newsfeedToggleButton) {
            newsfeedToggleButton.remove()
        }
        if (networkToggleButton) {
            networkToggleButton.remove()
            
            // unhide the celebrations section
            const celebrationsLink = document.querySelector('a[href="https://www.linkedin.com/celebrations"]')
            if (celebrationsLink) {
                const celebrationsSection = celebrationsLink.parentNode
                celebrationsSection.style.visibility = 'visible'
            } 
        }
        if (jobsToggleButton) {
            jobsToggleButton.remove()
            // unhide the 'show more job results' button(s)
            showJobs = true
            toggleResultsButton()
        }
        // set flags to false; ensures correct settings when the user turns the master switch back on
        showNewsfeed = false
        showNetwork = false
        showJobs = false
    }
}

function addMasterSwitch() {
    masterSwitch = document.createElement('div')
    masterSwitch.id = 'dfl_master-switch'
    masterSwitch.classList.add('artdeco-toggle', 'artdeco-toggle--toggled')
    
    const switchInput = document.createElement('input')
    switchInput.classList.add('artdeco-toggle__button', 'input')
    switchInput.id = 'dfl_master-switch-input'

    const switchLabel = document.createElement('label')
    switchLabel.classList.add('artdeco-toggle__text')
    switchLabel.id = 'dfl_master-switch-label'
    switchLabel.textContent = showDfl ? 'DFL on' : 'DFL off'
    
    masterSwitch.appendChild(switchInput)
    masterSwitch.appendChild(switchLabel)

    // add click event listener to div
    masterSwitch.addEventListener('click', function (evt) {
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
        addMasterSwitch()
    }
}, 50);