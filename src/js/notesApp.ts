import { Textarea } from "./composable/Textarea";
import { Note } from "./entities/note";
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
  private addNewNoteInfo: HTMLDivElement = this.addNewNoteArea.querySelector(".infofield") as HTMLDivElement;
  private addNewNoteCancelBtn: HTMLButtonElement = this.addNewNoteArea.querySelector(".cancel") as HTMLButtonElement;

  private noNotesYetField: HTMLDivElement = this.container.querySelector("#noNotesYet") as HTMLDivElement;
  private noNotesYetFieldAddNoteBtn: HTMLButtonElement = this.noNotesYetField.querySelector(".button") as HTMLButtonElement;

  private notesList: HTMLDivElement = this.container.querySelector("#notesList") as HTMLDivElement;
  private notesListAddNoteBtn: HTMLButtonElement = this.notesList.querySelector(".button") as HTMLButtonElement;
  /* END HTML Elements */

  /* Crucial behaviour-related fields */
  private textarea: Textarea = new Textarea(this.container.querySelector(".customTextarea") as HTMLDivElement, {
    handlers: {
      add: this.addNewNoteCallback.bind(this),
    },
  });
  private notesCollection: NotesCollection = new NotesCollection(this.notesList);
  private state: keyof typeof States = this.setState(States.IDLE);
  private currentEditedNote: Note | null = null;
  /* END Crucial behaviour-related fields */

  constructor(private container: HTMLElement) {
    this.bindListeners();
  }

  private bindListeners() {
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));
    this.noNotesYetFieldAddNoteBtn.addEventListener("click", () => {
      this.state = this.setState(States.ADDING);
    });
    this.notesListAddNoteBtn.addEventListener("click", () => {
      this.state = this.setState(States.ADDING);
    });

    this.addNewNoteCancelBtn.addEventListener("click", () => {
      this.state = this.setState(States.IDLE);
    });

    this.notesList.addEventListener("click", this.notesListClickHandler.bind(this));
  }

  /* Main state function */
  private setState(newState: keyof typeof States) {
    /* Change elements visibility */
    HTMLBuilder.setVisibility(this.noNotesYetField, this.notesCollection.length === 0);
    HTMLBuilder.setVisibility(this.notesListAddNoteBtn, this.notesCollection.length > 0 && newState === States.IDLE);
    HTMLBuilder.setVisibility(this.addNewNoteArea, newState !== States.IDLE);
    HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, newState === States.IDLE);

    switch (newState) {
      case States.IDLE:
        this.currentEditedNote = null;
        this.textarea.resetValue();
        break;
      case States.ADDING:
        this.addNewNoteInfo.textContent = "Add new note";
        break;
      case States.EDITING:
        if (this.currentEditedNote != null) {
          this.addNewNoteInfo.textContent = `Edit ${this.currentEditedNote.title.toLowerCase()}`;
          this.textarea.setValue(this.currentEditedNote.content);
        }
        break;
    }

    return newState;
  }

  /* Handlers */
  private searchNotes(e: InputEvent) {
    if (!e.target || !("value" in e.target)) return;

    this.notesCollection.hideEveryNotContaining(e.target.value as string);
  }

  private notesListClickHandler(e: any) {
    if (!(e.target instanceof HTMLElement) && !(e.target instanceof SVGElement)) return;

    const noteId = (e.target.closest(".note") as HTMLDivElement | null)?.dataset?.id;
    if (noteId == null) return;

    if (e.target.classList.contains("edit")) {
      const edittedNote = this.notesCollection.getNoteById(noteId);
      if (edittedNote == null) return;

      this.currentEditedNote = edittedNote;
      this.state = this.setState(States.EDITING);
    } else if (e.target.classList.contains("remove")) {
      this.notesCollection.remove(noteId);
      if (this.currentEditedNote?.id === noteId) {
        this.state = this.setState(States.IDLE);
      } else {
        this.state = this.setState(this.state);
      }
    }
  }

  private addNewNoteCallback(text: string) {
    if (this.state === States.EDITING && this.currentEditedNote != null) {
      this.currentEditedNote.content = text;

      this.currentEditedNote = null;
    } else if (this.state === States.ADDING) {
      this.notesCollection.add(`Random note no. ${Math.random().toString().slice(2, 6)}`, text);
    }
    this.state = this.setState(States.IDLE);
  }
}
