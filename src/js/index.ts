import { Modal } from "./composable/Modal";
import { NotesApp } from "./notesApp";

(() => {
  const notesAppContainer = document.querySelector("#notesAppContainer");
  if (!(notesAppContainer instanceof HTMLElement)) {
    throw new Error("Notes app container does not exist. Leaving...");
  }

  new NotesApp(notesAppContainer, new Modal(document.querySelector("#modalContainer") as HTMLDivElement));
})();
