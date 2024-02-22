document.addEventListener('DOMContentLoaded', function() {
    // Request email ID from background script
    chrome.runtime.sendMessage({action: "getEmailId"}, function(response) {
        if (response.error) {
              document.getElementById('emailId').textContent = response.error;
          } else {
              document.getElementById('emailId').textContent = response.emailId || 'No email ID available.';
              getEmailList(); // Proceed to get email list if email ID is successfully retrieved
        }
    });
});

function getEmailList() {
    // Request email list from background script
    chrome.runtime.sendMessage({action: "getEmailList"}, function(response) {
      const emailListElement = document.getElementById('emailList');
      emailListElement.innerHTML = ''; // Clear existing list
      if (response.error) {
        emailListElement.innerHTML = `<li>${response.error}</li>`;
      } else {
        response.emails.forEach(email => {
            const li = document.createElement('li');
            li.textContent = email.subject; // Adjust based on actual email object structure
                emailListElement.appendChild(li);
            });
        }
    });
}