import { ALL_USER_STATES, USER_STATES } from '../adapters/responses';

type UNIX_RESPONSES = [
  '???',
  `${number}m ago`,
  `${number}h ago`,
  `> 99hs`,
  '< 1m'
];

//time is imprecise since this needs to be done in the backend.
export class UnixToDate {
  public unixTime: Date | null;
  private currentDate: Date;

  private userState: ALL_USER_STATES;

  constructor(time: number, status?: ALL_USER_STATES) {
    this.unixTime = time > 0 ? new Date(time * 1000) : null;
    this.currentDate = new Date();

    this.userState = status ?? USER_STATES[0];
  }

  getDifferenceTime(): UNIX_RESPONSES[number] {
    if (!this.unixTime) return '???';
    const result = Math.round(
      (this.currentDate.getTime() - this.unixTime.getTime()) / 60000
    ); // minutes

    console.log({ result, hours: result / 60 });

    if (this.userState === USER_STATES[1] || result < 1) return '< 1m';
    return result < 60
      ? `${result}m ago`
      : result / 60 > 99
      ? `> 99hs`
      : `${Math.round(result / 60)}h ago`;
  }
}
