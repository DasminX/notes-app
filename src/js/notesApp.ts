import { NotesCollection } from "./notesCollection";
import { HTMLBuilder } from "./utils/htmlBuilder";

const enum States {
  ADDING = "ADDING",
  EDITING = "EDITING",
  IDLE = "IDLE",
}

export class NotesApp {
  private state = States.IDLE;

  private notesCollection: NotesCollection = new NotesCollection();

  /* HTML Elements */
  private searchInput: HTMLInputElement = this.container.querySelector("#searchbar > input") as HTMLInputElement;

  private addNewNoteArea: HTMLDivElement = this.container.querySelector("#addNewNote") as HTMLDivElement;
  private addNewNoteCancelBtn: HTMLButtonElement = this.addNewNoteArea.querySelector(".cancel") as HTMLButtonElement;
  private addNewNoteConfirmBtn: HTMLButtonElement = this.addNewNoteArea.querySelector(".add") as HTMLButtonElement;
  private addNewNoteAreaResizer: SVGElement = this.addNewNoteArea.querySelector(".resizer") as SVGElement;

  private noNotesYetField: HTMLDivElement = this.container.querySelector("#noNotesYet") as HTMLDivElement;
  private noNotesYetFieldAddNoteBtn: HTMLButtonElement = this.noNotesYetField.querySelector(".button") as HTMLButtonElement;

  private notesList: HTMLDivElement = this.container.querySelector("#notesList") as HTMLDivElement;
  private notesListAddNoteBtn: HTMLButtonElement = this.notesList.querySelector(".button") as HTMLButtonElement;
  /* END HTML Elements */

  constructor(private container: HTMLElement) {
    /* Bind listeners */
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));
    [this.noNotesYetFieldAddNoteBtn, this.notesListAddNoteBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setState(States.ADDING);
      });
    });
  }

  /* Main state function */
  private setState(newState: keyof typeof States) {}

  /* Handlers */
  private searchNotes(e: InputEvent) {
    if (!e.target || !("value" in e.target)) return;

    this.notesCollection.filterNotesBy(e.target.value as string);
  }
}
