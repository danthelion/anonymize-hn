function registerButtonAction(tabId, button, action) {
    // clicking button will send a message to
    // content script in the same tab as the popup
    button.addEventListener('click', () => chrome.tabs.sendMessage(tabId, { [action]: true }));
}

function setupButtons(tabId) {
    // add click actions to each 3 buttons
    registerButtonAction(tabId, document.getElementById('fullAnonymize'), 'fullAnonymize');
    registerButtonAction(tabId, document.getElementById('hashNames'), 'hashNames');
}

function injectStartSearchScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Injects JavaScript code into a page
        // chrome.tabs.executeScript(tabs[0].id, { file: 'main.js' });

        // dd click handlers for buttons
        setupButtons(tabs[0].id);
    });
}

injectStartSearchScript()
