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
  private _searchInput: HTMLInputElement;

  private _addNewNoteArea: HTMLDivElement;
  private _addNewNoteInfo: HTMLDivElement;
  private _addNewNoteCancelBtn: HTMLButtonElement;

  private _noNotesYetField: HTMLDivElement;
  private _noNotesYetFieldAddNoteBtn: HTMLButtonElement;

  private _notesList: HTMLDivElement;
  private _notesListAddNoteBtn: HTMLButtonElement;
  /* END HTML Elements */

  /* Crucial behaviour-related fields */
  private _textarea: Textarea;
  private _notesCollection: NotesCollection;
  private _state: keyof typeof States;
  private _currentEditedNote: Note | null;
  /* END Crucial behaviour-related fields */

  constructor(private readonly _container: HTMLElement) {
    this._searchInput = this._container.querySelector("#searchbar > input") as HTMLInputElement;

    this._addNewNoteArea = this._container.querySelector("#addNewNote") as HTMLDivElement;
    this._addNewNoteInfo = this._addNewNoteArea.querySelector(".infofield") as HTMLDivElement;
    this._addNewNoteCancelBtn = this._addNewNoteArea.querySelector(".cancel") as HTMLButtonElement;

    this._noNotesYetField = this._container.querySelector("#noNotesYet") as HTMLDivElement;
    this._noNotesYetFieldAddNoteBtn = this._noNotesYetField.querySelector(".button") as HTMLButtonElement;

    this._notesList = this._container.querySelector("#notesList") as HTMLDivElement;
    this._notesListAddNoteBtn = this._notesList.querySelector(".button") as HTMLButtonElement;

    this._textarea = new Textarea(this._container.querySelector(".customTextarea") as HTMLDivElement, {
      handlers: {
        add: this._addNewNoteCallback.bind(this),
      },
    });
    this._notesCollection = new NotesCollection(this._notesList);
    this._state = this._setState(States.IDLE);
    this._currentEditedNote = null;

    this._bindListeners();
  }

  private _bindListeners() {
    this._searchInput.addEventListener("input", (e) => {
      this._searchNotes(e);
    });

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
  private _searchNotes(e: Event) {
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
