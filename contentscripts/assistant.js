async function init() {
  let { events, responseTypes } = await import(
    chrome.runtime.getURL("helper/variables.js")
  );

  let bubble = document.createElement("div");
  document.body.appendChild(bubble);

  let selectedNode = false,
    selectedPosition = false;

  console.log("Assistant");

  function getSelectedText() {
    if (window.getSelection) selectedNode = window.getSelection();
    else if (document.getSelection) selectedNode = document.getSelection();

    if (!selectedNode || selectedNode.toString().trim() === "")
      return undefined;
    return selectedNode.toString().trim();
  }

  document.onkeyup = function (evt) {
    if (evt.key.toLowerCase() === "shift") {
      openBubble();
    }
  };

  document.ondblclick = function (evt) {
    openBubble();
  };

  function getAbsPosition(node = selectedNode) {
    if (!node) return;
    if (selectedPosition) return selectedPosition;
    let fixedPosition = node.getRangeAt(0).getBoundingClientRect();

    selectedPosition = {
      left: fixedPosition.left + window.scrollX,
      right: fixedPosition.right + window.scrollX,
      top: fixedPosition.top + window.scrollY,
      bottom: fixedPosition.bottom + window.scrollY,
    };

    return selectedPosition;
  }

  function calBubbleCSS() {
    let ps = getAbsPosition();
    let bbCSS = new (function () {
      this.minWidth = 130;
      this.top = ps.bottom + 10;
      this.width = ps.right - ps.left;
      this.maxWidth = this.width > this.minWidth ? this.width : this.minWidth;
      this.left =
        this.width < this.minWidth
          ? ps.left - (this.minWidth - this.width) / 2
          : ps.left;
      return this;
    })();
    return bbCSS;
  }

  function openBubble() {
    let selectedText = getSelectedText();
    if (!selectedText) return;

    openLoadingBubble();
    onceSendMessage(events.TRANSLATE, selectedText, processReceive);
  }

  function onceSendMessage(event, payload, cb) {
    chrome.runtime.sendMessage({ event, payload }, cb);
  }

  function processReceive(response) {
    // console.log(response);
    switch (response.type) {
      case responseTypes.SUGGEST:
        let title = `<div class="didyoumean">Did you mean:</div>`;
        return openResultBubble(title + response.dict);

      case responseTypes.INIT:
      case responseTypes.ANSWER:
      case responseTypes.STORED:
        return openResultBubble(response.dict);

      case responseTypes.ERROR:
        console.log("An error was occur", response.message);
      default:
        console.log("Unknown response type");
    }
  }

  function openLoadingBubble() {
    let ps = calBubbleCSS();
    console.log("loading", ps);
    bubble.innerHTML = `<div class="asst-bubble" style="top: ${
      ps.top
    }px; left: ${ps.left}px; max-width: ${
      ps.maxWidth
    }px"><div class="asst-wrapper"><img class="asst-bb" src="${chrome.runtime.getURL(
      "materials/imgs/sunny-light.svg"
    )}"/></div></div>`;
  }

  function openResultBubble(html) {
    let ps = calBubbleCSS();
    console.log("result", ps);
    let innerHTML = `<div class="asst-bubble" style="top: ${ps.top}px; left: ${ps.left}px; max-width: ${ps.maxWidth}px">${html}</div>`;
    bubble.innerHTML = innerHTML;
    // hideOnClickOutside(bubble);
  }

  function removeBubble() {
    bubble.innerHTML = "";
    selectedPosition = false;
    selectedNode = false;
  }

  function hideOnClickOutside(element) {
    const isVisible = (elem) =>
      !!elem &&
      !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

    const outsideClickListener = (event) => {
      if (!element.contains(event.target) && isVisible(element)) {
        // or use: event.target.closest(selector) === null
        removeBubble();
        removeClickListener();
      }
    };

    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener);
    };

    document.addEventListener("click", outsideClickListener);
  }
}

init();
