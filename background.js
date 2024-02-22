const apiUrl = 'https://api.guerrillamail.com/ajax.php';

// Function to get or create an email ID
function getEmailId(callback) {
    // Check if an email ID already exists in storage
    chrome.storage.local.get(['emailId', 'sessionId'], function(result) {
        if (result.emailId && result.sessionId) {
            // If found, use the existing email ID
            callback(result.emailId);
        } else {
            // If not found, create a new email ID
            fetch(`${apiUrl}?f=get_email_address&lang=en`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                const emailId = data.email_addr;
                const sessionId = data.sid_token;
                // Store the new email ID and session ID
                chrome.storage.local.set({emailId: emailId, sessionId: sessionId}, function() {
                    callback(emailId);
                });
            })
            .catch(error => console.error('Error fetching email ID:', error));
        }
    });
}

// Function to get the list of received emails
function getEmailList(sessionId, callback) {
    fetch(`${apiUrl}?f=get_email_list&offset=0&sid_token=${sessionId}`, {
        method: 'GET'
    })
    .then(response => {
        if(response.ok && response.status === 200) {
            return response.json(); // Only parse as JSON if response is OK
        } else {
            throw new Error('API returned status ' + response.status);
        }
    })
    .then(data => {
        if(data && data.list) { // Check if 'list' is a property of data
            const emails = data.list;
            callback(emails);
        } else {
            throw new Error('No emails found in the response');
        }
    })
    .catch(error => {
        console.error('Error fetching email list:', error);
        callback(null, error); // Pass the error to the callback for proper handling
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getEmailId") {
        getEmailId(sendResponse);
        return true; // Indicates asynchronous response
    } else if (request.action === "getEmailList") {
        chrome.storage.local.get(['sessionId'], function(result) {
            if (result.sessionId) {
                getEmailList(result.sessionId, sendResponse);
            }
        });
        return true; // Indicates asynchronous response
    }
});