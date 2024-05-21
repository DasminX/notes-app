import { NotesCollection } from "./notesCollection";
import { HTMLBuilder } from "./utils/htmlBuilder";

export class NotesApp {
  private notesCollection: NotesCollection = new NotesCollection();
  private searchInput: HTMLInputElement = this.container.querySelector("#searchbar > input") as HTMLInputElement;

  constructor(private container: HTMLElement) {
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));
  }

  private searchNotes(e: InputEvent) {
    if (!e.target || !("value" in e.target)) return;

    this.notesCollection.filterNotesBy(e.target.value as string);
  }
}
