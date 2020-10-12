import { queryOxford } from "../network/index.js";
import { playSound } from "../helper/audio.js";

const events = {
  TRANSLATE: "translate",
  SPEAK: "speak",
};

chrome.runtime.onInstalled.addListener(function (details) {
  console.log("Extension is installed", details);
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  console.log(req, sender);
  switch (req.event) {
    case events.TRANSLATE:
      translate(req.payload, sendResponse);
      break;
    case events.SPEAK:
      processAudio(req.payload, sendResponse);
      break;
  }
  return true;
});

function processAudio({ srcMp3, srcOgg }, sendResponse) {
  if (!!srcMp3 && !!srcOgg) {
    try {
      playSound(srcMp3, srcOgg);
      sendResponse({ message: "Success" });
    } catch (error) {
      sendResponse({ error: true, message: "Error" });
      throw error;
    }
  }
}

function translate(question, sendResponse) {
  // sendResponse({ html: question });
  queryOxford(question)
    .catch((err) => sendResponse({ error: true, ...err }))
    .then(({ html, status }) => {
      let root = document.createElement("html");
      root.innerHTML = html;

      switch (status) {
        case 200:
          let webtop = root.getElementsByClassName("webtop")[0];
          return sendResponse({ html: webtop.outerHTML });
        case 404:
          break;

        default:
          throw { message: "Status code undefined" };
      }
    })
    .catch((err) => sendResponse({ error: true, ...err }));
}
