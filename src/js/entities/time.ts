const MONTH_NAMES: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export class Time {
  private _now: Date = new Date(Date.now());

  public get monthAndDay(): string {
    return `${this.getMonthName()} ${this._now.getDate()}`;
  }

  public getMonthName(): string {
    return MONTH_NAMES[this._now.getMonth() + 1] ?? "Easter egg by DasminX :)";
  }
}
