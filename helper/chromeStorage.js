export const getData = (key, cb) => {
  chrome.storage.local.get([...key], cb);
};

export const setData = (key, value, cb = undefined) => {
  chrome.storage.local.set({ [key]: value }, cb);
};

export default {
  getData,
  setData,
};
