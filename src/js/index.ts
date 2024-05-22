import { NotesApp } from "./notesApp";

(() => {
  const notesAppContainer = document.querySelector("#notesAppContainer");
  if (!(notesAppContainer instanceof HTMLElement)) {
    throw new Error("Notes app container does not exist. Leaving...");
  }

  new NotesApp(notesAppContainer);
})();
