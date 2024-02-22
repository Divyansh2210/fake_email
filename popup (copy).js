// Revised to align with API's expected parameters for fetching email list
function getEmailList(sessionId, callback) {
    fetch(`${apiUrl}?f=check_email&sid_token=${sessionId}`, {
        method: 'GET' // Confirm method as per API documentation
    })
    .then(response => response.json())
    .then(data => {
        const emails = data.list; // Ensure this matches API response structure
        callback(emails);
    })
    .catch(error => {
        console.error('Error fetching email list:', error);
        callback(null, error); // Enhanced error handling for user feedback
    });
}

// Adjusted for correct HTTP method as per API documentation
// Confirm if POST is correct or if should be changed to GET
fetch(`${apiUrl}?f=get_email_address`, {
    method: 'POST' // or 'GET' if API specifies
    // Additional parameters as required by API for this action
})
.then(response => response.json())
.then(data => {
    // Process response to create or retrieve email ID
})
.catch(error => console.error('Error:', error));
