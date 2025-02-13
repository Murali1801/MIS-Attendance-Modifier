chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("mis.aldel.lan/sjcet/view_stud_attendance.php")) {
        chrome.storage.local.get(["enabled"], function(result) {
            if (result.enabled) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: modifyAttendanceTable
                });
            }
        });
    }
});
