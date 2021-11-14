const githubURL = 'https://github.com/';

const mattURL = `${githubURL}/mthurmond`;
const distractionFreeLinkedinURL = `${githubURL}/mthurmond/distraction-free-linkedin`;
const feedbackURL = `${githubURL}/mthurmond/distraction-free-linkedin/issues`;

const manageExtensionsURL = 'chrome://extensions/';
const extensionsDetailsURL = `${manageExtensionsURL}?id=koobmglbcddgeoopgphanmhjppfaehaa`;

//open the appropriate new tab when the user clicks each link
document.querySelector('.feedbackLink').addEventListener('click', function() {
    chrome.tabs.create({url: feedbackURL})
});

document.querySelector('.distractionFreeLinkedinLink').addEventListener('click', function() {
    chrome.tabs.create({url: distractionFreeLinkedinURL})
});

document.querySelector('.extensionsDetailsLink').addEventListener('click', function() {
    chrome.tabs.create({url: extensionsDetailsURL})
});

document.querySelector('.manageExtensionsLink').addEventListener('click', function() {
    chrome.tabs.create({url: manageExtensionsURL})
});

document.querySelector('.mattLink').addEventListener('click', function() {
    chrome.tabs.create({url: mattURL})
});