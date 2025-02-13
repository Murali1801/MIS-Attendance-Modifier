document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitch = document.getElementById("toggleModifications");
    const refreshBtn = document.getElementById("refreshData");

    // Load saved state
    chrome.storage.sync.get("modificationsEnabled", (data) => {
        toggleSwitch.checked = data.modificationsEnabled ?? true;
    });

    // Handle toggle switch
    toggleSwitch.addEventListener("change", function () {
        chrome.storage.sync.set({ modificationsEnabled: toggleSwitch.checked }, () => {
            console.log("Modifications enabled:", toggleSwitch.checked);
        });

        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (enabled) => {
                    localStorage.setItem("modificationsEnabled", enabled);
                    window.location.reload(); // Reload to apply changes
                },
                args: [toggleSwitch.checked],
            });
        });
    });

    // Refresh Data
    refreshBtn.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    localStorage.setItem("forceRefresh", true);
                    window.location.reload();
                }
            });
        });
    });
});
