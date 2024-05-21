import { v4 as uuidv4 } from "uuid";
import { Time } from "./time";

type UUID = ReturnType<typeof uuidv4>;

export class Note {
  public id: UUID = uuidv4();
  private addedAt: Time = new Time();

  constructor(public readonly title: string, public body: string) {}

  update(body: string) {
    this.body = body;
  }

  public get humanReadableDate() {
    return this.addedAt.getMonthDayAsString();
  }
}
