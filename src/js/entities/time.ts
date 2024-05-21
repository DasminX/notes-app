export class Time {
  private monthNames: string[] = [
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

  private _now: Date = new Date(Date.now());

  public get nowUTC() {
    return this._now.toUTCString();
  }

  public getMonthDayAsString(): string {
    return `${this.getMonthName()} ${this._now.getDate()}`;
  }

  public getMonthName(): string {
    return this.monthNames[this._now.getMonth() + 1] ?? "Easter egg by DasminX :)";
  }
}
