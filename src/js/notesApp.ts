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
  private addNewNoteCancelBtn: HTMLButtonElement = this.addNewNoteArea.querySelector(".cancel") as HTMLButtonElement;

  private noNotesYetField: HTMLDivElement = this.container.querySelector("#noNotesYet") as HTMLDivElement;
  private noNotesYetFieldAddNoteBtn: HTMLButtonElement = this.noNotesYetField.querySelector(".button") as HTMLButtonElement;

  private notesList: HTMLDivElement = this.container.querySelector("#notesList") as HTMLDivElement;
  private notesListAddNoteBtn: HTMLButtonElement = this.notesList.querySelector(".button") as HTMLButtonElement;
  /* END HTML Elements */

  private customTextarea: HTMLDivElement;
  private textarea: Textarea;
  private notesCollection: NotesCollection;
  private state: keyof typeof States;
  private currentEditedNote: Note | null = null;

  constructor(private container: HTMLElement) {
    this.customTextarea = this.container.querySelector(".customTextarea") as HTMLDivElement;
    this.textarea = new Textarea(this.customTextarea, {
      handlers: {
        add: (text: string) => {
          if (this.state === States.EDITING) {
            const note = this.notesCollection.getNoteById(this.currentEditedNote?.id ?? "");
            if (!note) {
              this.currentEditedNote = null;
              return;
            }

            note.content = text;
          } else if (this.state === States.ADDING || true) {
            this.notesCollection.add(`Random note no. ${Math.random().toString().slice(2, 6)}`, text);
          }
          this.state = this.setState(States.IDLE);
        },
      },
    });

    this.notesCollection = new NotesCollection(this.notesList);
    this.state = this.setState(States.IDLE);

    /* Bind listeners */
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));

    this.noNotesYetFieldAddNoteBtn.addEventListener("click", () => {
      this.state = this.setState(States.ADDING);
    });
    this.notesListAddNoteBtn.addEventListener("click", () => {
      this.state = this.setState(States.ADDING);
    });

    this.addNewNoteCancelBtn.addEventListener("click", () => {
      this.textarea.resetValue();
      this.setState(States.IDLE);
    });

    this.notesList.addEventListener("click", this.notesListClickHandler.bind(this));
  }

  /* Main state function */
  private setState(newState: keyof typeof States) {
    switch (newState) {
      case States.IDLE:
        this.currentEditedNote = null;
        HTMLBuilder.setVisibility(this.addNewNoteArea, false);
        HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, true);
        break;
      case States.ADDING:
        HTMLBuilder.setVisibility(this.addNewNoteArea, true);
        HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, false);
        break;
      case States.EDITING:
        if (newState == States.EDITING && this.currentEditedNote != null) {
          this.textarea.setValue(this.currentEditedNote.content);
        }
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

  private notesListClickHandler(e: any) {
    if (!(e.target instanceof HTMLElement) && !(e.target instanceof SVGElement)) return;

    const id = (e.target.closest(".note") as HTMLDivElement | null)?.dataset?.id;
    if (id == null) return;

    if (e.target.classList.contains("edit")) {
      const note = this.notesCollection.getNoteById(id);
      if (note == null) return;

      this.currentEditedNote = note;
      this.state = this.setState(States.EDITING);
    } else if (e.target.classList.contains("remove")) {
      this.notesCollection.remove(id);
      this.state = this.setState(this.state);
    }
  }
}
