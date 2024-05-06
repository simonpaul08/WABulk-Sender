chrome.action.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;

        if (url.startsWith("https://web.whatsapp.com/")) {
            chrome.scripting
                .executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        ["919876907501", "916280183034"].forEach((number) => {
                            setTimeout(() => {
                                const body = document.querySelector("body");
                                const link = document.createElement("a");
                                link.href = `ttps://web.whatsapp.com/send?phone=${number}&text=working...`;
                                body.appendChild(link);
                                link.click();

                                setTimeout(() => {
                                    const sendButton = document.querySelector("span[data-icon='send']");
                                    sendButton.click();
                                }, 2000);
                            }, 10000);
                        });
                    }
                })
                .then(() => console.log("script injected"));
        } else {
            // Open WhatsApp Web
            chrome.tabs.create({ url: "https://web.whatsapp.com/" });
        }
    });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "uploadExcel") {
        const file = message.file;
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            console.log(fileContent);
            sendResponse({ status: "success" });
        };
        reader.readAsText(file);
    }
});