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
    const newTitle = changeInfo.title.replace(/^[0-9]+ /, ''); // Remove existing tab number if any
    if (tabTitles[tabId] !== newTitle) {
      tabTitles[tabId] = newTitle;
      updateTabTitles();
    }
  }
}, {properties: ['title']}); // Only listen for title changes

chrome.tabs.onMoved.addListener(updateTabTitles); // Update tab titles when tabs are moved
chrome.tabs.on
