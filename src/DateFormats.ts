export const padToTwoDigit = (n: number) => n <= 9 ? '0' + n : n;

export enum FormatType {
  Date = 1,
  Time = 2,
  TimeAndDate = FormatType.Date | FormatType.Time
};

export const format = (date: Date, formatType: FormatType = FormatType.TimeAndDate) => {
  switch (formatType) {
    case FormatType.Date: return formatDate(date);
    case FormatType.Time: return formatTime(date);
    case FormatType.TimeAndDate: return formatDate(date) + ' в ' + formatTime(date);
  }
}

const months = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'ноября', 'декабря',
];

const formatDate = (date: Date) => [
  date.getDate(),
  months[date.getMonth()],
  date.getFullYear() !== new Date().getFullYear() ? date.getFullYear() : null
].filter(l => l).join(' ');

export const formatTime = (date: Date) => padToTwoDigit(date.getHours()) + ':' + padToTwoDigit(date.getMinutes());

const hour = 1000 * 60 * 60;

export enum TimeDiffType {
  Day = hour * 24,
  Hour = hour,
  Minutes = hour / 60,
}

export const getDateDiff = (from: Date, to: Date, diffType = TimeDiffType.Day): number => {
  return Math.floor(
    (from.getTime() - to.getTime()) / diffType
  );
}


export const dateToISOFormat = (date: Date) => [
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(padToTwoDigit).join('-'),
  [date.getHours(), date.getMinutes(), date.getSeconds()].map(padToTwoDigit).join(':')
].join('T');


export const toCurrentDate = (date: string) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + (-d.getTimezoneOffset()));
  return dateToISOFormat(d);
}
