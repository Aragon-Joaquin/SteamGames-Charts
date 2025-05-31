import { ALL_USER_STATES, USER_STATES } from '../adapters/responses';

export type UNIX_RESPONSES = [
  '???',
  '< 1m',

  `${number}m ago`,
  `${number}m`,

  `${number}h ago`,
  `${number}h`,

  `${number}d ago`,
  `${number}d`,

  `> 1d`,
  `> 2d`,
  `> 3d`,

  `> 1w`
][number];

// works only using minutes
const ONE_HOUR = 60;
const ONE_DAY = 1440;
const ONE_WEEK = 10080;

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

  getDifferenceTime(): UNIX_RESPONSES {
    if (!this.unixTime) return '???';
    const result = this.getMinutesAgo();

    if (this.userState === USER_STATES[1] || result < 1) return '< 1m';
    return this.parseMinutes(result, true);
  }

  getMinutesAgo = () =>
    !this.unixTime
      ? 0
      : Math.round(
          (this.currentDate.getTime() - this.unixTime.getTime()) / 60000
        ); // minutes

  parseMinutes = (
    customTime?: number,
    includeAgo?: boolean
  ): UNIX_RESPONSES => {
    const minutes = customTime || this.getMinutesAgo();
    const ago = includeAgo == true ? ' ago' : '';

    if (minutes < ONE_HOUR) return `${minutes}m${ago}`;

    if (minutes > ONE_HOUR && minutes < ONE_DAY)
      return `${Math.round(minutes / ONE_HOUR)}h${ago}`;

    return minutes > ONE_DAY && minutes < ONE_WEEK
      ? `${Math.round(minutes / ONE_DAY)}d${ago}`
      : `> 1w`;
  };
}
