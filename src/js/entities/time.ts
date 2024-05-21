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

  get now() {
    return this._now.toUTCString();
  }

  public getMonthDayAsString(): string {
    return `${this.getMonthName(this._now.getMonth() + 1)} ${this._now.getDate()}`;
  }

  public getMonthName(month: number): string {
    return this.monthNames[month] ?? "Easter egg";
  }
}
