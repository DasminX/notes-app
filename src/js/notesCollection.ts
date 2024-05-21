import { Note } from "./entities/note";

export class NotesCollection {
  private notes: Note[] = new Array();

  constructor() {}

  public addNote(data: Note) {}
  public filterNotesBy(value: string) {}
}
