import { responseTypes } from "./variables.js";

export function translate(data) {
  switch (data.type) {
    case responseTypes.SUGGEST:
      return {
        html:
          `<div class="result-header">“${data.question}” not found</div><div class="didyoumean">Did you mean:</div>` +
          data.dict,
      };

    case responseTypes.INIT:
    case responseTypes.ANSWER:
    case responseTypes.STORED:
      return { html: data.dict };

    case responseTypes.ERROR:
      return { error: "An error was occur", message: data.message };
    default:
      return { error: "Unknown response type" };
  }
}
