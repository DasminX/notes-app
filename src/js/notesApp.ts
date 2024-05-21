import { Textarea } from "./composable/Textarea";
import { NotesCollection } from "./notesCollection";
import { HTMLBuilder } from "./utils/htmlBuilder";

const enum States {
  CHANGING = "CHANGING",
  IDLE = "IDLE",
}

/* TODO:
- resizer as a seperate class, self creating and handling (provided "empty" placeholder container as param)
- self living Note (created html inside)
*/

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

  private notesCollection: NotesCollection = new NotesCollection(this.notesList);
  private state: keyof typeof States = this.setState(States.IDLE);

  constructor(private container: HTMLElement) {
    this.customTextarea = this.container.querySelector(".customTextarea") as HTMLDivElement;
    this.textarea = new Textarea(this.customTextarea, {
      handlers: {
        add: (text: string) => {
          this.notesCollection.add(`Random note no. ${Math.random().toString().slice(2, 6)}`, text);
          this.setState(States.IDLE);
        },
      },
    });

    /* Bind listeners */
    this.searchInput.addEventListener("input", this.searchNotes.bind(this));
    [this.noNotesYetFieldAddNoteBtn, this.notesListAddNoteBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setState(States.CHANGING);
      });
    });
    this.addNewNoteCancelBtn.addEventListener("click", () => {
      this.textarea.resetValue();
      this.setState(States.IDLE);
    });

    this.notesList.addEventListener("click", (e) => {
      if (!(e.target instanceof HTMLElement) && !(e.target instanceof SVGElement)) return;

      const closestNote = e.target.closest(".note");
      if (!closestNote) return;

      const id = (closestNote as HTMLDivElement).dataset?.id;
      if (id == undefined) return;

      if (e.target.classList.contains("edit")) {
        // TODO
        this.setState(States.CHANGING);
      } else if (e.target.classList.contains("remove")) {
        this.notesCollection.remove(id);
        this.setState(this.state);
      }
    });
  }

  /* Main state function */
  private setState(newState: keyof typeof States) {
    switch (newState) {
      case States.IDLE:
        HTMLBuilder.setVisibility(this.addNewNoteArea, false);
        HTMLBuilder.setVisibility(this.noNotesYetFieldAddNoteBtn, true);
        break;
      case States.CHANGING:
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

  addNoteHandler(e: any) {
    console.log(e);
  }
}
