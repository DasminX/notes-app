import { NotesCollection } from "./notesCollection";
import { HTMLBuilder } from "./utils/htmlBuilder";

const enum States {
  ADDING = "ADDING",
  EDITING = "EDITING",
  IDLE = "IDLE",
}

export class NotesApp {
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

  private notesCollection: NotesCollection = new NotesCollection(this.notesList);
  private state: keyof typeof States = this.setState(States.IDLE);

  constructor(private container: HTMLElement) {
    /* Bind listeners */
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));
    [this.noNotesYetFieldAddNoteBtn, this.notesListAddNoteBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setState(States.ADDING);
      });
    });
    this.addNewNoteCancelBtn.addEventListener("click", () => {
      this.setState(States.IDLE);
    });

    this.addNewNoteConfirmBtn.addEventListener("click", () => {
      this.notesCollection.add(
        `Random note no. ${Math.random().toString().slice(2, 6)}`,
        this.addNewNoteArea.querySelector("textarea")!.value
      );
      this.setState(States.IDLE);
    });
  }

  /* Main state function */
  private setState(newState: keyof typeof States) {
    switch (newState) {
      case States.IDLE:
        HTMLBuilder.setVisibility(this.addNewNoteArea, false);
        HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, true);
        break;
      case States.ADDING:
        HTMLBuilder.setVisibility(this.addNewNoteArea, true);
        HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, false);
        break;
    }

    if (this.notesCollection.length > 0) {
      HTMLBuilder.setVisibility(this.noNotesYetField, false);
      HTMLBuilder.setVisibility(this.notesListAddNoteBtn, true);
    } else {
      HTMLBuilder.setVisibility(this.noNotesYetField, true);
      HTMLBuilder.setVisibility(this.notesListAddNoteBtn, false);
    }

    return newState;
  }

  /* Handlers */
  private searchNotes(e: InputEvent) {
    if (!e.target || !("value" in e.target)) return;

    this.notesCollection.hideEveryNotContaining(e.target.value as string);
  }
}
