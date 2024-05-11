function updateTabTitles() {
  console.log("Background script running!"); // For debugging purposes

  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const newTitle = `${i + 1} ${tab.title}`;
      chrome.tabs.update(tab.id, { active: true, title: newTitle });
    }
  });
}


chrome.tabs.onCreated.addListener(updateTabTitles);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.title) {
    updateTabTitles();
  }
});
setTimeout(updateTabTitles, 100);
updateTabTitles(); // Initial update on load
