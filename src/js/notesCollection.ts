import { Note } from "./entities/note";

export class NotesCollection {
  private _notes: Note[] = new Array();

  constructor(private readonly _listContainer: HTMLElement) {}

  public get length() {
    return this._notes.length;
  }

  public add(title: Note["title"], content: Note["content"]) {
    const newNote = new Note(title, content);
    newNote.insertHTMLInto(this._listContainer);
    this._notes.push(newNote);
  }

  public remove(id: Note["id"]) {
    this._notes = this._notes.filter((note) => {
      if (note.id === id) {
        note.removeFromHTML();
        return false;
      }
      return true;
    });
  }

  public getNoteById(id: Note["id"]) {
    return this._notes.find((note) => note.id === id) ?? null;
  }

  /* TODO PADDING RIGHT  */
  public hideEveryNotContaining(text: string) {
    this._notes.forEach((note) => {
      note.hideIfNotContaining(text.toLowerCase());
    });
  }
}
