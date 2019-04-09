class MemDataStore {
  constructor() {
    this._openedTabsCount = 0;
    this._onAllTabsClosedListeners = [];
  }

  addAllTabsClosedListener(listenerToAdd) {
    this._onAllTabsClosedListeners = [
      ...this._onAllTabsClosedListeners,
      listenerToAdd
    ];
  }

  removeAllTabsClosedListener(listenerToRemove) {
    this._onAllTabsClosedListeners = this._onAllTabsClosedListeners.filter(
      listener => {
        return listenerToRemove !== listener;
      }
    );
  }

  set openedTabsCount(value) {
    this._openedTabsCount = value;

    if (value === 0) {
      this._onAllTabsClosedListeners.forEach(listener => {
        listener.call(null);
      });
    }
  }

  get openedTabsCount() {
    return this._openedTabsCount();
  }
}

const clearBrowsingData = () => {
  chrome.browsingData.remove(
    {},
    {
      appcache: true,
      cache: true,
      cacheStorage: true,
      cookies: true,
      downloads: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      localStorage: true,
      pluginData: false,
      passwords: true,
      serviceWorkers: true,
      webSQL: true
    },
    () => {
      console.log("Browsing data has been cleared!");
    }
  );
};

const memDataStore = new MemDataStore();
memDataStore.addAllTabsClosedListener(() => {
  clearBrowsingData();
});

const updateNumberOfTabs = () => {
  chrome.tabs.query({}, tabs => {
    memDataStore.openedTabsCount = tabs.length;
  });
};
chrome.tabs.onCreated.addListener(updateNumberOfTabs);
chrome.tabs.onRemoved.addListener(updateNumberOfTabs);

clearBrowsingData();
