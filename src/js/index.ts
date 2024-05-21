import { NotesAppCreator } from "./NotesAppCreator";

(() => {
  const notesAppContainer = document.querySelector("#notesAppContainer");
  if (!(notesAppContainer instanceof HTMLElement)) {
    throw new Error("Notes app error does not exist. Die.");
  }

  new NotesAppCreator(notesAppContainer);
})();
