import { Note } from "./entities/note";

export class NotesCollection {
  private notes: Note[] = new Array();

  constructor(private readonly listContainer: HTMLElement) {}

  get length() {
    return this.notes.length;
  }

  public add(title: Note["title"], content: Note["content"]) {
    const newNote = new Note(title, content);
    newNote.insertHTMLInto(this.listContainer);
    this.notes.push(newNote);
  }

  public remove(id: Note["id"]) {
    this.notes = this.notes.filter((note) => {
      if (note.id === id) {
        note.remove();
        return false;
      }
      return true;
    });
  }

  /* TODO PADDING RIGHT  */
  public hideEveryNotContaining(text: string) {
    this.notes.forEach((note) => {
      note.hideIfNotContaining(text.toLowerCase());
    });
  }
}
