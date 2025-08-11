import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'hace unos segundos';
    const intervals: [number, string][] = [
      [60, 'minuto'],
      [3600, 'hora'],
      [86400, 'día'],
      [2592000, 'mes'],
      [31536000, 'año']
    ];
    let counter = seconds;
    let unit = 'segundos';
    for (let i = intervals.length - 1; i >= 0; i--) {
      if (seconds >= intervals[i][0]) {
        counter = Math.floor(seconds / intervals[i][0]);
        unit = intervals[i][1] + (counter > 1 ? 's' : '');
        break;
      }
    }
    return `hace ${counter} ${unit}`;
  }
}
