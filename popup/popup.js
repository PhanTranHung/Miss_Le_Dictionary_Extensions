const textarea = document.getElementById("text");
const btnsubmit = document.getElementById("btn-submit");
const fieldcontent = document.getElementById("field-content");

textarea.addEventListener("keypress", (e) => "Enter" === e.code && main());
btnsubmit.addEventListener("click", main);

const events = {
  TRANSLATE: "translate",
  SPEAK: "speak",
};

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   console.log(response.farewell);
// });

function main() {
  let question = textarea.value.trim();
  if (question.length <= 0) {
    textarea.value = "";
    textarea.focus();
  } else onceSendMessage(events.TRANSLATE, question, fillUI);
}

function onceSendMessage(event, payload, cb) {
  chrome.runtime.sendMessage({ event, payload }, cb);
}

function fillUI(response) {
  console.log(response);
  let html = response.html;
  fieldcontent.innerHTML = html;
  binding();
}

function binding() {
  bindingAudioBtn();
}

function bindingAudioBtn() {
  let btn_speakers = document.getElementsByClassName("audio_play_button");

  for (let btn of btn_speakers) {
    let { srcMp3, srcOgg } = btn.dataset;
    btn.addEventListener("click", (evt) =>
      onceSendMessage("speak", { srcMp3, srcOgg }, (respose) => {
        console.log(respose);
      })
    );
  }
}
