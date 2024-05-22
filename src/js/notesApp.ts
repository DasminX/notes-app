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
  private _searchInput: HTMLInputElement = this._container.querySelector("#searchbar > input") as HTMLInputElement;

  private _addNewNoteArea: HTMLDivElement = this._container.querySelector("#addNewNote") as HTMLDivElement;
  private _addNewNoteInfo: HTMLDivElement = this._addNewNoteArea.querySelector(".infofield") as HTMLDivElement;
  private _addNewNoteCancelBtn: HTMLButtonElement = this._addNewNoteArea.querySelector(".cancel") as HTMLButtonElement;

  private _noNotesYetField: HTMLDivElement = this._container.querySelector("#noNotesYet") as HTMLDivElement;
  private _noNotesYetFieldAddNoteBtn: HTMLButtonElement = this._noNotesYetField.querySelector(".button") as HTMLButtonElement;

  private _notesList: HTMLDivElement = this._container.querySelector("#notesList") as HTMLDivElement;
  private _notesListAddNoteBtn: HTMLButtonElement = this._notesList.querySelector(".button") as HTMLButtonElement;
  /* END HTML Elements */

  /* Crucial behaviour-related fields */
  private _textarea: Textarea = new Textarea(this._container.querySelector(".customTextarea") as HTMLDivElement, {
    handlers: {
      add: this._addNewNoteCallback.bind(this),
    },
  });
  private _notesCollection: NotesCollection = new NotesCollection(this._notesList);
  private _state: keyof typeof States = this._setState(States.IDLE);
  private _currentEditedNote: Note | null = null;
  /* END Crucial behaviour-related fields */

  constructor(private readonly _container: HTMLElement) {
    this._bindListeners();
  }

  private _bindListeners() {
    this._searchInput.addEventListener("input", this._searchNotes.bind(this));
    this._noNotesYetFieldAddNoteBtn.addEventListener("click", () => {
      this._state = this._setState(States.ADDING);
    });
    this._notesListAddNoteBtn.addEventListener("click", () => {
      this._state = this._setState(States.ADDING);
    });

    this._addNewNoteCancelBtn.addEventListener("click", () => {
      this._state = this._setState(States.IDLE);
    });

    this._notesList.addEventListener("click", this._notesListClickHandler.bind(this));
  }

  /* Main state function */
  private _setState(newState: keyof typeof States) {
    /* Change elements visibility */
    HTMLBuilder.setVisibility(this._noNotesYetField, this._notesCollection.length === 0);
    HTMLBuilder.setVisibility(this._notesListAddNoteBtn, this._notesCollection.length > 0 && newState === States.IDLE);
    HTMLBuilder.setVisibility(this._addNewNoteArea, newState !== States.IDLE);
    HTMLBuilder.setVisibility(this._noNotesYetFieldAddNoteBtn, newState === States.IDLE);

    switch (newState) {
      case States.IDLE:
        this._currentEditedNote = null;
        this._textarea.resetValue();
        break;
      case States.ADDING:
        this._addNewNoteInfo.textContent = "Add new note";
        break;
      case States.EDITING:
        if (this._currentEditedNote != null) {
          this._addNewNoteInfo.textContent = `Edit ${this._currentEditedNote.title.toLowerCase()}`;
          this._textarea.setValue(this._currentEditedNote.content);
        }
        break;
    }

    return newState;
  }

  /* Handlers */
  private _searchNotes(e: InputEvent) {
    if (!e.target || !("value" in e.target)) return;

    this._notesCollection.hideEveryNotContaining(e.target.value as string);
  }

  private _notesListClickHandler(e: any) {
    if (!(e.target instanceof HTMLElement) && !(e.target instanceof SVGElement)) return;

    const noteId = (e.target.closest(".note") as HTMLDivElement | null)?.dataset?.id;
    if (noteId == null) return;

    if (e.target.classList.contains("edit")) {
      const edittedNote = this._notesCollection.getNoteById(noteId);
      if (edittedNote == null) return;

      this._currentEditedNote = edittedNote;
      this._state = this._setState(States.EDITING);
    } else if (e.target.classList.contains("remove")) {
      this._notesCollection.remove(noteId);
      if (this._currentEditedNote?.id === noteId) {
        this._state = this._setState(States.IDLE);
      } else {
        this._state = this._setState(this._state);
      }
    }
  }

  private _addNewNoteCallback(text: string) {
    if (this._state === States.EDITING && this._currentEditedNote != null) {
      this._currentEditedNote.content = text;

      this._currentEditedNote = null;
    } else if (this._state === States.ADDING) {
      this._notesCollection.add(`Random note no. ${Math.random().toString().slice(2, 6)}`, text);
    }
    this._state = this._setState(States.IDLE);
  }
}
