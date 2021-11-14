// add stylesheet to the DOM so the "message hidden" styles appear immediately
const stylesheetUrl = chrome.runtime.getURL('hider/hider-main.css');    
const stylesheetElement = document.createElement('link');
stylesheetElement.rel = 'stylesheet';
stylesheetElement.setAttribute('href', stylesheetUrl);
stylesheetElement.setAttribute('id', "hider__main-stylesheet");
document.body.appendChild(stylesheetElement);

// //once the required elements exist, this function initiates the js
// function initiateDistractionFreeLinkedin() {
//     addToggleButton();
    
//     //call this to hide messages by default when slack is first loaded
//     toggleMessages(showMessages);
// }

// //continuously check if the required elements exist. once they do, stop checking and call the appropriate function. 
// const checkForElements = setInterval(function () {
//     if (
//         document.getElementsByClassName('feed-shared-actor').length > 0 
//         && document.title.length > 0
//     ) {
//         clearInterval(checkForElements);
//         initiateDistractionFreeLinkedin();
//     }
// }, 100);