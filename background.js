let tabTitles = {};

function updateTabTitles() {
  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (!tabTitles[tab.id]) {
        tabTitles[tab.id] = tab.title.replace(/^[0-9]+ /, ''); // Remove existing tab number if any
      }
      chrome.tabs.executeScript(tab.id, {
        code: 'document.title = `' + (i + 1) + ' ' + tabTitles[tab.id] + '`;'
      });
    }
  });
}

chrome.tabs.onCreated.addListener(updateTabTitles);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.title) {
    tabTitles[tabId] = changeInfo.title.replace(/^[0-9]+ /, ''); // Remove existing tab number if any
    updateTabTitles();
  }
});
setTimeout(updateTabTitles, 100);
updateTabTitles(); // Initial update on load
