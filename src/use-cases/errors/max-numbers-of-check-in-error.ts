export class MaxNumbersOfCheckInError extends Error {
  constructor() {
    super("Max numbers of checkin reached.");
  }
}
