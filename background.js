// Firefox add-on that numbers each tab in order to facilitate tab-switching to users who use keyboard shortcuts. Safe to use, no malicious code. You can also check the code out youself on my github repository: https://github.com/siizx/firefox_tabs_numbering
// Author: Andrea P. from Italy (andreczw) (siizx@live.it).

let tabTitles = {};

function updateTabTitles() {
  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (!tabTitles[tab.id]) {
        tabTitles[tab.id] = tab.title.replace(/^[0-9]+ /, ''); // Remove existing tab number if any
      }
      const newTitle = (i + 1) + ' ' + tabTitles[tab.id];
      if (tab.title !== newTitle) {
        chrome.tabs.executeScript(tab.id, {
          code: 'document.title = `' + newTitle + '`;'
        });
      }
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
chrome.tabs.onDetached.addListener(updateTabTitles); // Update tab titles when tabs are detached
chrome.tabs.onAttached.addListener(updateTabTitles); // Update tab titles when tabs are attached

setTimeout(updateTabTitles, 100);
updateTabTitles(); // Initial update on load
