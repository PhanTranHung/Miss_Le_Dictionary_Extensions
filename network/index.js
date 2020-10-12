function fetchUrl(url, query = "", data = {}, method = "GET") {
  return new Promise((reslove, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(xhr.responseText);
        reslove({ html: xhr.responseText, status: xhr.status });
      }
    }; // Implemented elsewhere.

    xhr.addEventListener("load", (evt) => {
      console.log("The transfer is complete.");
    });
    xhr.addEventListener("error", (evt) =>
      transferError(evt, "An error occurred while transferring the file.")
    );
    xhr.addEventListener("abort", (evt) =>
      transferError(evt, "The transfer has been canceled by the user.")
    );
    xhr.addEventListener("timeout", (evt) => transferError(evt, "Time out!!!"));

    function transferError(evt, message) {
      console.log(message);
      reject({ message, evt });
    }

    xhr.timeout = 5000;
    xhr.open(method, url, true);
    xhr.send();
  });
}

export function queryOxford(question) {
  question = question.trim();

  let url =
    "https://www.oxfordlearnersdictionaries.com/definition/english/" + question;
  return fetchUrl(url);
}
