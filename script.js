window.onload = function () {
    console.log("script file exectured");
    const fileUpload = document.getElementById('fileUpload');
    const openWhatsappBtn = document.getElementById('openWhatsappBtn');

    // Upload functionality (same as before)
    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return; // No file selected
        }

        // index.html:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "uploadExcel", file: file });
        });
    });

    // Open WhatsApp Web button functionality
    openWhatsappBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: "https://web.whatsapp.com/" });
    });
}
