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
        note.removeFromHTML();
        return false;
      }
      return true;
    });
  }

  public getNoteById(id: Note["id"]) {
    return this.notes.find((note) => note.id === id) ?? null;
  }

  /* TODO PADDING RIGHT  */
  public hideEveryNotContaining(text: string) {
    this.notes.forEach((note) => {
      note.hideIfNotContaining(text.toLowerCase());
    });
  }
}
