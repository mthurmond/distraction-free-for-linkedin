// create flag to control whether inbox should be hidden. set value to true and remove initial toggleInbox function call to show inbox by default. set to false and include an initial toggleInbox call to hide inbox by default.
let showInbox = false;

// declare these as global since inboxToggleButton is used in multiple functions and titleObserver is used in the mutation observer and needs to be tracked over time. 
let inboxToggleButton, titleObserver;

// add styles -->
// add inbox menu item font-weight style
const inboxFontStyle = document.createElement('style');
inboxFontStyle.classList.add('hider__inbox-font-style');
document.body.appendChild(inboxFontStyle);
// create variable for selector since it requires pulling the URL to find the 'inbox' anchor element
const inboxMenuSelector = `a[href='${location.protocol + '//' + location.host + location.pathname + '#inbox'}']`;

// add unread email badge style
const emailBadgeStyle = document.createElement('style');
emailBadgeStyle.classList.add('hider__email-badge-style');
document.body.appendChild(emailBadgeStyle);

// check if user is viewing inbox, both with and without a new email window open
function checkForInboxHash() {
    if (location.hash.search('#inbox') != -1) {
        return true;
    } else {
        return false;
    }
}

// add style that hides email table on initial load to avoid flicker
let emailTableStyle = document.createElement('style');
emailTableStyle.classList.add('hider__email-table-style');
document.body.appendChild(emailTableStyle);
if (checkForInboxHash()) {
    emailTableStyle.innerHTML = `div#\\:3 { visibility: hidden !important; }`;
}

function changeTableVisibility(desiredVisibility) {
    // change emails table visibility
    document.getElementById(':3').style.visibility = desiredVisibility;
    // change table toolbar visibility
    document.querySelector("div#\\:4 [gh='tm']").style.visibility = desiredVisibility;
    // remove table styling used to avoid inbox flicker on load and when menu clicked
    emailTableStyle.innerHTML = ``;
}

function handleHashChange() {
    // remove custom inbox menu styling
    inboxFontStyle.innerHTML = '';

    // store correct visibility value based on whether the inbox is hidden
    const visibilityValue = showInbox ? 'visible' : 'hidden';

    // if user is viewing inbox
    if (checkForInboxHash()) {
        // show button
        inboxToggleButton.style.display = 'flex';
        // flip emails table and toolbar visibility
        changeTableVisibility(visibilityValue);

    // if user isn't viewing inbox
    } else {
        // hide button
        inboxToggleButton.style.display = "none";
        changeTableVisibility('visible');

        // if user isn't viewing inbox and inbox is hidden
        if (!showInbox) {
            // unbold the inbox menu
            inboxFontStyle.innerHTML = `${inboxMenuSelector} { font-weight: normal !important; }`;
        }
    }
}

function addToggleButton() {
    inboxToggleButton = document.createElement('button');
    inboxToggleButton.id = 'hider__toggle-button';
    inboxToggleButton.classList.add('GN', 'GW');
    inboxToggleButton.innerHTML = 'Show inbox';

    // call "toggleInbox" when button is clicked
    inboxToggleButton.addEventListener('click', function (evt) {
        // flip the showInbox boolean to change the inbox state from it's prior state
        showInbox = !showInbox;
        toggleInbox(showInbox);
    });

    //store gmail button toolbar in a variable
    const buttonToolbar = document.getElementById(':4');
    buttonToolbar.prepend(inboxToggleButton);

    window.onhashchange = handleHashChange;

}

function swapTitle(showInbox) {

    if (showInbox) {
        // set doc title to stored value or, if null, to "Gmail"
        chrome.storage.sync.get(['titleText'], function (result) {

            // store unread messages. if none, div will not be in dom, so store '0'.
            let unreadEmailCount = document.querySelector('div.bsU') ? document.querySelector('div.bsU').innerHTML : '0';

            if (result.titleText && result.titleText != 'Gmail') {
                // if actual title was stored when messages were hidden, apply it and swap in the latest unread email count  
                document.title = result.titleText.replace(/\(([^)]+)\)/, `(${unreadEmailCount})`);

            } else {
                // if the actual title wasn't stored when messages were hidden, apply a standard title with the latest unread email count
                document.title = `Inbox (${unreadEmailCount}) - Gmail`;
            }

        });

        // remove the mutation observer
        titleObserver.disconnect();

    } else {
        chrome.storage.sync.set({ 'titleText': document.title }, function () { });
        document.title = 'Inbox hidden';

        // activate the mutation observer
        titleObserver = new MutationObserver(function (mutations) {
            if (!showInbox && document.title != 'Inbox hidden' && checkForInboxHash()) {
                document.title = 'Inbox hidden';
            }
        });

        titleObserver.observe(
            document.querySelector('title'),
            { characterData: true, childList: true }
        );
    }
}

// called when show/hide button clicked, with current "showInbox" boolean value. clicking the button adjusts the sidebar visibility and button text.  
function toggleInbox(showInbox) {
    inboxToggleButton.innerHTML = showInbox ? 'Hide inbox' : 'Show inbox';

    // remove focus from button after it's pressed, since native gmail class "GW" has an unwanted focus state
    inboxToggleButton.blur();

    // flip visibility of emails table and toolbar
    const visibilityValue = showInbox ? 'visible' : 'hidden';
    changeTableVisibility(visibilityValue);

    // flip display of unread email badge 
    const displayValue = showInbox ? 'flex' : 'none !important'
    emailBadgeStyle.innerHTML = `.bsU { display: ${displayValue}; }`;

    // swap title each time button pressed
    swapTitle(showInbox)
}

// start gmail hider by adding the button and hiding the inbox
function initiateHider() {
    addToggleButton();

    // hide messages by default when gmail first loads
    toggleInbox(showInbox);
}

// once required elements exist, call the function necessary to load gmail hider
const checkForStartConditions = setInterval(function () {
    if (
        // top nav buttons loaded
        document.querySelector("div#\\:4 [gh='tm']")
        // inbox menu item loaded
        && document.querySelector("div [data-tooltip='Inbox']")
        // title loaded
        && document.title.length > 0
        // user is viewing inbox
        && checkForInboxHash()
    ) {
        clearInterval(checkForStartConditions);
        initiateHider();
    }
}, 100);

// reduce inbox flicker when user clicks back to inbox menu item
function addInboxMenuEvent() {
    document.querySelector("div [data-tooltip='Inbox']").addEventListener('click', function (evt) {
        if (!showInbox) {
            emailTableStyle.innerHTML = `div#\\:3 { visibility: hidden !important; }`;
        }
    });
}

// shortly after window loads, call function that reduces inbox flicker
window.onload = function () {
    setTimeout(addInboxMenuEvent, 3000);
}