function deterministicHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

function reset() {
    const hnuserElements = document.getElementsByClassName("hnuser");

    for (let i = 0; i < hnuserElements.length; i++) {
        const element = hnuserElements[i];
        const elementOriginalText = element.getAttribute("data-hnuser-original");

        // Create a new element to replace the original one
        const newElement = document.createElement("a");
        newElement.setAttribute("data-hnuser-original", elementOriginalText);
        newElement.setAttribute("href", `user?id=${elementOriginalText}`);
        newElement.textContent = `${elementOriginalText}`;
        newElement.className = "hnuser";

        // Replace the original element with the new one
        element.parentNode.replaceChild(newElement, element);
    }
}

function hashHnuserElements(anonymize) {
    const hnuserElements = document.getElementsByClassName("hnuser");

    for (let i = 0; i < hnuserElements.length; i++) {
        const element = hnuserElements[i];
        const elementText = element.textContent;
        const elementOriginalText = element.getAttribute("data-hnuser-original");
        let elementHash = deterministicHash(elementText);

        // Create a new element to replace the original one
        const newElement = document.createElement("a");
        newElement.setAttribute("data-hnuser-original", elementOriginalText);
        newElement.setAttribute("href", `user?id=${elementOriginalText}`);
        if (anonymize) {
            newElement.textContent = "anonymous";
        } else {
            // check if we have a hash saved in local storage for this username already
            // if so, use that instead of the hash of the username
            // this way, the same username will always be replaced with the same hash
            let savedHash = localStorage.getItem(elementOriginalText);
            if (savedHash) {
                elementHash = savedHash;
            }
            newElement.textContent = `${elementHash}`;
        }
        newElement.className = "hnuser";

        // Save original element text in a data attribute and hash pair in storage
        localStorage.setItem(elementText, elementHash.toString());

        // Replace the original element with the new one
        element.parentNode.replaceChild(newElement, element);
    }
}

function saveHashes() {
    const hnuserElements = document.getElementsByClassName("hnuser");

    for (let i = 0; i < hnuserElements.length; i++) {
        const element = hnuserElements[i];
        const elementText = element.textContent;
        let elementHash = deterministicHash(elementText);

        // Save original element text in a data attribute and hash pair in storage
        element.setAttribute("data-hnuser-original", elementText);
        localStorage.setItem(elementText, elementHash.toString());
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.hashNames) {
            hashHnuserElements(false);
        }
        if (request.fullAnonymize) {
            hashHnuserElements(true);
        }
        if (request.reset) {
            reset();
        }
    }
);

// save username hashes as attribute on hnuser elements so we can look them up later
saveHashes();
